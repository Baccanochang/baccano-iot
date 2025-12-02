package repository

import "baccano-iot/api-gateway/internal/domain"

type ProductRepo struct{ s *Store }

func NewProductRepo(s *Store) *ProductRepo { return &ProductRepo{s: s} }

func (r *ProductRepo) Create(p domain.Product) domain.Product {
    r.s.mu.Lock()
    r.s.Products[p.ID] = p
    if _, ok := r.s.Models[p.ID]; !ok { r.s.Models[p.ID] = map[string]domain.ThingModel{} }
    r.s.mu.Unlock()
    return p
}

func (r *ProductRepo) Get(id string) (domain.Product, bool) {
    r.s.mu.RLock()
    p, ok := r.s.Products[id]
    r.s.mu.RUnlock()
    return p, ok
}

func (r *ProductRepo) SaveModel(productID, version string, m domain.ThingModel) domain.ThingModel {
    r.s.mu.Lock()
    if _, ok := r.s.Models[productID]; !ok { r.s.Models[productID] = map[string]domain.ThingModel{} }
    r.s.Models[productID][version] = m
    r.s.mu.Unlock()
    return m
}

func (r *ProductRepo) ListModels(productID string) map[string]domain.ThingModel {
    r.s.mu.RLock()
    models := r.s.Models[productID]
    r.s.mu.RUnlock()
    return models
}

func (r *ProductRepo) GetModel(productID, version string) (domain.ThingModel, bool) {
    r.s.mu.RLock()
    m, ok := r.s.Models[productID][version]
    r.s.mu.RUnlock()
    return m, ok
}

