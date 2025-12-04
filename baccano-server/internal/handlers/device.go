package handlers

import (
	"net/http"

	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
)

// DeviceHandler 设备处理器
type DeviceHandler struct {
	deviceService *services.DeviceService
}

// NewDeviceHandler 创建设备处理器
func NewDeviceHandler(deviceService *services.DeviceService) *DeviceHandler {
	return &DeviceHandler{
		deviceService: deviceService,
	}
}

// ListDevices 获取设备列表
func (h *DeviceHandler) ListDevices(c *gin.Context) {
	devices := h.deviceService.ListDevices()
	c.JSON(http.StatusOK, devices)
}

// CreateDevice 创建新设备
func (h *DeviceHandler) CreateDevice(c *gin.Context) {
	var device services.Device
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdDevice, err := h.deviceService.CreateDevice(device)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdDevice)
}

// GetDevice 获取设备详情
func (h *DeviceHandler) GetDevice(c *gin.Context) {
	id := c.Param("id")
	device, err := h.deviceService.GetDevice(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if device == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	c.JSON(http.StatusOK, device)
}

// UpdateDevice 更新设备信息
func (h *DeviceHandler) UpdateDevice(c *gin.Context) {
	id := c.Param("id")
	var device services.Device
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedDevice, err := h.deviceService.UpdateDevice(id, device)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updatedDevice == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	c.JSON(http.StatusOK, updatedDevice)
}

// DeleteDevice 删除设备
func (h *DeviceHandler) DeleteDevice(c *gin.Context) {
	id := c.Param("id")
	err := h.deviceService.DeleteDevice(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// GetShadow 获取设备影子
func (h *DeviceHandler) GetShadow(c *gin.Context) {
	id := c.Param("id")
	shadow, err := h.deviceService.GetDeviceShadow(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if shadow == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	c.JSON(http.StatusOK, shadow)
}

// UpdateDesired 更新设备期望影子
func (h *DeviceHandler) UpdateDesired(c *gin.Context) {
	id := c.Param("id")
	var desired map[string]interface{}
	if err := c.ShouldBindJSON(&desired); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 获取当前影子
	shadow, err := h.deviceService.GetDeviceShadow(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if shadow == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	// 更新期望影子
	shadow.Desired = desired
	updatedShadow, err := h.deviceService.UpdateDeviceShadow(id, *shadow)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedShadow)
}

// GetAttributes 获取设备属性
func (h *DeviceHandler) GetAttributes(c *gin.Context) {
	id := c.Param("id")
	device, err := h.deviceService.GetDevice(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if device == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	c.JSON(http.StatusOK, device.Attributes)
}

// UpdateAttributes 更新设备属性
func (h *DeviceHandler) UpdateAttributes(c *gin.Context) {
	id := c.Param("id")
	var attributes map[string]interface{}
	if err := c.ShouldBindJSON(&attributes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 获取当前设备
	device, err := h.deviceService.GetDevice(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if device == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	// 更新属性
	device.Attributes = attributes
	updatedDevice, err := h.deviceService.UpdateDevice(id, *device)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedDevice.Attributes)
}

// RPC 远程调用设备服务
func (h *DeviceHandler) RPC(c *gin.Context) {
	id := c.Param("id")
	var rpcReq struct {
		Method string                 `json:"method"`
		Params map[string]interface{} `json:"params"`
	}

	if err := c.ShouldBindJSON(&rpcReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.deviceService.RPC(id, rpcReq.Method, rpcReq.Params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}
