import { IndexType, Permission, RelationshipType } from "node-appwrite";
import { db, tournamentCollection, gameCollection } from "../name";
import { databases } from "./config";

export default async function createTournamentsCollection() {
	await databases.createCollection(
		db,
		tournamentCollection,
		tournamentCollection,
		[
			Permission.read("any"),
			Permission.read("users"),
			Permission.create("users"),
			Permission.create("any"),
			Permission.update("any"),
		]
	);
	console.log("Tournament collection has been created");

	await Promise.all([
		databases.createStringAttribute(
			db,
			tournamentCollection,
			"tournamentId",
			20,
			true,
			undefined
		),

		databases.createBooleanAttribute(
			db,
			tournamentCollection,
			"synced",
			false,
			false
		),

		databases.createStringAttribute(
			db,
			tournamentCollection,
			"players",
			1000,
			true,
			undefined,
			true
		),
		databases.createRelationshipAttribute(
			db,
			tournamentCollection,
			gameCollection,
			RelationshipType.OneToMany,
			true,
			gameCollection,
			tournamentCollection
		),
	]);
	console.log("Tournaments Attributes created");

	//Index for searching for tournaments
	await Promise.all([
		databases.createIndex(
			db,
			tournamentCollection,
			"tournamentId",
			IndexType.Unique,
			["tournamentId"],
			["asc"]
		),
	]);
}
