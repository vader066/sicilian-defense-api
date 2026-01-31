import { GAME } from "@/types/database/models";
import { GameRepository } from "./repository";

export class GameService {
	private gameRepository = new GameRepository();

	async addGameList(games: GAME[]): Promise<number> {
		const rowsModified = await this.gameRepository.addGames(games);
		return rowsModified;
	}

	async getTournamentGames(tournamentId: string): Promise<GAME[]> {
		const games = await this.gameRepository.getTournamentGames(tournamentId);
		return games;
	}
}
