declare namespace NodeJS {
	interface ProcessEnv {
		PORT?: string;
		NODE_ENV?: "development" | "production" | "test";
		PUBLIC_APPWRITE_HOST_URL: string;
		PUBLIC_APPWRITE_PROJECT_ID: string;
		APPWRITE_API_KEY: string;
	}
}
