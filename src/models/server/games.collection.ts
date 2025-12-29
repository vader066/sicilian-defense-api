import { IndexType, Permission, RelationshipType } from "node-appwrite";
import { db, gameCollection, playerCollection } from "../name";
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
		databases.createStringAttribute(db, gameCollection, "game_id", 20, true),
		databases.createStringAttribute(db, gameCollection, "black", 20, true),
		databases.createStringAttribute(db, gameCollection, "white", 20, true),
		databases.createStringAttribute(db, gameCollection, "winner", 20, false),
		databases.createIntegerAttribute(db, gameCollection, "blackRating", false), //entry rating for black player
		databases.createIntegerAttribute(db, gameCollection, "whiteRating", false), //entry rating for white player
		databases.createDatetimeAttribute(db, gameCollection, "played_at", true),
		databases.createBooleanAttribute(db, gameCollection, "draw", false),
		databases.createEnumAttribute(
			db,
			gameCollection,
			"forfeit",
			["BF", "WF", "FF"],
			false
		),
	]);
	console.log("Game Attributes has been created");

	//Index for searching for games
	await Promise.all([
		databases.createIndex(
			db,
			gameCollection,
			"game_id",
			IndexType.Unique,
			["game_id"],
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
// Id, players, winner, tournament, played_at
