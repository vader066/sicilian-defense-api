import { Request, Response } from "express";
import { BaseHandler } from "@/shared/handler";
import { AdminAuthService } from "./service";
import {
	AdminLoginReq,
	AdminLoginReqSchema,
	RefreshReq,
	refreshReqSchema,
} from "@/types/admin-auth";
import { ClubService } from "../club-service/service";

// Use arrow functions for the methods to automatically bind this

export class AdminAuthHandler extends BaseHandler {
	private adminAuthService = new AdminAuthService();
	private clubClient = new ClubService();

	Login = async (req: Request, res: Response) => {
		try {
			const body = this.validate<AdminLoginReq>(req, AdminLoginReqSchema);
			const result = await this.adminAuthService.LoginAdmin(
				body.email,
				body.password
			);

			const club = await this.clubClient.getClubByID(result.admin.club_id);
			if (!club) {
				throw new Error(
					`Could not find admin's club: ${result.admin.club_id} `
				);
			}

			res.cookie("refresh_token", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
			});

			const payload = {
				access_token: result.accessToken,
				user: result.admin,
				club,
			};
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
				const error = new Error("Missing refresh token cookie");
				error.name = "AuthError";
				throw error;
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
