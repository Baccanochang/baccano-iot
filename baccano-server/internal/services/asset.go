package services

import (
	"time"
)

// AssetService 资产服务
type AssetService struct {
	dataStore *DataStoreService
}

// NewAssetService 创建资产服务
func NewAssetService(dataStore *DataStoreService) *AssetService {
	return &AssetService{
		dataStore: dataStore,
	}
}

// ListAssets 获取资产列表
func (s *AssetService) ListAssets() []Asset {
	assets := make([]Asset, 0, len(s.dataStore.Assets))
	for _, asset := range s.dataStore.Assets {
		assets = append(assets, asset)
	}
	return assets
}

// CreateAsset 创建新资产
func (s *AssetService) CreateAsset(asset Asset) (*Asset, error) {
	// 生成资产ID（如果没有提供）
	if asset.ID == "" {
		asset.ID = "asset-" + time.Now().Format("20060102150405")
	}

	// 设置默认值
	if asset.Status == "" {
		asset.Status = "online"
	}

	// 设置时间戳
	now := time.Now().Format(time.RFC3339)
	asset.CreatedAt = now
	asset.UpdatedAt = now

	// 存储资产
	s.dataStore.Assets[asset.ID] = asset

	return &asset, nil
}

// GetAsset 获取资产详情
func (s *AssetService) GetAsset(id string) (*Asset, error) {
	asset, exists := s.dataStore.Assets[id]
	if !exists {
		return nil, nil // 资产不存在
	}
	return &asset, nil
}

// UpdateAsset 更新资产信息
func (s *AssetService) UpdateAsset(id string, asset Asset) (*Asset, error) {
	existingAsset, exists := s.dataStore.Assets[id]
	if !exists {
		return nil, nil // 资产不存在
	}

	// 更新资产信息
	if asset.Name != "" {
		existingAsset.Name = asset.Name
	}
	if asset.Type != "" {
		existingAsset.Type = asset.Type
	}
	if asset.ParentID != "" {
		existingAsset.ParentID = asset.ParentID
	}
	if asset.Status != "" {
		existingAsset.Status = asset.Status
	}
	if asset.Description != "" {
		existingAsset.Description = asset.Description
	}
	if asset.Properties != nil {
		existingAsset.Properties = asset.Properties
	}

	// 更新时间戳
	existingAsset.UpdatedAt = time.Now().Format(time.RFC3339)

	// 存储更新后的资产
	s.dataStore.Assets[id] = existingAsset

	return &existingAsset, nil
}

// DeleteAsset 删除资产
func (s *AssetService) DeleteAsset(id string) error {
	delete(s.dataStore.Assets, id)
	return nil
}
