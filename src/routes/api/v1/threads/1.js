export async function get()
{
	return {
		body:
	
		{
			"thread":
			{
				id: 1,
				title: "Game of Thrones chat",
				forum: {
					id: 1,
					title: "General discussion",
				},
				modified: "2021-06-05T15:15:00Z",
				unread: 1,
				postsInThread: 88,
				posts: [
					{
						id: 10001,
						index: 1,
						author: "tspomer",
						posted: "2021-01-01T15:00:00Z",
						html: "<p>The annual thread where we talk about Game of Thrones.</p>",
						canEdit: true,
					},
					{
						id: 10002,
						index: 84,
						author: "ldemaris",
						posted: "2021-06-01T15:00:00Z",
						html: "<p>lol u guys see that episode what a turd</p>",
					},
					{
						id: 10003,
						index: 85,
						author: "bkell",
						posted: "2021-06-02T15:00:00Z",
						html: "<p>No, I spent the evening merging my consciousness with the hivemind.</p>",
					},
					{
						id: 10004,
						index: 86,
						author: "clampwick",
						posted: "2021-06-03T15:00:00Z",
						html: "<p><a href=\"ForumThread.aspx?Thread=1#Post84\">Lincoln · 84</a>: Ah crap, I missed it again. I was washing my solid gold rocket car.</p><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>",
						canEdit: true,
					},
					{
						id: 10005,
						index: 87,
						author: "tspomer",
						posted: "2021-06-04T15:00:00Z",
						html: "<p>It was okay. This week's <a href=\"\" rel=\"noopener\" target=\"blank\">Gay of Thrones</a> was even worse than usual though. <img src=\"Bitmaps/Emo/Glare.png\" width=\"12\" height=\"12\" class=\"emo\" alt=\"-_-\" title=\"\" /></p>",
						canEdit: true,
					},
					{
						id: 10006,
						index: 88,
						author: "lbrown",
						posted: "2021-06-05T15:00:00Z",
						modifier: "tspomer",
						modified: "2021-06-05T15:15:00Z",
						html: "<p>Did anyone else notice Daenarys's Starbucks cup?!</p>",
						canEdit: true,
					},
					/*{
						id: 11000,
						index: 88.1,
						author: "clampwick",
						posted: "2021-06-05T16:00:00Z",
						html: "<p><nobr>LOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOLOL</nobr></p>",
						canEdit: true,
					},
					{
						id: 11001,
						index: 88.2,
						author: "clampwick",
						posted: "2021-06-05T16:00:01Z",
						html: `<p><img src="/images/app/logo512.png" width="3000" height="2000" /></p>`,
						canEdit: true,
					},*/
				],
			}

		}

	}
}

export async function post()
{
	const original = await get()
	original.body.thread.posts.push({
		id: 10007,
		index: 89,
		author: "tspomer",
		posted: (new Date()).toISOString(),
		html: "<p>lol yes</p>",
		canEdit: true,
	})
	// @ts-ignore
	original.body.id = 10007

	return original
}
