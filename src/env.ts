import dotenv from "dotenv";
dotenv.config();

const env = {
	port: Number(process.env.PORT) || 5006,
	environment: String(process.env.NODE_ENV) || "development",
	accessJwtSecret: String(process.env.ACCESS_JWTSECRET),
	refreshJwtSecret: String(process.env.REFRESH_JWTSECRET),
	db: {
		host: String(process.env.DB_HOST) || "localhost",
		port: Number(process.env.DB_PORT) || 5432,
		user: String(process.env.DB_USER) || "postgres",
		password: String(process.env.DB_PASSWORD) || "password",
		database: String(process.env.DB_NAME) || "database",
	},
};

export default env;
