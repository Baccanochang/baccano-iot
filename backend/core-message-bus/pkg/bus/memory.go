package bus

import "sync"

type MemoryBus struct { subs map[string][]func(Message); mu sync.RWMutex }
func NewMemoryBus() *MemoryBus { return &MemoryBus{subs: map[string][]func(Message){}} }
func (b *MemoryBus) Publish(m Message) error { b.mu.RLock(); hs := b.subs[m.Topic]; b.mu.RUnlock(); for _, h := range hs { h(m) }; return nil }
func (b *MemoryBus) Subscribe(topic string, handler func(Message)) error { b.mu.Lock(); b.subs[topic] = append(b.subs[topic], handler); b.mu.Unlock(); return nil }
