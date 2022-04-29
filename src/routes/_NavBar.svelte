<script lang="ts">
	import { browser } from "$app/env"
	import { goto } from "$app/navigation"
	import { phone } from "$lib/utils/settings"
	import { Badge, LightDismiss, Logo, Popup, SearchBox } from "$lib/components"
	import { currentUser, loginState, LoginState, logout, unreadThreads } from "$lib/data"
	
	/** If true, only the essential elements are shown. */
	export let minimal: boolean = false

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
	@import "../core";

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

		font-weight: $font-weight;
		font-size: 20px;
		letter-spacing: .02em;
		line-height: 32px;

		user-select: none;

		--link: var(--link-nav);
		--link-hover: var(--link-nav-hover);

		transition: background-color 500ms ease;

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

		&.minimal
		{
			position: relative;
			background-color: transparent;
			backdrop-filter: none;
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

			background-color: var(--accent-dark2);
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
		font-weight: $font-weight-bold;
		text-decoration: none;
		@include caps;
	}
	
	a:hover, a:focus
	{
		text-decoration: underline;
		text-decoration-thickness: 2px;
	}

	a:focus:not(:focus-visible):not(:hover)
	{
		text-decoration: none;
		background-color: unset;
	}

	.phone-unread-count
	{
		margin-left: -16px;
		color: var(--red-dark1);
		font-size: $font-size-tiny;
	}

	.desktop-badge
	{
		margin-right: 0.5em;
	}
</style>

<header aria-expanded={expanded} tabindex="-1" class:minimal>
	<div><nav>
		<a href="#top" class="skip-to-content">Skip to content</a>
		<div id="expander" tabindex="-1" class="expander" on:click={toggleHeader}>
			{#if !minimal}
				<svg width="48" height="48">
					<path d="M14,17h20m0,7h-20m0,7h20" />
				</svg>
			{/if}
		</div>
		<ul on:click={closeHeader}>
			<li>
				<span><Logo /></span>
				{#if !minimal && $phone && $unreadThreads.next}
					<span class="phone-unread-count"><Badge value={$unreadThreads.length} /></span>
				{/if}
			</li>
			<li class="phone-only"><a href="/">Home</a></li>
			{#if !minimal && $loginState === LoginState.LoggedIn}
				<li><span>
					<a href="/forums">Forums</a>
					{#if $phone && $unreadThreads.next}
						• <a href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="Next: {$unreadThreads.next.title}"><Badge value={$unreadThreads.length} /> unread</a>
					{/if}
				</span></li>
				<li class="not-phone">
					<SearchBox small collapsed on:submit={onSearch} />
				</li>
			{/if}
			<li class="not-phone flexspacer"></li>
			{#if !minimal && !$phone && $loginState === LoginState.LoggedIn && $unreadThreads.next}
				<li class="not-phone"><a href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="Next: {$unreadThreads.next.title}"><span class="desktop-badge"><Badge value={$unreadThreads.length} /></span>unread ›</a></li>
			{/if}
			{#if ($loginState === LoginState.LoggedIn || $loginState === LoginState.MustAcceptTerms) && $currentUser}
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
