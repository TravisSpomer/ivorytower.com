export async function GET()
{
	return {
		body:
	
		{
			"post":
			{
				id: 10007,
				index: 89,
				author: "tspomer",
				posted: "2021-07-25T15:00:00Z",
				html: "<p>lol yes</p>",
				canEdit: true,
			}
		}

	}
}

export async function POST()
{
	return {
		body:
	
		{
			"post":
			{
				id: 10006,
				index: 88,
				author: "lbrown",
				posted: "2021-06-05T15:00:00Z",
				modifier: "tspomer",
				modified: "2021-06-05T15:15:00Z",
				html: "<p>Did anyone else notice Daenarys's Starbucks cup?!</p>",
				rating: 1,
				canEdit: true,
			},
		}

	}
}

export async function DELETE()
{
	return {
		body:

		{

		}

	}
}
