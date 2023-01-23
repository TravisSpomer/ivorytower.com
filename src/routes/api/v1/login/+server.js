import { json } from "@sveltejs/kit"

export async function POST()
{
	return json({
		result: 1,
		username: "tspomer",
		token: "FakeAutoLoginToken123",
		acceptedTerms: true,
		users:
		[
			{ username: "tspomer", fullName: "Travis Spomer", shortName: "Travis", role: 1 },
			{ username: "bkell", fullName: "Brian Kell", shortName: "Brian", role: 0 },
			{ username: "clampwick", fullName: "Chester Lampwick", shortName: "Chester", role: 0 },
			{ username: "lbrown", fullName: "Laura Brown", shortName: "Laura", role: 0 },
			{ username: "ldemaris", fullName: "Lincoln DeMaris", shortName: "Lincoln", role: 0 },
		],
		unreadThreads:
		[
			{
				id: 1,
				title: "Game of Thrones chat",
				modified: "2021-06-05T15:15:00Z",
				unread: 1,
			},
			{
				id: 2,
				title: "A brand new thread",
				modified: "2022-05-20T19:11:00Z",
				unread: 1,
			},
		],
	})
}
