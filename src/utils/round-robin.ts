export type Pair = {
	white?: string;
	black?: string;
	bye?: string;
};

export type Round = {
	round: number;
	pairings: Pair[];
};

export function generateFullRoundRobinSchedule(playerIDs: string[]): Round[] {
	const isOdd = playerIDs.length % 2 !== 0;

	// If odd, add a dummy player for byes
	if (isOdd) {
		playerIDs.push("BYE");
	}

	const n = playerIDs.length;
	const rounds = n - 1;
	const half = n / 2;

	const schedule: Round[] = [];

	// Copy array so we can rotate safely
	let rotation = [...playerIDs];

	for (let round = 1; round <= rounds; round++) {
		const pairings: Pair[] = [];

		for (let i = 0; i < half; i++) {
			const p1 = rotation[i];
			const p2 = rotation[n - 1 - i];

			if (p1 === "BYE") {
				pairings.push({ bye: p2 });
			} else if (p2 === "BYE") {
				pairings.push({ bye: p1 });
			} else {
				// Alternate colors by round for fairness
				if (round % 2 === 0) {
					pairings.push({ white: p2, black: p1 });
				} else {
					pairings.push({ white: p1, black: p2 });
				}
			}
		}

		schedule.push({ round, pairings });

		// Rotate players (keep first fixed)
		rotation = [rotation[0], rotation[n - 1], ...rotation.slice(1, n - 1)];
	}

	return schedule;
}

// Example usage:
// const playerIDs: string[] = [
// 	"Alice",
// 	"Bob",
// 	"Charlie",
// 	"Diana",
// 	"Eve",
// 	"Frank",
// 	"Grace",
// ];

// const schedule = generateFullRoundRobinSchedule(playerIDs);
// console.log(JSON.stringify(schedule, null, 2));
