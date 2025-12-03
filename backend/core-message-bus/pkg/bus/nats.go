package bus

import (
	"github.com/nats-io/nats.go"
)

type NatsBus struct {
	nc *nats.Conn
	js nats.JetStreamContext
}

func NewNatsBus(url string) (*NatsBus, error) {
	nc, err := nats.Connect(url)
	if err != nil {
		return nil, err
	}
	js, err := nc.JetStream()
	if err != nil {
		return nil, err
	}
	return &NatsBus{nc: nc, js: js}, nil
}

func (b *NatsBus) Publish(m Message) error {
	_, err := b.js.Publish(m.Topic, m.Data)
	return err
}

func (b *NatsBus) Subscribe(topic string, handler func(Message)) error {
	_, err := b.js.Subscribe(topic, func(msg *nats.Msg) { handler(Message{Topic: msg.Subject, Data: msg.Data}) })
	return err
}
