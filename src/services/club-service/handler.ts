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

	testHandler = async (req: Request, res: Response) => {
		try {
			// this id value was taken from initial db seeding data
			const club = await this.clubService.getClubByID(
				"e7b8f7c4-3b21-4c9e-a8f4-1d2f6a5f9b0a",
			);
			if (club) {
				res
					.status(200)
					.json({
						message: "success test club retrieved",
						data: club,
						status: 200,
					});
			} else {
				res
					.status(404)
					.json({ message: "Club not found", data: null, status: 404 });
			}
		} catch (error: any) {
			const status = error.code || 500;
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
