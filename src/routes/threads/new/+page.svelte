<script lang="ts">
	import type { PageProps } from "./$types"
	import { browser } from "$app/environment"
	import { goto } from "$app/navigation"
	import type { BasicForum } from "$lib/sdk"
	import { createThread, getForum } from "$lib/sdk"
	import { Button, Editor, Heading, Title, Wait } from "$lib/components"

	const { data }: PageProps = $props()
	const forumID = $derived(data.forumID)

	let forum: BasicForum | undefined = $state()
	let error: Error | null = $state(null)

	let editor: Editor | undefined = $state()
	let threadTitle: string = $state("")
	let postText: string = $state("")
	let isPosting: boolean = $state(false)

	async function refresh()
	{
		try
		{
			if (!forumID)
			{
				error = new Error("You can't post here.")
				return
			}
			forum = (await getForum(forumID)).forum
		}
		catch (e)
		{
			error = e
		}
	}

	async function postThread()
	{
		if (!editor || !forumID || isPosting || threadTitle.length === 0 || postText.length === 0) return

		try
		{
			isPosting = true
			const thread = (await createThread({ forumID, title: threadTitle, text: editor.getHTML() })).thread
			editor.discardDraft()
			goto(`/threads/${thread.id}`)
		}
		catch (ex)
		{
			console.error(ex)
			isPosting = false
		}
	}

	if (browser)
	{
		$effect(() =>
		{
			forumID
			refresh()
		})
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
			{#snippet after({ uploading })}
				<p>
					<Button onclick={postThread} disabled={isPosting || uploading || threadTitle.length === 0 || postText.length === 0}>Create thread</Button>
					{#if isPosting}
						<Wait size={40} />
					{/if}
				</p>
			{/snippet}
		</Editor>
	{/if}
{/if}
