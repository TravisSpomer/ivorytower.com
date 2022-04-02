<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { UnreadThreadsPager } from "$lib/components"
</script>

<svelte:head>
	<title>{$unreadThreads.prefixText}IvoryTower</title>
</svelte:head>

<h1>It's the new IvoryTower</h1>
<p>
	Welcome to the new IvoryTower 3! Is it a beta? A preview? Too pretentious.
</p>
<p>
	If you ever find the new site lacking, you can use the "old site" link at the bottom of any page on the site, or just update your bookmark to <a href="https://old.ivorytower.com">old.ivorytower.com</a>.
</p>

<UnreadThreadsPager thenHome={false} />
