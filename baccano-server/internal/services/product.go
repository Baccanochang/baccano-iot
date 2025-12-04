package services

import (
	"time"
)

// ProductService 产品服务
type ProductService struct {
	dataStore *DataStoreService
}

// NewProductService 创建产品服务
func NewProductService(dataStore *DataStoreService) *ProductService {
	return &ProductService{
		dataStore: dataStore,
	}
}

// ListProducts 获取产品列表
func (s *ProductService) ListProducts() []Product {
	products := make([]Product, 0, len(s.dataStore.Products))
	for _, product := range s.dataStore.Products {
		products = append(products, product)
	}
	return products
}

// CreateProduct 创建新产品
func (s *ProductService) CreateProduct(product Product) (*Product, error) {
	// 生成产品ID（如果没有提供）
	if product.ID == "" {
		product.ID = "product-" + time.Now().Format("20060102150405")
	}

	// 设置默认值
	if product.Protocol == "" {
		product.Protocol = "MQTT"
	}
	if product.DefaultModelVersion == "" {
		product.DefaultModelVersion = "v1"
	}

	// 设置时间戳
	now := time.Now().Format(time.RFC3339)
	product.CreatedAt = now
	product.UpdatedAt = now

	// 存储产品
	s.dataStore.Products[product.ID] = product

	// 初始化产品的物模型映射
	if _, exists := s.dataStore.Models[product.ID]; !exists {
		s.dataStore.Models[product.ID] = make(map[string]ThingModel)
	}

	return &product, nil
}

// GetProduct 获取产品详情
func (s *ProductService) GetProduct(id string) (*Product, error) {
	product, exists := s.dataStore.Products[id]
	if !exists {
		return nil, nil // 产品不存在
	}
	return &product, nil
}

// UpdateProduct 更新产品信息
func (s *ProductService) UpdateProduct(id string, product Product) (*Product, error) {
	existingProduct, exists := s.dataStore.Products[id]
	if !exists {
		return nil, nil // 产品不存在
	}

	// 更新产品信息
	if product.Name != "" {
		existingProduct.Name = product.Name
	}
	if product.Protocol != "" {
		existingProduct.Protocol = product.Protocol
	}
	if product.DefaultModelVersion != "" {
		existingProduct.DefaultModelVersion = product.DefaultModelVersion
	}
	if product.Description != "" {
		existingProduct.Description = product.Description
	}

	// 更新时间戳
	existingProduct.UpdatedAt = time.Now().Format(time.RFC3339)

	// 存储更新后的产品
	s.dataStore.Products[id] = existingProduct

	return &existingProduct, nil
}

// DeleteProduct 删除产品
func (s *ProductService) DeleteProduct(id string) error {
	// 删除产品
	delete(s.dataStore.Products, id)
	// 删除产品的物模型
	delete(s.dataStore.Models, id)
	return nil
}

// ListModels 获取产品的物模型列表
func (s *ProductService) ListModels(productID string) map[string]ThingModel {
	models, exists := s.dataStore.Models[productID]
	if !exists {
		return make(map[string]ThingModel)
	}
	return models
}

// GetModel 获取产品的特定版本物模型
func (s *ProductService) GetModel(productID, version string) (*ThingModel, error) {
	models, exists := s.dataStore.Models[productID]
	if !exists {
		return nil, nil // 产品不存在
	}

	model, exists := models[version]
	if !exists {
		return nil, nil // 模型版本不存在
	}

	return &model, nil
}

// PutModel 保存产品的物模型
func (s *ProductService) PutModel(productID, version string, model ThingModel) (*ThingModel, error) {
	// 确保产品存在
	if _, exists := s.dataStore.Products[productID]; !exists {
		return nil, nil // 产品不存在
	}

	// 确保模型映射存在
	if _, exists := s.dataStore.Models[productID]; !exists {
		s.dataStore.Models[productID] = make(map[string]ThingModel)
	}

	// 保存模型
	s.dataStore.Models[productID][version] = model

	return &model, nil
}

// ValidateModel 验证物模型
func (s *ProductService) ValidateModel(model ThingModel) (bool, error) {
	// TODO: 实现物模型验证逻辑
	// 这里为了演示，直接返回验证通过
	return true, nil
}

// DiffModels 比较两个物模型的差异
func (s *ProductService) DiffModels(oldModel, newModel ThingModel) (map[string]interface{}, error) {
	// TODO: 实现物模型差异比较逻辑
	// 这里为了演示，直接返回空差异
	return make(map[string]interface{}), nil
}
