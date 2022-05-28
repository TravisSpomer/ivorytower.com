import { sleep } from "$lib/utils/promise"

export async function get()
{
	await sleep(3000)

	return {
		body:
	
		{
			"thread":
			{
				id: 2,
				title: "A brand new thread",
				forum: {
					id: 1,
					title: "General discussion",
				},
				modified: "2022-05-20T19:11:00Z",
				unread: 1,
				postsInThread: 1,
				posts: [
					{
						id: 20001,
						index: 1,
						author: "clampwick",
						posted: "2022-05-20T19:11:00Z",
						html: "<p>No content yet, but there will be someday!</p>",
						canEdit: true,
					},
				],
			}

		}

	}
}

export async function post()
{
	const original = await get()
	original.body.thread.posts.push({
		id: 20002,
		index: 89,
		author: "tspomer",
		posted: (new Date()).toISOString(),
		html: "<p>hey</p>",
		canEdit: true,
	})
	// @ts-ignore
	original.body.id = 20001

	return original
}
