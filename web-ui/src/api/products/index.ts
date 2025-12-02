import { api } from '../client'
import type { ThingModel } from '../../@types/thing-model'

export function createProduct(body: { id: string; name: string; protocol: string; defaultModelVersion?: string }) {
  return api.post('/api/v1/products', body).then(r => r.data)
}
export function putThingModel(productId: string, version: string, model: ThingModel) {
  return api.put(`/api/v1/products/${productId}/thing-model`, { version, model }).then(r => r.data)
}
export function listThingModels(productId: string) {
  return api.get(`/api/v1/products/${productId}/thing-models`).then(r => r.data)
}
export function getThingModel(productId: string, version: string) {
  return api.get(`/api/v1/products/${productId}/thing-models/${version}`).then(r => r.data)
}
export function validateThingModel(model: ThingModel) {
  return api.post(`/api/v1/products/dummy/thing-models/validate`, { model }).then(r => r.data)
}
export function diffThingModels(a: ThingModel, b: ThingModel) {
  return api.post(`/api/v1/products/dummy/thing-models/diff`, { a, b }).then(r => r.data)
}

