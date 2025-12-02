package main

import (
    "bytes"
    "context"
    "encoding/json"
    "net/http"
    "os"
    "strings"
    "time"

    "baccano-iot/device-gateway/internal/client"

    mqtt "github.com/mochi-mqtt/server/v2"
    "github.com/mochi-mqtt/server/v2/listeners"
    "github.com/mochi-mqtt/server/v2/packets"

    coap "github.com/plgd-dev/go-coap/v3/coap"
    "github.com/plgd-dev/go-coap/v3/mux"
)

type gwHook struct{ mqtt.HookBase; dc *client.DCClient }

func (h *gwHook) OnConnectAuthenticate(cl *mqtt.Client, pk packets.Packet) bool {
    deviceID := cl.ID
    productID := pk.Connect.Username
    credential := string(pk.Connect.Password)
    _, err := h.dc.Authenticate(context.Background(), deviceID, productID, credential)
    return err == nil
}

func (h *gwHook) OnPublish(cl *mqtt.Client, pk packets.Packet) (packets.Packet, error) {
    topic := pk.TopicName
    parts := strings.Split(topic, "/")
    if len(parts) >= 5 && parts[0] == "v1" && parts[3] == "telemetry" {
        productID := parts[1]
        deviceID := parts[2]
        payload := string(pk.Payload)
        ts := time.Now().UnixMilli()
        _, _ = h.dc.PublishTelemetry(context.Background(), deviceID, productID, payload, ts)
    }
    return pk, nil
}

func main() {
    addr := os.Getenv("DC_GRPC_ADDR")
    if addr == "" { addr = "localhost:8091" }
    dc, _ := client.NewDCClient(addr)

    server := mqtt.New(nil)
    server.AddHook(&gwHook{dc: dc}, nil)

    tcp := listeners.NewTCP("mqtt-tcp", ":1883")
    _ = server.AddListener(tcp, &listeners.Config{})

    go func() { _ = server.Serve() }()

    router := mux.NewRouter()
    router.Handle("/v1/{productId}/{deviceId}/telemetry", mux.HandlerFunc(func(w mux.ResponseWriter, r *mux.Message) {
        path := r.Path()
        if len(path) < 5 { return }
        productID := path[1]
        deviceID := path[2]
        payload := r.Message.Payload
        ts := time.Now().UnixMilli()
        _, _ = dc.PublishTelemetry(context.Background(), deviceID, productID, string(payload), ts)
        _ = w.SetResponse(coap.Changed, coap.TextPlain, bytes.NewReader([]byte("ok")))
    }))

    go func() { _ = coap.ListenAndServe("udp", ":5683", router) }()

    http.ListenAndServe(":8070", http.NewServeMux())
}
