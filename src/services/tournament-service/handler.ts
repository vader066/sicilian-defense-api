import { Request, Response } from "express";
import { BaseHandler } from "@/shared/handler";
import { AdminManagementService } from "../admin-management-service/service";
import { TournamentService } from "./service";
import { DBTourney } from "@/types/database/models";
import { randomUUID } from "node:crypto";
import { GameService } from "../game-service/service";
import {
	createTournamentReqSchema,
	syncTournReq,
	syncTournReqSchema,
	tournamentReq,
} from "@/types/tournament";
import { getArenaGames } from "../lichess";

// Use arrow functions for the methods to automatically bind this

export class TournamentServiceHandler extends BaseHandler {
	private service = new TournamentService();
	private adminClient = new AdminManagementService();
	private gameClient = new GameService();

	getTournamentWithGamesHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const tourneyId = req.params.tourneyId;

			// get the tournament to make sure it exists
			const dbTourney = await this.service.GetTournamentById(tourneyId);

			// check if tournament belongs to this admin's club
			const admin = await this.adminClient.getAdminByID(userId);
			if (admin.club_id != dbTourney.club_id) {
				res.status(403).json({
					message: `This user is not an admin for club or club does not exist`,
					data: null,
					status: 403,
				});
			}

			// make db call for players
			const result = await this.service.GetTournamentWithGames(dbTourney);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	addTournamentWithGamesHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const admin = await this.adminClient.getAdminByID(userId);
			const body = this.validate<tournamentReq>(req, createTournamentReqSchema);

			//add tournament to tournament table
			const tournId = randomUUID();
			const tournament: DBTourney = {
				id: tournId,
				club_id: admin.club_id,
				status: "completed",
				number_of_games: body.games.length,
				number_of_players: body.playerIDs.length,
				tournament_name: body.tournamentName,
				number_of_rounds: body.numberOfRounds,
				synced: false,
			};

			const createdTourney = await this.service.AddTournament(tournament);

			// assign the created tournament's ID to the games tournament_id field
			body.games.forEach((g) => {
				g.tournament_id = tournId;
			});

			// add games
			const result = await this.gameClient.addGameList(body.games);
			const response = {
				tournament_id: createdTourney.id,
				games_added: result,
			};
			res.status(201).json({ message: "success", data: response, status: 201 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	listTournamentsHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const admin = await this.adminClient.getAdminByID(userId);
			const tournaments = await this.service.ListClubTournaments(admin.club_id);
			res
				.status(200)
				.json({ message: "success", data: tournaments, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	syncTournamentHandler = async (req: Request, res: Response) => {
		try {
			// authenticate admin user
			const userId = this.authenticate(req);
			const body = this.validate<syncTournReq>(req, syncTournReqSchema);

			// Admin authorization - verify tournament and admin belong to the same club
			const admin = await this.adminClient.getAdminByID(userId);
			const tournament = await this.service.GetTournamentById(
				req.params.tournamentId
			);
			if (admin.club_id != tournament.club_id) {
				res.status(403).json({
					message: `This admin user and tournament do not belong to the same club`,
					data: null,
					status: 403,
				});
			}

			const updatedTournament = await this.service.SyncTournament(
				tournament,
				body
			);
			res
				.status(200)
				.json({ message: "success", data: updatedTournament, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	getLichessArenaTournamentHandler = async (req: Request, res: Response) => {
		try {
			const tournamentId = req.params.id;
			const { data: lichessTourney } = await getArenaGames(tournamentId);
			res
				.status(200)
				.json({ message: "success", data: lichessTourney, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
