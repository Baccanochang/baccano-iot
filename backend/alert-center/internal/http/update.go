package httpx

import (
    "encoding/json"
    "net/http"
)

func UpdateAlertStatus(w http.ResponseWriter, r *http.Request, id string) {
    var body struct{ Status string `json:"status"` }
    json.NewDecoder(r.Body).Decode(&body)
    a := alerts[id]
    a.Status = body.Status
    alerts[id] = a
    json.NewEncoder(w).Encode(a)
}

