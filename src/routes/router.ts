import { getAllPlayers } from "@/controllers/playerController";
import { Router } from "express";

const router = Router();

router.route("/players").get(getAllPlayers);
router.route("/my-players").get((req, res) => {
	res.status(200).json({ message: "Players added!" });
});
router.route("/add-players").get((req, res) => {
	res.status(200).json({ message: "Players added!" });
});

export default router;
