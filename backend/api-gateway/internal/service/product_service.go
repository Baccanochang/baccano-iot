package service

import (
	"baccano-iot/api-gateway/internal/domain"
	"baccano-iot/api-gateway/internal/repository"
)

type ProductService struct{ repo *repository.ProductRepo }

func NewProductService(r *repository.ProductRepo) *ProductService { return &ProductService{repo: r} }

func (s *ProductService) Create(p domain.Product) domain.Product { return s.repo.Create(p) }
func (s *ProductService) Get(id string) (domain.Product, bool)   { return s.repo.Get(id) }
func (s *ProductService) SaveModel(productID, version string, m domain.ThingModel) domain.ThingModel {
	return s.repo.SaveModel(productID, version, m)
}
func (s *ProductService) ListModels(productID string) map[string]domain.ThingModel {
	return s.repo.ListModels(productID)
}
func (s *ProductService) GetModel(productID, version string) (domain.ThingModel, bool) {
	return s.repo.GetModel(productID, version)
}

type ValidationResult struct {
	Valid   bool   `json:"valid"`
	Message string `json:"message"`
}

func (s *ProductService) ValidateModel(m domain.ThingModel) ValidationResult {
	if m.SchemaVersion == "" {
		return ValidationResult{Valid: false, Message: "schemaVersion required"}
	}
	return ValidationResult{Valid: true, Message: "ok"}
}

type DiffRequest struct {
	A domain.ThingModel
	B domain.ThingModel
}
type DiffResult struct {
	Added   []string `json:"added"`
	Removed []string `json:"removed"`
}

func (s *ProductService) DiffModels(a, b domain.ThingModel) DiffResult {
	amap := map[string]struct{}{}
	bmap := map[string]struct{}{}
	for _, p := range a.Properties {
		if id, ok := p["identifier"].(string); ok {
			amap[id] = struct{}{}
		}
	}
	for _, p := range b.Properties {
		if id, ok := p["identifier"].(string); ok {
			bmap[id] = struct{}{}
		}
	}
	var added, removed []string
	for k := range bmap {
		if _, ok := amap[k]; !ok {
			added = append(added, k)
		}
	}
	for k := range amap {
		if _, ok := bmap[k]; !ok {
			removed = append(removed, k)
		}
	}
	return DiffResult{Added: added, Removed: removed}
}
