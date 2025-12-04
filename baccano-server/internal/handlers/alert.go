package handlers

import (
	"net/http"

	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
)

// AlertHandler 告警处理器
type AlertHandler struct {
	alertService *services.AlertService
}

// NewAlertHandler 创建告警处理器
func NewAlertHandler(alertService *services.AlertService) *AlertHandler {
	return &AlertHandler{
		alertService: alertService,
	}
}

// ListAlerts 获取告警列表
func (h *AlertHandler) ListAlerts(c *gin.Context) {
	alerts := h.alertService.ListAlerts()
	c.JSON(http.StatusOK, alerts)
}

// CreateAlert 创建新告警
func (h *AlertHandler) CreateAlert(c *gin.Context) {
	var alert services.Alert
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdAlert, err := h.alertService.CreateAlert(alert)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdAlert)
}

// GetAlert 获取告警详情
func (h *AlertHandler) GetAlert(c *gin.Context) {
	id := c.Param("id")
	alert, err := h.alertService.GetAlert(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if alert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Alert not found"})
		return
	}

	c.JSON(http.StatusOK, alert)
}

// UpdateAlert 更新告警信息
func (h *AlertHandler) UpdateAlert(c *gin.Context) {
	id := c.Param("id")
	var alert services.Alert
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedAlert, err := h.alertService.UpdateAlert(id, alert)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updatedAlert == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Alert not found"})
		return
	}

	c.JSON(http.StatusOK, updatedAlert)
}

// DeleteAlert 删除告警
func (h *AlertHandler) DeleteAlert(c *gin.Context) {
	id := c.Param("id")
	err := h.alertService.DeleteAlert(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
