import { call } from "./api"
import { ThreadClippingMaxAgeDays, ThreadClippingMinLatestPosts } from "../data/settings"
import type { BasicForum } from "./forums"
import { fromJSON as postFromJSON } from "./posts"
import type { Post } from "./posts"

/** Basic information about a forums thread. */
export interface BasicThread
{
	/** The unique thread ID. */
	id: number
	/** The thread title. */
	title: string
	/** The date that the thread was last modified. */
	modified: Date
	/** The number of unread posts in the thread. */
	unread: number
	/** True if you've ignored the thread. */
	ignored: boolean
}

/** Full information about a forums thread. */
export interface Thread extends BasicThread
{
	/** The forum folder containing the thread. */
	forum: BasicForum
	/** True if you can post in this thread. */
	canPost: boolean
	/** An array of posts in the thread. */
	posts: Post[]
	/** The number of posts in the thread. (This will be the length of the posts array if the results haven't been filtered.) */
	postsInThread: number
}

/** A response from the getThread API. */
export interface GetThreadResponse
{
	/** A thread object. */
	thread: Thread
	/** A payload of updated unread threads. */
	unreadThreads?: GetUnreadThreadsResponse["unreadThreads"]
}

/** A request body to the createThread API. */
export interface CreateThreadRequest
{
	/** The ID of the forum folder the thread should be posted in. */
	forumID: number
	/** The title of the thread. */
	title: string
	/** The text of the first post in the thread. */
	text: string
}

/** A response from the createThread API. */
export interface CreateThreadResponse
{
	/** The thread that was just created. */
	thread: Thread
}

/** A request body to the postReply API. */
export interface PostThreadReplyRequest
{
	/** The HTML to post. */
	text: string
}

/** A response from the postReply API. */
export interface PostThreadReplyResponse
{
	/** The ID of the new post. */
	id: number
	/** The updated thread object. */
	thread: Thread
}

/** A response from the getUnreadThreads API. */
export interface GetUnreadThreadsResponse
{
	/** An array of unread threads. */
	unreadThreads: BasicThread[]
}

/** A response to the ignoreThread API. */
export interface IgnoreThreadResponse
{
	/** The ID of the thread that was ignored or unignored. */
	id: number
	/** True if the thread was ignored, or false if it was unignored. */
	ignored: boolean
}

/**
	Returns the contents of a single thread.
*/
export function getThread(id: number): Promise<GetThreadResponse>
{
	return getThreadCore(`/threads/${id}`)
}

/**
	Returns the contents of a single thread, filtered to only return the posts within a specific range.
*/
export function getThreadWithPostRange(id: number, fromIndex: number, toIndex: number): Promise<GetThreadResponse>
{
	return getThreadCore(`/threads/${id}?from=${fromIndex}&to=${toIndex}`)
}

/**
	Returns the contents of a single thread, filtered to only return the posts within a specific date range.
*/
export function getThreadClipped(id: number, maxAge: number = ThreadClippingMaxAgeDays, latest: number = ThreadClippingMinLatestPosts): Promise<GetThreadResponse>
{
	return getThreadCore(`/threads/${id}?maxage=${maxAge}&latest=${latest}`)
}

async function getThreadCore(url: string): Promise<GetThreadResponse>
{
	const rawResponse = await call(url) as GetThreadResponse

	// The raw JSON response contains dates as strings, so convert those to Date objects now.
	fromJSON(rawResponse.thread)

	return rawResponse
}

/** Given a raw Thread object from JSON, initializes the object and returns the same instance. */
export function fromJSON<T extends BasicThread>(thread: T): T
{
	// The Date fields are actually supplied as a string, so convert those now.
	thread.modified = new Date(thread.modified as unknown as string)

	// Some fields are optional in the JSON.
	if (!("unread" in thread)) thread.unread = 0
	if (!("ignored" in thread)) thread.ignored = false
	if (!("canPost" in thread)) (thread as unknown as Thread).canPost = true

	// Also do this for posts in the thread.
	if ("posts" in thread)
		(thread as unknown as Thread).posts.forEach(postFromJSON)

	// Return the same instance... but better!
	return thread
}

/**
	Creates a new forums thread.
*/
export async function createThread(request: CreateThreadRequest): Promise<CreateThreadResponse>
{
	const response = await call(`/threads`, { body: JSON.stringify(request), method: "POST" }) as CreateThreadResponse

	// The raw JSON response contains dates as strings, so convert those to Date objects now.
	fromJSON(response.thread)

	return response
}

/**
	Posts a reply to an existing thread.
*/
export async function postThreadReply(threadID: number, post: PostThreadReplyRequest): Promise<PostThreadReplyResponse>
{
	const response = await call(`/threads/${threadID}`, { body: JSON.stringify(post), method: "POST" }) as PostThreadReplyResponse

	// The raw JSON response contains dates as strings, so convert those to Date objects now.
	response.thread.posts.forEach(postFromJSON)

	return response
}

/**
	Gets the user's list of unread threads.
*/
export async function getUnreadThreads(): Promise<GetUnreadThreadsResponse>
{
	return call("/threads/unread")
}

/**
	Ignores or unignores a thread.
*/
export async function ignoreThread(threadID: number, ignore: boolean): Promise<IgnoreThreadResponse>
{
	return call(`/threadignore/${threadID}?ignore=${ignore ? "true" : "false"}`, { method: "POST" }) as Promise<IgnoreThreadResponse>
}
