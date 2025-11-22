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

export interface GAMES {
	gameId: string;
	black: string;
	white: string;
	winner?: string;
	blackRating?: number; //Black Players Rating going into the game
	whiteRating?: number; //White Players Rating going into the game
	date: Date;
	tournaments?: string;
	draw?: boolean;
	forfeit?: "BF" | "WF" | "FF"; // Black Forfeit, White Forfeit, Full(Both players) Forfeit
}

export interface TOURNAMENT {
	docId?: string; // Hyphenated tournament ID value
	tournamentId: string;
	games: Array<GAMES>;
	players: Array<string>;
	synced?: boolean;
	club?: string;
}

export type ratingUpdate = {
	username: string;
	newRating: number;
};

export interface PLAYER {
	id: string;
	club_id: string;
	first_name: string;
	last_name: string;
	programme: string;
	username: string;
	date_of_birth: string;
	sex: "MALE" | "FEMALE";
	created_at?: string;
	updated_at?: string;
}

export interface APPWRITE_TOURNAMENT {
	total: number;
	documents: TOURNAMENT[];
}
export interface APPWRITE_PLAYERS {
	total: number;
	documents: PLAYER[];
}
