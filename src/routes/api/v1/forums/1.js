export async function get()
{
	return {
		body:

		{
			"forum":
			{
				id: 1,
				title: "General discussion",
				canPost: true,
				threads: [
					{
						id: 1,
						title: "Game of Thrones chat",
						modified: "2021-06-05T15:15:00Z",
						unread: 1,
					},
				],
			}
		}

	}
}