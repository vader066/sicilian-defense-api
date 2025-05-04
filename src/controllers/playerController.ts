import { Request, Response } from "express";
import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { Member } from "@/types/database/models";
import { Query } from "node-appwrite";

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
		console.log("There was an error deleting the player");
		console.log(error);
		res
			.status(error.code || 404)
			.json({ message: error.message, data: null, status: error.code || 404 });
	}
}

//@desc add player from a club
//@route POST /api/players/
export async function addPlayer(req: Request, res: Response) {
	try {
		const request: Member = req.body;
		const response = await databases.createDocument(
			db,
			playerCollection,
			request.username,
			{
				id: request.username,
				name: `${request.first_name} ${request.last_name}`,
				rating: request.rating,
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
			.json({ message: error.type, data: null, status: error.code || 409 });
	}
}
