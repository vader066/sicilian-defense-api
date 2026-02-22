import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
			cb(null, true);
		} else {
			cb(new Error("Only CSV files are allowed"));
		}
	},
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
