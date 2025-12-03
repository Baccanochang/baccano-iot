package proto

import (
	"context"
	"google.golang.org/grpc"
)

type DeviceConnectClient interface {
	Authenticate(ctx context.Context, in *AuthRequest, opts ...grpc.CallOption) (*AuthResponse, error)
	PublishTelemetry(ctx context.Context, in *Telemetry, opts ...grpc.CallOption) (*TelemetryAck, error)
}

type deviceConnectClient struct{ cc grpc.ClientConnInterface }

func NewDeviceConnectClient(cc grpc.ClientConnInterface) DeviceConnectClient {
	return &deviceConnectClient{cc}
}

func (c *deviceConnectClient) Authenticate(ctx context.Context, in *AuthRequest, opts ...grpc.CallOption) (*AuthResponse, error) {
	out := new(AuthResponse)
	err := c.cc.Invoke(ctx, "/deviceconnect.DeviceConnect/Authenticate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *deviceConnectClient) PublishTelemetry(ctx context.Context, in *Telemetry, opts ...grpc.CallOption) (*TelemetryAck, error) {
	out := new(TelemetryAck)
	err := c.cc.Invoke(ctx, "/deviceconnect.DeviceConnect/PublishTelemetry", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

type DeviceConnectServer interface {
	Authenticate(context.Context, *AuthRequest) (*AuthResponse, error)
	PublishTelemetry(context.Context, *Telemetry) (*TelemetryAck, error)
}

type UnimplementedDeviceConnectServer struct{}

func (UnimplementedDeviceConnectServer) Authenticate(context.Context, *AuthRequest) (*AuthResponse, error) {
	return nil, grpc.ErrServerStopped
}
func (UnimplementedDeviceConnectServer) PublishTelemetry(context.Context, *Telemetry) (*TelemetryAck, error) {
	return nil, grpc.ErrServerStopped
}

func RegisterDeviceConnectServer(s grpc.ServiceRegistrar, srv DeviceConnectServer) {
	s.RegisterService(&grpc.ServiceDesc{
		ServiceName: "deviceconnect.DeviceConnect",
		HandlerType: (*DeviceConnectServer)(nil),
		Methods: []grpc.MethodDesc{
			{MethodName: "Authenticate", Handler: _DeviceConnect_Authenticate_Handler},
			{MethodName: "PublishTelemetry", Handler: _DeviceConnect_PublishTelemetry_Handler},
		},
		Streams:  []grpc.StreamDesc{},
		Metadata: "backend/proto/device_connect.proto",
	}, srv)
}

func _DeviceConnect_Authenticate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AuthRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DeviceConnectServer).Authenticate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{Server: srv, FullMethod: "/deviceconnect.DeviceConnect/Authenticate"}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DeviceConnectServer).Authenticate(ctx, req.(*AuthRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _DeviceConnect_PublishTelemetry_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Telemetry)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DeviceConnectServer).PublishTelemetry(ctx, in)
	}
	info := &grpc.UnaryServerInfo{Server: srv, FullMethod: "/deviceconnect.DeviceConnect/PublishTelemetry"}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DeviceConnectServer).PublishTelemetry(ctx, req.(*Telemetry))
	}
	return interceptor(ctx, in, info, handler)
}
