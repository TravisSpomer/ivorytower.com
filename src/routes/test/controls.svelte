<script lang="ts">
	import { Button } from "$lib/components"
</script>

<svelte:head>
	<title>Control tests</title>
</svelte:head>

<h1>Control tests</h1>

<h2>Buttons</h2>
<p>
	Regular buttons
	<Button on:click={() => alert("hello")}>Regular</Button>
	<Button accent>Accent</Button>
	<Button subtle>Subtle</Button>
	<Button danger>Danger</Button>
	<Button disabled>Disabled</Button>
</p>
<p>
	Link buttons
	<Button href="/test" title="I'm actually a link, not a button!">Link</Button>
	<Button href="/test" accent>Accent</Button>
	<Button href="/test" subtle>Subtle</Button>
	<Button href="/test" danger>Danger</Button>
	<Button href="/test" disabled>Disabled</Button>
</p>
