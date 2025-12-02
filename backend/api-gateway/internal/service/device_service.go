package service

import (
    "baccano-iot/api-gateway/internal/domain"
    "baccano-iot/api-gateway/internal/repository"
)

type DeviceService struct{ repo *repository.DeviceRepo }

func NewDeviceService(r *repository.DeviceRepo) *DeviceService { return &DeviceService{repo: r} }

func (s *DeviceService) Create(d domain.Device) domain.Device { return s.repo.Create(d) }
func (s *DeviceService) Get(id string) (domain.Device, bool) { return s.repo.Get(id) }
func (s *DeviceService) Shadow(id string) (domain.Shadow, bool) { return s.repo.GetShadow(id) }
func (s *DeviceService) UpdateDesired(id string, desired map[string]interface{}) (domain.Shadow, bool) { return s.repo.UpdateDesired(id, desired) }
func (s *DeviceService) GetAttributes(id string) (map[string]interface{}, bool) { return s.repo.GetAttributes(id) }
func (s *DeviceService) UpdateAttributes(id string, attrs map[string]interface{}) (map[string]interface{}, bool) { return s.repo.UpdateAttributes(id, attrs) }

