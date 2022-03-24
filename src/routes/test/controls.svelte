<script lang="ts">
	import { Button, SearchBox } from "$lib/components"
	import Vote from "$lib/components/Vote.svelte" // not in main export because it's not meant to be reused
</script>

<svelte:head>
	<title>Controls playground</title>
</svelte:head>

<h1>Controls playground</h1>

<p>
	Please wipe your feet to avoid tracking sand into the rest of the site.
</p>

<h2>Buttons</h2>
<p>
	Regular buttons
	<Button>Regular</Button>
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
<p style="display: flex;">
	<Vote value={17} vote={null} />
</p>

<h2>Man does not live on button alone</h2>

<p>
	<SearchBox />
</p>
<p>
	<SearchBox collapsed />
</p>

<p>
	<input type="text" />
</p>

<p>
	<textarea />
</p>
