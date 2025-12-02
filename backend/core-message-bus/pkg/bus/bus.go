package bus

type Message struct { Topic string Payload []byte }
type Publisher interface { Publish(m Message) error }
type Subscriber interface { Subscribe(topic string, handler func(Message)) error }
type Bus interface { Publisher; Subscriber }

