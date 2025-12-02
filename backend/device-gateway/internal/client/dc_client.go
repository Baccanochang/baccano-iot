package client

import (
    "context"
    "google.golang.org/grpc"
    pb "baccano-iot/device-connect/proto"
)

type DCClient struct{ conn *grpc.ClientConn; cli pb.DeviceConnectClient }

func NewDCClient(addr string) (*DCClient, error) {
    c, err := grpc.Dial(addr, grpc.WithInsecure())
    if err != nil { return nil, err }
    return &DCClient{conn: c, cli: pb.NewDeviceConnectClient(c)}, nil
}

func (c *DCClient) Authenticate(ctx context.Context, deviceId, productId, credential string) (*pb.AuthResponse, error) {
    return c.cli.Authenticate(ctx, &pb.AuthRequest{DeviceId: deviceId, ProductId: productId, Credential: credential})
}

func (c *DCClient) PublishTelemetry(ctx context.Context, deviceId, productId, payload string, ts int64) (*pb.TelemetryAck, error) {
    return c.cli.PublishTelemetry(ctx, &pb.Telemetry{DeviceId: deviceId, ProductId: productId, Payload: payload, Ts: ts})
}

