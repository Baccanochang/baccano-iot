package bus

type Message struct { Topic string; Data []byte }

type Bus interface {
    Publish(m Message) error
    Subscribe(topic string, handler func(Message)) error
}

