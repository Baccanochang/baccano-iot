package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"baccano-iot/baccano-server/internal/config"
	"baccano-iot/baccano-server/internal/handlers"
	"baccano-iot/baccano-server/internal/middleware"
	"baccano-iot/baccano-server/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}

	// 初始化配置
	cfg := config.LoadConfig()

	// 初始化应用
	app := &App{
		Config: cfg,
	}

	if err := app.Initialize(); err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	// 启动服务
	if err := app.Start(); err != nil {
		log.Fatalf("Failed to start application: %v", err)
	}

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	app.Shutdown()
}

// App 应用程序结构
type App struct {
	Config     *config.Config
	Server     *gin.Engine
	HTTPServer *http.Server

	// 服务
	AuthService      *services.AuthService
	DeviceService    *services.DeviceService
	ProductService   *services.ProductService
	AssetService     *services.AssetService
	AlertService     *services.AlertService
	DataService      *services.DataService
	RuleService      *services.RuleService
	DataStoreService *services.DataStoreService

	// 处理器
	AuthHandler    *handlers.AuthHandler
	DeviceHandler  *handlers.DeviceHandler
	ProductHandler *handlers.ProductHandler
	AssetHandler   *handlers.AssetHandler
	AlertHandler   *handlers.AlertHandler
	DataHandler    *handlers.DataHandler
	RuleHandler    *handlers.RuleHandler
}

// Initialize 初始化应用程序
func (app *App) Initialize() error {
	// 初始化Gin引擎
	app.Server = gin.New()
	app.Server.Use(gin.Logger())
	app.Server.Use(gin.Recovery())
	app.Server.Use(middleware.CORS())

	// 初始化数据存储服务（先初始化，因为其他服务依赖它）
	app.DataStoreService = services.NewDataStoreService(app.Config.DatabaseURL, app.Config.RedisURL, app.Config.NATSURL)

	// 初始化其他服务
	app.AuthService = services.NewAuthService(app.Config.JWTSecret)
	app.DeviceService = services.NewDeviceService(app.DataStoreService)
	app.ProductService = services.NewProductService(app.DataStoreService)
	app.AssetService = services.NewAssetService(app.DataStoreService)
	app.AlertService = services.NewAlertService(app.DataStoreService)
	app.DataService = services.NewDataService(app.DataStoreService)
	app.RuleService = services.NewRuleService(app.DataStoreService, app.Config.NATSURL)

	// 初始化处理器
	app.AuthHandler = handlers.NewAuthHandler(app.AuthService)
	app.DeviceHandler = handlers.NewDeviceHandler(app.DeviceService)
	app.ProductHandler = handlers.NewProductHandler(app.ProductService)
	app.AssetHandler = handlers.NewAssetHandler(app.AssetService)
	app.AlertHandler = handlers.NewAlertHandler(app.AlertService)
	app.DataHandler = handlers.NewDataHandler(app.DataService)
	app.RuleHandler = handlers.NewRuleHandler(app.RuleService)

	// 设置路由
	app.setupRoutes()

	// 配置HTTP服务器
	app.HTTPServer = &http.Server{
		Addr:    app.Config.HTTPPort,
		Handler: app.Server,
	}

	return nil
}

// setupRoutes 设置路由
func (app *App) setupRoutes() {
	// 健康检查
	app.Server.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API组
	api := app.Server.Group("/api/v1")

	// 认证路由
	auth := api.Group("/auth")
	{
		auth.POST("/login", app.AuthHandler.Login)
		auth.POST("/refresh", app.AuthHandler.Refresh)
	}

	// 设备管理路由
	devices := api.Group("/devices")
	{
		devices.GET("", app.DeviceHandler.ListDevices)
		devices.POST("", app.DeviceHandler.CreateDevice)
		devices.GET("/:id", app.DeviceHandler.GetDevice)
		devices.PUT("/:id", app.DeviceHandler.UpdateDevice)
		devices.DELETE("/:id", app.DeviceHandler.DeleteDevice)
		devices.GET("/:id/telemetry/latest", app.DataHandler.GetLatestTelemetry)
		devices.GET("/:id/telemetry/history", app.DataHandler.GetTelemetryHistory)
		devices.POST("/:id/rpc", app.DeviceHandler.RPC)
		devices.GET("/:id/shadow", app.DeviceHandler.GetShadow)
		devices.PUT("/:id/shadow/desired", app.DeviceHandler.UpdateDesired)
		devices.GET("/:id/attributes", app.DeviceHandler.GetAttributes)
		devices.POST("/:id/attributes", app.DeviceHandler.UpdateAttributes)
	}

	// 产品管理路由
	products := api.Group("/products")
	{
		products.GET("", app.ProductHandler.ListProducts)
		products.POST("", app.ProductHandler.CreateProduct)
		products.GET("/:id", app.ProductHandler.GetProduct)
		products.PUT("/:id", app.ProductHandler.UpdateProduct)
		products.DELETE("/:id", app.ProductHandler.DeleteProduct)
		products.GET("/:id/thing-models", app.ProductHandler.ListModels)
		products.PUT("/:id/thing-model", app.ProductHandler.PutModel)
		products.GET("/:id/thing-models/:version", app.ProductHandler.GetModel)
		products.POST("/:id/thing-models/validate", app.ProductHandler.ValidateModel)
		products.POST("/:id/thing-models/diff", app.ProductHandler.DiffModels)
	}

	// 资产管理路由
	assets := api.Group("/assets")
	{
		assets.GET("", app.AssetHandler.ListAssets)
		assets.POST("", app.AssetHandler.CreateAsset)
		assets.GET("/:id", app.AssetHandler.GetAsset)
		assets.PUT("/:id", app.AssetHandler.UpdateAsset)
		assets.DELETE("/:id", app.AssetHandler.DeleteAsset)
	}

	// 告警中心路由
	alerts := api.Group("/alerts")
	{
		alerts.GET("", app.AlertHandler.ListAlerts)
		alerts.POST("", app.AlertHandler.CreateAlert)
		alerts.GET("/:id", app.AlertHandler.GetAlert)
		alerts.PUT("/:id", app.AlertHandler.UpdateAlert)
		alerts.DELETE("/:id", app.AlertHandler.DeleteAlert)
	}

	// 规则引擎路由
	rules := api.Group("/rules")
	{
		rules.GET("", app.RuleHandler.ListRules)
		rules.POST("", app.RuleHandler.CreateRule)
		rules.GET("/:id", app.RuleHandler.GetRule)
		rules.PUT("/:id", app.RuleHandler.UpdateRule)
		rules.DELETE("/:id", app.RuleHandler.DeleteRule)
		rules.POST("/:id/enable", app.RuleHandler.EnableRule)
		rules.POST("/:id/disable", app.RuleHandler.DisableRule)
	}

	// 调试路由
	debug := app.Server.Group("/debug")
	{
		debug.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})
		debug.GET("/config", func(c *gin.Context) {
			c.JSON(http.StatusOK, app.Config)
		})
	}
}

// Start 启动应用程序
func (app *App) Start() error {
	var wg sync.WaitGroup

	// 启动HTTP服务器
	wg.Add(1)
	go func() {
		defer wg.Done()
		log.Printf("Starting HTTP server on %s", app.Config.HTTPPort)
		if err := app.HTTPServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start HTTP server: %v", err)
		}
	}()

	// 启动规则引擎
	wg.Add(1)
	go func() {
		defer wg.Done()
		log.Println("Starting rule engine")
		if err := app.RuleService.Start(); err != nil {
			log.Printf("Failed to start rule engine: %v", err)
		}
	}()

	wg.Wait()
	return nil
}

// Shutdown 关闭应用程序
func (app *App) Shutdown() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// 关闭HTTP服务器
	if app.HTTPServer != nil {
		if err := app.HTTPServer.Shutdown(ctx); err != nil {
			log.Printf("HTTP server shutdown error: %v", err)
		}
	}

	// 关闭规则引擎
	if app.RuleService != nil {
		if err := app.RuleService.Shutdown(); err != nil {
			log.Printf("Rule engine shutdown error: %v", err)
		}
	}

	// 关闭数据存储服务
	if app.DataStoreService != nil {
		if err := app.DataStoreService.Shutdown(); err != nil {
			log.Printf("Data store service shutdown error: %v", err)
		}
	}

	log.Println("Server shutdown complete")
}
