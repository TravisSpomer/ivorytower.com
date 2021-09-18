<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { UnreadThreadsPager } from "$lib/components"
</script>

<svelte:head>
	<title>{$unreadThreads.prefixText}IvoryTower</title>
</svelte:head>

<h1>Welcome to the IvoryTower 3 preview site!</h1>
<p>
	As you can probably see, this is very much a work in progress. The word “beta” in the URL is still a bit... aspirational.
</p>

<UnreadThreadsPager thenHome={false} />
