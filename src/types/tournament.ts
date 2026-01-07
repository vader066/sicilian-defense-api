import { z } from "zod";
import { GameSchema } from "./game";

export const createTournamentReqSchema = z.object({
	tournamentName: z.string(),
	numberOfRounds: z.number().min(1),
	games: z.array(GameSchema), // same as game object in db types
	playerIDs: z.array(z.string()),
});

export type tournamentReq = z.infer<typeof createTournamentReqSchema>;

const ratingUpdateSchema = z.object({
	playerId: z.string(),
	newRating: z.number(),
});

export const syncTournReqSchema = z.object({
	updatedGames: z.array(GameSchema),
	ratingUpdates: z.array(ratingUpdateSchema),
});

export type syncTournReq = z.infer<typeof syncTournReqSchema>;
