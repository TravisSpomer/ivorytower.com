<script lang="ts">
	import { unreadThreads } from "$lib/data"
	import { UnreadThreadsPager } from "$lib/components"
</script>

<svelte:head>
	<title>{$unreadThreads.prefixText}IvoryTower</title>
</svelte:head>

<h1>IvoryTower 3 beta</h1>
<p>
	Welcome to the beta! It'll be a long time until it's feature-complete. If you ever find the new site lacking, you can use the "old site" link at the bottom of any page on the site, or just update your bookmark to <a href="https://old.ivorytower.com">old.ivorytower.com</a>.
</p>

<UnreadThreadsPager thenHome={false} />
