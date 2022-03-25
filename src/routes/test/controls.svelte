<script lang="ts">
	import { Button, SearchBox } from "$lib/components"
	import Vote from "$lib/components/Vote.svelte" // not in main export because it's not meant to be reused
</script>

<style lang="scss">

	.stack
	{
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5em;
	}

</style>

<svelte:head>
	<title>Controls playground</title>
</svelte:head>

<h1>Controls playground</h1>

<p>
	Please wipe your feet to avoid tracking sand into the rest of the site.
</p>

<h2>Buttons</h2>
<p class="stack">
	<span>Regular buttons</span>
	<Button>Regular</Button>
	<Button outline>Outline</Button>
	<Button accent>Accent</Button>
	<Button ghost>Ghost</Button>
	<Button danger>Danger</Button>
	<Button disabled>Disabled</Button>
</p>
<p class="stack">
	<span>Link buttons</span>
	<Button href="/test" title="I'm actually a link, not a button!">Link</Button>
	<Button href="/test" outline>Outline</Button>
	<Button href="/test" accent>Accent</Button>
	<Button href="/test" ghost>Ghost</Button>
	<Button href="/test" danger>Danger</Button>
	<Button href="/test" disabled>Disabled</Button>
</p>
<p class="stack">
	<span>Tiny buttons</span>
	<Button tiny>Tiny</Button>
	<Button tiny outline>Outline</Button>
	<Button tiny accent>Accent</Button>
	<Button tiny ghost>Ghost</Button>
	<Button tiny danger>Danger</Button>
	<Button tiny disabled>Disabled</Button>
</p>
<p class="stack">
	<span>Vote buttons</span>
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
