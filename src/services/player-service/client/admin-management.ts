import { AdminManagementService } from "@/services/admin-management-service/service";

export class AdminClient {
	private static adminService = new AdminManagementService();
	static getAdminByID = this.adminService.getAdminByID.bind(this.adminService);
}
