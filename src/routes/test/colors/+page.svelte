<script lang="ts">
	import { Button, Title } from "$lib/components"

	const Neutrals: {[name: string]: string} =
	{
		White: "#ffffff",
		Platinum: "#f6f6f6",
		Grey: "#a3a3a3",
		Charcoal: "#242424",
		Black: "#000000",
	}

	const Colors: {[name: string]: string} =
	{
		Brown: "#5e2500",
		Crimson: "#ac1c40",
		Red: "#dd0737",
		Salmon: "#ff9d89",
		Burnt: "#ef5f00",
		Orange: "#ffa120",
		Yellow: "#ffe702",
		Lime: "#7ec957",
		Green: "#208839",
		Forest: "#03663a",
		Teal: "#1b837f",
		Aqua: "#6ae6d4",
		Sky: "#81bdeb",
		Blue: "#3378c8",
		Navy: "#2d297f",
		Purple: "#a54ed3",
		Gum: "#f899c9",
		Magenta: "#e84ffc",
		Berry: "#d72994",
		Wine: "#96326b",
	}

	const ColorEntries = [["Grey", Neutrals.Grey], ...Object.entries(Colors)]
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

	.swatchtile
	{
		&.relativelightness
		{
			--accent-light4: oklch(from var(--base) calc(l + 0.30) c h);
			--accent-light3: oklch(from var(--base) calc(l + 0.28) c h);
			--accent-light2: oklch(from var(--base) calc(l + 0.24) c h);
			--accent-light1: oklch(from var(--base) calc(l + 0.14) c h);
			--accent: var(--base);
			--accent-dark1: oklch(from var(--base) calc(l - 0.10) c h);
			--accent-dark2: oklch(from var(--base) calc(l - 0.17) c h);
			--accent-dark3: oklch(from var(--base) calc(l - 0.24) c h);
			--accent-dark4: oklch(from var(--base) calc(l - 0.33) c h);
		}

		&.mixed
		{
			--accent-light4: color-mix(in oklch, var(--base), white 37%);
			--accent-light3: color-mix(in oklch, var(--base), white 34%);
			--accent-light2: color-mix(in oklch, var(--base), white 28%);
			--accent-light1: color-mix(in oklch, var(--base), white 18%);
			--accent: var(--base);
			--accent-dark1: color-mix(in oklch, var(--base), black 12%);
			--accent-dark2: color-mix(in oklch, var(--base), black 25%);
			--accent-dark3: color-mix(in oklch, var(--base), black 35%);
			--accent-dark4: color-mix(in oklch, var(--base), black 45%);
		}

		&.fixedlightness
		{
			--accent-light4: oklch(from var(--base) 0.97 c h);
			--accent-light3: oklch(from var(--base) 0.95 c h);
			--accent-light2: oklch(from var(--base) 0.91 c h);
			--accent-light1: oklch(from var(--base) 0.81 c h);
			--accent: oklch(from var(--base) 0.67 c h);
			--accent-dark1: oklch(from var(--base) 0.57 c h);
			--accent-dark2: oklch(from var(--base) 0.50 c h);
			--accent-dark3: oklch(from var(--base) 0.43 c h);
			--accent-dark4: oklch(from var(--base) 0.34 c h);
		}

		/* Copied from app.css */
		/* REVIEW: Is there any way to not have to include this? */
		--accent-control-foreground: white;
		--accent-control-background: var(--accent-dark1);
		--accent-control-border: var(--accent-dark3);
		--accent-control-foreground-hover: white;
		--accent-control-background-hover: var(--accent);
		--accent-control-border-hover: var(--accent-dark2);
		--accent-control-foreground-pressed: white;
		--accent-control-background-pressed: var(--accent);
		--accent-control-border-pressed: var(--accent-dark2);

		::global(.theme-dark) &
		{
			--accent-control-foreground: white;
			--accent-control-background: var(--accent-dark2);
			--accent-control-border: var(--accent);
			--accent-control-foreground-hover: white;
			--accent-control-background-hover: var(--accent-dark1);
			--accent-control-border-hover: var(--accent);
			--accent-control-foreground-pressed: white;
			--accent-control-background-pressed: var(--accent-dark1);
			--accent-control-border-pressed: var(--accent);
		}
	}

</style>

<Title title="Dynamic button color techniques" />

<h1>Dynamic button color techniques</h1>

<p>
	These work pretty well, but a solution is needed for determining the foreground color. CSS <code>contrast-color()</code> is not supported in Chromium yet, and the results are quite bad anyway. Can we get the computed color values in JavaScript and adjust using that?
</p>

<h2>Relative lightness</h2>
<p>More creative control, better appearance. The best method I've found so far!</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile relativelightness" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>

<h2>Relative via mixing</h2>
<p>More confusing for no additional benefit?</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile mixed" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>

<h2>Fixed lightness</h2>
<p>Guaranteed contrast ratio, only works on certain base colors.</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile fixedlightness" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>
