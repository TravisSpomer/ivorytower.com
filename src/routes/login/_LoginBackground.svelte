<script lang="ts">
	export let visible: boolean = false

	let renderContents: boolean = visible

	$: if (visible) renderContents = true

	function onTransitionEnd(): void
	{
		if (!visible) renderContents = false
	}
</script>

<style lang="scss">
	@import "../../core";

	.root
	{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;

		--background-login-left: var(--accent-light4);
		--background-login-center: var(--accent-light3);
		--background-login-right: var(--accent-light2);

		:global(.theme-dark) &
		{
			--background-login-left: var(--background);
			--background-login-center: black;
			--background-login-right: var(--background);
		}

		&.hidden
		{
			pointer-events: none;
		}
	}

	.leftrect, .leftpoint, .center, .rightpoint, .rightrect
	{
		position: absolute;
		top: 0;
		height: 100vh;

		transition:
			opacity 300ms ease 200ms,	
			transform 500ms ease;

		@media (prefers-reduced-motion)
		{
			transition: none;
		}
	}

	.leftrect
	{
		left: 0;
		width: 50vw;

		background-color: var(--background-login-left);

		&.hidden
		{
			opacity: 0;
			transform: translateX(-35.5vh);
		}
	}

	.leftpoint
	{
		left: 50vw;
		width: 35.5vh;

		fill: var(--background-login-left);

		&.hidden
		{
			opacity: 0;
			transform: translateX(-35.5vh);
		}
	}

	.center
	{
		left: calc(50vw - 35.5vh);
		width: 71vh;

		fill: var(--background-login-center);

		&.hidden
		{
			transform: scale(0);
		}
	}

	.rightpoint
	{
		left: calc(50vw - 35.5vh + 0.5px);
		width: 35.5vh;

		fill: var(--background-login-right);

		&.hidden
		{
			opacity: 0;
			transform: translateX(35.5vh);
		}
	}

	.rightrect
	{
		left: 50vw;
		width: 50vw;

		background-color: var(--background-login-right);

		&.hidden
		{
			opacity: 0;
			transform: translateX(35.5vh);
		}
	}
</style>

{#if renderContents}
	<div class:root={true} class:hidden={!visible}>
		<div class:leftrect={true} class:hidden={!visible}></div>
		<div class:rightrect={true} class:hidden={!visible}></div>
		<svg viewBox="0 0 35.5 100" class:leftpoint={true} class:hidden={!visible}>
			<path d="M0,0 35.5,50 0,100Z" />
		</svg>
		<svg viewBox="0 0 35.5 100" class:rightpoint={true} class:hidden={!visible}>
			<path d="M35.5,0 0,50 35.5,100Z" />
		</svg>
		<svg viewBox="0 0 71 100" class:center={true} class:hidden={!visible} on:transitionend={onTransitionEnd}>
			<path d="M0,50 35.5,0 71,50 35.5,100Z" />
		</svg>
	</div>
{/if}
