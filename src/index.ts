import "module-alias/register";
import express from "express";
import cors from "cors";
import env from "./env";
import router from "./routes/router";
import getOrCreateDB from "./models/server/dbSetup";

const port = env.port;
const app = express();

// Initialize the database before starting the server
(async () => {
	try {
		await getOrCreateDB();
		console.log("Database setup completed");
	} catch (error) {
		console.error("Error during database setup:", error);
		process.exit(1); // Exit the process if the database setup fails
	}
})();

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
app.use(express.json());
app.use("/api", router);

app.listen(5001, () => {
	console.log(`Server is running on port ${port}`);
	// eslint-disable-next-line no-console
	console.log(`http://localhost:${port}`);
});
