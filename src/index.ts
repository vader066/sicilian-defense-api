import express, { Request, Response } from "express";
import env from "./env";

const port = env.port;
const app = express();

app.get("/", (req: Request, res: Response) => {
	res.send("Hello Worldsss!");
});

app.listen(5001, () => {
	console.log(`Server is running on port ${port}`);
	// eslint-disable-next-line no-console
	console.log(`http://localhost:${port}`);
});
