package config

import (
	"os"
)

// Config 应用配置
type Config struct {
	// HTTP服务配置
	HTTPPort string

	// 设备连接服务配置
	MQTTPort string
	CoAPPort string
	GRPCPort string

	// 认证配置
	JWTSecret string

	// 数据库配置
	DatabaseURL string
	RedisURL    string
	NATSURL     string

	// 其他配置
	Environment string
	LogLevel    string
}

// LoadConfig 加载配置
func LoadConfig() *Config {
	return &Config{
		HTTPPort:    getEnv("HTTP_PORT", ":8080"),
		MQTTPort:    getEnv("MQTT_PORT", ":1883"),
		CoAPPort:    getEnv("COAP_PORT", ":5683"),
		GRPCPort:    getEnv("GRPC_PORT", ":8091"),
		JWTSecret:   getEnv("JWT_SECRET", "dev-secret"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/iot?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		NATSURL:     getEnv("NATS_URL", "nats://localhost:4222"),
		Environment: getEnv("ENV", "development"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),
	}
}

// getEnv 获取环境变量，如果不存在则返回默认值
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
