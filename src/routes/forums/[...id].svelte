<script context="module" lang="ts">
	import type { Load } from "./[...id]"
	type LoadInput = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	export async function load({ params }: LoadInput): Promise<LoadOutput>
	{
		const { id } = params
		const forumID = id ? Number.parseInt(id, 10) : null
		if (forumID !== null && isNaN(forumID)) return { status: 404, error: new Error(`There's no forum "${forumID}".`) }

		return { props: { id: forumID } }
	}
</script>

<script lang="ts">
	import { browser } from "$app/env"
	import { unreadThreads } from "$lib/data"
	import { getForum } from "$lib/sdk"
	import type { Forum } from "$lib/sdk"
	import { Button, ForumView, Heading, Wait } from "$lib/components"

	export let id: number | null

	let forum: Forum | null = null
	let error: Error | null = null

	$: if (browser)
	{
		id
		refresh()
	}

	async function refresh(): Promise<void>
	{
		try
		{
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
</script>

<style lang="scss">

	h1
	{
		margin-bottom: 1em;
	}

</style>

<svelte:head>
	<title>{$unreadThreads.prefixText}{forum && forum.id ? forum.title : "Forums"} - IvoryTower</title>
</svelte:head>

{#if browser}{#if forum}
	<Heading parentHref={forum.id ? (forum.parent ? `/forums/${forum.parent.id}` : "/forums") : undefined} parentTitle={forum.id ? (forum.parent ? forum.parent.title : "Forums") : undefined}>
		{forum.id ? forum.title : "Forums"}
		<div slot="controls">
			{#if forum.id && forum.canPost}
				<Button toolbar href="/threads/new?forum={forum.id}">New thread</Button>
			{/if}
		</div>
	</Heading>
	<ForumView {forum} />
{:else if error}
	<aside class="danger">
		{error.message}
	</aside>
{:else}
	<p>
		<Wait />
	</p>
{/if}{/if}
