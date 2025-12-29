import { z } from "zod";

export const GameSchema = z.object({
	game_id: z.string(),
	white: z.string(),
	black: z.string(),
	winner: z.string().optional(),
	black_rating: z.number().optional(),
	white_rating: z.number().optional(),
	played_at: z.string(),
	tournament_id: z.string().optional(),
	draw: z.boolean(),
	forfeit: z.enum(["BF", "WF", "FF"]).optional(),
});
