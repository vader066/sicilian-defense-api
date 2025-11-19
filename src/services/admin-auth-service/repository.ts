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

	async getAdminAuth(adminId: string): Promise<ADMINAUTH | null> {
		try {
			const query = `
        SELECT * FROM admin_auth WHERE admin_id = $1;
      `;
			const result = await pool.query<ADMINAUTH>(query, [adminId]);
			if (result.rows.length === 0) {
				return null;
			}
			return result.rows[0];
		} catch (error: any) {
			throw new Error(`getAdminAuth: ${error.message}`);
		}
	}
}
