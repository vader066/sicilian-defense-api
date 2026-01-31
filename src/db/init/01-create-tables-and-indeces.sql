-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types
DO $$ BEGIN
  CREATE TYPE forfeit_type AS ENUM ('BF', 'WF', 'FF');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sex AS ENUM ('MALE', 'FEMALE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE tournament_status AS ENUM ('in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_types AS ENUM ('ADMIN', 'PLAYER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY,
  club_name VARCHAR(100) NOT NULL,
  number_of_players INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  programme VARCHAR(100) NOT NULL,
  rating NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
  username VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  sex sex NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY,
  tournament_name VARCHAR(100) NOT NULL,
  number_of_players INTEGER NOT NULL,
  number_of_rounds INTEGER NOT NULL DEFAULT 1,
  number_of_games INTEGER NOT NULL DEFAULT 0,
  status tournament_status NOT NULL DEFAULT 'in_progress',
  synced BOOLEAN NOT NULL DEFAULT FALSE,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  began_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
  game_id UUID PRIMARY KEY,
  white UUID REFERENCES players(id) NOT NULL,
  black UUID REFERENCES players(id) NOT NULL,
  winner UUID REFERENCES players(id),
  round INTEGER NOT NULL DEFAULT 1,
  black_rating DOUBLE PRECISION,
  white_rating DOUBLE PRECISION,
  played_at TIMESTAMP NOT NULL DEFAULT NOW(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  draw BOOLEAN NOT NULL DEFAULT FALSE,
  forfeit forfeit_type
);


CREATE TABLE IF NOT EXISTS tournament_players (
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tournament_id, player_id)
);

CREATE TABLE IF NOT EXISTS tournament_pairings (
  id UUID PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  white UUID,
  black UUID,
  bye UUID,
  round INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  admin_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) UNIQUE, 
  creator BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS super_admin (
  id UUID PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  admin_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS admin_auth (
  admin_id UUID PRIMARY KEY REFERENCES admin(id),
  password_hash VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS super_admin_auth (
  admin_id UUID PRIMARY KEY REFERENCES super_admin(id),
  password_hash VARCHAR NOT NULL
);

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

CREATE INDEX IF NOT EXISTS idx_tournament_pairings_tournament_id ON tournament_pairings(tournament_id);
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_club_id ON players(club_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_club_id ON tournaments(club_id);
CREATE INDEX IF NOT EXISTS idx_games_tournament_id ON games(tournament_id);

