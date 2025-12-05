import apiClient from './axiosConfig';

// 设备类型定义
export interface Device {
  id: string;
  name: string;
  deviceModel: string;
  serialNumber: string;
  status: number; // 0-离线，1-在线，2-故障
  ipAddress?: string;
  macAddress?: string;
  lastOnlineTime?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface DeviceConfig {
  id: string;
  deviceId: string;
  configKey: string;
  configValue: string;
  description?: string;
  updatedAt?: string;
}

export interface DeviceData {
  deviceId: string;
  timestamp: string;
  data: Record<string, any>;
}

// 设备管理API服务
export const deviceApi = {
  // 获取设备列表
  getDevices: async (): Promise<Device[]> => {
    return apiClient.get('/devices');
  },

  // 获取设备详情
  getDeviceById: async (id: string): Promise<Device> => {
    return apiClient.get(`/devices/${id}`);
  },

  // 创建设备
  createDevice: async (device: Omit<Device, 'id' | 'lastOnlineTime' | 'createdAt' | 'updatedAt'>): Promise<Device> => {
    return apiClient.post('/devices', device);
  },

  // 更新设备
  updateDevice: async (id: string, device: Partial<Device>): Promise<Device> => {
    return apiClient.put(`/devices/${id}`, device);
  },

  // 删除设备
  deleteDevice: async (id: string): Promise<void> => {
    return apiClient.delete(`/devices/${id}`);
  },

  // 获取设备配置
  getDeviceConfigs: async (deviceId: string): Promise<DeviceConfig[]> => {
    return apiClient.get(`/devices/${deviceId}/configs`);
  },

  // 更新设备配置
  updateDeviceConfig: async (deviceId: string, config: DeviceConfig): Promise<DeviceConfig> => {
    return apiClient.put(`/devices/${deviceId}/configs`, config);
  },

  // 获取设备实时数据
  getDeviceRealTimeData: async (deviceId: string): Promise<DeviceData> => {
    return apiClient.get(`/devices/${deviceId}/realtime-data`);
  },

  // 获取设备历史数据
  getDeviceHistoryData: async (deviceId: string, params: { startTime: string; endTime: string; limit?: number }): Promise<DeviceData[]> => {
    return apiClient.get(`/devices/${deviceId}/history-data`, { params });
  },

  // 批量更新设备状态
  batchUpdateDeviceStatus: async (deviceIds: string[], status: number): Promise<void> => {
    return apiClient.patch('/devices/batch/status', { deviceIds, status });
  },
};
