import { ADMIN, ADMINAUTH, REFRESHSESSION } from "@/types/database/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminAuthRepository } from "./repository";
import { randomUUID, createHash } from "crypto";
import env from "@/env";
import { AdminManagementService } from "../admin-management-service/service";

export interface RefreshToken extends jwt.JwtPayload {}

export class AdminAuthService {
	private adminAuthRepository = new AdminAuthRepository();

	private adminClient = new AdminManagementService();

	async hashPassword(password: string): Promise<string> {
		const saltRounds = 12;
		const hashed = await bcrypt.hash(password, saltRounds);
		return hashed;
	}

	hashToken(token: string): string {
		return createHash("sha256").update(token).digest("hex");
	}

	async verifyPassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}

	async createAdminAuth(adminAuth: ADMINAUTH) {
		await this.adminAuthRepository.createAdminAuth(adminAuth);
	}

	async verifyAdminCredentials(
		adminId: string,
		password: string
	): Promise<boolean> {
		const adminAuth = await this.adminAuthRepository.getAdminAuth(adminId);
		if (!adminAuth) {
			throw new Error("Admin not found");
		}
		const isValid = await this.verifyPassword(
			password,
			adminAuth.password_hash
		);
		return isValid;
	}

	async LoginAdmin(email: string, password: string): Promise<LoginResponse> {
		// get adminId
		const admin = await this.adminClient.getAdminByEmail(email);
		const adminId = admin.id;

		// verify credentials
		const isValid = await this.verifyAdminCredentials(adminId, password);
		if (!isValid) {
			throw new Error("Invalid credentials");
		}

		// generate access and refresh tokens
		const jti = randomUUID();
		const accessToken = this.generateAccessToken(adminId, "ADMIN", admin.email);
		const refreshToken = this.generateRefreshToken(
			jti,
			adminId,
			"ADMIN",
			admin.email
		);

		// store refresh token in DB
		const hashedToken = this.hashToken(refreshToken);
		const session: REFRESHSESSION = {
			id: jti,
			user_id: adminId,
			user_type: "ADMIN",
			token_hash: hashedToken,
			expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
		};
		await this.adminAuthRepository.addRefreshSession(session);
		return { accessToken, refreshToken, admin };
	}

	async LogoutAdmin(refreshToken: string): Promise<Date> {
		try {
			const decoded = jwt.decode(refreshToken) as RefreshTokenPayload;
			if (!decoded || decoded.type !== "refresh") {
				throw new Error("Invalid refresh token payload");
			}
			if (!decoded.jti) throw new Error("Refresh token missing ID");
			const tokenId = decoded.jti;

			jwt.verify(refreshToken, env.refreshJwtSecret);

			// Revoke the refresh session in the database
			await this.adminAuthRepository.revokeRefreshSession(tokenId);
			const revokedAt = new Date();

			return revokedAt;
		} catch (error) {
			throw new Error(`refreshAccessToken: ${error}`);
		}
	}

	async LogoutAdminSessions(refreshToken: string): Promise<Date> {
		try {
			const decoded = jwt.decode(refreshToken) as RefreshTokenPayload;
			if (!decoded || decoded.type !== "refresh") {
				throw new Error("Invalid refresh token payload");
			}
			if (!decoded.sub) throw new Error("Refresh token missing adminID");
			const adminId = decoded.sub;

			jwt.verify(refreshToken, env.refreshJwtSecret);

			// Revoke all the refresh session in the database
			await this.adminAuthRepository.deleteAllUserSessions(adminId);
			const revokedAt = new Date();

			return revokedAt;
		} catch (error) {
			throw new Error(`refreshAccessToken: ${error}`);
		}
	}

	async refreshAccessToken(
		refreshToken: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		try {
			const decoded = jwt.decode(refreshToken) as RefreshTokenPayload;
			if (!decoded || decoded.type !== "refresh") {
				throw new Error("Invalid refresh token payload");
			}
			if (!decoded.jti) throw new Error("Refresh token missing ID");
			if (!decoded.sub) throw new Error("User ID missing in token");

			const tokenId = decoded.jti;
			const adminId = decoded.sub;
			const adminEmail = decoded.email;

			// Retrieve the refresh session from the database
			const session = await this.adminAuthRepository.getRefreshSession(tokenId);

			// validate session
			if (!session) {
				throw new Error("Refresh session expired or not found");
			}

			if (session.revoked_at) {
				throw new Error("Refresh token has been revoked");
			}

			if (new Date(session.expires_at) < new Date()) {
				throw new Error("Token expired");
			}

			if (this.hashToken(refreshToken) !== session.token_hash) {
				throw new Error("Token hash mismatch");
			}

			// generate new access and refresh tokens
			const newTokenId = randomUUID();
			const accessToken = this.generateAccessToken(
				adminId,
				"ADMIN",
				adminEmail
			);
			const newRefreshToken = this.generateRefreshToken(
				newTokenId,
				adminId,
				"ADMIN",
				adminEmail
			);

			// store new refresh token in DB
			const hashedToken = this.hashToken(newRefreshToken);
			const newSession: REFRESHSESSION = {
				id: newTokenId,
				user_id: adminId,
				user_type: "ADMIN",
				token_hash: hashedToken,
				expires_at: new Date(
					Date.now() + 30 * 24 * 60 * 60 * 1000
				).toISOString(), // 30 days from now
			};
			await this.adminAuthRepository.addRefreshSession(newSession);

			// revoke old refresh token
			await this.adminAuthRepository.revokeRefreshSession(tokenId);

			return { accessToken, refreshToken: newRefreshToken };
		} catch (error) {
			throw new Error(`refreshAccessToken: ${error}`);
		}
	}

	generateAccessToken(
		sub: string,
		role: "ADMIN" | "PLAYER",
		email: string,
		expiresIn?: number
	): string {
		const accessToken = jwt.sign(
			{
				sub: sub,
				role: role,
				email: email,
			},
			env.accessJwtSecret,
			{ expiresIn: expiresIn ?? 300 }
		);
		return accessToken;
	}

	generateRefreshToken(
		jti: string,
		sub: string,
		role: "ADMIN" | "PLAYER",
		email: string,
		expiresIn?: any
	): string {
		const refreshToken = jwt.sign(
			{
				sub: sub,
				role: role,
				email: email,
				type: "refresh",
			},
			env.refreshJwtSecret,
			{
				jwtid: jti,
				expiresIn: expiresIn ?? "30d",
			}
		);
		return refreshToken;
	}
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	admin: ADMIN;
}

export interface RefreshTokenPayload extends jwt.JwtPayload {
	type: "refresh";
	role: "ADMIN" | "PLAYER";
	email: string;
}
