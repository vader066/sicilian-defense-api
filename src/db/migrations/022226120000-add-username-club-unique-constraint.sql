-- Enforce uniqueness of username within a club.
-- Players in different clubs may still share the same username.
ALTER TABLE players
  ADD CONSTRAINT uq_players_username_club_id UNIQUE (username, club_id);


--run these migrations on the staging db then delete this file and the remove-username-unique-constraint.sql migration file, as the unique constraint is now added in the create tables migration file. This is to prevent issues with the unique constraint when running the create tables migration on a fresh db.