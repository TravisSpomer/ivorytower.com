<script lang="ts">
	// TODO: Upgrade to Svelte 5—uses let: syntax

	import type { PageData } from "./$types"
	import { browser } from "$app/environment"
	import { goto } from "$app/navigation"
	import type { BasicForum } from "$lib/sdk"
	import { createThread, getForum } from "$lib/sdk"
	import { Button, Editor, Heading, Title, Wait } from "$lib/components"

	export let data: PageData
	let forumID: number
	$: ({ forumID } = data)

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
			const thread = (await createThread({ forumID, title: threadTitle, text: editor.getHTML() })).thread
			if (editor) editor.discardDraft()
			goto(`/threads/${thread.id}`)
		}
		catch (ex)
		{
			console.error(ex)
			isPosting = false
		}
	}
</script>

<Title title="New thread" />

{#if browser}
	{#if error}
		<aside class="danger">
			{error.message}
		</aside>
	{:else}
		<Heading previousHref="/forums/{forum ? forum.id : ""}" previousTitle={forum ? forum.title : "Back"}>New thread{forum ? " in " + forum.title : ""}</Heading>
		<p>
			<label>Subject:<br /><input type="text" bind:value={threadTitle} size="40" disabled={isPosting} required /></label>
		</p>
		<Editor bind:this={editor} bind:value={postText} placeholder="Post reply" disabled={isPosting} collapsible sitewideUniqueID="/threads/new">
			<p slot="after" let:uploading>
				<Button on:click={postThread} disabled={isPosting || uploading || threadTitle.length === 0 || postText.length === 0}>Create thread</Button>
				{#if isPosting}
					<Wait size={40} />
				{/if}
			</p>
		</Editor>
	{/if}
{/if}
