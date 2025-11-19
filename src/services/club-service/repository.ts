import { pool } from "@/db/db";
import { CLUB } from "@/types/database/models";

export class ClubRepository {
	async getClubById(id: string): Promise<CLUB | null> {
		try {
			const result = await pool.query<CLUB>(
				"SELECT * FROM clubs WHERE id = $1",
				[id]
			);
			const club = result.rows[0];
			if (!club) return null;
			return club;
		} catch (error: any) {
			throw new Error(`getClubById: ${error.message}`);
		}
	}

	async getAllClubs(): Promise<CLUB[]> {
		try {
			const result = await pool.query<CLUB>("SELECT * FROM clubs");
			const clubs = result.rows;
			return clubs;
		} catch (error: any) {
			throw new Error(`getAllClubs: ${error.message}`);
		}
	}

	async createClub(club: CLUB) {
		try {
			const query = `
      INSERT INTO clubs (id, club_name, number_of_players, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW());
    `;
			await pool.query(query, [
				club.id,
				club.club_name,
				club.number_of_players,
			]);
		} catch (error: any) {
			throw new Error(`createClub: ${error.message}`);
		}
	}

	async updateClub(club: CLUB) {
		try {
			const query = `
      UPDATE clubs 
        club_name = $2,
        number_of_players = $3,
        updated_at = NOW(),
      WHERE id = $1
    `;
			await pool.query(query, [
				club.id,
				club.club_name,
				club.number_of_players,
			]);
		} catch (error: any) {
			throw new Error(`updateClub: ${error.message}`);
		}
	}
}
