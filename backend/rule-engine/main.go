package main

import (
    "bytes"
    "encoding/json"
    "log"
    "net/http"
    "os"
    busx "baccano-iot/core-message-bus/pkg/bus"
    "baccano-iot/data-store"
    httpx "baccano-iot/rule-engine/internal/http"
)

func main() {
    go httpx.NewServer().Listen(":8085")
    nurl := os.Getenv("NATS_URL"); if nurl == "" { nurl = "nats://localhost:4222" }
    nb, err := busx.NewNatsBus(nurl)
    if err != nil {
        log.Printf("nats init err: %v", err)
        nb = busx.NewMemoryBus()
    }
    pgurl := os.Getenv("PG_URL")
    var pg *data_store.Postgres
    if pgurl != "" {
        p, err := data_store.NewPostgres(pgurl)
        if err != nil { log.Printf("pg init err: %v", err) } else { pg = p }
    }
    _ = nb.Subscribe("device.telemetry.*", func(m busx.Message) {
        var payload map[string]interface{}
        _ = json.Unmarshal(m.Data, &payload)
        temp, _ := payload["temperature"].(float64)
        if temp > 80 {
            _ = pg.SaveEvent(data_store.Event{DeviceID: "", Ts: 0, Type: "alert", Data: m.Data})
            _, _ = http.Post("http://localhost:8084/api/v1/alerts", "application/json", bytes.NewBuffer([]byte(`{"id":"a1","deviceId":"demo","type":"temp_high","severity":"MAJOR","status":"ACTIVE"}`)))
        }
    })
    select {}
}
