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
	}

	.swatchtile
	{
		background-color: var(--accent-light4);
		padding: 0.5em;

		&.relativelightness
		{
			--accent-light4: oklch(from var(--base) calc(l + 0.30) calc(c - 0.10) h);
			--accent-light3: oklch(from var(--base) calc(l + 0.28) calc(c - 0.07) h);
			--accent-light2: oklch(from var(--base) calc(l + 0.24) calc(c - 0.05) h);
			--accent-light1: oklch(from var(--base) calc(l + 0.14) calc(c - 0.02) h);
			--accent: var(--base);
			--accent-dark1: oklch(from var(--base) calc(l - 0.10) c h);
			--accent-dark2: oklch(from var(--base) calc(l - 0.17) c h);
			--accent-dark3: oklch(from var(--base) calc(l - 0.24) c h);
			--accent-dark4: oklch(from var(--base) calc(l - 0.33) c h);
		}

		&.relativelightnessmultiply
		{
			--accent-light4: oklch(from var(--base) calc(l * 0.10 + 0.90) calc(c * 0.10) h);
			--accent-light3: oklch(from var(--base) calc(l * 0.20 + 0.80) calc(c * 0.20) h);
			--accent-light2: oklch(from var(--base) calc(l * 0.40 + 0.60) calc(c * 0.40) h);
			--accent-light1: oklch(from var(--base) calc(l * 0.60 + 0.40) calc(c * 0.60) h);
			--accent: var(--base);
			--accent-dark1: oklch(from var(--base) calc(l * 0.88) calc(c * 0.88) h);
			--accent-dark2: oklch(from var(--base) calc(l * 0.75) calc(c * 0.75) h);
			--accent-dark3: oklch(from var(--base) calc(l * 0.65) calc(c * 0.65) h);
			--accent-dark4: oklch(from var(--base) calc(l * 0.55) calc(c * 0.55) h);
		}

		&.mixed
		{
			--accent-light4: color-mix(in oklch, var(--base), white 90%);
			--accent-light3: color-mix(in oklch, var(--base), white 80%);
			--accent-light2: color-mix(in oklch, var(--base), white 60%);
			--accent-light1: color-mix(in oklch, var(--base), white 40%);
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
		/*
			If you wanted to support changing these on a granular basis, you should move the original declaractions into their own
			.define-control-tokens class. CSS variables that reference other variables don't work like functions!
		*/
		&
		{
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
	}

</style>

<Title title="Dynamic button color techniques" />

<h1>Dynamic button color techniques</h1>

<p>
	These work pretty well, but a solution is needed for determining the foreground color. CSS <code>contrast-color()</code> is not supported in Chromium yet, and the results are quite bad anyway. Can we get the computed color values in JavaScript and adjust using that?
</p>

<h2>Relative lightness, via mixing</h2>
<p>Handles the necessary chroma shifts required for very light colors in an easy-to-understand manner.</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile mixed" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>

<h2>Relative lightness, multiplicative</h2>
<p>Identical results to the mixing method, but not nearly as easy to understand. But allows for the absolute greatest flexibility.</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile relativelightnessmultiply" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>

<h2>Relative lightness, additive</h2>
<p>Not useful.</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile relativelightness" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>

<h2>Fixed lightness</h2>
<p>Guaranteed contrast ratio, but minimal creative control and only works on certain base colors.</p>
<div class="stack">
	{#each ColorEntries as [name, hex]}
		<div class="swatchtile fixedlightness" style:--base={hex}>
			<Button accent>{name}</Button>
		</div>
	{/each}
</div>
