import { AdminAuthHandler } from "@/services/admin-auth-service/handler";
import { ClubServiceHandler } from "@/services/club-service/handler";
import { PlayerServiceHandler } from "@/services/player-service/handler";
import { Router } from "express";

const router = Router();

// Check if the server is running
router.route("/health").get((_, res) => {
	res.status(200).json({
		message: "Server is running",
		status: 200,
	});
});

// initialize handlers
const clubServiceHandler = new ClubServiceHandler();
const playerServiceHandler = new PlayerServiceHandler();
const adminAuthHandler = new AdminAuthHandler();

// player routes
router
	.route("/club/:clubId/players")
	.get(playerServiceHandler.getClubPlayersHandler);
router.route("/players/:playerId").get(playerServiceHandler.getPlayerHandler);
// router.route("/players/:id").delete(deletePlayer); If we delete a player what happens to the games he has played? what happens to the tournaments and the ratings?
// router.route("/players/").post(addPlayer);
// router.route("/players/:id").put(editPlayerInfo);
// router.route("/players/populate").post(addBulkPlayers);

// admin routes
// - public
router.route("/admin/sign-up").post(clubServiceHandler.createClubAccount);
router.route("/admin/login").post(adminAuthHandler.Login);

// tournament routes
// router.route("/tournaments").get(getAllTournaments);
// router.route("/tournaments").post(addTournament);
// router.route("/sync-tournament/:id").patch(syncTournament);
// router.route("/lichess-tournament/:id").get(getLichessArenaTournament);

export default router;
