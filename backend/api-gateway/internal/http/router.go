package httpx

import (
    "net/http"
    "strings"
)

type Router struct{ mux *http.ServeMux }

func NewRouter() *Router { return &Router{mux: http.NewServeMux()} }
func (r *Router) Handle(pattern string, handler func(http.ResponseWriter, *http.Request)) { r.mux.HandleFunc(pattern, handler) }
func (r *Router) Serve(addr string) error { return http.ListenAndServe(addr, r.mux) }

func PathParts(prefix string, path string) []string {
    p := strings.TrimPrefix(path, prefix)
    if p == path { return nil }
    return strings.Split(strings.TrimPrefix(p, "/"), "/")
}

