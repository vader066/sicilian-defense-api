import env from "@/env";
import { Pool } from "pg";

export const pool = new Pool({
	host: env.db.host,
	user: env.db.user,
	password: env.db.password,
	database: env.db.database,
	port: env.db.port,
	max: 20,
	ssl: { rejectUnauthorized: false },
	// idleTimeoutMillis: 30000,
	// connectionTimeoutMillis: 2000,
	// maxLifetimeSeconds: 60
});
