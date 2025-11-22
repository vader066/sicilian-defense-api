import { Request, Response } from "express";
import { BaseHandler } from "@/shared/handler";
import { AdminAuthService } from "./service";
import {
	AdminLoginReq,
	AdminLoginReqSchema,
	RefreshReq,
	refreshReqSchema,
} from "@/types/admin-auth";

// Use arrow functions for the methods to automatically bind this

export class AdminAuthHandler extends BaseHandler {
	private adminAuthService = new AdminAuthService();

	Login = async (req: Request, res: Response) => {
		const body = this.validate<AdminLoginReq>(req, AdminLoginReqSchema);
		try {
			const result = await this.adminAuthService.LoginAdmin(
				body.email,
				body.password
			);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	Refresh = async (req: Request, res: Response) => {
		const body = this.validate<RefreshReq>(req, refreshReqSchema);
		try {
			const result = await this.adminAuthService.refreshAccessToken(
				body.refresh_token
			);
			res.status(200).json({ message: "success", data: result, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
