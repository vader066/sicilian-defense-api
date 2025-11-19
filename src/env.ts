import dotenv from "dotenv";
dotenv.config();

const env = {
	appwrite: {
		endpoint: String(process.env.PUBLIC_APPWRITE_HOST_URL),
		projectId: String(process.env.PUBLIC_APPWRITE_PROJECT_ID),
		apikey: String(process.env.APPWRITE_API_KEY),
	},
	port: Number(process.env.PORT) || 5006,
	environment: String(process.env.NODE_ENV) || "development",
	accessJwtSecret: String(process.env.ACCESS_JWTSECRET),
	refreshJwtSecret: String(process.env.REFRESH_JWTSECRET),
};

export default env;
