import { db } from "../name";
import createGamesCollection from "./games.collection";
import createTournamentsCollection from "./tournaments.collection";
import createPlayerCollection from "./player.collection";
import { databases } from "./config";
import createClubsCollection from "./club.collection";

export default async function getOrCreateDB() {
	try {
		await databases.get(db);
		console.log("Database connecting");
	} catch (error) {
		try {
			await databases.create(db, db);
			console.log("Database created");

			// creating collections
			await Promise.all([
				createGamesCollection(),
				createTournamentsCollection(),
				createPlayerCollection(),
				createClubsCollection(),
			]);
			console.log("Collection created");
			console.log("Database created");
		} catch (error) {
			console.log("Error creating databases or collection", error);
		}
	}

	return databases;
}
