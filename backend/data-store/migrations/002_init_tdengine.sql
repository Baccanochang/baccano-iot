CREATE STABLE IF NOT EXISTS device_telemetry (
  ts TIMESTAMP,
  device_id NCHAR(36),
  temperature DOUBLE,
  humidity DOUBLE,
  pressure DOUBLE,
  tags JSON,
  fields JSON
) TAGS (tenant_id NCHAR(36), product_id NCHAR(36), model_id NCHAR(36));

CREATE STABLE IF NOT EXISTS device_event (
  ts TIMESTAMP,
  device_id NCHAR(36),
  event_type NCHAR(50),
  event_data JSON
) TAGS (tenant_id NCHAR(36), product_id NCHAR(36), model_id NCHAR(36));
