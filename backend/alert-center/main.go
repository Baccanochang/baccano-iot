package main

import (
    "net/http"
    "baccano-iot/alert-center/internal/http"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/debug/health", httpx.DebugHealth)
    mux.HandleFunc("/api/v1/alerts", func(w http.ResponseWriter, r *http.Request) {
        if r.Method == "GET" { httpx.ListAlerts(w, r); return }
        if r.Method == "POST" { httpx.CreateAlert(w, r); return }
        http.NotFound(w, r)
    })
    mux.HandleFunc("/api/v1/alerts/", func(w http.ResponseWriter, r *http.Request) {
        id := r.URL.Path[len("/api/v1/alerts/"):]
        if r.Method == "GET" { httpx.GetAlert(w, r, id); return }
        if r.Method == "PUT" { httpx.UpdateAlertStatus(w, r, id); return }
        http.NotFound(w, r)
    })
    http.ListenAndServe(":8084", mux)
}
