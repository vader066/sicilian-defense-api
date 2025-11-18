import { PLAYER } from "@/types/database/models";
import { PlayerRepository } from "./repository";

export class PlayerService {
	private playerRepository = new PlayerRepository();
	async GetPlayerByID(id: string): Promise<PLAYER> {
		if (id === "") {
			throw new Error("PlayerId must be provided");
		}
		const player = await this.playerRepository.getPlayerById(id);

		return player;
	}

	async GetPlayerByUsername(username: string): Promise<PLAYER> {
		if (username === "") {
			throw new Error("Username must be provided");
		}
		const player = await this.playerRepository.getPlayerByUsername(username);

		return player;
	}

	async GetClubPlayers(id: string): Promise<PLAYER[]> {
		if (id === "") {
			throw new Error("Club ID must be provided");
		}
		const clubPlayers = await this.playerRepository.getClubPlayers(id);

		return clubPlayers;
	}
}
