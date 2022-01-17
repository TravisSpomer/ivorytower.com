<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

	export async function load({ url }: LoadInput): Promise<LoadOutput<{forumID: number}>>
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
	import { Editor, Wait } from "$lib/components"
	
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
			goto(`/threads/${thread.id}`)
		}
		catch
		{
			isPosting = false
		}
	}

	function onBeforeUnload(ev: BeforeUnloadEvent)
	{
		// If they haven't typed anything of significance, don't block them from navigating away.
		if (!isPosting && (!postText || postText.length < 100)) return

		// Otherwise, warn them!
		ev.preventDefault()
		ev.returnValue = ""
		return ev.returnValue

		// IMPORTANT: This only covers navigations away from the site, not intra-site navigations.
		// TODO: Develop a solution for pausing intra-site navigations as well.
	}
</script>

<svelte:head>
	<title>New thread - IvoryTower</title>
</svelte:head>

<svelte:window on:beforeunload={onBeforeUnload} />

{#if browser}{#if isPosting}
	<p>
		<Wait />
	</p>
{:else if error}
	<aside class="danger">
		{error.message}
	</aside>
{:else}
	<h1>New thread{forum ? " in " + forum.title : ""}</h1>
	<p>
		<label>Subject:<br /><input type="text" bind:value={threadTitle} size="40" required /></label>
	</p>
	<Editor bind:this={editor} bind:value={postText} placeholder="Post reply" disabled={isPosting} collapsible>
		<p slot="after" let:uploading>
			<button class:button={true} on:click={postThread} disabled={isPosting || uploading || threadTitle.length === 0 || postText.length === 0}>Create thread</button>
		</p>
	</Editor>
{/if}{/if}
