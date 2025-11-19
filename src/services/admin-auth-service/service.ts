import { ADMIN, ADMINAUTH } from "@/types/database/models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminAuthRepository } from "./repository";
import { AdminClient } from "./client/admin-management";
import { randomUUID } from "crypto";
import env from "@/env";

export interface RefreshToken extends jwt.JwtPayload {}

export class AdminAuthService {
	private adminAuthRepository = new AdminAuthRepository();

	async hashPassword(password: string): Promise<string> {
		const saltRounds = 12;
		const hashed = await bcrypt.hash(password, saltRounds);
		return hashed;
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
		const admin = await AdminClient.getAdminByEmail(email);

		// verify credentials
		const isValid = await this.verifyAdminCredentials(admin.id, password);
		if (!isValid) {
			throw new Error("Invalid credentials");
		}
		const accessToken = jwt.sign(
			{
				sub: admin.id,
				role: "admin",
				email: admin.email,
			},
			env.accessJwtSecret,
			{ expiresIn: 300 }
		);
		const jti = randomUUID();
		const refreshToken = jwt.sign(
			{
				sub: admin.id,
				role: "admin",
				email: admin.email,
			},
			env.refreshJwtSecret,
			{
				jwtid: jti,
				expiresIn: "30d",
			}
		);

		// store refresh token in DB or cache (not implemented here)
		return { accessToken, refreshToken, admin };
	}
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	admin: ADMIN;
}
