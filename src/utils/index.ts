export function toHyphenatedId(str: string) {
	return str.trim().toLowerCase().replace(/\s+/g, "-");
}

export function fromHyphenatedId(str: string) {
	return str
		.split("-") // split by hyphen
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
		.join(" "); // rejoin with spaces
}
