import { z } from "zod";

export const PlayerReqSchema = z.object({
	id: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	programme: z.string(),
	username: z.string(),
	rating: z.number(),
	date_of_birth: z.string(),
	sex: z.enum(["MALE", "FEMALE"]),
	club_id: z.string(),
});

export type PlayerReq = z.infer<typeof PlayerReqSchema>;
