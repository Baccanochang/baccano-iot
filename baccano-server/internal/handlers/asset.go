package handlers

import (
	"net/http"

	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
)

// AssetHandler 资产处理器
type AssetHandler struct {
	assetService *services.AssetService
}

// NewAssetHandler 创建资产处理器
func NewAssetHandler(assetService *services.AssetService) *AssetHandler {
	return &AssetHandler{
		assetService: assetService,
	}
}

// ListAssets 获取资产列表
func (h *AssetHandler) ListAssets(c *gin.Context) {
	assets := h.assetService.ListAssets()
	c.JSON(http.StatusOK, assets)
}

// CreateAsset 创建新资产
func (h *AssetHandler) CreateAsset(c *gin.Context) {
	var asset services.Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdAsset, err := h.assetService.CreateAsset(asset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdAsset)
}

// GetAsset 获取资产详情
func (h *AssetHandler) GetAsset(c *gin.Context) {
	id := c.Param("id")
	asset, err := h.assetService.GetAsset(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if asset == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found"})
		return
	}

	c.JSON(http.StatusOK, asset)
}

// UpdateAsset 更新资产信息
func (h *AssetHandler) UpdateAsset(c *gin.Context) {
	id := c.Param("id")
	var asset services.Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedAsset, err := h.assetService.UpdateAsset(id, asset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updatedAsset == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Asset not found"})
		return
	}

	c.JSON(http.StatusOK, updatedAsset)
}

// DeleteAsset 删除资产
func (h *AssetHandler) DeleteAsset(c *gin.Context) {
	id := c.Param("id")
	err := h.assetService.DeleteAsset(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
