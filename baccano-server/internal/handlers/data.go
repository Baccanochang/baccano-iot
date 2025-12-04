package handlers

import (
	"net/http"

	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
)

// DataHandler 数据处理器
type DataHandler struct {
	dataService *services.DataService
}

// NewDataHandler 创建数据处理器
func NewDataHandler(dataService *services.DataService) *DataHandler {
	return &DataHandler{
		dataService: dataService,
	}
}

// GetLatestTelemetry 获取设备最新遥测数据
func (h *DataHandler) GetLatestTelemetry(c *gin.Context) {
	deviceID := c.Param("deviceId")
	data, err := h.dataService.GetLatestTelemetry(deviceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}

// GetTelemetryHistory 获取设备遥测数据历史
func (h *DataHandler) GetTelemetryHistory(c *gin.Context) {
	deviceID := c.Param("deviceId")
	startTime := c.Query("startTime")
	endTime := c.Query("endTime")

	data, err := h.dataService.GetTelemetryHistory(deviceID, startTime, endTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
