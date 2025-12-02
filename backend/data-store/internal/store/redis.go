package store

import (
    "context"
    "github.com/redis/go-redis/v9"
)

type Redis struct { cli *redis.Client }

func NewRedis(addr string) *Redis { return &Redis{cli: redis.NewClient(&redis.Options{Addr: addr})} }

func (r *Redis) SetDeviceOnline(deviceID string, online bool) error {
    v := "0"; if online { v = "1" }
    return r.cli.Set(context.Background(), "device:online:"+deviceID, v, 0).Err()
}

func (r *Redis) IsOnline(deviceID string) (bool, error) {
    s, err := r.cli.Get(context.Background(), "device:online:"+deviceID).Result()
    if err != nil { return false, err }
    return s == "1", nil
}

