import {
	addPlayer,
	deletePlayer,
	getAllPlayers,
} from "@/controllers/playerController";
import { Router } from "express";

const router = Router();

router.route("/players").get(getAllPlayers);
router.route("/players/:id").delete(deletePlayer);
router.route("/players/").post(addPlayer);
router.route("/delete-player/:id").delete(deletePlayer);

router.route("/my-players").get((req, res) => {
	res.status(200).json({ message: "Players added!" });
});
router.route("/add-players").get((req, res) => {
	res.status(200).json({ message: "Players added!" });
});

export default router;
