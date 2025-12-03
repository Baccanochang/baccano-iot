package server

import (
    "github.com/gin-gonic/gin"
    "baccano-iot/api-gateway/internal/http"
)

type Server struct{ r *gin.Engine }

func New() *Server {
    g := gin.New()
    g.Use(gin.Recovery())
    g.Use(httpx.RateLimit())
    g.Use(httpx.JWTAuth())
    return &Server{r: g}
}

func (s *Server) Handle(method, path string, h gin.HandlerFunc) { s.r.Handle(method, path, h) }
func (s *Server) Group(prefix string) *gin.RouterGroup { return s.r.Group(prefix) }
func (s *Server) Run(addr string) error { return s.r.Run(addr) }

