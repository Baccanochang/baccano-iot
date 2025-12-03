package repository

import (
	"baccano-iot/api-gateway/internal/domain"
	"sync"
)

type Store struct {
	Devices    map[string]domain.Device
	Shadows    map[string]domain.Shadow
	Attributes map[string]map[string]interface{}
	Products   map[string]domain.Product
	Models     map[string]map[string]domain.ThingModel
	mu         sync.RWMutex
}

func NewStore() *Store {
	return &Store{
		Devices:    map[string]domain.Device{},
		Shadows:    map[string]domain.Shadow{},
		Attributes: map[string]map[string]interface{}{},
		Products:   map[string]domain.Product{},
		Models:     map[string]map[string]domain.ThingModel{},
	}
}
