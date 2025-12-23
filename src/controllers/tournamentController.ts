// import { Request, Response } from "express";
// import { db, playerCollection, tournamentCollection } from "@/models/name";
// import { databases } from "@/models/server/config";
// import { ratingUpdate, TOURNAMENT } from "@/types/database/models";
// import { getArenaGames } from "@/services/lichess";
// import { toHyphenatedId } from "@/utils";

// //@desc Get all tournaments
// //@route GET /api/tournaments
// export async function getAllTournaments(_: Request, res: Response) {
// 	try {
// 		const result = await databases.listDocuments(db, tournamentCollection);
// 		res.status(200).json({ message: "success", data: result, status: 200 });
// 	} catch (error: any) {
// 		const status = error.code || 404;
// 		res
// 			.status(status)
// 			.json({ message: error.message, data: null, status: status });
// 	}
// }

// //@desc add tournament from a club
// //@route POST /api/tournaments/
// // export async function addTournament(req: Request, res: Response) {
// // 	try {
// // 		const request: { tournament: TOURNAMENT } = await req.body;
// // 		const { tournament } = request;
// // 		const docId = toHyphenatedId(tournament.tournamentId);
// // 		const response = await databases.createDocument(
// // 			db,
// // 			tournamentCollection,
// // 			docId,
// // 			{
// // 				tournamentId: tournament.tournamentId,
// // 				players: tournament.players,
// // 				games: [...tournament.games],
// // 			}
// // 		);

// // 		res.status(201).json({
// // 			message: "success",
// // 			data: {
// // 				Created_at: response.$createdAt,
// // 				id: response.$id,
// // 			},
// // 			status: 201,
// // 		});
// // 	} catch (error: any) {
// // 		console.log(error.message);
// // 		res
// // 			.status(error.code || 409)
// // 			.json({ message: error.message, data: null, status: error.code || 409 });
// // 	}
// // }

// //@desc sync tournament: (update the rating of players using the results of the tournament)
// //@route PATCH /sync-tournament/:id
// export async function syncTournament(req: Request, res: Response) {
// 	try {
// 		const playerUpdates: ratingUpdate[] = req.body.ratingUpdates;
// 		const docId = toHyphenatedId(req.params.id);

// 		const tournamentUpdatePromise = databases.updateDocument(
// 			db,
// 			tournamentCollection,
// 			docId,
// 			{
// 				synced: true,
// 				games: req.body.games,
// 			}
// 		);
// 		const playerUpdatePromises = playerUpdates.map((update) => {
// 			return databases.updateDocument(db, playerCollection, update.username, {
// 				rating: update.newRating,
// 			});
// 		});
// 		const response = await Promise.all([
// 			tournamentUpdatePromise,
// 			...playerUpdatePromises,
// 		]);

// 		res.status(200).json({ message: "success", data: response, status: 200 });
// 	} catch (error: any) {
// 		console.log(error);
// 		res
// 			.status(error.code || 500)
// 			.json({ message: error, data: null, status: error.code || 500 });
// 	}
// }

// //@desc get a lichess tournament's games
// //@route GET api/lichess-arena-tournament/:id
// export async function getLichessArenaTournament(req: Request, res: Response) {
// 	const tournamentId = req.params.id;
// 	const response = await getArenaGames(tournamentId);
// 	res.status(response.status).json(response);
// }
