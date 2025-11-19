import { z } from "zod";

export const CreatePlayerReqSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	programme: z.string(),
	username: z.string(),
	date_of_birth: z.string(),
	sex: z.enum(["MALE", "FEMALE"]),
});

export type CreatePlayerReq = z.infer<typeof CreatePlayerReqSchema>;

export const UpdatePlayerReqSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	programme: z.string(),
	username: z.string(),
	date_of_birth: z.string(),
	sex: z.enum(["MALE", "FEMALE"]),
});

export type UpdatePlayerReq = z.infer<typeof UpdatePlayerReqSchema>;
