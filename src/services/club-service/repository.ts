import { pool } from "@/db/db";
import { CLUB, PLAYER } from "@/types/database/models";

export async function getClubById(id: string): Promise<PLAYER> {
  const result = await pool.query<PLAYER>("SELECT * FROM clubs WHERE id = $1", [id]);
  const club = result.rows[0];
  if (!club) throw new Error('Club not found');
  
  return club;
}

export async function getAllClubs(): Promise<PLAYER[]> {
  try {
    const result = await pool.query<PLAYER>("SELECT * FROM clubs");
    const players = result.rows;
    return players;
    
  } catch (error: any) {
    throw new Error(`getAllClubs: ${error.message}`)
  }
}

export async function createClub(club: CLUB): Promise<PLAYER[]> {
  try {
    const result = await pool.query<PLAYER>("SELECT * FROM clubs");
    const players = result.rows;
    return players;
    
  } catch (error: any) {
    throw new Error(`getAllClubs: ${error.message}`)
  }
}
