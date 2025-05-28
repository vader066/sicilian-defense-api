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
	rating: number;
	club: string;
	sex: sex;
	dob: Date;
	username: string;
	programme: string;
	first_name: string;
	last_name: string;
}

type sex = "male" | "female" | undefined;

export interface APPWRITE_TOURNAMENT {
	total: number;
	documents: TOURNAMENT[];
}
export interface APPWRITE_PLAYERS {
	total: number;
	documents: PLAYER[];
}
