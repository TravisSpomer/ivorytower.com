<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { Title, UnreadThreadsPager } from "$lib/components"
	import NoMorePosts from "./_NoMorePosts.svelte"
</script>

<Title title={null} />

{#if $unreadThreads.length}
	<UnreadThreadsPager thenHome={false} />
{:else}
	<NoMorePosts />
{/if}
