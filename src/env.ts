import dotenv from "dotenv";
import { parse } from "pg-connection-string";

// use host from the DATABASE_URL for hosting service and DB_HOST for local development and testing
const config = parse(String(process.env.DATABASE_URL)!);
let host: string;
if (process.env.NODE_ENV === "development") {
	host = String(process.env.DB_HOST);
} else {
	host = String(config.host);
}

dotenv.config();

const env = {
	port: Number(process.env.PORT) || 5006,
	environment: String(process.env.NODE_ENV) || "development",
	accessJwtSecret: String(process.env.ACCESS_JWTSECRET),
	refreshJwtSecret: String(process.env.REFRESH_JWTSECRET),
	db: {
		host: host,
		port: Number(process.env.DB_PORT) || 5432,
		user: String(process.env.DB_USER) || "postgres",
		password: String(process.env.DB_PASSWORD) || "password",
		database: String(process.env.DB_NAME) || "database",
	},
};

export default env;
