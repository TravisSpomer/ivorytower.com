<script context="module" lang="ts">
	import type { Load } from "./__types/new"
	type LoadEvent = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	export async function load({ url }: LoadEvent): LoadOutput
	{
		const id = url.searchParams.get("forum")
		const forumID = id ? Number.parseInt(id, 10) : NaN
		if (isNaN(forumID)) return { status: 404, error: new Error(`There's no forum "${forumID}".`) }

		return { props: { forumID } }
	}
</script>

<script lang="ts">
	import { browser } from "$app/env"
	import { goto } from "$app/navigation"
	import type { BasicForum } from "$lib/sdk"
	import { createThread, getForum } from "$lib/sdk"
	import { Button, Editor, Heading, Title, Wait } from "$lib/components"
	
	export let forumID: number
	
	let forum: BasicForum
	let error: Error | null = null

	let editor: Editor
	let threadTitle: string = ""
	let postText: string = ""
	let isPosting: boolean = false

	$: if (browser)
	{
		forumID
		refresh()
	}

	async function refresh()
	{
		try
		{
			forum = (await getForum(forumID)).forum
		}
		catch (e)
		{
			error = e
		}
	}
	
	async function postThread()
	{
		if (isPosting || threadTitle.length === 0 || postText.length === 0) return

		try
		{
			isPosting = true
			const thread = (await createThread({ forumID, title: threadTitle, text: editor.getHtml() })).thread
			editor.discardDraft()
			goto(`/threads/${thread.id}`)
		}
		catch
		{
			isPosting = false
		}
	}
</script>

<Title title="New thread" />

{#if browser}{#if isPosting}
	<p>
		<Wait delay={1000} />
	</p>
{:else if error}
	<aside class="danger">
		{error.message}
	</aside>
{:else}
	<Heading previousHref="/forums/{forum ? forum.id : ""}" previousTitle={forum ? forum.title : "Back"}>New thread{forum ? " in " + forum.title : ""}</Heading>
	<p>
		<label>Subject:<br /><input type="text" bind:value={threadTitle} size="40" required /></label>
	</p>
	<Editor bind:this={editor} bind:value={postText} placeholder="Post reply" disabled={isPosting} collapsible sitewideUniqueID="/threads/new">
		<p slot="after" let:uploading>
			<Button on:click={postThread} disabled={isPosting || uploading || threadTitle.length === 0 || postText.length === 0}>Create thread</Button>
		</p>
	</Editor>
{/if}{/if}
