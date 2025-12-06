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
		try {
			const body = this.validate<AdminLoginReq>(req, AdminLoginReqSchema);
			const result = await this.adminAuthService.LoginAdmin(
				body.email,
				body.password
			);
			res.cookie("refresh_token", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 1000 * 60 * 60 * 24 * 7,
			});

			const payload = { access_token: result.accessToken };
			res.status(200).json({ message: "success", data: payload, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	Logout = async (req: Request, res: Response) => {
		try {
			const body = this.validate<RefreshReq>(req, refreshReqSchema);
			const revokedAt = await this.adminAuthService.LogoutAdmin(
				body.refresh_token
			);
			res.cookie("refresh_token", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 0,
			});
			res.status(200).json({
				message: "success",
				data: { revoked_at: revokedAt.toISOString() },
				status: 200,
			});
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	LogoutAllSessions = async (req: Request, res: Response) => {
		try {
			const body = this.validate<RefreshReq>(req, refreshReqSchema);
			const revokedAt = await this.adminAuthService.LogoutAdminSessions(
				body.refresh_token
			);
			res.cookie("refresh_token", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 0, // delete cookie
			});
			res.status(200).json({
				message: "success",
				data: { revoked_at: revokedAt.toISOString() },
				status: 200,
			});
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};

	Refresh = async (req: Request, res: Response) => {
		try {
			const refreshToken = req.cookies?.refresh_token;
			if (!refreshToken) {
				return res.status(401).json({
					message: "Missing refresh token",
					data: null,
					status: 401,
				});
			}
			const result = await this.adminAuthService.refreshAccessToken(
				refreshToken
			);
			const payload = { access_token: result.accessToken };
			res.cookie("refresh_token", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days or whatever you choose
			});

			res.status(200).json({ message: "success", data: payload, status: 200 });
		} catch (error: any) {
			const status = this.errorStatus(error);
			res
				.status(status)
				.json({ message: error.message, data: null, status: status });
		}
	};
}
