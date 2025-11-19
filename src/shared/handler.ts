import env from "@/env";
import { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { z } from "zod";

class Validator {
	protected validate<T>(req: Request, schema: z.ZodType): T {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			throw new Error("Invalid request body");
		}

		return result.data as T;
	}
}

export class BaseHandler extends Validator {
	protected authenticate(req: Request): string {
		const bearerToken = req.headers.authorization;
		if (!bearerToken) {
			let err = new Error("Missing Bearer Token");
			(err as any).code = 401;
			throw err;
		}

		// strip "Bearer " if present
		const token = bearerToken.startsWith("Bearer ")
			? bearerToken.split(" ")[1]
			: bearerToken;

		try {
			const decoded = verify(token, env.accessJwtSecret) as JwtPayload;

			const userId = decoded.sub;
			if (!userId) {
				throw new Error("Missing userID from authentication");
			}
			return userId;
		} catch (error: any) {
			error.code = 401;
			error.message = `Bearer Token: ${error.message}`;
			throw error;
		}
	}
}
