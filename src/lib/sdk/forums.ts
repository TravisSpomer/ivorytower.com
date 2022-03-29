import { call } from "./api"
import type { BasicThread, GetUnreadThreadsResponse } from "./threads"
import { fromJSON as threadFromJSON } from "./threads"

/** Basic information about a forum (forums folder). */
export interface BasicForum
{
	/** The unique forum folder ID, or null/undefined for the forums index. */
	id?: number
	/** The forum title, or null/undefined for the forums index. */
	title?: string
	/** The description of the forum, or null/undefined for the forums index. */
	description?: string
}

/** Full information about a forums thread. */
export interface Forum extends BasicForum
{
	/** The forum folder containing this one, if any. */
	parent?: Forum
	/** An array of subforums of this forum, if any. */
	forums?: BasicForum[]
	/** An array of threads in the forum, if any. */
	threads?: BasicThread[]
	/** If true, the user can create new threads in this folder. */
	canPost?: boolean
}

/** A response from the getForum API. */
export interface GetForumResponse
{
	/** A Forum object. */
	forum: Forum
	/** A payload of updated unread threads. */
	unreadThreads?: GetUnreadThreadsResponse["unreadThreads"]
}

/**
	Returns the contents of a single forum.
*/
export async function getForum(id: number | null): Promise<GetForumResponse>
{
	const rawResponse = await call(id ? `/forums/${id}` : "/forums") as GetForumResponse
	if (rawResponse.forum.threads) rawResponse.forum.threads.forEach(threadFromJSON)
	return rawResponse
}
