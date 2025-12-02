package domain

type ThingModel struct {
    SchemaVersion string `json:"schemaVersion"`
    Properties []map[string]interface{} `json:"properties"`
    Services []map[string]interface{} `json:"services"`
    Events []map[string]interface{} `json:"events"`
}

type ModelVersion struct {
    ProductID string
    Version string
    Model ThingModel
}

