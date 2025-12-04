package services

import (
	"time"
)

// AlertService 告警服务
type AlertService struct {
	dataStore *DataStoreService
}

// NewAlertService 创建告警服务
func NewAlertService(dataStore *DataStoreService) *AlertService {
	return &AlertService{
		dataStore: dataStore,
	}
}

// ListAlerts 获取告警列表
func (s *AlertService) ListAlerts() []Alert {
	alerts := make([]Alert, 0, len(s.dataStore.Alerts))
	for _, alert := range s.dataStore.Alerts {
		alerts = append(alerts, alert)
	}
	return alerts
}

// CreateAlert 创建新告警
func (s *AlertService) CreateAlert(alert Alert) (*Alert, error) {
	// 生成告警ID（如果没有提供）
	if alert.ID == "" {
		alert.ID = "alert-" + time.Now().Format("20060102150405")
	}

	// 设置默认值
	if alert.Severity == "" {
		alert.Severity = "info"
	}
	if alert.Status == "" {
		alert.Status = "active"
	}
	if alert.Timestamp == "" {
		alert.Timestamp = time.Now().Format(time.RFC3339)
	}

	// 存储告警
	s.dataStore.Alerts[alert.ID] = alert

	return &alert, nil
}

// GetAlert 获取告警详情
func (s *AlertService) GetAlert(id string) (*Alert, error) {
	alert, exists := s.dataStore.Alerts[id]
	if !exists {
		return nil, nil // 告警不存在
	}
	return &alert, nil
}

// UpdateAlert 更新告警信息
func (s *AlertService) UpdateAlert(id string, alert Alert) (*Alert, error) {
	existingAlert, exists := s.dataStore.Alerts[id]
	if !exists {
		return nil, nil // 告警不存在
	}

	// 更新告警信息
	if alert.Severity != "" {
		existingAlert.Severity = alert.Severity
	}
	if alert.Status != "" {
		existingAlert.Status = alert.Status
	}
	if alert.Message != "" {
		existingAlert.Message = alert.Message
	}
	if alert.ResolvedAt != "" {
		existingAlert.ResolvedAt = alert.ResolvedAt
	}

	// 存储更新后的告警
	s.dataStore.Alerts[id] = existingAlert

	return &existingAlert, nil
}

// DeleteAlert 删除告警
func (s *AlertService) DeleteAlert(id string) error {
	delete(s.dataStore.Alerts, id)
	return nil
}
