<script lang="ts">
	import { unreadThreads } from "$lib/data"

	export interface Props
	{
		/** The page title. Explicitly set this to null in the rare case that you do not need a page title. */
		title: string | null
	}

	const { title }: Props = $props()
</script>

<svelte:head>
	<title>{$unreadThreads.length > 0 ? `(${$unreadThreads.length}) ` : ""}{title ? `${title} - ` : ""}IvoryTower</title>
</svelte:head>
