<script lang="ts">
	import { Badge, Button, FocusWithin, SearchBox, Title, Toolbar, Upload, Wait } from "$lib/components"
	import Vote from "$lib/components/Vote.svelte" // not in main export because it's not meant to be reused

	let isWaiting: boolean = $state(false)
</script>

<style>

	.stack
	{
		margin: 1em 0;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5em;
	}

</style>

<Title title="Controls playground" />

<h1>Controls playground</h1>

<p>
	Please wipe your feet to avoid tracking sand into the rest of the site.
</p>

<h2>Buttons</h2>

<FocusWithin visibleOnly>
{#snippet children({ within })}

<div class="stack">
	<span>Regular buttons</span>
	<Button>Regular</Button>
	<Button accent>Accent</Button>
	<Button ghost>Ghost</Button>
	<Button danger>Danger</Button>
	<Button disabled>Disabled</Button>
</div>
<div class="stack">
	<span>Link buttons</span>
	<Button href="/test" title="I'm actually a link, not a button!">Link</Button>
	<Button href="/test" accent>Accent</Button>
	<Button href="/test" ghost>Ghost</Button>
	<Button href="/test" danger>Danger</Button>
	<Button href="/test" disabled>Disabled</Button>
</div>
<div class="stack">
	<span>Tiny buttons</span>
	<Button tiny>Tiny</Button>
	<Button tiny accent>Accent</Button>
	<Button tiny ghost>Ghost</Button>
	<Button tiny danger>Danger</Button>
	<Button tiny disabled>Disabled</Button>
	<Button tiny ghost disabled>Ghost disabled</Button>
</div>
<Toolbar>
	<Button toolbar>Toolbar</Button>
	<Button tiny toolbar>Tiny toolbar</Button>
	<Button toolbar disabled>Disabled</Button>
	{#snippet right()}
		<Button toolbar>Right-aligned content</Button>
	{/snippet}
</Toolbar>
<div class="stack">
	<span>Vote buttons</span>
	<Vote value={17} vote={null} />
	<Vote value={0} vote={null} disabled />
</div>

<div>
	Focus in this section: {within ? "✅" : "❌"}
</div>

{/snippet}
</FocusWithin>

<h2>Man does not live on button alone</h2>

<p>
	<label><input type="checkbox" bind:checked={isWaiting} />Wait for it</label>
	{#if isWaiting}
		<Wait size={28} delay={250} />
	{/if}
</p>

<div class="stack">
	<Badge value={0} />
	<Badge value={1} />
	<Badge value={69} />
	<Badge value={420} />
</div>

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
	<textarea></textarea>
</p>

<Upload />
