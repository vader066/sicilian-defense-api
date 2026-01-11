import { ADMIN } from "@/types/database/models";
import { AdminRepository } from "./repository";

export class AdminManagementService {
	private adminRepository = new AdminRepository();

	async getAdminByID(adminId: string): Promise<ADMIN> {
		const admin = await this.adminRepository.getAdminById(adminId);
		return admin;
	}

	async getAdminByEmail(email: string): Promise<ADMIN | null> {
		const admin = await this.adminRepository.getAdminByEmail(email);
		return admin;
	}

	async createAdminUser(admin: ADMIN) {
		// check for existing admin with email
		const existingAdminWithSameEmail =
			await this.adminRepository.getAdminByEmail(admin.email);
		if (existingAdminWithSameEmail != null) {
			let error = new Error(
				`Admin with email: ${admin.email} already exists`
			) as Error & { code: number };
			error.code = 409;
			throw error;
		}

		// check for existing admin with username
		const existingAdminWithSameUsername =
			await this.adminRepository.getAdminByUsername(admin.username);
		if (existingAdminWithSameUsername != null) {
			let error = new Error(
				`Admin with username: ${admin.username} already exists`
			) as Error & { code: number };
			error.code = 409;
			throw error;
		}

		await this.adminRepository.createAdmin(admin);
	}
}
