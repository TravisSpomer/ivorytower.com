<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

	export async function load({ url }: LoadInput): Promise<LoadOutput>
	{
		const name = url.searchParams.get("name")
		if (name !== "csmolinsky") return { status: 404 }
	
		return {}
	}
</script>

<svelte:head>
	<title>Secret admin panel - IvoryTower</title>
</svelte:head>

<h1>
	Secret IvoryTower admin panel
</h1>

<p>
	[Not yet implemented]
</p>
