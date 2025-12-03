package main

import (
    "log"
    "os"
    "sync"
    "baccano-iot/core-message-bus/pkg/bus"
    "baccano-iot/data-store"
    httpx "baccano-iot/device-connect/internal/http"
    grpcx "baccano-iot/device-connect/internal/grpc"
    "baccano-iot/device-connect/internal/repository"
    "baccano-iot/device-connect/internal/service"
)

func main() {
    nurl := os.Getenv("NATS_URL"); if nurl == "" { nurl = "nats://localhost:4222" }
    nb, err := bus.NewNatsBus(nurl)
    if err != nil { log.Printf("nats init failed: %v", err); nb = nil }
    rds := store.NewRedis(os.Getenv("REDIS_ADDR"))
    pgURL := os.Getenv("PG_URL")
    var pg *store.Postgres
    if pgURL != "" { pg, _ = store.NewPostgres(pgURL) }

    repo := repository.NewRepo()
    svc := service.NewConnectService(repo)
    httpSrv := httpx.NewServer(svc)

    g := &grpcx.Server{Bus: nb, Cache: rds, RDB: pg}
    // wire dependencies via package-level variables where appropriate

    var wg sync.WaitGroup
    wg.Add(2)
    go func() { defer wg.Done(); _ = httpSrv.Listen(":8090") }()
    go func() { defer wg.Done(); _ = grpcx.Listen(":8091", g) }()
    wg.Wait()
    _ = rds; _ = pg; _ = nb
}
