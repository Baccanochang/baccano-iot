module baccano-iot/device-gateway

go 1.25

require (
	baccano-iot/device-connect v0.0.0-00010101000000-000000000000
	github.com/mochi-mqtt/server/v2 v2.4.2
	github.com/plgd-dev/go-coap/v3 v3.4.1
	google.golang.org/grpc v1.64.0
)

require (
	github.com/dsnet/golib/memfile v1.0.0 // indirect
	github.com/gorilla/websocket v1.5.0 // indirect
	github.com/pion/dtls/v3 v3.0.7 // indirect
	github.com/pion/logging v0.2.4 // indirect
	github.com/pion/transport/v3 v3.0.7 // indirect
	github.com/rs/xid v1.4.0 // indirect
	go.uber.org/atomic v1.11.0 // indirect
	golang.org/x/crypto v0.33.0 // indirect
	golang.org/x/exp v0.0.0-20240904232852-e7e105dedf7e // indirect
	golang.org/x/net v0.35.0 // indirect
	golang.org/x/sync v0.11.0 // indirect
	golang.org/x/sys v0.30.0 // indirect
	golang.org/x/text v0.22.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20240318140521-94a12d6c2237 // indirect
	google.golang.org/protobuf v1.33.0 // indirect
)

replace baccano-iot/device-connect => ../device-connect
