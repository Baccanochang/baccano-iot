package engine

type Node interface { Process(map[string]interface{}) (map[string]interface{}, error) }
type Chain struct { nodes []Node }
func NewChain(nodes []Node) *Chain { return &Chain{nodes: nodes} }
func (c *Chain) Run(input map[string]interface{}) (map[string]interface{}, error) { out := input; var err error; for _, n := range c.nodes { out, err = n.Process(out); if err != nil { return nil, err } } return out, nil }

