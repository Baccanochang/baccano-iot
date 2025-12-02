package httpx

import (
    "encoding/json"
    "net/http"
)

type Device struct { ID string `json:"id"`; Name string `json:"name"`; ProductID string `json:"productId"` }
var devices = map[string]Device{}
var shadows = map[string]map[string]interface{}{}
var attributes = map[string]map[string]interface{}{}

func CreateDevice(w http.ResponseWriter, r *http.Request) { var d Device; json.NewDecoder(r.Body).Decode(&d); devices[d.ID] = d; json.NewEncoder(w).Encode(d) }
func GetDevice(w http.ResponseWriter, r *http.Request, id string) { json.NewEncoder(w).Encode(devices[id]) }
func ListDevices(w http.ResponseWriter, r *http.Request) { var arr []Device; for _, v := range devices { arr = append(arr, v) }; json.NewEncoder(w).Encode(arr) }
func GetShadow(w http.ResponseWriter, r *http.Request, id string) { json.NewEncoder(w).Encode(map[string]interface{}{"desired": shadows[id], "reported": shadows[id]}) }
func UpdateDesired(w http.ResponseWriter, r *http.Request, id string) { var body map[string]interface{}; json.NewDecoder(r.Body).Decode(&body); if shadows[id] == nil { shadows[id] = map[string]interface{}{} }; for k,v := range body { shadows[id][k] = v }; json.NewEncoder(w).Encode(map[string]interface{}{"desired": shadows[id]}) }
func GetAttributes(w http.ResponseWriter, r *http.Request, id string) { json.NewEncoder(w).Encode(map[string]interface{}{"attributes": attributes[id]}) }
func UpdateAttributes(w http.ResponseWriter, r *http.Request, id string) { var body struct{ Attributes map[string]interface{} `json:"attributes"` }; json.NewDecoder(r.Body).Decode(&body); if attributes[id] == nil { attributes[id] = map[string]interface{}{} }; for k,v := range body.Attributes { attributes[id][k] = v }; json.NewEncoder(w).Encode(map[string]interface{}{"attributes": attributes[id]}) }
