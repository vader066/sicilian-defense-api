import { pool } from "@/db/db";
import { GAME } from "@/types/database/models";

export class GameRepository {
	async addGame(game: GAME) {
		const result = await pool.query(
			"INSERT INTO games (game_id, white, black, winner, black_rating, white_rating, played_at, tournament_id, draw, forfeit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING *",
			[
				game.game_id,
				game.white,
				game.black,
				game.winner,
				game.black_rating,
				game.white_rating,
				game.played_at,
				game.tournament_id,
				game.draw,
				game.forfeit,
			]
		);
		return result.rows[0];
	}

	async getGameById(id: string): Promise<GAME | null> {
		const result = await pool.query<GAME>(
			"SELECT * FROM games WHERE game_id = $1",
			[id]
		);
		const game = result.rows[0];
		if (!game) return null;

		return game;
	}

	async getTournamentGames(tournamentId: string): Promise<GAME[]> {
		try {
			const result = await pool.query<GAME>(
				"SELECT * FROM games WHERE tournament_id = $1",
				[tournamentId]
			);
			const games = result.rows;
			return games;
		} catch (error: any) {
			throw new Error(
				`Error in repo function getTournamentGames: ${error.message}`
			);
		}
	}

	async getPlayerGames(playerId: string): Promise<GAME[]> {
		try {
			const result = await pool.query<GAME>(
				`SELECT * FROM games 
        WHERE black = $1
        OR white = $1`,
				[playerId]
			);
			const games = result.rows;
			return games;
		} catch (error: any) {
			throw new Error(
				`Error in repo function getPlayerGames: ${error.message}`
			);
		}
	}

	async addGames(games: GAME[]): Promise<number> {
		const values: any[] = [];

		const placeholders = games
			.map((g, idx) => {
				const base = idx * 8; // number of fields per game
				values.push(
					g.white,
					g.black,
					g.winner,
					g.black_rating,
					g.white_rating,
					g.tournament_id,
					g.draw,
					g.forfeit
				);

				return `(
        gen_random_uuid(),
        $${base + 1},  -- white
        $${base + 2},  -- black
        $${base + 3},  -- winner
        $${base + 4},  -- black_rating
        $${base + 5},  -- white_rating
        NOW(),  -- played_at
        $${base + 6},  -- tournament_id
        $${base + 7},  -- draw
        $${base + 8}   -- forfeit
      )`;
			})
			.join(",\n");

		const query = `
    INSERT INTO games
    (game_id, white, black, winner, black_rating, white_rating, played_at, tournament_id, draw, forfeit)
    VALUES
    ${placeholders}
    RETURNING id;
  `;

		const result = await pool.query(query, values);
		const insertCount = result.rowCount;
		if (!insertCount) {
			const error = new Error(
				"Operation unsuccessfull. Add Games returned count null"
			);
			(error as any).code = 500;
			throw error;
		}

		return insertCount;
	}
}
