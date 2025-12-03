package main

import (
	"baccano-iot/api-gateway/internal/domain"
	httpx "baccano-iot/api-gateway/internal/http"
	"baccano-iot/api-gateway/internal/repository"
	"baccano-iot/api-gateway/internal/service"
	"baccano-iot/api-gateway/server"
	logx "baccano-iot/shared/log"

	"github.com/gin-gonic/gin"
)

func sampleModel() domain.ThingModel {
	return domain.ThingModel{
		SchemaVersion: "1.0",
		Properties: []map[string]interface{}{
			{
				"identifier": "temperature",
				"name":       "温度",
				"accessMode": "rw",
				"dataType": map[string]interface{}{
					"type":  "float",
					"specs": map[string]interface{}{"min": -100, "max": 300, "step": 0.1, "unit": "℃"},
				},
				"category":    "telemetry",
				"description": "环境温度传感器",
			},
		},
		Services: []map[string]interface{}{
			{
				"identifier": "reboot",
				"name":       "重启设备",
				"callType":   "async",
				"inputData": []interface{}{
					map[string]interface{}{
						"identifier": "delay",
						"name":       "延迟时间",
						"dataType":   map[string]interface{}{"type": "int", "specs": map[string]interface{}{"min": 0, "max": 60, "unit": "秒"}},
					},
				},
				"outputData": []interface{}{
					map[string]interface{}{
						"identifier": "result",
						"name":       "执行结果",
						"dataType":   map[string]interface{}{"type": "bool"},
					},
				},
			},
		},
		Events: []map[string]interface{}{
			{
				"identifier": "error",
				"name":       "错误事件",
				"type":       "error",
				"outputData": []interface{}{
					map[string]interface{}{"identifier": "errorCode", "name": "错误码", "dataType": map[string]interface{}{"type": "int"}},
					map[string]interface{}{"identifier": "errorMessage", "name": "错误信息", "dataType": map[string]interface{}{"type": "string"}},
				},
			},
		},
	}
}

func main() {
	logx.Init()
	store := repository.NewStore()
	productRepo := repository.NewProductRepo(store)
	deviceRepo := repository.NewDeviceRepo(store)
	productSvc := service.NewProductService(productRepo)
	deviceSvc := service.NewDeviceService(deviceRepo)
	srv := server.New()

	store.Models["demo-prod"] = map[string]domain.ThingModel{"v1": sampleModel()}
	store.Products["demo-prod"] = domain.Product{ID: "demo-prod", Name: "Demo Product", Protocol: "MQTT", DefaultModelVersion: "v1"}

	dh := httpx.NewDeviceHandler(deviceSvc)
	ph := httpx.NewProductHandler(productSvc)

	srv.Handle("GET", "/debug/health", func(c *gin.Context) { httpx.DebugHealth(c.Writer, c.Request) })
	srv.Handle("GET", "/debug/config", func(c *gin.Context) { httpx.DebugConfig(c.Writer, c.Request) })
	srv.Handle("POST", "/api/v1/auth/login", func(c *gin.Context) { httpx.Login(c.Writer, c.Request) })
	srv.Handle("POST", "/api/v1/auth/refresh", func(c *gin.Context) { httpx.Refresh(c.Writer, c.Request) })

	srv.Handle("POST", "/api/v1/devices", func(c *gin.Context) { dh.Create(c.Writer, c.Request) })

	v1 := srv.Group("/api/v1")
	v1.GET("/devices/:id", func(c *gin.Context) { dh.Get(c.Writer, c.Request, c.Param("id")) })
	v1.GET("/devices/:id/thing-model", func(c *gin.Context) {
		id := c.Param("id")
		p := store.Products[store.Devices[id].ProductID]
		m := store.Models[p.ID][p.DefaultModelVersion]
		dh.GetModel(c.Writer, c.Request, m)
	})
	v1.POST("/devices/:id/rpc", func(c *gin.Context) { dh.RPC(c.Writer, c.Request, c.Param("id")) })
	v1.GET("/devices/:id/shadow", func(c *gin.Context) { dh.GetShadow(c.Writer, c.Request, c.Param("id")) })
	v1.PUT("/devices/:id/shadow/desired", func(c *gin.Context) { dh.UpdateDesired(c.Writer, c.Request, c.Param("id")) })
	v1.GET("/devices/:id/attributes", func(c *gin.Context) { dh.GetAttributes(c.Writer, c.Request, c.Param("id")) })
	v1.POST("/devices/:id/attributes", func(c *gin.Context) { dh.UpdateAttributes(c.Writer, c.Request, c.Param("id")) })
	v1.GET("/telemetry/:deviceId/latest", func(c *gin.Context) { httpx.GetLatestTelemetry(c.Writer, c.Request, c.Param("deviceId")) })
	v1.GET("/telemetry/:deviceId/history", func(c *gin.Context) { httpx.GetTelemetryHistory(c.Writer, c.Request, c.Param("deviceId")) })

	srv.Handle("POST", "/api/v1/products", func(c *gin.Context) { ph.Create(c.Writer, c.Request) })

	v1.GET("/products/:productId/thing-models", func(c *gin.Context) { ph.ListModels(c.Writer, c.Request, c.Param("productId")) })
	v1.PUT("/products/:productId/thing-model", func(c *gin.Context) { ph.PutModel(c.Writer, c.Request, c.Param("productId")) })
	v1.GET("/products/:productId/thing-models/:version", func(c *gin.Context) { ph.GetModel(c.Writer, c.Request, c.Param("productId"), c.Param("version")) })
	v1.POST("/products/:productId/thing-models/validate", func(c *gin.Context) { ph.ValidateModel(c.Writer, c.Request) })
	v1.POST("/products/:productId/thing-models/diff", func(c *gin.Context) { ph.DiffModels(c.Writer, c.Request) })

	srv.Run(":8080")
}
