import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const api = axios.create({ baseURL })

export function createDevice(body: { id: string; name: string; productId: string; modelVersion: string }) {
  return api.post('/api/v1/devices', body).then(r => r.data)
}

export function getDevice(id: string) {
  return api.get(`/api/v1/devices/${id}`).then(r => r.data)
}

export function getThingModel(id: string) {
  return api.get(`/api/v1/devices/${id}/thing-model`).then(r => r.data)
}

export function getShadow(id: string) {
  return api.get(`/api/v1/devices/${id}/shadow`).then(r => r.data)
}

export function updateDesired(id: string, desired: Record<string, any>) {
  return api.put(`/api/v1/devices/${id}/shadow/desired`, desired).then(r => r.data)
}

export function getAttributes(id: string) {
  return api.get(`/api/v1/devices/${id}/attributes`).then(r => r.data)
}

export function updateAttributes(id: string, attributes: Record<string, any>) {
  return api.post(`/api/v1/devices/${id}/attributes`, { attributes }).then(r => r.data)
}

export function callService(id: string, service: string, params: Record<string, any>) {
  return api.post(`/api/v1/devices/${id}/rpc`, { service, params }).then(r => r.data)
}

