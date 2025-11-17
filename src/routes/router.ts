import { getClubPlayersHandler, getPlayerByIdHandler, getPlayerByUsernameHandler } from "@/services/player-service/handler";
import { Router } from "express";

const router = Router();

// Check if the server is running
router.route("/health").get((_, res) => {
	res.status(200).json({
		message: "Server is running",
		status: 200,
	});
});

// player routes
// new endpoints
router.route("/club/:clubId/players").get(getClubPlayersHandler);
router.route("/players/:playerId").get(getPlayerByIdHandler);
router.route("/players/username/:username").get(getPlayerByUsernameHandler);

// router.route("/players").get(getAllPlayers);
// router.route("/players/:id").delete(deletePlayer);
// router.route("/players/").post(addPlayer);
// router.route("/players/:id").put(editPlayerInfo);
// router.route("/players/populate").post(addBulkPlayers);

// tournament routes
// router.route("/tournaments").get(getAllTournaments);
// router.route("/tournaments").post(addTournament);
// router.route("/sync-tournament/:id").patch(syncTournament);
// router.route("/lichess-tournament/:id").get(getLichessArenaTournament);

export default router;
