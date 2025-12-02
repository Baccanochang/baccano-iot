package httpx

import (
    "net/http"
    "strings"
    "time"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "os"
)

type limiter struct{ tokens map[string]int; last map[string]time.Time }

func newLimiter() *limiter { return &limiter{tokens: map[string]int{}, last: map[string]time.Time{}} }

func (l *limiter) allow(key string, rate int, refill time.Duration) bool {
    now := time.Now()
    last := l.last[key]
    if now.Sub(last) >= refill { l.tokens[key] = rate; l.last[key] = now }
    if l.tokens[key] > 0 { l.tokens[key]--; return true }
    return false
}

func RateLimit() gin.HandlerFunc {
    l := newLimiter()
    return func(c *gin.Context) {
        ip := c.ClientIP()
        if !l.allow(ip, 100, time.Minute) { c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error":"rate limit"}); return }
        c.Next()
    }
}

func JWTAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        auth := c.GetHeader("Authorization")
        if auth == "" { c.Next(); return }
        parts := strings.Split(auth, " ")
        if len(parts) != 2 || parts[0] != "Bearer" { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"invalid auth"}); return }
        secret := os.Getenv("JWT_SECRET")
        if secret == "" { secret = "dev-secret" }
        _, err := jwt.Parse(parts[1], func(t *jwt.Token) (interface{}, error) { return []byte(secret), nil })
        if err != nil { c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"unauthorized"}); return }
        c.Next()
    }
}

