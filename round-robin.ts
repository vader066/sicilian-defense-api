type Player = { playerID: string };

type Game = {
	white?: string;
	black?: string;
	bye?: string;
};

type Round = {
	round: number;
	games: Game[];
};

export function generateFullRoundRobinSchedule(players: Player[]): Round[] {
	const playerIds = players.map((p) => p.playerID);

	const isOdd = playerIds.length % 2 !== 0;

	// If odd, add a dummy player for byes
	if (isOdd) {
		playerIds.push("BYE");
	}

	const n = playerIds.length;
	const rounds = n - 1;
	const half = n / 2;

	const schedule: Round[] = [];

	// Copy array so we can rotate safely
	let rotation = [...playerIds];

	for (let round = 1; round <= rounds; round++) {
		const games: Game[] = [];

		for (let i = 0; i < half; i++) {
			const p1 = rotation[i];
			const p2 = rotation[n - 1 - i];

			if (p1 === "BYE") {
				games.push({ bye: p2 });
			} else if (p2 === "BYE") {
				games.push({ bye: p1 });
			} else {
				// Alternate colors by round for fairness
				if (round % 2 === 0) {
					games.push({ white: p2, black: p1 });
				} else {
					games.push({ white: p1, black: p2 });
				}
			}
		}

		schedule.push({ round, games });

		// Rotate players (keep first fixed)
		rotation = [rotation[0], rotation[n - 1], ...rotation.slice(1, n - 1)];
	}

	return schedule;
}

// Example usage:
const players: Player[] = [
	{ playerID: "Alice" },
	{ playerID: "Bob" },
	{ playerID: "Charlie" },
	{ playerID: "Diana" },
	{ playerID: "Eve" },
	{ playerID: "Frank" },
	{ playerID: "Grace" },
];

const schedule = generateFullRoundRobinSchedule(players);
console.log(JSON.stringify(schedule, null, 2));
