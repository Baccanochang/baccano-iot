package httpx

import (
    "encoding/json"
    "net/http"
    "baccano-iot/device-connect/internal/service"
)

type Server struct{ svc *service.ConnectService }

func NewServer(s *service.ConnectService) *Server { return &Server{svc: s} }

func (s *Server) routes() *http.ServeMux {
    mux := http.NewServeMux()
    mux.HandleFunc("/debug/health", DebugHealth)
    mux.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
        var body struct{ DeviceID string `json:"deviceId"` Protocol string `json:"protocol"` }
        json.NewDecoder(r.Body).Decode(&body)
        s.svc.Connect(body.DeviceID, body.Protocol)
        json.NewEncoder(w).Encode(map[string]string{"status":"ok"})
    })
    mux.HandleFunc("/disconnect", func(w http.ResponseWriter, r *http.Request) {
        var body struct{ DeviceID string `json:"deviceId"` }
        json.NewDecoder(r.Body).Decode(&body)
        s.svc.Disconnect(body.DeviceID)
        json.NewEncoder(w).Encode(map[string]string{"status":"ok"})
    })
    mux.HandleFunc("/status/", func(w http.ResponseWriter, r *http.Request) {
        id := r.URL.Path[len("/status/"):]
        c, ok := s.svc.Status(id)
        if !ok { w.WriteHeader(http.StatusNotFound); json.NewEncoder(w).Encode(map[string]string{"error":"not found"}); return }
        json.NewEncoder(w).Encode(c)
    })
    return mux
}

func (s *Server) Listen(addr string) error { return http.ListenAndServe(addr, s.routes()) }
