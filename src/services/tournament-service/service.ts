import { DBTourney, PLAYER, TOURNAMENT } from "@/types/database/models";
import { TourneyRepository } from "./repository";
import { GameService } from "../game-service/service";
import { PlayerService } from "../player-service/player-service";
import { syncTournReq } from "@/types/tournament";

export class TournamentService {
	private tournamentRepository = new TourneyRepository();

	private gameClient = new GameService();
	private playerClient = new PlayerService();

	async GetTournamentById(tournamentId: string): Promise<DBTourney> {
		const tourney = await this.tournamentRepository.getTournamentById(
			tournamentId
		);

		if (!tourney) {
			let err = new Error() as any;
			err.status = 404;
			err.message = "Cannot find tournament";
			throw err;
		}
		return tourney;
	}

	async AddTournament(tournament: DBTourney): Promise<DBTourney> {
		const tourney = await this.tournamentRepository.addTournament(tournament);
		return tourney;
	}

	async GetTournamentWithGames(tourney: DBTourney): Promise<TOURNAMENT> {
		try {
			// get the games of the tournaments
			const tourneyGames = await this.gameClient.getTournamentGames(tourney.id);

			// get the player id's from the tournament games without duplicates
			let playerIDs: string[] = [];
			tourneyGames.forEach((game) => {
				if (!playerIDs.includes(game.black)) {
					playerIDs.push(game.black);
				} else if (!playerIDs.includes(game.white)) {
					playerIDs.push(game.white);
				}
			});

			const tournament: TOURNAMENT = {
				games: tourneyGames,
				id: tourney.id,
				tournamentName: tourney.tournament_name,
				playerIDs,
				clubId: tourney.club_id,
				beganAt: tourney.began_at ? new Date(tourney.began_at) : new Date(),
				numberOfRounds: tourney.number_of_rounds,
			};

			return tournament;
		} catch (error: any) {
			error.code = 500;
			error.message = `Error getting tournament with games: ${error.message}`;
			throw error;
		}
	}

	async ListClubTournaments(clubId: string): Promise<DBTourney[]> {
		const tournaments = await this.tournamentRepository.getClubTournaments(
			clubId
		);
		return tournaments;
	}

	async SyncTournament(
		tournament: DBTourney,
		syncReq: syncTournReq
	): Promise<DBTourney> {
		//get all club players
		const players = await this.playerClient.GetClubPlayers(tournament.club_id);

		// update synced value
		tournament.synced = true;
		const updatedTourney = await this.tournamentRepository.updateTournament(
			tournament
		);

		// verify if updates contain unknown players and throw error
		const playerIDs = players.map((p) => p.id);
		const verify = syncReq.ratingUpdates.some((u) => {
			const has = playerIDs.includes(u.playerId);
			return !has;
		});
		if (!verify) {
			throw Error(
				"Player in updates request body did not match any player in the club's database"
			);
		}

		// update player ratings
		const promises: Promise<PLAYER>[] = [];
		syncReq.ratingUpdates.forEach((update) => {
			const player = players.find((p) => p.id === update.playerId);
			player!.rating = update.newRating;
			promises.push(this.playerClient.UpdatePlayer(player!));
		});

		await Promise.all(promises);
		return updatedTourney;
	}
}
