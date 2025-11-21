import { ClubService } from "@/services/club-service/service";

export class ClubClient {
	private static clubService = new ClubService();
	static getClubByID = this.clubService.getClubByID.bind(this.clubService);
}
