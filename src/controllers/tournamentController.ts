import { Request, Response } from "express";
import { db, tournamentCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { TOURNAMENT } from "@/types/database/models";
import { v4 as uuidv4 } from "uuid";
import { Query } from "node-appwrite";
import { getArenaGames } from "@/services/lichess";

//@desc Get all tournaments
//@route GET /api/tournaments
export async function getAllTournaments(_: Request, res: Response) {
	try {
		const result = await databases.listDocuments(db, tournamentCollection, [
			Query.limit(3),
		]);
		res.status(200).json({ message: "success", data: result, status: 200 });
	} catch (error: any) {
		const status = error.code || 404;
		res
			.status(status)
			.json({ message: error.message, data: null, status: status });
	}
}

//@desc add tournament from a club
//@route POST /api/tournaments/
export async function addTournament(req: Request, res: Response) {
	const id = uuidv4();
	try {
		const request: { tournament: TOURNAMENT } = await req.body;
		const { tournament } = request;
		const response = await databases.createDocument(
			db,
			tournamentCollection,
			id,
			{
				tournamentId: tournament.tournamentId,
				players: tournament.players,
				games: [...tournament.games],
			}
		);

		res.status(201).json({
			message: "success",
			data: {
				Created_at: response.$createdAt,
				id: response.$id,
			},
			status: 201,
		});
	} catch (error: any) {
		console.log(error.message);
		res
			.status(error.code || 409)
			.json({ message: error.message, data: null, status: error.code || 409 });
	}
}

//@desc sync tournament: (update the rating of players using the results of the tournament)
//@route PATCH /sync-tournament/:id
export async function syncTournament(req: Request, res: Response) {
	try {
		const response = await databases.updateDocument(
			db,
			tournamentCollection,
			req.params.id,
			{
				synced: true,
			}
		);
		console.log(response);
		res.status(200).json({ message: "success", data: null, status: 200 });
	} catch (error: any) {
		console.log(error.message);
		res
			.status(error.code || 500)
			.json({ message: error.message, data: null, status: error.code || 500 });
	}
}

//@desc get a lichess tournament's games
//@route GET api/lichess-arena-tournament/:id
export async function getLichessArenaTournament(req: Request, res: Response) {
	const tournamentId = req.params.id;
	const response = await getArenaGames(tournamentId);
	res.status(response.status).json(response);
}
