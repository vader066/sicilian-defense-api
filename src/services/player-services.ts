import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { PLAYER } from "@/types/database/models";

export async function createPlayer(player: PLAYER) {
	await databases.createDocument(db, playerCollection, player.id, {
		id: player.id,
		name: player.name,
		rating: player.rating,
		clubs: "KNUST CHESS CLUB", //use the name of the users club
	});
	console.log("Player created");
}
