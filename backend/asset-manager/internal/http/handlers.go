package httpx

import (
    "encoding/json"
    "net/http"
)

type Asset struct { ID string `json:"id"`; Name string `json:"name"`; Type string `json:"type"`; ParentID string `json:"parentId"` }
var assets = map[string]Asset{}

func CreateAsset(w http.ResponseWriter, r *http.Request) { var a Asset; json.NewDecoder(r.Body).Decode(&a); assets[a.ID] = a; json.NewEncoder(w).Encode(a) }
func GetAsset(w http.ResponseWriter, r *http.Request, id string) { json.NewEncoder(w).Encode(assets[id]) }
func ListAssets(w http.ResponseWriter, r *http.Request) { var arr []Asset; for _, v := range assets { arr = append(arr, v) }; json.NewEncoder(w).Encode(arr) }

