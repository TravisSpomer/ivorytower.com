import { json } from "@sveltejs/kit"

export async function GET()
{
	return json({
		"users":
		[
			{ username: "tspomer", fullName: "Travis Spomer", shortName: "Travis", role: 1 },
			{ username: "bkell", fullName: "Brian Kell", shortName: "Brian", role: 0 },
			{ username: "clampwick", fullName: "Chester Lampwick", shortName: "Chester", role: 0 },
			{ username: "lbrown", fullName: "Laura Brown", shortName: "Laura", role: 0 },
			{ username: "ldemaris", fullName: "Lincoln DeMaris", shortName: "Lincoln", role: 0 },
		]
	})
}
