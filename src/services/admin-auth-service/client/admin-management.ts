import { AdminManagementService } from "@/services/admin-management-service/service";

export class AdminClient {
	private static adminService = new AdminManagementService();
	// get admin user by admin ID
	static getAdminByID = this.adminService.getAdminByID.bind(this.adminService);

	// get admin user by admin email
	static getAdminByEmail = this.adminService.getAdminByEmail.bind(
		this.adminService
	);
}
