import { json } from "@sveltejs/kit"

export async function GET()
{
	return json({
		"forum":
		{
			forums: [
				{
					id: 1,
					title: "General discussion",
					description: "This is where the magic happens",
				},
			],
		}
	})
}
