import { api } from '../client'

// 设备管理API
export function listDevices() {
  return api.get('/api/v1/devices').then(r => r.data)
}

export function createDevice(body: { id: string; name: string; productId: string; modelVersion: string }) {
  return api.post('/api/v1/devices', body).then(r => r.data)
}

export function getDevice(id: string) {
  return api.get(`/api/v1/devices/${id}`).then(r => r.data)
}

export function updateDevice(id: string, body: { name: string; productId: string; modelVersion: string }) {
  return api.put(`/api/v1/devices/${id}`, body).then(r => r.data)
}

export function deleteDevice(id: string) {
  return api.delete(`/api/v1/devices/${id}`).then(r => r.data)
}

// 物模型API
export function getThingModelByDevice(id: string, productId: string, version: string = 'v1') {
  return api.get(`/api/v1/products/${productId}/thing-models/${version}`).then(r => r.data)
}

// 设备影子API
export function getShadow(id: string) {
  return api.get(`/api/v1/devices/${id}/shadow`).then(r => r.data)
}

export function updateDesired(id: string, desired: Record<string, any>) {
  return api.put(`/api/v1/devices/${id}/shadow/desired`, desired).then(r => r.data)
}

// 设备属性API
export function getAttributes(id: string) {
  return api.get(`/api/v1/devices/${id}/attributes`).then(r => r.data)
}

export function updateAttributes(id: string, attributes: Record<string, any>) {
  return api.post(`/api/v1/devices/${id}/attributes`, attributes).then(r => r.data)
}

// 设备RPC API
export function callService(id: string, service: string, params: Record<string, any>) {
  return api.post(`/api/v1/devices/${id}/rpc`, { method: service, params }).then(r => r.data)
}

// 遥测数据API
export function getLatestTelemetry(id: string) {
  return api.get(`/api/v1/devices/${id}/telemetry/latest`).then(r => r.data)
}

export function getTelemetryHistory(id: string, params?: { startTime?: string; endTime?: string; limit?: number }) {
  return api.get(`/api/v1/devices/${id}/telemetry/history`, { params }).then(r => r.data)
}

