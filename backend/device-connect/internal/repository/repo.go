package repository

import (
	"baccano-iot/device-connect/internal/domain"
	"sync"
)

type Repo struct {
	connections map[string]domain.Connection
	mu          sync.RWMutex
}

func NewRepo() *Repo                       { return &Repo{connections: map[string]domain.Connection{}} }
func (r *Repo) Upsert(c domain.Connection) { r.mu.Lock(); r.connections[c.DeviceID] = c; r.mu.Unlock() }
func (r *Repo) Get(id string) (domain.Connection, bool) {
	r.mu.RLock()
	c, ok := r.connections[id]
	r.mu.RUnlock()
	return c, ok
}
func (r *Repo) SetOnline(id string, v bool) {
	r.mu.Lock()
	c := r.connections[id]
	c.Online = v
	r.connections[id] = c
	r.mu.Unlock()
}
