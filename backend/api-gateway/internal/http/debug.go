package httpx

import (
    "encoding/json"
    "net/http"
)

type Health struct { Status string `json:"status"` }

func DebugHealth(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(Health{Status: "ok"})
}

func DebugConfig(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{"env": "dev"})
}

