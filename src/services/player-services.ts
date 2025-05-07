import { db, playerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { PLAYER } from "@/types/database/models";

export async function createPlayer(player: PLAYER) {
	await databases.createDocument(db, playerCollection, player.username, {
		...player,
	});
	console.log("Player created");
}
