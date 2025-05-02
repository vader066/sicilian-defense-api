// for parsing lichess's api ndjson response

export async function ParseNDjson<T>(response: Response) {
	// Check content type
	const contentType = response.headers.get("Content-Type");
	if (contentType && contentType.includes("application/x-ndjson")) {
		const text = await response.text();

		// Split the response text by newline
		const lines = text.split("\n");

		// Parse each line as JSON
		const data: Array<T> = lines
			.map((line) => {
				if (line.trim()) {
					// Check if the line is not empty
					try {
						return JSON.parse(line);
					} catch (error) {
						console.error("JSON Parsing Error:", error);
						return null; // or handle errors as needed
					}
				}
				return null; // or handle empty lines as needed
			})
			.filter((item) => item !== null); // Filter out any null values
		return data;
	} else {
		console.error("Unexpected content type:", contentType);
	}
}
