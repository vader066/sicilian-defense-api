import { IndexType, Permission, RelationshipType } from "node-appwrite";
import {
	db,
	clubCollection,
	playerCollection,
	tournamentCollection,
} from "../name";
import { databases } from "./config";

export default async function createClubsCollection() {
	await databases.createCollection(db, clubCollection, clubCollection, [
		Permission.read("any"),
		Permission.read("users"),
		Permission.create("users"),
		Permission.create("any"),
		Permission.update("any"),
	]);
	console.log("Clubs collection has been created");

	await Promise.all([
		databases.createStringAttribute(
			db,
			clubCollection,
			"id",
			30,
			true,
			undefined
		),

		databases.createStringAttribute(
			db,
			clubCollection,
			"name",
			30,
			true,
			undefined
		),

		databases.createEmailAttribute(
			db,
			clubCollection,
			"email",
			true,
			undefined
		),

		databases.createStringAttribute(
			db,
			clubCollection,
			"userName",
			30,
			true,
			undefined
		),

		databases.createRelationshipAttribute(
			db,
			clubCollection,
			playerCollection,
			RelationshipType.OneToMany,
			true,
			playerCollection,
			clubCollection
		),
		databases.createRelationshipAttribute(
			db,
			clubCollection,
			tournamentCollection,
			RelationshipType.OneToMany,
			true,
			tournamentCollection,
			clubCollection
		),
	]);
	console.log("Clubs Attributes created");

	//Index for searching for clubs
	await Promise.all([
		databases.createIndex(
			db,
			clubCollection,
			"id",
			IndexType.Unique,
			["id"],
			["asc"]
		),
	]);
}
