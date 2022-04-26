<script lang="ts">
	import { unreadThreads } from "$lib/data"

	/** The page title. */
	export let title: string | null = null
</script>
	
<svelte:head>
	<title>{$unreadThreads.length > 0 ? `(${$unreadThreads.length}) ` : ""}{title ? `${title} - ` : ""}IvoryTower</title>
</svelte:head>
