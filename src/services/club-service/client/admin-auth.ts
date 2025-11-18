import { AdminAuthService } from "@/services/admin-auth-service/service";

export class AdminAuthClient {
	private static adminAuthService = new AdminAuthService();
	static createAdminAuth = this.adminAuthService.createAdminAuth.bind(
		this.adminAuthService
	);
}
