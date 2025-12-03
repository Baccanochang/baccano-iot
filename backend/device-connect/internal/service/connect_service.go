package service

import (
	"baccano-iot/device-connect/internal/domain"
	"baccano-iot/device-connect/internal/repository"
)

type ConnectService struct{ repo *repository.Repo }

func NewConnectService(r *repository.Repo) *ConnectService { return &ConnectService{repo: r} }
func (s *ConnectService) Connect(id, protocol string) {
	s.repo.Upsert(domain.Connection{DeviceID: id, Protocol: protocol, Online: true})
}
func (s *ConnectService) Disconnect(id string)                       { s.repo.SetOnline(id, false) }
func (s *ConnectService) Status(id string) (domain.Connection, bool) { return s.repo.Get(id) }
