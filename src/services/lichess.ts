import { ARENATOURNAMENTGAME } from "@/types/lichess/game";
import { ParseNDjson } from "@/utils/parse-ndjson";

// fetch and parse the tournament games from lichess's api
export async function getArenaGames(id: string) {
	const url = `https://lichess.org/api/tournament/${id}/games`;
	try {
		const response = await fetch(url, {
			headers: {
				Accept: "application/x-ndjson",
			},
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		const parsedResponse = await ParseNDjson<ARENATOURNAMENTGAME>(response);
		return { message: "success", data: parsedResponse, status: 200 };
	} catch (error: any) {
		return { message: error.message, data: null, status: error.code || 500 };
	}
}
