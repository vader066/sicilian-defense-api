import { pool } from "@/db/db";
import { ADMIN } from "@/types/database/models";

export class AdminRepository {
	async createAdmin(admin: ADMIN) {
		try {
			const query = `
       INSERT INTO admin 
       (
         id, 
         first_name, 
         last_name, 
         club_id, 
         admin_name, 
         email, 
         username, 
         creator, 
         created_at, 
         updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW());
     `;
			await pool.query(query, [
				admin.id,
				admin.first_name,
				admin.last_name,
				admin.club_id,
				"",
				admin.email,
				admin.username,
				admin.creator,
			]);
		} catch (error: any) {
			throw new Error(`createAdmin: ${error.message}`);
		}
	}

	async getAdminById(id: string): Promise<ADMIN> {
		try {
			const result = await pool.query<ADMIN>(
				"SELECT * FROM admin WHERE id = $1",
				[id]
			);
			const admin = result.rows[0];
			if (!admin) throw new Error("Admin user not found");
			return admin;
		} catch (error: any) {
			throw new Error(`getAdminById: ${error.message}`);
		}
	}

	async getAdminByUsername(username: string): Promise<ADMIN | null> {
		const result = await pool.query<ADMIN>(
			"SELECT * FROM admin WHERE username = $1",
			[username]
		);
		const admin = result.rows[0];
		if (!admin) return null;

		return admin;
	}

	async getAdminByEmail(email: string): Promise<ADMIN | null> {
		const result = await pool.query<ADMIN>(
			"SELECT * FROM admin WHERE email = $1",
			[email]
		);
		const admin = result.rows[0];
		if (!admin) return null;

		return admin;
	}
}
