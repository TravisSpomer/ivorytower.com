<script context="module" lang="ts">
	import type { Load } from "./__types/ForumThread.aspx"
	type LoadEvent = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	export async function load({ url }: LoadEvent): Promise<LoadOutput>
	{
		const threadID = url.searchParams.get("Thread")
		return { redirect: `/threads/${threadID}${location.hash}`, status: 301 }
	}
</script>
