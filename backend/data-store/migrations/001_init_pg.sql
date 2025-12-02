CREATE TABLE IF NOT EXISTS device (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36),
  model_id VARCHAR(36),
  asset_id VARCHAR(36),
  tenant_id VARCHAR(36),
  name VARCHAR(255),
  credential VARCHAR(255),
  last_online_time TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE,
  meta_data JSONB,
  created_time TIMESTAMPTZ DEFAULT NOW(),
  updated_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_shadow (
  device_id VARCHAR(36) PRIMARY KEY,
  desired JSONB,
  reported JSONB,
  metadata JSONB,
  version BIGINT DEFAULT 0,
  created_time TIMESTAMPTZ DEFAULT NOW(),
  updated_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_attribute (
  id VARCHAR(36) PRIMARY KEY,
  device_id VARCHAR(36),
  identifier VARCHAR(100),
  key VARCHAR(255),
  value JSONB,
  data_type VARCHAR(50),
  update_time TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, identifier)
);

CREATE TABLE IF NOT EXISTS asset (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36),
  parent_id VARCHAR(36),
  name VARCHAR(255),
  type VARCHAR(50),
  path VARCHAR(1024),
  additional_info JSONB,
  created_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thing_model (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36),
  version VARCHAR(50),
  definition JSONB,
  created_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thing_model_property (
  id VARCHAR(36) PRIMARY KEY,
  model_id VARCHAR(36),
  identifier VARCHAR(100),
  name VARCHAR(255),
  data_type VARCHAR(50),
  specs JSONB,
  attribute BOOLEAN DEFAULT FALSE,
  created_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thing_model_service (
  id VARCHAR(36) PRIMARY KEY,
  model_id VARCHAR(36),
  identifier VARCHAR(100),
  name VARCHAR(255),
  call_type VARCHAR(20),
  description TEXT,
  input_params JSONB,
  output_params JSONB,
  created_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS thing_model_event (
  id VARCHAR(36) PRIMARY KEY,
  model_id VARCHAR(36),
  identifier VARCHAR(100),
  name VARCHAR(255),
  event_type VARCHAR(20),
  description TEXT,
  output_data JSONB,
  created_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_event (
  id VARCHAR(36) PRIMARY KEY,
  device_id VARCHAR(36),
  event_type VARCHAR(50),
  event_data JSONB,
  ts TIMESTAMPTZ DEFAULT NOW()
);
