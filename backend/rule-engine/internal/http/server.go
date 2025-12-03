package httpx

import (
	"baccano-iot/rule-engine/internal/engine"
	"encoding/json"
	"net/http"
)

type Server struct{}

func NewServer() *Server { return &Server{} }

func (s *Server) Listen(addr string) error {
	mux := http.NewServeMux()
	mux.HandleFunc("/debug/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})
	mux.HandleFunc("/execute", func(w http.ResponseWriter, r *http.Request) {
		var input map[string]interface{}
		json.NewDecoder(r.Body).Decode(&input)
		ch := engine.NewChain([]engine.Node{})
		out, _ := ch.Run(input)
		json.NewEncoder(w).Encode(out)
	})
	return http.ListenAndServe(addr, mux)
}
