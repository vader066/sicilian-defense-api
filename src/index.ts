import "module-alias/register";
import express, { Request, Response } from "express";
import cors from "cors";
import env from "./env";
import router from "./routes/router";

const port = env.port;
const app = express();

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
