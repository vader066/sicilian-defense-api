import { pool } from "@/db/db";
import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { PLAYER } from "@/types/database/models";

export async function createPlayer(player: PLAYER) {
	await databases.createDocument(db, playerCollection, player.username, {
		...player,
	});
	console.log("Player created");
}

export async function getPlayerByUsername(username: string): Promise<PLAYER> {
  const result = await pool.query<PLAYER>("SELECT * FROM players WHERE username = $1", [username]);
  const player = result.rows[0];
  if (!player) throw new Error('Player not found');
  
  return player;
}

export async function getPlayerById(id: string): Promise<PLAYER> {
  const result = await pool.query<PLAYER>("SELECT * FROM players WHERE id = $1", [id]);
  const player = result.rows[0];
  if (!player) throw new Error('Player not found');
  
  return player;
}

export async function getClubPlayers(clubId: string): Promise<PLAYER[]> {
  try {
    const result = await pool.query<PLAYER>("SELECT * FROM players WHERE club_id = $1", [clubId]);
    const players = result.rows;
    return players;
    
  } catch (error: any) {
    throw new Error(`Error in repo function getClubPlayers: ${error.message}`)
  }
}

// export async function getTournamentPlayers(tournamentId: string): Promise<PLAYER[]> {
//   const result = await pool.query<PLAYER>("SELECT * FROM players WHERE club_id = $1", [tournamentId]);
//   const players = result.rows;
  
//   return players;
// }