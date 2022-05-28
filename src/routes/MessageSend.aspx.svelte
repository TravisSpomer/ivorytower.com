<script context="module" lang="ts">
	import type { Load } from "./__types/MessageSend.aspx"
	type LoadEvent = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	export async function load({ url }: LoadEvent): Promise<LoadOutput>
	{
		const name = url.searchParams.get("name")
		if (name !== "csmolinsky") return { status: 404 }
	
		return {}
	}
</script>

<script lang="ts">
	import { Title } from "$lib/components"
</script>

<Title title="Secret admin panel" />

<h1>
	Secret IvoryTower admin panel
</h1>

<p>
	[Not yet implemented]
</p>
