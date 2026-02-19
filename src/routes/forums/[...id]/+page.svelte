<script lang="ts">
	import type { PageProps } from "./$types"
	import { browser } from "$app/environment"
	import { unreadThreads } from "$lib/data"
	import { getForum } from "$lib/sdk"
	import type { Forum } from "$lib/sdk"
	import { Button, ForumView, Heading, Title, Wait } from "$lib/components"

	const { params }: PageProps = $props()

	let forum: Forum | null = $state(null)
	let error: Error | null = $state(null)

	async function refresh(): Promise<void>
	{
		try
		{
			const id = params.id !== "" ? parseInt(params.id, 10) : null
			if (id !== null && isNaN(id))
			{
				error = new Error("That forum doesn't exist.")
				return
			}

			const response = await getForum(id)
			forum = response.forum
			if (response.unreadThreads)
			{
				$unreadThreads.refreshFromArray(response.unreadThreads)
			}
		}
		catch (e)
		{
			error = e
		}
	}

	if (browser)
	{
		$effect(() =>
		{
			params.id
			refresh()
		})
	}
</script>

<Title title={forum && forum.title ? forum.title : "Forums"} />

{#if browser}{#if forum}
	<Heading
		previousHref={forum.id ? (forum.parent ? `/forums/${forum.parent.id}` : "/forums") : undefined}
		previousTitle={forum.id ? (forum.parent ? forum.parent.title : "Forums") : undefined}
	>
		{forum.id ? forum.title : "Forums"}
		{#snippet controls()}
			<div>
				{#if forum!.id && forum!.canPost}
					<Button toolbar href="/threads/new?forum={forum!.id}">New thread</Button>
				{/if}
			</div>
		{/snippet}
	</Heading>
	<ForumView {forum} />
{:else if error}
	<aside class="danger">
		{error.message}
	</aside>
{:else}
	<p>
		<Wait delay={1000} />
	</p>
{/if}{/if}
