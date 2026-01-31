import "module-alias/register";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./env";
import router from "./routes/router";

const port = env.port;
const app = express();

let allowedOrigin: string;
if (env.environment === "production") {
	allowedOrigin = "https://sicilian-defense-ui-app.onrender.com";
} else {
	allowedOrigin = "http://localhost:3000";
}
app.use(
	cors({
		origin: allowedOrigin,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port ${port}`);
	// eslint-disable-next-line no-console
	console.log(`http://localhost:${port}`);
});
