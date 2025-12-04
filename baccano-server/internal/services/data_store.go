package services

import (
	"fmt"
	"log"

	"github.com/nats-io/nats.go"
	"github.com/redis/go-redis/v9"
)

// DataStoreService 数据存储服务
type DataStoreService struct {
	redisClient *redis.Client
	natsConn   *nats.Conn

	// 内存数据存储（用于开发和测试）
	Devices  map[string]Device
	Products map[string]Product
	Assets   map[string]Asset
	Alerts   map[string]Alert
	Rules    map[string]Rule
	Models   map[string]map[string]ThingModel
}

// NewDataStoreService 创建数据存储服务
func NewDataStoreService(databaseURL, redisURL, natsURL string) *DataStoreService {
	svc := &DataStoreService{
		// 初始化内存存储
		Devices:  make(map[string]Device),
		Products: make(map[string]Product),
		Assets:   make(map[string]Asset),
		Alerts:   make(map[string]Alert),
		Rules:    make(map[string]Rule),
		Models:   make(map[string]map[string]ThingModel),
	}

	// 连接Redis（如果配置了）
	if redisURL != "" {
		opt, err := redis.ParseURL(redisURL)
		if err != nil {
			log.Printf("Failed to parse Redis URL: %v, using in-memory storage", err)
		} else {
			svc.redisClient = redis.NewClient(opt)
		}
	}

	// 连接NATS（如果配置了）
	if natsURL != "" {
		conn, err := nats.Connect(natsURL)
		if err != nil {
			log.Printf("Failed to connect to NATS: %v, using in-memory communication", err)
		} else {
			svc.natsConn = conn
		}
	}

	// 连接PostgreSQL（如果配置了）
	if databaseURL != "" {
		// TODO: 实现PostgreSQL连接
		log.Printf("PostgreSQL connection not implemented yet, using in-memory storage")
	}

	// 初始化示例数据
	svc.initSampleData()

	return svc
}

// initSampleData 初始化示例数据
func (s *DataStoreService) initSampleData() {
	// 初始化示例产品
	s.Products["demo-prod"] = Product{
		ID:                  "demo-prod",
		Name:                "Demo Product",
		Protocol:            "MQTT",
		DefaultModelVersion: "v1",
	}

	// 初始化示例设备
	s.Devices["demo-dev"] = Device{
		ID:        "demo-dev",
		Name:      "Demo Device",
		ProductID: "demo-prod",
		Status:    "online",
	}

	// 初始化示例模型
	s.Models["demo-prod"] = map[string]ThingModel{
		"v1": {
			SchemaVersion: "1.0",
			Properties: []Property{
				{
					Identifier: "temperature",
					Name:       "温度",
					AccessMode: "rw",
					DataType: DataType{
						Type: "float",
						Specs: map[string]interface{}{
							"min":  -100,
							"max":  300,
							"step": 0.1,
							"unit": "℃",
						},
					},
					Category:    "telemetry",
					Description: "环境温度传感器",
				},
			},
			Services: []Service{
				{
					Identifier: "reboot",
					Name:       "重启设备",
					CallType:   "async",
					InputData: []Param{
						{
							Identifier: "delay",
							Name:       "延迟时间",
							DataType:   DataType{Type: "int", Specs: map[string]interface{}{"min": 0, "max": 60, "unit": "秒"}},
						},
					},
					OutputData: []Param{
						{
							Identifier: "result",
							Name:       "执行结果",
							DataType:   DataType{Type: "bool"},
						},
					},
				},
			},
			Events: []Event{
				{
					Identifier: "error",
					Name:       "错误事件",
					Type:       "error",
					OutputData: []Param{
						{
							Identifier: "errorCode",
							Name:       "错误码",
							DataType:   DataType{Type: "int"},
						},
						{
							Identifier: "errorMessage",
							Name:       "错误信息",
							DataType:   DataType{Type: "string"},
						},
					},
				},
			},
		},
	}
}

// Shutdown 关闭数据存储服务
func (s *DataStoreService) Shutdown() error {
	var err error

	// 关闭NATS连接
	if s.natsConn != nil {
		s.natsConn.Close()
	}

	// 关闭Redis连接
	if s.redisClient != nil {
		if redisErr := s.redisClient.Close(); redisErr != nil {
			log.Printf("Failed to close Redis connection: %v", redisErr)
			err = fmt.Errorf("failed to close Redis connection: %v", redisErr)
		}
	}

	return err
}

// PublishToNATS 发布消息到NATS
func (s *DataStoreService) PublishToNATS(subject string, data []byte) error {
	if s.natsConn == nil {
		log.Printf("NATS not connected, skipping publish to %s: %s", subject, string(data))
		return nil
	}
	return s.natsConn.Publish(subject, data)
}

// SubscribeToNATS 订阅NATS主题
func (s *DataStoreService) SubscribeToNATS(subject string, handler nats.MsgHandler) (*nats.Subscription, error) {
	if s.natsConn == nil {
		log.Printf("NATS not connected, skipping subscription to %s", subject)
		return nil, nil
	}
	return s.natsConn.Subscribe(subject, handler)
}

// GetRedisClient 获取Redis客户端
func (s *DataStoreService) GetRedisClient() *redis.Client {
	return s.redisClient
}

// GetNATSConn 获取NATS连接
func (s *DataStoreService) GetNATSConn() *nats.Conn {
	return s.natsConn
}
