<script lang="ts">
	import { page } from "$app/stores"
	import { Title } from "$lib/components"

	let title: string
	let message: string
	let error: Error | null = null

	switch ($page.status)
	{
		case 404:
			title = "Not found"
			message = "Sorry, that page wasn’t found."
			break
		default:
			title = "Oops"
			message = "Sorry, something went wrong."
			error = $page.error
	}
</script>

<Title {title} />

<h1>{title}</h1>
<p>
	{message}
</p>
{#if error}
<details style="margin-top: 4em;">
	<summary>
		Technical details
	</summary>
	<h3>
		{error.name}: {error.message}
	</h3>
	{#if "stack" in error}
	<pre>
		{error.stack}
	</pre>
	{/if}
</details>
{/if}
