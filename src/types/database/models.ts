export interface CLUB {
	id: string;
	club_name: string;
	number_of_players: number;
	created_at?: string;
	updated_at?: string;
}

export interface ADMIN {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	club_id: string;
	admin_name?: string;
	username: string;
	creator: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface ADMINAUTH {
	admin_id: string;
	password_hash: string;
}

export interface PLAYER {
	id: string;
	club_id: string;
	first_name: string;
	last_name: string;
	programme: string;
	username: string;
	rating: number;
	date_of_birth: string;
	sex: "MALE" | "FEMALE";
	created_at?: string;
	updated_at?: string;
}

export interface REFRESHSESSION {
	id: string;
	user_id: string;
	user_type: "ADMIN" | "PLAYER";
	token_hash: string;
	expires_at: string;
	revoked_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface GAME {
	game_id: string;
	white: string;
	black: string;
	winner?: string;
	round: number;
	black_rating?: number; // shouldn't be optional will change later
	white_rating?: number; // shouldn't be optional will change later
	played_at: string;
	tournament_id?: string;
	draw: boolean;
	forfeit?: "BF" | "WF" | "FF"; // Black Forfeit, White Forfeit, Full(Both players) Forfeit
}

export interface DBTourney {
	id: string;
	tournament_name: string;
	number_of_rounds: number;
	number_of_players: number;
	number_of_games: number;
	status: "in_progress" | "completed" | "cancelled";
	synced: boolean;
	club_id: string;
	began_at?: string;
}

export interface TOURNAMENT_PAIRINGS {
	id: string;
	tournament_id: string;
	white?: string;
	black?: string;
	bye?: string;
	round: number;
	created_at: string;
}

export interface TOURNAMENT {
	id: string;
	tournamentName: string;
	numberOfRounds: number;
	numberOfGames: number;
	status: "in_progress" | "completed" | "cancelled";
	games: Array<GAME>;
	playerIDs: Array<string>; // player id's
	dbPlayers?: Array<PLAYER>; // don't use for now
	synced?: boolean;
	clubId: string;
	beganAt: Date;
}

export type ratingUpdate = {
	username: string;
	newRating: number;
};

export interface APPWRITE_TOURNAMENT {
	total: number;
	documents: TOURNAMENT[];
}
export interface APPWRITE_PLAYERS {
	total: number;
	documents: PLAYER[];
}
