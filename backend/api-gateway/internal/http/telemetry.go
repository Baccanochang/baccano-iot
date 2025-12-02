package httpx

import (
    "net/http"
    "io"
)

func GetLatestTelemetry(w http.ResponseWriter, r *http.Request, deviceID string) {
    resp, err := http.Get("http://data-store:8086/api/v1/telemetry/" + deviceID + "/latest")
    if err != nil { w.WriteHeader(http.StatusBadGateway); return }
    defer resp.Body.Close()
    w.WriteHeader(resp.StatusCode)
    io.Copy(w, resp.Body)
}

func GetTelemetryHistory(w http.ResponseWriter, r *http.Request, deviceID string) {
    resp, err := http.Get("http://data-store:8086/api/v1/telemetry/" + deviceID + "/history")
    if err != nil { w.WriteHeader(http.StatusBadGateway); return }
    defer resp.Body.Close()
    w.WriteHeader(resp.StatusCode)
    io.Copy(w, resp.Body)
}
