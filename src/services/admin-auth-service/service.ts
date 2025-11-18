import { ADMINAUTH } from "@/types/database/models";
import { AdminAuthRepository } from "./repository";

export class AdminAuthService {
	private adminAuthRepository = new AdminAuthRepository();

	async createAdminAuth(adminAuth: ADMINAUTH) {
		await this.adminAuthRepository.createAdminAuth(adminAuth);
	}
}
