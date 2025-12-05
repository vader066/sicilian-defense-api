import { pool } from "@/db/db";
import { DBTourney, GAME } from "@/types/database/models";

export class TourneyRepository {
	async addTournament(tournament: DBTourney): Promise<DBTourney> {
		const result = await pool.query<DBTourney>(
			"INSERT INTO tournaments (id, tournament_name, number_of_players, synced, club_id, began_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
			[
				tournament.id,
				tournament.tournament_name,
				tournament.number_of_players,
				tournament.synced,
				tournament.club_id,
				tournament.began_at,
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
}
