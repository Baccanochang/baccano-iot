package service

type Gateway struct{}

func NewGateway() *Gateway                                { return &Gateway{} }
func (g *Gateway) Accept(deviceID string, payload []byte) {}
