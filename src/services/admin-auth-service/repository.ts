import { pool } from "@/db/db";
import { ADMINAUTH, REFRESHSESSION } from "@/types/database/models";

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

	async addRefreshSession(session: REFRESHSESSION): Promise<REFRESHSESSION> {
		try {
			const query = `
        INSERT INTO refresh_sessions (id, user_id, user_type, token_hash, expires_at, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *; 
      `;
			const result = await pool.query<REFRESHSESSION>(query, [
				session.id,
				session.user_id,
				session.user_type,
				session.token_hash,
				session.expires_at,
			]);
			return result.rows[0];
		} catch (error: any) {
			throw new Error(`addRefreshSession: ${error.message}`);
		}
	}

	async getRefreshSession(tokenId: string): Promise<REFRESHSESSION | null> {
		try {
			const query = `
        SELECT * FROM refresh_sessions WHERE id = $1;
      `;
			const result = await pool.query<REFRESHSESSION>(query, [tokenId]);
			if (result.rows.length === 0) {
				return null;
			}
			return result.rows[0];
		} catch (error: any) {
			throw new Error(`getRefreshSession: ${error.message}`);
		}
	}

	async deleteRefreshSession(tokenId: string): Promise<void> {
		try {
			const query = `
      DELETE FROM refresh_sessions WHERE id = $1;
    `;
			await pool.query(query, [tokenId]);
		} catch (error: any) {
			throw new Error(`deleteRefreshSession: ${error.message}`);
		}
	}
}
