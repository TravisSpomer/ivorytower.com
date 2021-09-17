import { call } from "./api"

/** Information about a post. */
export interface Post
{
	/** The 1-based index of this post, only unique within this thread. */
	index: number
	/** The post ID, unique across all threads. */
	id: number
	/** The username of the person who wrote the post. */
	author: string
	/** The date that the post was first made. */
	posted: Date
	/** The username of the person who last modified the post, if any. */
	modifier?: string
	/** The date that the post was last modified, if any. */
	modified?: Date
	/** The post's total vote score, or null if it has never been voted on. */
	rating?: number
	/** The user's current vote on this post. */
	vote: -1 | null | 1
	/** The HTML contents of the post. */
	html: string
	/** True if the user can edit this post. */
	canEdit: boolean
}

/** An optional request to the getPostByID API. */
export interface GetPostRequest
{
	/** If true, the response should return content in its original unprocessed form when possible. */
	original?: boolean
}

/** A response from the getPostByID and getPostByIndex APIs. */
export interface GetPostResponse
{
	/** The requested post. */
	post: Post
}

/** A request to the castVote API. */
export interface UpdatePostRequestVote
{
	/** The vote to cast on the post. */
	vote: -1 | 0 | 1
}

/** A response from the castVote API. */
export interface UpdatePostResponseVote
{
	/** The post's new rating. */
	rating?: number
}

/** A request to the editPost API. */
export interface UpdatePostRequestEdit
{
	/** The new HTML contents of the post. */
	html: string
}

/** A response from the editPost API. */
export interface UpdatePostResponseEdit
{
	/** The updated version of the post. */
	post: Post
}

/** Given a raw Post object from JSON, initializes the object and returns the same instance. */
export function fromJSON(post: Post): Post
{
	// The Date fields are actually supplied as a string, so convert those now.
	post.posted = new Date(post.posted as unknown as string)
	if (post.modified) post.modified = new Date(post.modified as unknown as string)
	if (!post.vote) post.vote = null

	// Return the same instance... but better!
	return post
}

/** Retrieves the contents of a single post by its ID. */
export async function getPostByID(postID: number, options?: GetPostRequest): Promise<GetPostResponse>
{
	const response = await call(`/posts/${postID}${options && options.original ? "?original" : ""}`) as GetPostResponse
	response.post = fromJSON(response.post)
	return response
}

/** Retrieves the contents of a single post by its thread ID and post index. */
export async function getPostByIndex(threadID: number, postIndex: number): Promise<GetPostResponse>
{
	const response = await call(`/posts/${threadID}/${postIndex}`) as GetPostResponse
	response.post = fromJSON(response.post)
	return response
}

/** Casts the user's vote on a post. */
export async function castVote(post: Post | number, vote: -1 | null | 1): Promise<UpdatePostResponseVote>
{
	const postID = typeof post === "number" ? post : post.id
	const request: UpdatePostRequestVote = { vote: vote || 0 }

	return call(`/posts/${postID}`, { body: JSON.stringify(request), method: "POST" })
}

/** Edits the content of a post. */
export async function editPost(post: Post | number, content: UpdatePostRequestEdit): Promise<UpdatePostResponseEdit>
{
	const postID = typeof post === "number" ? post : post.id
	const response = await call(`/posts/${postID}`, { body: JSON.stringify(content), method: "POST" })
	response.post = fromJSON(response.post)
	return response
}

/** Deletes a post. */
export async function deletePost(post: Post | number): Promise<any>
{
	const postID = typeof post === "number" ? post : post.id
	return call(`/posts/${postID}`, { body: JSON.stringify({ delete: true }), method: "POST" })
}
