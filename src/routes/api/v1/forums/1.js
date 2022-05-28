export async function get()
{
	return {
		body:

		{
			"forum":
			{
				id: 1,
				title: "General discussion",
				description: "This is where the magic happens",
				canPost: true,
				threads: [
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
			}
		}

	}
}
