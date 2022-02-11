<script lang="ts">
	import { browser } from "$app/env"
	import { goto } from "$app/navigation"
	import { darkMode, phone } from "$lib/utils/settings"
	import { currentUser, loginState, LoginState, logout, unreadThreads } from "$lib/data"
	import LightDismiss from "./LightDismiss.svelte"
	import Popup from "./Popup.svelte"
	import SearchBox from "./SearchBox.svelte"
	
	let expanded: boolean

	function toggleHeader()
	{
		expanded = !expanded
	}

	function closeHeader()
	{
		if (expanded) expanded = false
	}

	function onSearch(e: CustomEvent<{value: string}>): void
	{
		if (e.detail.value === "") return
		goto(`https://old.ivorytower.com/Search.aspx?For=${e.detail.value}`)
	}

	$: if (browser)
	{
		const element = document.activeElement as (HTMLElement | null)
		if (!expanded && element && "blur" in element as any) element.blur()
	}
</script>

<style lang="scss">
	@import "../../core.scss";

	header
	{
		$outset: 40px; // How much the content can spill out of the column, to line up header text with body text

		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
		left: 0;
		right: 0;
		white-space: nowrap;
		z-index: 99999;
		overflow: hidden;

		color: var(--foreground);
		background-color:  var(--background);

		font-family: $font-accent;
		font-weight: $font-weight;
		font-size: 20px;
		letter-spacing: .02em;
		line-height: 32px;

		user-select: none;

		@media (max-width: $full-width)
		{
			overflow-x: auto;
		}

		@include phone-only
		{
			height: 48px;

			box-shadow: 0 1px 3px var(--background);

			transition:
				height 250ms ease,
				box-shadow 750ms ease;

			&[aria-expanded = "true"], &:focus-within
			{
				height: 168px; /* set an explicit height for animation */

				box-shadow: 0 0px 12px rgba(black, 0.2);
			}
		}

		@supports (backdrop-filter: blur(16px))
		{
			background-color: var(--background-trans);
			backdrop-filter: blur(16px);
		}

		& > *
		{
			display: flex;

			& > *
			{
				flex: 1 1 #{$full-width + $outset * 2};
				max-width: #{$full-width + $outset * 2};
				margin: 0 auto;
			}
		}

		ul
		{
			margin: 0;
			padding: 0;
			height: 80px;

			display: flex;
			align-items: center;

			list-style-type: none;

			@include phone-only
			{
				height: unset;
				margin: 8px 0 0 0;
				flex-direction: column;
				align-items: flex-start;
			}
		}
		
		li
		{
			display: inline-block;
			margin: 0;

			@include phone-only
			{
				margin-bottom: 8px;
			}
		}
		
		li > *:first-child
		{
			display: inline-block;
			margin: 0 12px;
			padding: 0 8px;
		}
		
		.expander
		{
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			height: 48px;

			outline: none; /* fixes focus rect on Safari */
			text-align: right;

			cursor: pointer;

			@include not-phone
			{
				display: none;
			}

			svg
			{
				stroke: var(--foreground);
				stroke-width: 2px;
				fill: none;
			}
		}

		a.skip-to-content
		{
			position: absolute;
			transform: translateY(-48px);
			top: 8px;
			left: 16px;
			padding: 0 1em 0.25em 1em;

			background-color: var(--primary-dark2);
			color: white;

			transition: transform 150ms ease;

			&:focus
			{
				color: white;
				transform: translateY(0);
			}
		}
	}

	a, a:visited
	{
		color: var(--primary-dark3);
		font-weight: $font-weight-bold;
		text-decoration: none;
		@include caps;

		:global(.theme-dark) &
		{
			color: var(--foreground);
		}

		img
		{
			transition: opacity 0.1s;
		}
	}
	
	a:hover, a:focus
	{
		color: var(--primary-dark1);
		text-decoration: underline;
		text-decoration-thickness: 2px;

		:global(.theme-dark) &
		{
			color: var(--primary-light2);
			background-color: rgba(255, 255, 255, 0.2);
		}

		img
		{
			opacity: 0.6;

			:global(.theme-dark) &
			{
				opacity: 1;
			}
		}
	}

	a:focus:not(:focus-visible):not(:hover)
	{
		color: var(--primary-dark3);
		text-decoration: none;
		background-color: unset;

		img
		{
			opacity: unset;
		}
	}

	.phone-unread-count
	{
		color: var(--red-dark1);
		font-size: $font-size-tiny;
	}
</style>

<header aria-expanded={expanded} tabindex="-1">
	<div><nav>
		<a href="#top" class="skip-to-content">Skip to content</a>
		<div id="expander" tabindex="-1" class="expander"  on:click={toggleHeader}>
			<svg width="48" height="48">
				<path d="M14,17h20m0,7h-20m0,7h20" />
			</svg>
		</div>
		<ul on:click={closeHeader}>
			<li>
				<a href="/">
					<img src="/images/logotype{$darkMode ? "-dark" : ""}.svg" alt="IvoryTower" width="100" height="32" />
					{#if $phone && $unreadThreads.next}
						<span class="phone-unread-count">({$unreadThreads.length})</span>
					{/if}
				</a>
			</li>
			<li class="phone-only"><a href="/">Home</a></li>
			{#if $loginState === LoginState.LoggedIn}
				<li><span>
					<a href="/forums">Forums</a>
					{#if $phone && $unreadThreads.next}
						• <a href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="Next: {$unreadThreads.next.title}">{$unreadThreads.length} unread</a>
					{/if}
				</span></li>
				<li class="not-phone">
					<SearchBox small collapsed on:submit={onSearch} />
				</li>
			{/if}
			<li class="not-phone flexspacer"></li>
			{#if !$phone && $unreadThreads.next}
				<li class="not-phone"><a href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="Next: {$unreadThreads.next.title}">{$unreadThreads.length} unread ›</a></li>
			{/if}
			{#if $loginState === LoginState.LoggedIn && $currentUser}
				<li>
					{#if $phone}
						<a href="/" on:click|preventDefault={logout}>Sign out {$currentUser.shortName}</a>
					{:else}
						<span><Popup onHover>
							<span slot="anchor"><a href="/" on:click={ev => ev.preventDefault()}>Hi {$currentUser.shortName}</a></span>
							<a href="/" on:click|preventDefault={logout}>Sign out</a>
						</Popup></span>
					{/if}
				</li>
			{/if}
		</ul>
	</nav></div>
</header>

{#if expanded}
	<LightDismiss on:close={closeHeader} zIndex={99998} />
{/if}
