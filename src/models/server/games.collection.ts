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
		databases.createStringAttribute(db, gameCollection, "gameId", 20, true),
		databases.createRelationshipAttribute(
			db,
			gameCollection,
			playerCollection,
			RelationshipType.ManyToMany,
			false,
			playerCollection
		),
		databases.createRelationshipAttribute(
			db,
			gameCollection,
			playerCollection,
			RelationshipType.OneToMany,
			false,
			"winner"
		),
		databases.createRelationshipAttribute(
			db,
			gameCollection,
			playerCollection,
			RelationshipType.OneToMany,
			false,
			"white"
		),
		databases.createRelationshipAttribute(
			db,
			gameCollection,
			playerCollection,
			RelationshipType.OneToMany,
			false,
			"black"
		),
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
