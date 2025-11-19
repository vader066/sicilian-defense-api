import { z } from "zod";

export const AdminLoginReqSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export type AdminLoginReq = z.infer<typeof AdminLoginReqSchema>;
