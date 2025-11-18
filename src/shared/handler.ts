import { Request } from "express";
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

export class BaseHandler extends Validator {}
