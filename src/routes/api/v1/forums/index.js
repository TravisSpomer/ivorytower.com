export async function GET()
{
	return {
		body:
	
		{
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
		}

	}
}
