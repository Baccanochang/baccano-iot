package httpx

import (
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"time"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&body)
	if body.Username == "" || body.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid credentials"})
		return
	}
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret"
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": body.Username, "role": "admin", "exp": time.Now().Add(time.Hour).Unix()})
	s, _ := token.SignedString([]byte(secret))
	json.NewEncoder(w).Encode(map[string]string{"token": s})
}

func Refresh(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Token string `json:"token"`
	}
	json.NewDecoder(r.Body).Decode(&body)
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dev-secret"
	}
	_, err := jwt.Parse(body.Token, func(t *jwt.Token) (interface{}, error) { return []byte(secret), nil })
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid token"})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"sub": "user", "role": "admin", "exp": time.Now().Add(time.Hour).Unix()})
	s, _ := token.SignedString([]byte(secret))
	json.NewEncoder(w).Encode(map[string]string{"token": s})
}
