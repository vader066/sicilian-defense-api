import { Request, Response } from "express";
import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";

//@desc Get all players
//@route GET /api/players
export async function getAllPlayers(req: Request, res: Response) {
	try {
		const result = await databases.listDocuments(db, playerCollection);
		res.status(200).json({ message: "success", data: result });
	} catch (error: any) {
		res.status(error.status).json({ message: error.message, data: null });
	}
}
