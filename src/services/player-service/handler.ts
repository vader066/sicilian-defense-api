import { Request, Response } from "express";
import { GetClubPlayers, GetPlayerByID, GetPlayerByUsername } from "./player-service";

export async function getClubPlayersHandler(req: Request, res: Response) {
	try {
		const result = await GetClubPlayers(req.params.clubId);
		res.status(200).json({ message: "success", data: result, status: 200 });
	} catch (error: any) {
		const status = error.code || 500;
		res
			.status(500)
			.json({ message: error.message, data: null, status: status});
	}
}
  
export async function getPlayerByIdHandler(req: Request, res: Response) {
	try {
		const result = await GetPlayerByID(req.params.playerId);
		res.status(200).json({ message: "success", data: result, status: 200 });
	} catch (error: any) {
		const status = error.code || 500;
		res
			.status(status)
			.json({ message: error.message, data: null, status: status });
	}
}

export async function getPlayerByUsernameHandler(req: Request, res: Response) {
	try {
		const result = await GetPlayerByUsername(req.params.username);
		res.status(200).json({ message: "success", data: result, status: 200 });
	} catch (error: any) {
		const status = error.code || 500;
		res
			.status(status)
			.json({ message: error.message, data: null, status: status });
	}
}