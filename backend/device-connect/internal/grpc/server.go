package grpcx

import (
	"baccano-iot/core-message-bus/pkg/bus"
	pb "baccano-iot/device-connect/proto"
	"context"
	"encoding/json"
	"google.golang.org/grpc"
	"net"
	"net/http"
)

type Server struct {
	pb.UnimplementedDeviceConnectServer
	Bus   bus.Bus
	Cache interface {
		SetDeviceOnline(deviceID string, online bool) error
	}
	RDB interface {
		UpdateDeviceOnline(deviceID string, online bool) error
	}
}

func NewServer() *Server { return &Server{} }

func (s *Server) Authenticate(ctx context.Context, req *pb.AuthRequest) (*pb.AuthResponse, error) {
	if s.Cache != nil {
		_ = s.Cache.SetDeviceOnline(req.DeviceId, true)
	}
	if s.RDB != nil {
		_ = s.RDB.UpdateDeviceOnline(req.DeviceId, true)
	}
	if s.Bus != nil {
		_ = s.Bus.Publish(bus.Message{Topic: "device.event.connect", Data: []byte(req.DeviceId)})
	}
	return &pb.AuthResponse{Ok: true, Message: "authenticated"}, nil
}

func (s *Server) PublishTelemetry(ctx context.Context, t *pb.Telemetry) (*pb.TelemetryAck, error) {
	var model struct {
		Properties []struct {
			Identifier string `json:"identifier"`
			Name       string `json:"name"`
			Category   string `json:"category"`
			DataType   struct {
				Type  string                 `json:"type"`
				Specs map[string]interface{} `json:"specs"`
			} `json:"dataType"`
		} `json:"properties"`
	}
	resp, err := http.Get("http://api-gateway:8080/api/v1/devices/" + t.DeviceId + "/thing-model")
	if err == nil {
		defer resp.Body.Close()
		_ = json.NewDecoder(resp.Body).Decode(&model)
	}
	var payload map[string]interface{}
	_ = json.Unmarshal([]byte(t.Payload), &payload)
	norm := map[string]interface{}{}
	for _, p := range model.Properties {
		v, ok := payload[p.Identifier]
		if !ok {
			continue
		}
		switch p.DataType.Type {
		case "int":
			switch x := v.(type) {
			case float64:
				norm[p.Identifier] = int64(x)
			}
		case "float":
			switch x := v.(type) {
			case float64:
				norm[p.Identifier] = x
			}
		case "string":
			switch x := v.(type) {
			case string:
				norm[p.Identifier] = x
			}
		case "bool":
			switch x := v.(type) {
			case bool:
				norm[p.Identifier] = x
			}
		}
	}
	b, _ := json.Marshal(norm)
	if s.Bus != nil {
		_ = s.Bus.Publish(bus.Message{Topic: "device.telemetry." + t.DeviceId, Data: b})
	}
	return &pb.TelemetryAck{Ok: true}, nil
}

func Listen(addr string, svc *Server) error {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	g := grpc.NewServer()
	pb.RegisterDeviceConnectServer(g, svc)
	return g.Serve(lis)
}
