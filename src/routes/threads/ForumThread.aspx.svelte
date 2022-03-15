<script context="module" lang="ts">
	import type { Load } from "./ForumThread.aspx"
	type LoadInput = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	export async function load({ url }: LoadInput): Promise<LoadOutput>
	{
		const threadID = url.searchParams.get("Thread")
		return { redirect: `/threads/${threadID}${location.hash}`, status: 301 }
	}
</script>
