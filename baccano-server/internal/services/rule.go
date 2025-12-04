package services

import (
	"time"
)

// RuleService 规则服务
type RuleService struct {
	dataStore *DataStoreService
	natsURL   string
}

// NewRuleService 创建规则服务
func NewRuleService(dataStore *DataStoreService, natsURL string) *RuleService {
	return &RuleService{
		dataStore: dataStore,
		natsURL:   natsURL,
	}
}

// Start 启动规则引擎
func (s *RuleService) Start() error {
	// TODO: 实现规则引擎启动逻辑
	return nil
}

// Shutdown 关闭规则引擎
func (s *RuleService) Shutdown() error {
	// TODO: 实现规则引擎关闭逻辑
	return nil
}

// ListRules 获取规则列表
func (s *RuleService) ListRules() []Rule {
	rules := make([]Rule, 0, len(s.dataStore.Rules))
	for _, rule := range s.dataStore.Rules {
		rules = append(rules, rule)
	}
	return rules
}

// CreateRule 创建新规则
func (s *RuleService) CreateRule(rule Rule) (*Rule, error) {
	// 生成规则ID（如果没有提供）
	if rule.ID == "" {
		rule.ID = "rule-" + time.Now().Format("20060102150405")
	}

	// 设置默认值
	if rule.Enabled == false {
		rule.Enabled = true
	}

	// 设置时间戳
	now := time.Now().Format(time.RFC3339)
	rule.CreatedAt = now
	rule.UpdatedAt = now

	// 存储规则
	s.dataStore.Rules[rule.ID] = rule

	return &rule, nil
}

// GetRule 获取规则详情
func (s *RuleService) GetRule(id string) (*Rule, error) {
	rule, exists := s.dataStore.Rules[id]
	if !exists {
		return nil, nil // 规则不存在
	}
	return &rule, nil
}

// UpdateRule 更新规则信息
func (s *RuleService) UpdateRule(id string, rule Rule) (*Rule, error) {
	existingRule, exists := s.dataStore.Rules[id]
	if !exists {
		return nil, nil // 规则不存在
	}

	// 更新规则信息
	if rule.Name != "" {
		existingRule.Name = rule.Name
	}
	if rule.Description != "" {
		existingRule.Description = rule.Description
	}
	if rule.Condition != "" {
		existingRule.Condition = rule.Condition
	}
	if rule.Action != "" {
		existingRule.Action = rule.Action
	}
	if rule.Enabled != existingRule.Enabled {
		existingRule.Enabled = rule.Enabled
	}

	// 更新时间戳
	existingRule.UpdatedAt = time.Now().Format(time.RFC3339)

	// 存储更新后的规则
	s.dataStore.Rules[id] = existingRule

	return &existingRule, nil
}

// DeleteRule 删除规则
func (s *RuleService) DeleteRule(id string) error {
	delete(s.dataStore.Rules, id)
	return nil
}

// EnableRule 启用规则
func (s *RuleService) EnableRule(id string) error {
	rule, exists := s.dataStore.Rules[id]
	if !exists {
		return nil // 规则不存在
	}

	rule.Enabled = true
	rule.UpdatedAt = time.Now().Format(time.RFC3339)
	s.dataStore.Rules[id] = rule

	return nil
}

// DisableRule 禁用规则
func (s *RuleService) DisableRule(id string) error {
	rule, exists := s.dataStore.Rules[id]
	if !exists {
		return nil // 规则不存在
	}

	rule.Enabled = false
	rule.UpdatedAt = time.Now().Format(time.RFC3339)
	s.dataStore.Rules[id] = rule

	return nil
}
