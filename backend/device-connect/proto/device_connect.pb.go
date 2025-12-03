package proto

import (
    "reflect"
)

type AuthRequest struct {
    DeviceId   string `protobuf:"bytes,1,opt,name=deviceId,proto3" json:"deviceId"`
    ProductId  string `protobuf:"bytes,2,opt,name=productId,proto3" json:"productId"`
    Credential string `protobuf:"bytes,3,opt,name=credential,proto3" json:"credential"`
}
type AuthResponse struct {
    Ok      bool   `protobuf:"varint,1,opt,name=ok,proto3" json:"ok"`
    Message string `protobuf:"bytes,2,opt,name=message,proto3" json:"message"`
}
type Telemetry struct {
    DeviceId  string `protobuf:"bytes,1,opt,name=deviceId,proto3" json:"deviceId"`
    ProductId string `protobuf:"bytes,2,opt,name=productId,proto3" json:"productId"`
    Payload   string `protobuf:"bytes,3,opt,name=payload,proto3" json:"payload"`
    Ts        int64  `protobuf:"varint,4,opt,name=ts,proto3" json:"ts"`
}
type TelemetryAck struct {
    Ok bool `protobuf:"varint,1,opt,name=ok,proto3" json:"ok"`
}

func _() { _ = reflect.TypeOf(AuthRequest{}) }

