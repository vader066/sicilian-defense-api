-- Create tournament_status enum only if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'tournament_status'
  ) THEN
    CREATE TYPE tournament_status AS ENUM ('in_progress', 'completed', 'cancelled');
  END IF;
END$$;

-- Add status column if it does not exist
ALTER TABLE tournaments
ADD COLUMN IF NOT EXISTS status tournament_status NOT NULL DEFAULT 'in_progress';

-- Add number_of_games column if it does not exist
ALTER TABLE tournaments
ADD COLUMN IF NOT EXISTS number_of_games INTEGER NOT NULL DEFAULT 0;

-- Create tournament_pairings table if it does not exist
CREATE TABLE IF NOT EXISTS tournament_pairings (
  id UUID PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  white UUID,
  black UUID,
  bye UUID,
  round INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index only if it does not exist
CREATE INDEX IF NOT EXISTS idx_tournament_pairings_tournament_id 
ON tournament_pairings(tournament_id);