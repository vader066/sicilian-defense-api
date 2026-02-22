import { PLAYER } from "@/types/database/models";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CsvValidationError {
	type: "header" | "row";
	message: string;
	row?: number;
	field?: string;
}

export interface CsvValidationResult {
	valid: boolean;
	errors: CsvValidationError[];
	players: Omit<PLAYER, "club_id" | "id">[];
}

// ---------------------------------------------------------------------------
// Constants – single source of truth for expected CSV shape
// ---------------------------------------------------------------------------

/** All PLAYER fields that must be present as CSV headers (club_id is excluded
 *  because it is derived from the authenticated admin's club). */
export const EXPECTED_CSV_HEADERS: ReadonlyArray<
	keyof Omit<PLAYER, "club_id" | "id" | "created_at" | "updated_at">
> = [
	"first_name",
	"last_name",
	"programme",
	"username",
	"rating",
	"date_of_birth",
	"sex",
];

const VALID_SEX_VALUES = new Set<string>(["MALE", "FEMALE"]);

/** DD/MM/YYYY where DD 01-31, MM 01-12, YYYY 4-digit year */
const DOB_REGEX = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

/**
 * Converts a validated DD/MM/YYYY string to YYYY-MM-DD (ISO 8601).
 */
function dobToISO(dob: string): string {
	const [dd, mm, yyyy] = dob.split("/");
	return `${yyyy}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Header validations  (run once, before any row is touched)
// ---------------------------------------------------------------------------

function validateHeaders(headers: string[]): CsvValidationError[] {
	const errors: CsvValidationError[] = [];
	const headerSet = new Set(headers);

	for (const expected of EXPECTED_CSV_HEADERS) {
		if (!headerSet.has(expected)) {
			errors.push({
				type: "header",
				message: `Missing required CSV header: "${expected}"`,
				field: expected,
			});
		}
	}

	return errors;
}

// ---------------------------------------------------------------------------
// Row validations  (run per-row only when headers are valid)
// ---------------------------------------------------------------------------

function validateRow(
	row: Record<string, string>,
	rowIndex: number,
): CsvValidationError[] {
	const errors: CsvValidationError[] = [];
	const rowNum = rowIndex + 1; // 1-based display number

	// 1. Presence check – every required header must have a non-empty value
	for (const field of EXPECTED_CSV_HEADERS) {
		const value = row[field];
		if (value === undefined || value.trim() === "") {
			errors.push({
				type: "row",
				message: `Row ${rowNum}: missing value for required field "${field}"`,
				row: rowNum,
				field,
			});
		}
	}

	// 2. Type / format checks (only when the value is present)
	const ratingRaw = row["rating"]?.trim();
	if (ratingRaw && isNaN(Number(ratingRaw))) {
		errors.push({
			type: "row",
			message: `Row ${rowNum}: "rating" must be a number, got "${ratingRaw}"`,
			row: rowNum,
			field: "rating",
		});
	}

	const sexRaw = row["sex"]?.trim().toUpperCase();
	if (sexRaw && !VALID_SEX_VALUES.has(sexRaw)) {
		errors.push({
			type: "row",
			message: `Row ${rowNum}: "sex" must be "MALE" or "FEMALE", got "${row["sex"]}"`,
			row: rowNum,
			field: "sex",
		});
	}

	const dobRaw = row["date_of_birth"]?.trim();
	if (dobRaw && !DOB_REGEX.test(dobRaw)) {
		errors.push({
			type: "row",
			message: `Row ${rowNum}: "date_of_birth" must be in DD/MM/YYYY format, got "${dobRaw}"`,
			row: rowNum,
			field: "date_of_birth",
		});
	}

	return errors;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validates the headers and every data row of a parsed CSV.
 *
 * Header validations run first. Row validations are skipped entirely when
 * header errors are found to avoid misleading follow-up errors.
 *
 * To add more validations:
 *  - Header-level → add to `validateHeaders()`
 *  - Row-level     → add to `validateRow()`
 */
export function validateCsv(
	headers: string[],
	rows: Record<string, string>[],
): CsvValidationResult {
	const errors: CsvValidationError[] = [];

	// --- header validations ---
	const headerErrors = validateHeaders(headers);
	if (headerErrors.length > 0) {
		return { valid: false, errors: headerErrors, players: [] };
	}

	// --- row validations ---
	const players: Omit<PLAYER, "club_id" | "id">[] = [];

	for (let i = 0; i < rows.length; i++) {
		const rowErrors = validateRow(rows[i], i);
		errors.push(...rowErrors);

		if (rowErrors.length === 0) {
			const r = rows[i];
			players.push({
				first_name: r["first_name"].trim(),
				last_name: r["last_name"].trim(),
				programme: r["programme"].trim(),
				username: r["username"].trim(),
				rating: Number(r["rating"].trim()),
				// Convert DD/MM/YY → YYYY-MM-DD so Postgres always gets an
				// unambiguous ISO date regardless of the server's datestyle.
				date_of_birth: dobToISO(r["date_of_birth"].trim()),
				sex: r["sex"].trim().toUpperCase() as "MALE" | "FEMALE",
			});
		}
	}

	return { valid: errors.length === 0, errors, players };
}
