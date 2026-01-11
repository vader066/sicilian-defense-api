-- Remove unique constraint from players username column
ALTER TABLE players DROP CONSTRAINT IF EXISTS players_username_key;
