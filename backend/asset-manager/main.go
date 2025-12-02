package main

import (
    "net/http"
    "baccano-iot/asset-manager/internal/http"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/debug/health", httpx.DebugHealth)
    mux.HandleFunc("/api/v1/assets", func(w http.ResponseWriter, r *http.Request) {
        if r.Method == "GET" { httpx.ListAssets(w, r); return }
        if r.Method == "POST" { httpx.CreateAsset(w, r); return }
        http.NotFound(w, r)
    })
    mux.HandleFunc("/api/v1/assets/", func(w http.ResponseWriter, r *http.Request) {
        id := r.URL.Path[len("/api/v1/assets/"):]
        if r.Method == "GET" { httpx.GetAsset(w, r, id); return }
        http.NotFound(w, r)
    })
    http.ListenAndServe(":8083", mux)
}
