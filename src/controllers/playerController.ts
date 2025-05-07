import { Request, Response } from "express";
import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { PLAYER } from "@/types/database/models";
import { Query } from "node-appwrite";
import { createPlayer } from "@/services/player-services";

//@desc Get all players
//@route GET /api/players
export async function getAllPlayers(_: Request, res: Response) {
	try {
		const result = await databases.listDocuments(db, playerCollection, [
			Query.limit(50),
		]);
		res.status(200).json({ message: "success", data: result, status: 200 });
	} catch (error: any) {
		const status = error.code || 500;
		res
			.status(status)
			.json({ message: error.message, data: null, status: status });
	}
}

//@desc Delete player from a club
//@route DELETE /api/players/:id
export async function deletePlayer(req: Request, res: Response) {
	try {
		const response = await databases.deleteDocument(
			db,
			playerCollection,
			req.params.id
		);
		console.log(response);
		res.status(204).send();
	} catch (error: any) {
		console.log("There was an error deleting the player", error);
		res
			.status(error.code || 404)
			.json({ message: error.message, data: null, status: error.code || 404 });
	}
}

//@desc add player from a club
//@route POST /api/players/
export async function addPlayer(req: Request, res: Response) {
	try {
		const player: PLAYER = req.body;
		const response = await databases.createDocument(
			db,
			playerCollection,
			player.username,
			{
				...player,
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
		console.log("There was an error adding player", error);
		res
			.status(error.code || 409)
			.json({ message: error.type, data: null, status: error.code || 409 });
	}
}

//@desc edit player from a club
//@route PUT /api/players/:id
export async function editPlayerInfo(req: Request, res: Response) {
	try {
		const player: PLAYER = req.body;
		const response = await databases.updateDocument(
			db,
			playerCollection,
			player.username,
			{
				...player,
			}
		);
		res.status(201).json({
			message: "success",
			data: {
				updated_at: response.$updatedAt,
				id: response.$id,
			},
			status: 201,
		});
	} catch (error: any) {
		console.log("There was an error updating the player", error);
		res
			.status(error.code || 409)
			.json({ message: error.type, data: null, status: error.code || 409 });
	}
}

//@desc add List of players from a club
//@route POST /api/players/populate
export async function addBulkPlayers(req: Request, res: Response) {
	try {
		const players: PLAYER[] = req.body;
		players.forEach(async (player) => {
			await createPlayer(player);
			console.log(player);
		});
		res.status(201).json({
			message: "success",
			data: null,
			status: 201,
		});
		console.log("Player collection created");
	} catch (error: any) {
		console.log("There was an error adding players", error);
		res
			.status(error.code || 409)
			.json({ message: error.type, data: null, status: error.code || 409 });
	}
}
