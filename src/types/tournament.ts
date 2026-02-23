import { z } from "zod";
import { GameSchema } from "./game";
import { DBTourney, GAME } from "./database/models";

export const createTournamentReqSchema = z.object({
	tournamentName: z.string(),
	numberOfRounds: z.number().min(1),
	games: z.array(GameSchema), // same as game object in db types
	playerIDs: z.array(z.string()),
});

export type tournamentReq = z.infer<typeof createTournamentReqSchema>;

export const createRoundRobinTournamentReqSchema = z.object({
	playerIDs: z.array(z.string()).min(2, "At least 2 players required"),
	tournamentName: z.string(),
});

export type createRoundRobinTournamentReq = z.infer<
	typeof createRoundRobinTournamentReqSchema
>;

const ratingUpdateSchema = z.object({
	playerId: z.string(),
	newRating: z.number(),
});

export const syncTournReqSchema = z.object({
	updatedGames: z.array(GameSchema),
	ratingUpdates: z.array(ratingUpdateSchema),
});

export type syncTournReq = z.infer<typeof syncTournReqSchema>;

export type RatingUpdate = {
	playerId: string;
	newRating: number;
};

export type AddTournamentWithGamesResult = {
	tournament: DBTourney;
	updatedGames: GAME[];
	ratingUpdates: RatingUpdate[];
	gamesAdded: number;
};
