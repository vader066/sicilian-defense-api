import { ADMIN, ADMINAUTH, CLUB } from "@/types/database/models";
import { ClubRepository } from "./repository";
import { randomUUID } from "node:crypto";
import { CREATEACCOUNTREQ } from "@/types/club";
import { AdminClient } from "./client/admin-management";
import { AdminAuthClient } from "./client/admin-auth";

interface CREATEACCOUNTRES extends ADMIN, CLUB {}

export class ClubService {
	private clubRepository = new ClubRepository();
	private adminClient = new AdminClient();
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
		await AdminClient.createAdminUser(admin);

		// create admin auth
		const hashedPassword = req.password;
		const adminAuth: ADMINAUTH = {
			admin_id: admin.id,
			password_hash: hashedPassword,
		};
		await AdminAuthClient.createAdminAuth(adminAuth);

		// response
		return {
			...admin,
			...club,
		};
	}
}
