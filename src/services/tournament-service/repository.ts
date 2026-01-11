import { pool } from "@/db/db";
import { DBTourney, GAME, TOURNAMENT_PAIRINGS } from "@/types/database/models";

export class TourneyRepository {
	async addTournament(tournament: DBTourney): Promise<DBTourney> {
		const result = await pool.query<DBTourney>(
			"INSERT INTO tournaments (id, tournament_name, number_of_players, number_of_games, status, synced, club_id, number_of_rounds, began_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *",
			[
				tournament.id,
				tournament.tournament_name,
				tournament.number_of_players,
				tournament.number_of_games,
				tournament.status,
				tournament.synced,
				tournament.club_id,
				tournament.number_of_rounds,
			]
		);
		return result.rows[0];
	}

	async getTournamentById(id: string): Promise<DBTourney | null> {
		const result = await pool.query<DBTourney>(
			"SELECT * FROM tournaments WHERE id = $1",
			[id]
		);
		const tournament = result.rows[0];
		if (!tournament) return null;

		return tournament;
	}

	async getClubTournaments(clubId: string): Promise<DBTourney[]> {
		try {
			const result = await pool.query<DBTourney>(
				`SELECT * FROM tournaments 
        WHERE club_id = $1`,
				[clubId]
			);
			const tournaments = result.rows;
			return tournaments;
		} catch (error: any) {
			throw new Error(
				`Error in repo function getClubTournaments: ${error.message}`
			);
		}
	}

	async updateTournament(tournament: DBTourney): Promise<DBTourney> {
		const query = `
      UPDATE tournaments
      SET club_id = $2,
          tournament_name = $3,
          synced = $4,
          number_of_players = $5,
          number_of_rounds = $6,
          number_of_games = $7,
          status = $8,
          began_at = NOW()
      WHERE id = $1
      RETURNING *;
      `;
		const result = await pool.query<DBTourney>(query, [
			tournament.id,
			tournament.club_id,
			tournament.tournament_name,
			tournament.synced,
			tournament.number_of_players,
			tournament.number_of_rounds,
			tournament.number_of_games,
			tournament.status,
		]);

		const updatedPlayer = result.rows[0];
		return updatedPlayer;
	}

	async addTournamentPairings(
		pairings: TOURNAMENT_PAIRINGS[]
	): Promise<number> {
		const values: any[] = [];

		const placeholders = pairings
			.map((p, idx) => {
				const base = idx * 6; // number of fields per pairing
				values.push(
					p.id,
					p.tournament_id,
					p.white || null,
					p.black || null,
					p.bye || null,
					p.round
				);

				return `(
        $${base + 1},  -- id
        $${base + 2},  -- tournament_id
        $${base + 3},  -- white
        $${base + 4},  -- black
        $${base + 5},  -- bye
        $${base + 6}   -- round
      )`;
			})
			.join(",\n");

		const query = `
    INSERT INTO tournament_pairings
    (id, tournament_id, white, black, bye, round)
    VALUES
    ${placeholders}
    RETURNING id;
  `;

		const result = await pool.query(query, values);
		const insertCount = result.rowCount;
		if (!insertCount) {
			const error = new Error(
				"Operation unsuccessfull. Add Tournament Pairings returned count null"
			);
			(error as any).code = 500;
			throw error;
		}

		return insertCount;
	}

	async getTournamentPairings(
		tournamentId: string
	): Promise<TOURNAMENT_PAIRINGS[]> {
		try {
			const result = await pool.query<TOURNAMENT_PAIRINGS>(
				"SELECT * FROM tournament_pairings WHERE tournament_id = $1 ORDER BY round ASC",
				[tournamentId]
			);
			return result.rows;
		} catch (error: any) {
			throw new Error(
				`Error in repo function getTournamentPairings: ${error.message}`
			);
		}
	}
}
