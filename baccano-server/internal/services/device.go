package services

import (
	"time"
)

// DeviceService 设备服务
type DeviceService struct {
	dataStore *DataStoreService
}

// NewDeviceService 创建设备服务
func NewDeviceService(dataStore *DataStoreService) *DeviceService {
	return &DeviceService{
		dataStore: dataStore,
	}
}

// ListDevices 获取设备列表
func (s *DeviceService) ListDevices() []Device {
	devices := make([]Device, 0, len(s.dataStore.Devices))
	for _, device := range s.dataStore.Devices {
		devices = append(devices, device)
	}
	return devices
}

// CreateDevice 创建新设备
func (s *DeviceService) CreateDevice(device Device) (*Device, error) {
	// 生成设备ID（如果没有提供）
	if device.ID == "" {
		device.ID = "device-" + time.Now().Format("20060102150405")
	}

	// 设置默认值
	if device.Status == "" {
		device.Status = "offline"
	}

	// 设置时间戳
	now := time.Now().Format(time.RFC3339)
	device.CreatedAt = now
	device.UpdatedAt = now

	// 初始化设备影子
	if device.Shadow.Reported == nil {
		device.Shadow.Reported = make(map[string]interface{})
	}
	if device.Shadow.Desired == nil {
		device.Shadow.Desired = make(map[string]interface{})
	}

	// 存储设备
	s.dataStore.Devices[device.ID] = device

	return &device, nil
}

// GetDevice 获取设备详情
func (s *DeviceService) GetDevice(id string) (*Device, error) {
	device, exists := s.dataStore.Devices[id]
	if !exists {
		return nil, nil // 设备不存在
	}
	return &device, nil
}

// UpdateDevice 更新设备信息
func (s *DeviceService) UpdateDevice(id string, device Device) (*Device, error) {
	existingDevice, exists := s.dataStore.Devices[id]
	if !exists {
		return nil, nil // 设备不存在
	}

	// 更新设备信息
	if device.Name != "" {
		existingDevice.Name = device.Name
	}
	if device.ProductID != "" {
		existingDevice.ProductID = device.ProductID
	}
	if device.Status != "" {
		existingDevice.Status = device.Status
	}
	if device.Attributes != nil {
		existingDevice.Attributes = device.Attributes
	}

	// 更新时间戳
	existingDevice.UpdatedAt = time.Now().Format(time.RFC3339)

	// 存储更新后的设备
	s.dataStore.Devices[id] = existingDevice

	return &existingDevice, nil
}

// DeleteDevice 删除设备
func (s *DeviceService) DeleteDevice(id string) error {
	delete(s.dataStore.Devices, id)
	return nil
}

// GetDeviceShadow 获取设备影子
func (s *DeviceService) GetDeviceShadow(id string) (*DeviceShadow, error) {
	device, exists := s.dataStore.Devices[id]
	if !exists {
		return nil, nil // 设备不存在
	}
	return &device.Shadow, nil
}

// UpdateDeviceShadow 更新设备影子
func (s *DeviceService) UpdateDeviceShadow(id string, shadow DeviceShadow) (*DeviceShadow, error) {
	device, exists := s.dataStore.Devices[id]
	if !exists {
		return nil, nil // 设备不存在
	}

	// 更新影子
	if shadow.Reported != nil {
		device.Shadow.Reported = shadow.Reported
	}
	if shadow.Desired != nil {
		device.Shadow.Desired = shadow.Desired
	}
	device.Shadow.Version++
	device.Shadow.Timestamp = time.Now().Format(time.RFC3339)

	// 存储更新后的设备
	s.dataStore.Devices[id] = device

	return &device.Shadow, nil
}

// UpdateDeviceAttributes 更新设备属性
func (s *DeviceService) UpdateDeviceAttributes(id string, attributes map[string]interface{}) error {
	device, exists := s.dataStore.Devices[id]
	if !exists {
		return nil // 设备不存在
	}

	// 更新属性
	if device.Attributes == nil {
		device.Attributes = make(map[string]interface{})
	}
	for key, value := range attributes {
		device.Attributes[key] = value
	}

	// 更新时间戳
	s.dataStore.Devices[id] = device

	return nil
}

// RPC 远程调用设备服务
func (s *DeviceService) RPC(id string, method string, params map[string]interface{}) (map[string]interface{}, error) {
	// TODO: 实现设备RPC调用逻辑
	// 这里为了演示，直接返回成功响应

	return map[string]interface{}{
		"result":  "success",
		"message": "RPC call received",
		"method":  method,
		"params":  params,
	}, nil
}
