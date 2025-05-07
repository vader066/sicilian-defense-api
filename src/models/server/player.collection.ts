import { IndexType, Permission, RelationshipType } from "node-appwrite";
import { clubCollection, db, playerCollection } from "../name";
import { databases } from "./config";

export default async function createPlayerCollection() {
	await databases.createCollection(db, playerCollection, playerCollection, [
		Permission.read("any"),
		Permission.read("users"),
		Permission.create("users"),
		Permission.create("any"),
		Permission.update("any"),
	]);
	console.log("Player collection has been created");

	await Promise.all([
		databases.createStringAttribute(db, playerCollection, "username", 20, true),
		databases.createStringAttribute(
			db,
			playerCollection,
			"first_name",
			30,
			true
		),
		databases.createStringAttribute(
			db,
			playerCollection,
			"last_name",
			30,
			true
		),
		databases.createEnumAttribute(
			db,
			playerCollection,
			"sex",
			["male", "female"],
			true
		),
		databases.createStringAttribute(
			db,
			playerCollection,
			"programme",
			60,
			true
		),
		databases.createRelationshipAttribute(
			db,
			playerCollection,
			clubCollection,
			RelationshipType.ManyToOne,
			true,
			clubCollection,
			playerCollection
		),
		databases.createDatetimeAttribute(db, playerCollection, "dob", true),
		databases.createIntegerAttribute(db, playerCollection, "rating", true),
	]);
	console.log("Player Attributes created");

	//Index for searching for games
	await Promise.all([
		databases.createIndex(
			db,
			playerCollection,
			"id",
			IndexType.Unique,
			["id"],
			["asc"]
		),

		databases.createIndex(
			db,
			playerCollection,
			"name",
			IndexType.Key,
			["name"],
			["asc"]
		),
	]);
}
