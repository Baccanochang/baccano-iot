package handlers

import (
	"net/http"

	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
)

// RuleHandler 规则处理器
type RuleHandler struct {
	ruleService *services.RuleService
}

// NewRuleHandler 创建规则处理器
func NewRuleHandler(ruleService *services.RuleService) *RuleHandler {
	return &RuleHandler{
		ruleService: ruleService,
	}
}

// ListRules 获取规则列表
func (h *RuleHandler) ListRules(c *gin.Context) {
	rules := h.ruleService.ListRules()
	c.JSON(http.StatusOK, rules)
}

// CreateRule 创建新规则
func (h *RuleHandler) CreateRule(c *gin.Context) {
	var rule services.Rule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdRule, err := h.ruleService.CreateRule(rule)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdRule)
}

// GetRule 获取规则详情
func (h *RuleHandler) GetRule(c *gin.Context) {
	id := c.Param("id")
	rule, err := h.ruleService.GetRule(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if rule == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rule not found"})
		return
	}

	c.JSON(http.StatusOK, rule)
}

// UpdateRule 更新规则信息
func (h *RuleHandler) UpdateRule(c *gin.Context) {
	id := c.Param("id")
	var rule services.Rule
	if err := c.ShouldBindJSON(&rule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedRule, err := h.ruleService.UpdateRule(id, rule)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updatedRule == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Rule not found"})
		return
	}

	c.JSON(http.StatusOK, updatedRule)
}

// DeleteRule 删除规则
func (h *RuleHandler) DeleteRule(c *gin.Context) {
	id := c.Param("id")
	err := h.ruleService.DeleteRule(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// EnableRule 启用规则
func (h *RuleHandler) EnableRule(c *gin.Context) {
	id := c.Param("id")
	err := h.ruleService.EnableRule(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rule enabled"})
}

// DisableRule 禁用规则
func (h *RuleHandler) DisableRule(c *gin.Context) {
	id := c.Param("id")
	err := h.ruleService.DisableRule(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rule disabled"})
}
