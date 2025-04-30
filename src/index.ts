import "module-alias/register";
import express, { Request, Response } from "express";
import env from "./env";
import router from "./routes/router";

const port = env.port;
const app = express();

app.use("/api", router);

app.listen(5001, () => {
	console.log(`Server is running on port ${port}`);
	// eslint-disable-next-line no-console
	console.log(`http://localhost:${port}`);
});
