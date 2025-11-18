import { AdminManagementService } from "@/services/admin-management-service/service";

export class AdminClient {
	private static adminService = new AdminManagementService();
	static createAdminUser = this.adminService.createAdminUser.bind(
		this.adminService
	);
}
