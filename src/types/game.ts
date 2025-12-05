import { z } from "zod";

export const GameSchema = z.object({
	game_id: z.string(),
	white: z.string(),
	black: z.string(),
	winner: z.string(),
	black_rating: z.number(),
	white_rating: z.number(),
	played_at: z.string(),
	tournament_id: z.string(),
	draw: z.boolean(),
	forfeit: z.enum(["BF", "WF", "FF"]),
});
