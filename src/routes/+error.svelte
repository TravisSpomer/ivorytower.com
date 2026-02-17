<script lang="ts">
	import { page } from "$app/state"
	import { Title } from "$lib/components"

	let title: string
	let message: string

	switch (page.status)
	{
		case 404:
			title = "Not found"
			message = "Sorry, that page wasn’t found."
			break
		default:
			title = "Oops"
			message = "Sorry, something went wrong."
	}
</script>

<Title {title} />

<h1>{title}</h1>
<p>
	{message}
</p>
