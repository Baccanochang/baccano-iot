package repository

import "baccano-iot/api-gateway/internal/domain"

type DeviceRepo struct{ s *Store }

func NewDeviceRepo(s *Store) *DeviceRepo { return &DeviceRepo{s: s} }

func (r *DeviceRepo) Create(d domain.Device) domain.Device {
	r.s.mu.Lock()
	r.s.Devices[d.ID] = d
	r.s.Shadows[d.ID] = domain.Shadow{Desired: map[string]interface{}{}, Reported: map[string]interface{}{}}
	r.s.Attributes[d.ID] = map[string]interface{}{}
	r.s.mu.Unlock()
	return d
}

func (r *DeviceRepo) Get(id string) (domain.Device, bool) {
	r.s.mu.RLock()
	d, ok := r.s.Devices[id]
	r.s.mu.RUnlock()
	return d, ok
}

func (r *DeviceRepo) GetShadow(id string) (domain.Shadow, bool) {
	r.s.mu.RLock()
	sh, ok := r.s.Shadows[id]
	r.s.mu.RUnlock()
	return sh, ok
}

func (r *DeviceRepo) UpdateDesired(id string, desired map[string]interface{}) (domain.Shadow, bool) {
	r.s.mu.Lock()
	sh, ok := r.s.Shadows[id]
	if !ok {
		r.s.mu.Unlock()
		return domain.Shadow{}, false
	}
	for k, v := range desired {
		sh.Desired[k] = v
	}
	r.s.Shadows[id] = sh
	r.s.mu.Unlock()
	return sh, true
}

func (r *DeviceRepo) GetAttributes(id string) (map[string]interface{}, bool) {
	r.s.mu.RLock()
	attrs, ok := r.s.Attributes[id]
	r.s.mu.RUnlock()
	return attrs, ok
}

func (r *DeviceRepo) UpdateAttributes(id string, attrs map[string]interface{}) (map[string]interface{}, bool) {
	r.s.mu.Lock()
	cur, ok := r.s.Attributes[id]
	if !ok {
		r.s.mu.Unlock()
		return nil, false
	}
	for k, v := range attrs {
		cur[k] = v
	}
	r.s.Attributes[id] = cur
	r.s.mu.Unlock()
	return cur, true
}
