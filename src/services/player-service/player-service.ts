import { PLAYER } from "@/types/database/models";
import { getClubPlayers, getPlayerById, getPlayerByUsername } from "./repository";

export async function GetPlayerByID(id: string): Promise<PLAYER> {
  if (id === "") {
    throw new Error('PlayerId must be provided');
  }
  const player = await getPlayerById(id);

  return player;
}

export async function GetPlayerByUsername(username: string): Promise<PLAYER> {
  if (username === "") {
    throw new Error('Username must be provided');
  }
  const player = await getPlayerByUsername(username);

  return player;
}

export async function GetClubPlayers(id: string): Promise<PLAYER[]> {
  if (id === "") {
    throw new Error('Club ID must be provided');
  }
  const clubPlayers = await getClubPlayers(id);

  return clubPlayers;
}