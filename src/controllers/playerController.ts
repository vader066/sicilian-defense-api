import { Request, Response } from "express";
import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { Member } from "@/types/database/models";

//@desc Get all players
//@route GET /api/players
export async function getAllPlayers(_: Request, res: Response) {
	try {
		const result = await databases.listDocuments(db, playerCollection);
		res.status(200).json({ message: "success", data: result });
	} catch (error: any) {
		res.status(error.status).json({ message: error.message, data: null });
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
		res.status(204).json({ message: "success" });
	} catch (error: any) {
		console.log(error.message);
		res.status(error.code || 404).json({ message: error.type });
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
			Created_at: response.$createdAt,
			id: response.$id,
		});
	} catch (error: any) {
		console.log(error.message);
		res.status(error.code || 409).json({ message: error.type });
	}
}
