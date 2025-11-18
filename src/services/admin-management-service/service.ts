import { ADMIN } from "@/types/database/models";
import { AdminRepository } from "./repository";

export class AdminManagementService {
	private adminRepository = new AdminRepository();

	async createAdminUser(admin: ADMIN) {
		// check for existing admin with email
		const existingAdminWithSameEmail =
			await this.adminRepository.getAdminByEmail(admin.email);
		if (existingAdminWithSameEmail != null) {
			throw Error(`Admin with email: ${admin.email} already exists`);
		}

		// check for existing admin with username
		const existingAdminWithSameUsername =
			await this.adminRepository.getAdminByUsername(admin.username);
		if (existingAdminWithSameUsername != null) {
			throw Error(`Admin with username: ${admin.username} already exists`);
		}

		await this.adminRepository.createAdmin(admin);
	}
}
