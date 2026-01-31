import { z } from "zod";

export const CreateAccountReqSchema = z.object({
	club_name: z.string(),
	creator_is_player: z.boolean(),
	first_name: z.string(),
	last_name: z.string(),
	email: z.email(),
	username: z.string(),
	creator: z.boolean(),
	password: z.string(),
});

export type CREATEACCOUNTREQ = z.infer<typeof CreateAccountReqSchema>;
