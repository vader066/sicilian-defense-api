-- Create enum type only if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_types'
  ) THEN
    CREATE TYPE user_types AS ENUM ('ADMIN', 'PLAYER');
  END IF;
END$$;

-- Create table only if it does not exist
CREATE TABLE IF NOT EXISTS refresh_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type user_types NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL, 
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);