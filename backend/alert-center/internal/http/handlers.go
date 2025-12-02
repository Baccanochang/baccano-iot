package httpx

import (
    "encoding/json"
    "net/http"
)

type Alert struct { ID string `json:"id"`; DeviceID string `json:"deviceId"`; Type string `json:"type"`; Severity string `json:"severity"`; Status string `json:"status"` }
var alerts = map[string]Alert{}

func CreateAlert(w http.ResponseWriter, r *http.Request) { var a Alert; json.NewDecoder(r.Body).Decode(&a); alerts[a.ID] = a; json.NewEncoder(w).Encode(a) }
func GetAlert(w http.ResponseWriter, r *http.Request, id string) { json.NewEncoder(w).Encode(alerts[id]) }
func ListAlerts(w http.ResponseWriter, r *http.Request) { var arr []Alert; for _, v := range alerts { arr = append(arr, v) }; json.NewEncoder(w).Encode(arr) }

