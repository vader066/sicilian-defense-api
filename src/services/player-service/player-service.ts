import { PLAYER } from "@/types/database/models";
import { PlayerRepository } from "./repository";
import { ClubService } from "../club-service/service";

export class PlayerService {
	private playerRepository = new PlayerRepository();
	private clubClient = new ClubService();

	async CreatePlayer(player: PLAYER): Promise<PLAYER> {
		// check if player with same username and id already exists
		const existingPlayerByUsername =
			await this.playerRepository.getPlayerByUsername(player.username);
		const existingPlayerById = await this.playerRepository.getPlayerById(
			player.id
		);
		if (existingPlayerByUsername) {
			// only throw error if player with same username is in the same club
			if (existingPlayerByUsername.club_id === player.club_id) {
				throw new Error(
					`Player with username ${player.username} already exists`
				);
			}
		} else if (existingPlayerById) {
			throw new Error(`Player with ID ${player.id} already exists`);
		}

		//check if club exists
		const club = await this.clubClient.getClubByID(player.club_id);
		if (!club) {
			throw new Error(`Club with ID ${player.club_id} does not exist`);
		}

		// create player
		const newPlayer = await this.playerRepository.createPlayerV2(player);
		return newPlayer;
	}

	async GetPlayerByID(id: string): Promise<PLAYER> {
		try {
			if (id === "") {
				throw new Error("PlayerId must be provided");
			}
			const player = await this.playerRepository.getPlayerById(id);
			if (!player) {
				throw new Error(`Player with ID ${id} not found`);
			}
			return player;
		} catch (error: any) {
			error.code = 500;
			error.message = `Error getting player ${error.message}`;
			throw error;
		}
	}

	async GetClubPlayers(id: string): Promise<PLAYER[]> {
		try {
			if (id === "") {
				throw new Error("Club ID must be provided");
			}
			const clubPlayers = await this.playerRepository.getClubPlayers(id);
			return clubPlayers;
		} catch (error: any) {
			error.code = 500;
			error.message = `Error getting club players: ${error.message}`;
			throw error;
		}
	}

	async UpdatePlayer(player: PLAYER): Promise<PLAYER> {
		try {
			const updatedPlayer = await this.playerRepository.updatePlayer(player);
			return updatedPlayer;
		} catch (error: any) {
			error.code = 500;
			error.message = `Error Updating player: ${error.message}`;
			throw error;
		}
	}

	async createPlayerList(players: PLAYER[]): Promise<number> {
		//check if club exists
		const clubId = players[0].club_id;
		const club = await this.clubClient.getClubByID(clubId);
		if (!club) {
			throw new Error(`Club with ID ${clubId} does not exist`);
		}

		//add players
		const rowsModified = await this.playerRepository.addBulkPlayers(players);
		return rowsModified;
	}
}
