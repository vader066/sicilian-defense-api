import { pool } from "@/db/db";
import { ADMINAUTH } from "@/types/database/models";

export class AdminAuthRepository {
	async createAdminAuth(adminAuth: ADMINAUTH) {
		try {
			const query = `
       INSERT INTO admin_auth (admin_id, password_hash)
       VALUES ($1, $2);
     `;
			await pool.query(query, [adminAuth.admin_id, adminAuth.password_hash]);
		} catch (error: any) {
			throw new Error(`createAdminAuth: ${error.message}`);
		}
	}
}
