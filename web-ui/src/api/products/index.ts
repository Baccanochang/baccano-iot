import { api } from '../client'

// 产品管理API
export function listProducts() {
  return api.get('/api/v1/products').then(r => r.data)
}

export function createProduct(body: { id: string; name: string; description?: string }) {
  return api.post('/api/v1/products', body).then(r => r.data)
}

export function getProduct(id: string) {
  return api.get(`/api/v1/products/${id}`).then(r => r.data)
}

export function updateProduct(id: string, body: { name: string; description?: string }) {
  return api.put(`/api/v1/products/${id}`, body).then(r => r.data)
}

export function deleteProduct(id: string) {
  return api.delete(`/api/v1/products/${id}`).then(r => r.data)
}

// 物模型API
export function listThingModels(productId: string) {
  return api.get(`/api/v1/products/${productId}/thing-models`).then(r => r.data)
}

export function getThingModel(productId: string, version: string) {
  return api.get(`/api/v1/products/${productId}/thing-models/${version}`).then(r => r.data)
}

export function putThingModel(productId: string, version: string, model: any) {
  return api.put(`/api/v1/products/${productId}/thing-model`, model, { params: { version } }).then(r => r.data)
}

export function validateThingModel(productId: string, model: any) {
  return api.post(`/api/v1/products/${productId}/thing-models/validate`, model).then(r => r.data)
}

export function diffThingModels(productId: string, oldModel: any, newModel: any) {
  return api.post(`/api/v1/products/${productId}/thing-models/diff`, { old_model: oldModel, new_model: newModel }).then(r => r.data)
}