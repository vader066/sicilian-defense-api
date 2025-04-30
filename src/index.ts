import express, { Request, Response } from "express";

const app = express();

const port = 5001;

app.get("/", (req: Request, res: Response) => {
	res.send("Hello Worldsss!");
});

app.listen(5001, () => {
	console.log(`Server is running on port ${port}`);
	// eslint-disable-next-line no-console
	console.log(`http://localhost:${port}`);
});
