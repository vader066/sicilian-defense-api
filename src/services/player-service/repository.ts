import { pool } from "@/db/db";
import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { PLAYER } from "@/types/database/models";

export class PlayerRepository {
	async createPlayer(player: PLAYER) {
		await databases.createDocument(db, playerCollection, player.username, {
			...player,
		});
		console.log("Player created");
	}

	async createPlayerV2(player: PLAYER) {
		const result = await pool.query(
			"INSERT INTO players (id, club_id, first_name, last_name, programme, username, date_of_birth, sex, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *",
			[
				player.id,
				player.club_id,
				player.first_name,
				player.last_name,
				player.programme,
				player.username,
				player.date_of_birth,
				player.sex,
			]
		);
		return result.rows[0];
	}

	async getPlayerByUsername(username: string): Promise<PLAYER | null> {
		const result = await pool.query<PLAYER>(
			"SELECT * FROM players WHERE username = $1",
			[username]
		);
		const player = result.rows[0];
		if (!player) return null;

		return player;
	}

	async getPlayerById(id: string): Promise<PLAYER | null> {
		const result = await pool.query<PLAYER>(
			"SELECT * FROM players WHERE id = $1",
			[id]
		);
		const player = result.rows[0];
		if (!player) return null;

		return player;
	}

	async getClubPlayers(clubId: string): Promise<PLAYER[]> {
		try {
			const result = await pool.query<PLAYER>(
				"SELECT * FROM players WHERE club_id = $1",
				[clubId]
			);
			const players = result.rows;
			return players;
		} catch (error: any) {
			throw new Error(
				`Error in repo function getClubPlayers: ${error.message}`
			);
		}
	}

	async updatePlayer(player: PLAYER): Promise<PLAYER> {
		const query = `
    UPDATE players
    SET club_id = $2,
        first_name = $3,
        last_name = $4,
        programme = $5,
        username = $6,
        date_of_birth = $7,
        sex = $8,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
    `;
		const result = await pool.query<PLAYER>(query, [
			player.id,
			player.club_id,
			player.first_name,
			player.last_name,
			player.programme,
			player.username,
			player.date_of_birth,
			player.sex,
		]);

		const updatedPlayer = result.rows[0];
		return updatedPlayer;
	}

	async addBulkPlayers(players: PLAYER[]): Promise<number> {
		const values: any[] = [];

		const placeholders = players
			.map((p, idx) => {
				const base = idx * 7; // number of fields per player
				values.push(
					p.first_name,
					p.last_name,
					p.sex,
					p.date_of_birth,
					p.programme,
					p.username,
					p.club_id
				);

				return `(
        gen_random_uuid(),
        $${base + 1},  -- first_name
        $${base + 2},  -- last_name
        $${base + 3},  -- sex
        $${base + 4},  -- date_of_birth
        $${base + 5},  -- programme
        $${base + 6},  -- username
        NOW(),
        NOW(),
        $${base + 7}   -- club_id
      )`;
			})
			.join(",\n");

		const query = `
    INSERT INTO players
    (id, first_name, last_name, sex, date_of_birth, programme, username, created_at, updated_at, club_id)
    VALUES
    ${placeholders}
    RETURNING id;
  `;

		const result = await pool.query(query, values);
		const insertCount = result.rowCount;
		if (!insertCount) {
			const error = new Error(
				"Operation unsuccessfull. Add Bulk Players returned count null"
			);
			(error as any).code = 500;
			throw error;
		}

		return insertCount;
	}
}

// export async function getTournamentPlayers(tournamentId: string): Promise<PLAYER[]> {
//   const result = await pool.query<PLAYER>("SELECT * FROM players WHERE club_id = $1", [tournamentId]);
//   const players = result.rows;

//   return players;
// }
