<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { UnreadThreadsPager } from "$lib/components"
	import NoMorePosts from "./_NoMorePosts.svelte"
</script>

<svelte:head>
	<title>{$unreadThreads.prefixText}IvoryTower</title>
</svelte:head>

{#if $unreadThreads.length}
	<UnreadThreadsPager thenHome={false} />
{:else}
	<NoMorePosts />
{/if}
