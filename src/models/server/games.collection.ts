import { IndexType, Permission } from "node-appwrite";
import { db, gameCollection } from "../name";
import { databases } from "./config";

export default async function createGamesCollection() {
	await databases.createCollection(db, gameCollection, gameCollection, [
		Permission.read("any"),
		Permission.read("users"),
		Permission.create("users"),
		Permission.create("any"),
		Permission.update("any"),
	]);
	console.log("Games collection has been created");

	await Promise.all([
		databases.createStringAttribute(db, gameCollection, "gameId", 20, true),
		databases.createStringAttribute(
			db,
			gameCollection,
			"players",
			30,
			true,
			undefined,
			true
		),
		databases.createStringAttribute(
			db,
			gameCollection,
			"winner",
			30,
			true,
			undefined
		),
		// databases.createStringAttribute(db, gameCollection, "winner", 30, true),
		// databases.createStringAttribute(
		// 	db,
		// 	gameCollection,
		// 	"tournamentId",
		// 	15,
		// 	true,
		// 	undefined
		// ),
		databases.createStringAttribute(db, gameCollection, "date", 30, true),
	]);
	console.log("Game Attributes created");

	//Index for searching for games
	await Promise.all([
		databases.createIndex(
			db,
			gameCollection,
			"gameId",
			IndexType.Unique,
			["gameId"],
			["asc"]
		),

		databases.createIndex(
			db,
			gameCollection,
			"tournamentId",
			IndexType.Key,
			["tournamentId"],
			["asc"]
		),
	]);
}

//game
// Id, players, winner, tournament, date
