package httpx

import (
    "encoding/json"
    "net/http"
    "baccano-iot/api-gateway/internal/domain"
    "baccano-iot/api-gateway/internal/service"
)

type DeviceHandler struct{ svc *service.DeviceService }

func NewDeviceHandler(s *service.DeviceService) *DeviceHandler { return &DeviceHandler{svc: s} }

func (h *DeviceHandler) Create(w http.ResponseWriter, r *http.Request) {
    var d domain.Device
    if err := json.NewDecoder(r.Body).Decode(&d); err != nil { w.WriteHeader(http.StatusBadRequest); json.NewEncoder(w).Encode(map[string]string{"error":"invalid body"}); return }
    if d.ID == "" { w.WriteHeader(http.StatusBadRequest); json.NewEncoder(w).Encode(map[string]string{"error":"id required"}); return }
    res := h.svc.Create(d)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(res)
}

func (h *DeviceHandler) Get(w http.ResponseWriter, r *http.Request, id string) {
    d, ok := h.svc.Get(id)
    if !ok { w.WriteHeader(http.StatusNotFound); json.NewEncoder(w).Encode(map[string]string{"error":"not found"}); return }
    json.NewEncoder(w).Encode(d)
}

func (h *DeviceHandler) GetModel(w http.ResponseWriter, r *http.Request, model domain.ThingModel) {
    json.NewEncoder(w).Encode(model)
}

func (h *DeviceHandler) RPC(w http.ResponseWriter, r *http.Request, id string) {
    var body struct{ Service string `json:"service"` Params map[string]interface{} `json:"params"` }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil { w.WriteHeader(http.StatusBadRequest); json.NewEncoder(w).Encode(map[string]string{"error":"invalid body"}); return }
    json.NewEncoder(w).Encode(map[string]interface{}{"deviceId": id, "service": body.Service, "status": "accepted"})
}

func (h *DeviceHandler) GetShadow(w http.ResponseWriter, r *http.Request, id string) {
    sh, ok := h.svc.Shadow(id)
    if !ok { w.WriteHeader(http.StatusNotFound); json.NewEncoder(w).Encode(map[string]string{"error":"not found"}); return }
    json.NewEncoder(w).Encode(sh)
}

func (h *DeviceHandler) UpdateDesired(w http.ResponseWriter, r *http.Request, id string) {
    var desired map[string]interface{}
    if err := json.NewDecoder(r.Body).Decode(&desired); err != nil { w.WriteHeader(http.StatusBadRequest); json.NewEncoder(w).Encode(map[string]string{"error":"invalid body"}); return }
    sh, ok := h.svc.UpdateDesired(id, desired)
    if !ok { w.WriteHeader(http.StatusNotFound); json.NewEncoder(w).Encode(map[string]string{"error":"not found"}); return }
    json.NewEncoder(w).Encode(sh)
}

func (h *DeviceHandler) GetAttributes(w http.ResponseWriter, r *http.Request, id string) {
    attrs, ok := h.svc.GetAttributes(id)
    if !ok { w.WriteHeader(http.StatusNotFound); json.NewEncoder(w).Encode(map[string]string{"error":"not found"}); return }
    json.NewEncoder(w).Encode(map[string]interface{}{"attributes": attrs})
}

func (h *DeviceHandler) UpdateAttributes(w http.ResponseWriter, r *http.Request, id string) {
    var body struct{ Attributes map[string]interface{} `json:"attributes"` }
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil { w.WriteHeader(http.StatusBadRequest); json.NewEncoder(w).Encode(map[string]string{"error":"invalid body"}); return }
    attrs, ok := h.svc.UpdateAttributes(id, body.Attributes)
    if !ok { w.WriteHeader(http.StatusNotFound); json.NewEncoder(w).Encode(map[string]string{"error":"not found"}); return }
    json.NewEncoder(w).Encode(map[string]interface{}{"attributes": attrs})
}

