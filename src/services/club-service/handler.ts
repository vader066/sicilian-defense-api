import { Request, Response } from "express";
import { BaseHandler } from "@/shared/handler";
import { CREATEACCOUNTREQ, CreateAccountReqSchema } from "@/types/club";
import { ClubService } from "./service";

// Use arrow functions for the methods to automatically bind this

export class ClubServiceHandler extends BaseHandler {
	private clubService = new ClubService();

	createClubAccount = async (req: Request, res: Response) => {
		//validate request body
		const body = this.validate<CREATEACCOUNTREQ>(req, CreateAccountReqSchema);

		try {
			const result = await this.clubService.createAccount(body);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
