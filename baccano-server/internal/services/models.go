package services

// Device 设备模型
type Device struct {
	ID        string            `json:"id"`
	Name      string            `json:"name"`
	ProductID string            `json:"productId"`
	Status    string            `json:"status"` // online, offline, error, maintenance
	Attributes map[string]interface{} `json:"attributes"`
	Shadow    DeviceShadow     `json:"shadow"`
	CreatedAt string            `json:"createdAt"`
	UpdatedAt string            `json:"updatedAt"`
}

// Product 产品模型
type Product struct {
	ID                  string `json:"id"`
	Name                string `json:"name"`
	Protocol            string `json:"protocol"` // MQTT, CoAP, HTTP
	DefaultModelVersion string `json:"defaultModelVersion"`
	Description         string `json:"description"`
	CreatedAt           string `json:"createdAt"`
	UpdatedAt           string `json:"updatedAt"`
}

// Asset 资产模型
type Asset struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"` // organization, site, area, device
	ParentID    string `json:"parentId"`
	Status      string `json:"status"`
	Description string `json:"description"`
	Properties  map[string]interface{} `json:"properties"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

// Alert 告警模型
type Alert struct {
	ID          string `json:"id"`
	DeviceID    string `json:"deviceId"`
	RuleID      string `json:"ruleId"`
	Severity    string `json:"severity"` // info, warning, error, critical
	Message     string `json:"message"`
	Status      string `json:"status"` // active, acknowledged, resolved
	Timestamp   string `json:"timestamp"`
	ResolvedAt  string `json:"resolvedAt"`
}

// Rule 规则模型
type Rule struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Condition   string `json:"condition"`
	Action      string `json:"action"`
	Enabled     bool   `json:"enabled"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

// DeviceShadow 设备影子模型
type DeviceShadow struct {
	Reported   map[string]interface{} `json:"reported"`
	Desired    map[string]interface{} `json:"desired"`
	Version    int64                  `json:"version"`
	Timestamp  string                 `json:"timestamp"`
}

// ThingModel 物模型
type ThingModel struct {
	SchemaVersion string     `json:"schemaVersion"`
	Properties    []Property `json:"properties"`
	Services      []Service  `json:"services"`
	Events        []Event    `json:"events"`
}

// Property 属性定义
type Property struct {
	Identifier  string   `json:"identifier"`
	Name        string   `json:"name"`
	AccessMode  string   `json:"accessMode"` // r, w, rw
	DataType    DataType `json:"dataType"`
	Category    string   `json:"category"` // telemetry, attribute, config
	Description string   `json:"description"`
	Required    bool     `json:"required"`
}

// DataType 数据类型
type DataType struct {
	Type  string                 `json:"type"` // int, float, string, bool, array, object
	Specs map[string]interface{} `json:"specs"`
}

// Service 服务定义
type Service struct {
	Identifier string `json:"identifier"`
	Name       string `json:"name"`
	CallType   string `json:"callType"` // sync, async
	InputData  []Param `json:"inputData"`
	OutputData []Param `json:"outputData"`
	Description string `json:"description"`
}

// Event 事件定义
type Event struct {
	Identifier string `json:"identifier"`
	Name       string `json:"name"`
	Type       string `json:"type"` // info, warning, error
	OutputData []Param `json:"outputData"`
	Description string `json:"description"`
}

// Param 参数定义
type Param struct {
	Identifier string   `json:"identifier"`
	Name       string   `json:"name"`
	DataType   DataType `json:"dataType"`
	Required   bool     `json:"required"`
	Description string   `json:"description"`
}

// Telemetry 遥测数据
type Telemetry struct {
	DeviceID   string                 `json:"deviceId"`
	Timestamp  string                 `json:"timestamp"`
	Data       map[string]interface{} `json:"data"`
}
