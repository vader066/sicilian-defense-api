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

	async getPlayerByUsername(username: string): Promise<PLAYER> {
		const result = await pool.query<PLAYER>(
			"SELECT * FROM players WHERE username = $1",
			[username]
		);
		const player = result.rows[0];
		if (!player) throw new Error("Player not found");

		return player;
	}

	async getPlayerById(id: string): Promise<PLAYER> {
		const result = await pool.query<PLAYER>(
			"SELECT * FROM players WHERE id = $1",
			[id]
		);
		const player = result.rows[0];
		if (!player) throw new Error("Player not found");

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
}

// export async function getTournamentPlayers(tournamentId: string): Promise<PLAYER[]> {
//   const result = await pool.query<PLAYER>("SELECT * FROM players WHERE club_id = $1", [tournamentId]);
//   const players = result.rows;

//   return players;
// }
