import { Request, Response } from "express";
import { PlayerService } from "./player-service";
import { BaseHandler } from "@/shared/handler";

// Use arrow functions for the methods to automatically bind this

export class PlayerServiceHandler extends BaseHandler {
	private playerService = new PlayerService();

	// const body = this.validate<CREATEACCOUNTREQ>(req, Crthis.playerService.eateAccountReqSchema);
	getClubPlayersHandler = async (req: Request, res: Response) => {
		try {
			const result = await this.playerService.GetClubPlayers(req.params.clubId);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(500)
				.json({ message: error.message, data: null, status: status });
		}
	};

	getPlayerByIdHandler = async (req: Request, res: Response) => {
		try {
			const result = await this.playerService.GetPlayerByID(
				req.params.playerId
			);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	getPlayerByUsernameHandler = async (req: Request, res: Response) => {
		try {
			const result = await this.playerService.GetPlayerByUsername(
				req.params.username
			);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
