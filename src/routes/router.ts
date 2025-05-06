import {
	addBulkPlayers,
	addPlayer,
	deletePlayer,
	editPlayerInfo,
	getAllPlayers,
} from "@/controllers/playerController";
import {
	addTournament,
	getAllTournaments,
	getLichessArenaTournament,
	syncTournament,
} from "@/controllers/tournamentController";
import { Router } from "express";

const router = Router();

// player routes
router.route("/players").get(getAllPlayers);
router.route("/players/:id").delete(deletePlayer);
router.route("/players/").post(addPlayer);
router.route("/players/:id").put(editPlayerInfo);
router.route("/players/populate").post(addBulkPlayers);

// tournament routes
router.route("/tournaments").get(getAllTournaments);
router.route("/tournaments").post(addTournament);
router.route("/sync-tournament/:id").patch(syncTournament);
router.route("/lichess-tournament/:id").get(getLichessArenaTournament);

export default router;
