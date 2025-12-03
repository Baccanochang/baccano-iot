package httpx

import (
	"net/http"
)

type Server struct{}

func NewServer() *Server                   { return &Server{} }
func (s *Server) Listen(addr string) error { return http.ListenAndServe(addr, http.NewServeMux()) }
func (s *Server) Routes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/debug/health", DebugHealth)
	mux.HandleFunc("/api/v1/devices", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			ListDevices(w, r)
			return
		}
		if r.Method == "POST" {
			CreateDevice(w, r)
			return
		}
		http.NotFound(w, r)
	})
	mux.HandleFunc("/api/v1/devices/", func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Path[len("/api/v1/devices/"):]
		if r.Method == "GET" {
			GetDevice(w, r, id)
			return
		}
		if r.Method == "GET" && r.URL.Path[len("/api/v1/devices/")+len(id):] == "/shadow" {
			GetShadow(w, r, id)
			return
		}
		if r.Method == "PUT" && r.URL.Path[len("/api/v1/devices/")+len(id):] == "/shadow/desired" {
			UpdateDesired(w, r, id)
			return
		}
		if r.Method == "GET" && r.URL.Path[len("/api/v1/devices/")+len(id):] == "/attributes" {
			GetAttributes(w, r, id)
			return
		}
		if r.Method == "POST" && r.URL.Path[len("/api/v1/devices/")+len(id):] == "/attributes" {
			UpdateAttributes(w, r, id)
			return
		}
		http.NotFound(w, r)
	})
	return mux
}
func (s *Server) ListenWithRoutes(addr string) error { return http.ListenAndServe(addr, s.Routes()) }
