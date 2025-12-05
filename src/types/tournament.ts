import { z } from "zod";
import { GameSchema } from "./game";

export const createTournamentReqSchema = z.object({
	tournamentName: z.string(),
	games: z.array(GameSchema), // same as game object in db types
	playerIDs: z.string(),
});

export type tournamentReq = z.infer<typeof createTournamentReqSchema>;
