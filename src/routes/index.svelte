<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { UnreadThreadsPager } from "$lib/components"
</script>

<svelte:head>
	<title>{$unreadThreads.prefixText}IvoryTower</title>
</svelte:head>

<h1>IvoryTower 3 preview</h1>
<p>
	Welcome! Still a work in progress.
</p>

<UnreadThreadsPager thenHome={false} />
