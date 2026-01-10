-- Create tournament_status enum
CREATE TYPE tournament_status AS ENUM ('in_progress', 'completed', 'cancelled');

-- Add status column to tournaments table
ALTER TABLE tournaments
ADD COLUMN status tournament_status NOT NULL DEFAULT 'in_progress';

-- Add number_of_games column to tournaments table
ALTER TABLE tournaments
ADD COLUMN number_of_games INTEGER NOT NULL DEFAULT 0;

-- Create tournament_pairings table
CREATE TABLE tournament_pairings (
  id UUID PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  white UUID,
  black UUID,
  bye UUID,
  round INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for tournament_id on tournament_pairings
CREATE INDEX idx_tournament_pairings_tournament_id ON tournament_pairings(tournament_id);
