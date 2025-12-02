package store

type TSDB interface { Write(table string, data map[string]interface{}) error }
type RDB interface { Create(table string, row map[string]interface{}) error; Query(table string, filter map[string]interface{}) ([]map[string]interface{}, error) }
type Cache interface { Set(key string, val interface{}) error; Get(key string) (interface{}, bool) }

