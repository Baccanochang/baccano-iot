package store

import (
	"context"
	"github.com/jackc/pgx/v5"
)

type Postgres struct{ conn *pgx.Conn }

func NewPostgres(url string) (*Postgres, error) {
	c, err := pgx.Connect(context.Background(), url)
	if err != nil {
		return nil, err
	}
	return &Postgres{conn: c}, nil
}

func (p *Postgres) SaveEvent(e Event) error {
	_, err := p.conn.Exec(context.Background(), "INSERT INTO device_event(device_id, event_type, event_data, ts) VALUES($1,$2,$3,TO_TIMESTAMP($4/1000.0))", e.DeviceID, e.Type, string(e.Data), e.Ts)
	return err
}

func (p *Postgres) UpdateDeviceOnline(deviceID string, online bool) error {
	_, err := p.conn.Exec(context.Background(), "UPDATE device SET is_online=$1, last_online_time=NOW() WHERE id=$2", online, deviceID)
	return err
}
