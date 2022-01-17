<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

	export async function load({ url }: LoadInput): Promise<LoadOutput>
	{
		const threadID = url.searchParams.get("Thread")
		return { redirect: `/threads/${threadID}${location.hash}`, status: 301 }
	}
</script>
