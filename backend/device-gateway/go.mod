module baccano-iot/device-gateway

go 1.22

require (
    google.golang.org/grpc v1.64.0
    github.com/mochi-mqtt/server/v2 v2.4.2
    github.com/plgd-dev/go-coap/v3 v3.0.2
)

replace baccano-iot/device-connect => ../device-connect
