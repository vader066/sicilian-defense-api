import { AdminAuthHandler } from "@/services/admin-auth-service/handler";
import { ClubServiceHandler } from "@/services/club-service/handler";
import { PlayerServiceHandler } from "@/services/player-service/handler";
import { TournamentServiceHandler } from "@/services/tournament-service/handler";
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
const clubHandler = new ClubServiceHandler();
const playerHandler = new PlayerServiceHandler();
const adminAuthHandler = new AdminAuthHandler();
const tourneyHandler = new TournamentServiceHandler();

// player routes
router.route("/club/:clubId/players").get(playerHandler.getClubPlayersHandler);
router.route("/players/:playerId").get(playerHandler.getPlayerHandler);
router.route("/players").post(playerHandler.createPlayerHandler);
router.route("/players/:playerId").put(playerHandler.updatePlayerHandler);
router.route("/players/populate").post(playerHandler.createPlayersHandler);
// router.route("/players/:id").delete(deletePlayer); If we delete a player what happens to the games he has played? what happens to the tournaments and the ratings?

// admin routes
// - public
router.route("/admin/sign-up").post(clubHandler.createClubAccount);
router.route("/admin/login").post(adminAuthHandler.Login);
router.route("/admin/logout").post(adminAuthHandler.Logout);
router.route("/admin/logout/all").post(adminAuthHandler.LogoutAllSessions);
router.route("/admin/refresh").post(adminAuthHandler.Refresh);

// tournament routes
router
	.route("/tournaments/:tourneyId")
	.get(tourneyHandler.getTournamentWithGamesHandler);
router.route("/tournaments").post(tourneyHandler.addTournamentWithGamesHandler);
router.route("/tournaments").get(tourneyHandler.listTournamentsHandler);
router
	.route("/tournaments/:tournamentId/sync")
	.patch(tourneyHandler.syncTournamentHandler);
router
	.route("/tournaments/:tournamentId/pairings")
	.get(tourneyHandler.getTournamentPairingsHandler);
router
	.route("/tournaments/lichess/arena/:id")
	.get(tourneyHandler.getLichessArenaTournamentHandler);
router
	.route("/tournaments/round-robin/create")
	.post(tourneyHandler.createRoundRobinTournamentHandler);

export default router;
