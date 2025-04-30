import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const port = process.env.PORT || 5006;

app.get("/", (req: Request, res: Response) => {
	res.send("Hello Worldsss!");
});

app.listen(5001, () => {
	console.log(`Server is running on port ${port}`);
	// eslint-disable-next-line no-console
	console.log(`http://localhost:${port}`);
});
