package main

import "baccano-iot/device-manager/internal/http"

func main() { httpx.NewServer().ListenWithRoutes(":8082") }
