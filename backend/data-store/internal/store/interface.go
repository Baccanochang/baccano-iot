package store

type Telemetry struct { DeviceID string; Ts int64; Payload []byte }
type Event struct { DeviceID string; Ts int64; Type string; Data []byte }

type TSDB interface { WriteTelemetry(t Telemetry) error }
type RDB interface { SaveEvent(e Event) error; UpdateDeviceOnline(deviceID string, online bool) error }
type Cache interface { SetDeviceOnline(deviceID string, online bool) error; IsOnline(deviceID string) (bool, error) }

