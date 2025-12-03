package httpx

import (
	"baccano-iot/api-gateway/internal/domain"
	"baccano-iot/api-gateway/internal/service"
	"encoding/json"
	"net/http"
)

type ProductHandler struct{ svc *service.ProductService }

func NewProductHandler(s *service.ProductService) *ProductHandler { return &ProductHandler{svc: s} }

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p domain.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}
	if p.ID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "id required"})
		return
	}
	res := h.svc.Create(p)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(res)
}

func (h *ProductHandler) PutModel(w http.ResponseWriter, r *http.Request, productID string) {
	var body struct {
		Version string            `json:"version"`
		Model   domain.ThingModel `json:"model"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}
	m := h.svc.SaveModel(productID, body.Version, body.Model)
	json.NewEncoder(w).Encode(m)
}

func (h *ProductHandler) ListModels(w http.ResponseWriter, r *http.Request, productID string) {
	models := h.svc.ListModels(productID)
	json.NewEncoder(w).Encode(models)
}

func (h *ProductHandler) GetModel(w http.ResponseWriter, r *http.Request, productID, version string) {
	m, ok := h.svc.GetModel(productID, version)
	if !ok {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "not found"})
		return
	}
	json.NewEncoder(w).Encode(m)
}

func (h *ProductHandler) ValidateModel(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Model domain.ThingModel `json:"model"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}
	res := h.svc.ValidateModel(body.Model)
	json.NewEncoder(w).Encode(res)
}

func (h *ProductHandler) DiffModels(w http.ResponseWriter, r *http.Request) {
	var body struct {
		A domain.ThingModel `json:"a"`
		B domain.ThingModel `json:"b"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}
	res := h.svc.DiffModels(body.A, body.B)
	json.NewEncoder(w).Encode(res)
}
