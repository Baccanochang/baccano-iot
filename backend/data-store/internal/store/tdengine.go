package store

import (
	"database/sql"
	_ "github.com/taosdata/driver-go/v3/taosSql"
)

type TDengine struct{ db *sql.DB }

func NewTDengine(dsn string) (*TDengine, error) {
	db, err := sql.Open("taosSql", dsn)
	if err != nil {
		return nil, err
	}
	return &TDengine{db: db}, nil
}

func (t *TDengine) WriteTelemetry(d Telemetry) error {
	_, err := t.db.Exec("INSERT INTO device_telemetry USING device_telemetry TAGS('tenant','product','model') VALUES(now, ?, ?, ?)", d.DeviceID, string(d.Payload), d.Ts)
	return err
}
