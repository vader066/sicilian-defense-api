import { ADMIN, ADMINAUTH, CLUB } from "@/types/database/models";
import { ClubRepository } from "./repository";
import { randomUUID } from "node:crypto";
import { CREATEACCOUNTREQ } from "@/types/club";
import { AdminAuthService } from "../admin-auth-service/service";
import { AdminManagementService } from "../admin-management-service/service";
import { PlayerService } from "../player-service/player-service";

interface CREATEACCOUNTRES extends ADMIN, CLUB {}

export class ClubService {
	private clubRepository = new ClubRepository();

	private adminAuthClient = new AdminAuthService();
	private adminClient = new AdminManagementService();
	// private playerClient = new PlayerService();

	async createAccount(req: CREATEACCOUNTREQ): Promise<CREATEACCOUNTRES> {
		// create club
		const clubID = randomUUID();
		const club: CLUB = {
			id: clubID,
			club_name: req.club_name,
			number_of_players: req.creator_is_player ? 1 : 0,
		};
		await this.clubRepository.createClub(club);

		// create admin account
		const adminId = randomUUID();
		const admin: ADMIN = {
			id: adminId,
			first_name: req.first_name,
			last_name: req.last_name,
			email: req.email,
			username: req.username,
			club_id: clubID,
			creator: true,
		};
		await this.adminClient.createAdminUser(admin);

		// create admin auth
		const hashedPassword = await this.adminAuthClient.hashPassword(
			req.password
		);
		const adminAuth: ADMINAUTH = {
			admin_id: admin.id,
			password_hash: hashedPassword,
		};
		await this.adminAuthClient.createAdminAuth(adminAuth);

		// create player if creator is also a player
		// if (req.creator_is_player) {
		// 	await this.playerClient.CreatePlayer({
		// 		club_id: clubID,
		// 		first_name: req.first_name,
		// 		last_name: req.last_name,
		// 		id: adminId, // use the same id as admin
		// 		programme: "General",
		// 		username: req.username,
		// 		rating: 1400,
		// 		date_of_birth: "2000-01-01",
		// 		sex: "FEMALE",
		// 	});
		// }

		// response
		return {
			...admin,
			...club,
		};
	}

	async getClubByID(id: string): Promise<CLUB | null> {
		if (id === "") {
			throw new Error("Club ID must be provided");
		}
		const club = await this.clubRepository.getClubById(id);
		return club;
	}
}
