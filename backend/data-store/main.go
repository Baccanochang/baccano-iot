package main

import (
    "encoding/json"
    "net/http"
    "strings"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api/v1/telemetry/", func(w http.ResponseWriter, r *http.Request) {
        parts := r.URL.Path[len("/api/v1/telemetry/"):]
        if strings.HasSuffix(parts, "/latest") {
            deviceID := strings.TrimSuffix(parts, "/latest")
            json.NewEncoder(w).Encode(map[string]interface{}{"deviceId": deviceID, "ts": 0, "values": map[string]interface{}{"temperature": 25.3}})
            return
        }
        if strings.HasSuffix(parts, "/history") {
            json.NewEncoder(w).Encode([]map[string]interface{}{{"ts": 0, "temperature": 25.3}, {"ts": 1, "temperature": 26.1}})
            return
        }
        http.NotFound(w, r)
    })
    mux.HandleFunc("/api/v1/events/", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode([]map[string]interface{}{{"id":"a1","deviceId":"demo","type":"temp_high","severity":"MAJOR","status":"ACTIVE"}})
    })
    http.ListenAndServe(":8086", mux)
}
