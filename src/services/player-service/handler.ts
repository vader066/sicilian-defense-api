import { Request, Response } from "express";
import { PlayerService } from "./player-service";
import { BaseHandler } from "@/shared/handler";
import { AdminClient } from "./client/admin-management";

// Use arrow functions for the methods to automatically bind this

export class PlayerServiceHandler extends BaseHandler {
	private playerService = new PlayerService();

	// const body = this.validate<CREATEACCOUNTREQ>(req, Crthis.playerService.eateAccountReqSchema);
	getClubPlayersHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const clubId = req.params.clubId;

			// check if player is club admin
			const admin = await AdminClient.getAdminByID(userId);
			if (admin.club_id != clubId) {
				res.status(403).json({
					message: `This user is not an admin for club or club does not exist`,
					data: null,
					status: 403,
				});
			}

			// make db call for players
			const result = await this.playerService.GetClubPlayers(clubId);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	getPlayerHandler = async (req: Request, res: Response) => {
		try {
			const userId = this.authenticate(req);
			const admin = await AdminClient.getAdminByID(userId);
			const result = await this.playerService.GetPlayerByID(
				req.params.playerId
			);
			if (admin.club_id != result.club_id) {
				res.status(403).json({
					message: `This user and player do not belong to the same club`,
					data: null,
					status: 403,
				});
			}
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
