package handlers

import (
	"net/http"

	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
)

// ProductHandler 产品处理器
type ProductHandler struct {
	productService *services.ProductService
}

// NewProductHandler 创建产品处理器
func NewProductHandler(productService *services.ProductService) *ProductHandler {
	return &ProductHandler{
		productService: productService,
	}
}

// ListProducts 获取产品列表
func (h *ProductHandler) ListProducts(c *gin.Context) {
	products := h.productService.ListProducts()
	c.JSON(http.StatusOK, products)
}

// CreateProduct 创建新产品
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var product services.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdProduct, err := h.productService.CreateProduct(product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdProduct)
}

// GetProduct 获取产品详情
func (h *ProductHandler) GetProduct(c *gin.Context) {
	id := c.Param("id")
	product, err := h.productService.GetProduct(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if product == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

// UpdateProduct 更新产品信息
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product services.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProduct, err := h.productService.UpdateProduct(id, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if updatedProduct == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, updatedProduct)
}

// DeleteProduct 删除产品
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	err := h.productService.DeleteProduct(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// ListModels 获取产品的物模型列表
func (h *ProductHandler) ListModels(c *gin.Context) {
	productID := c.Param("id")
	models := h.productService.ListModels(productID)
	c.JSON(http.StatusOK, models)
}

// GetModel 获取产品的特定版本物模型
func (h *ProductHandler) GetModel(c *gin.Context) {
	productID := c.Param("id")
	version := c.Param("version")
	model, err := h.productService.GetModel(productID, version)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if model == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Model not found"})
		return
	}

	c.JSON(http.StatusOK, model)
}

// PutModel 保存产品的物模型
func (h *ProductHandler) PutModel(c *gin.Context) {
	productID := c.Param("id")
	version := c.DefaultQuery("version", "v1")

	var model services.ThingModel
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	savedModel, err := h.productService.PutModel(productID, version, model)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, savedModel)
}

// ValidateModel 验证物模型
func (h *ProductHandler) ValidateModel(c *gin.Context) {
	var model services.ThingModel
	if err := c.ShouldBindJSON(&model); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	valid, err := h.productService.ValidateModel(model)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"valid": valid})
}

// DiffModels 比较两个物模型的差异
func (h *ProductHandler) DiffModels(c *gin.Context) {
	var req struct {
		OldModel services.ThingModel `json:"old_model"`
		NewModel services.ThingModel `json:"new_model"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	diff, err := h.productService.DiffModels(req.OldModel, req.NewModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, diff)
}
