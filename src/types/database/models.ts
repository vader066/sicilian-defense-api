export interface CLUB {
	name: string;
	email: string;
	players: Array<PLAYER>;
	tournaments: Array<TOURNAMENT>;
}

export interface GAMES {
	gameId: string;
	black: string;
	white: string;
	winner: string;
	blackRating?: number;
	whiteRating?: number;
	date: Date;
	tournaments?: string;
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
  id: string;                 // UUID
  club_id: string;            // UUID
  first_name: string;
  last_name: string;
  programme: string;
  username: string;
  date_of_birth: string;      // DATE in Postgres maps to string in JS/TS
  sex: 'MALE' | 'FEMALE';     // Enum
  created_at: string;         // TIMESTAMP maps to string
  updated_at: string;         // TIMESTAMP maps to string
};

export interface APPWRITE_TOURNAMENT {
	total: number;
	documents: TOURNAMENT[];
}
export interface APPWRITE_PLAYERS {
	total: number;
	documents: PLAYER[];
}
