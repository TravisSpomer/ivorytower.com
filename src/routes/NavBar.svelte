<script lang="ts">
	import { MediaQuery } from "svelte/reactivity"
	import { browser } from "$app/environment"
	import { Badge, LightDismiss, Logo, Popup, SearchBox } from "$lib/components"
	import { currentUser, loginState, LoginState, logout, unreadThreads } from "$lib/data"

	export interface Props
	{
		/** If true, only the essential elements are shown. */
		minimal?: boolean
	}

	const { minimal = false }: Props = $props()

	const phone = new MediaQuery("width <= 600px")

	let expanded: boolean = $state(false)

	function toggleHeader()
	{
		expanded = !expanded
	}

	function closeHeader()
	{
		if (expanded) expanded = false
	}

	function onClickSignOut(ev: MouseEvent)
	{
		ev.preventDefault()
		logout()
	}

	function onSearch(ev: {value: string}): void
	{
		if (ev.value === "") return
		location.href = `https://old.ivorytower.com/Search.aspx?For=${ev.value}`
	}

	if (browser)
	{
		$effect(() =>
		{
			const element = document.activeElement as (HTMLElement | null)
			if (!expanded && element && "blur" in element as any) element.blur()
		})
	}
</script>

<style>

	header
	{
		--outset: 40px; /* How much the content can spill out of the column, to line up header text with body text */

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

		font-weight: var(--font-weight);
		font-size: 20px;
		letter-spacing: .02em;
		line-height: 32px;

		user-select: none;

		--link: var(--link-nav);
		--link-hover: var(--link-nav-hover);

		transition: background-color 500ms ease;

		@media (width <= 1060px) /* = 900px + 160px */
		{
			overflow-x: auto;
		}

		@media (width <= 600px)
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
				flex: 1 1 calc(900px + var(--outset) * 2);
				max-width: calc(900px + var(--outset) * 2);
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

			@media (width <= 600px)
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

			@media (width <= 600px)
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

			@media (width > 600px)
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

			&:focus-visible
			{
				color: white;
				transform: translateY(0);
			}
		}
	}

	a, a:visited
	{
		font-family: var(--font-caps);
		font-feature-settings: "c2sc" 1;
		text-transform: uppercase;
		font-weight: var(--font-weight-bold);

		&
		{
			text-decoration: none;
		}

		@media (hover: hover) { &:hover
		{
			text-decoration: underline;
			text-decoration-thickness: 2px;
		}}
		&:focus-visible, &:active
		{
			text-decoration: underline;
			text-decoration-thickness: 2px;
		}
	}

	.phone-unread-count
	{
		margin-left: -16px;
		color: var(--red-dark1);
		font-size: var(--font-size-tiny);
	}

	.desktop-badge
	{
		margin-right: 0.5em;
	}
</style>

<header aria-expanded={expanded} tabindex="-1" class:minimal>
	<div><nav>
		<a href="#top" class="skip-to-content">Skip to content</a>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div id="expander" tabindex="-1" class="expander" onclick={toggleHeader}>
			{#if !minimal}
				<svg width="48" height="48">
					<path d="M14,17h20m0,7h-20m0,7h20" />
				</svg>
			{/if}
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<ul onclick={closeHeader}>
			<li>
				<span><Logo /></span>
				{#if !minimal && phone.current && $unreadThreads.next}
					<span class="phone-unread-count"><Badge value={$unreadThreads.length} /></span>
				{/if}
			</li>
			<li class="phone-only"><a href="/">Home</a></li>
			{#if !minimal && $loginState === LoginState.LoggedIn}
				<li><span>
					<a href="/forums">Forums</a>
					{#if phone.current && $unreadThreads.next}
						• <a href="/threads/{$unreadThreads.next.id}" data-sveltekit-noscroll title="Next: {$unreadThreads.next.title}"><Badge value={$unreadThreads.length} /> unread</a>
					{/if}
				</span></li>
				<li class="not-phone">
					<SearchBox small collapsed onsubmit={onSearch} />
				</li>
			{/if}
			<li class="not-phone flexspacer"></li>
			{#if !minimal && !phone.current && $loginState === LoginState.LoggedIn && $unreadThreads.next}
				<li class="not-phone"><a href="/threads/{$unreadThreads.next.id}" data-sveltekit-noscroll title="Next: {$unreadThreads.next.title}"><span class="desktop-badge"><Badge value={$unreadThreads.length} /></span>unread ›</a></li>
			{/if}
			{#if ($loginState === LoginState.LoggedIn || $loginState === LoginState.MustAcceptTerms) && $currentUser}
				<li>
					{#if phone.current}
						<a href="/" onclick={onClickSignOut}>Sign out {$currentUser.shortName}</a>
					{:else}
						<span><Popup onHover>
							{#snippet anchor()}
								<span><a href="/" onclick={ev => ev.preventDefault()}>Hi {$currentUser.shortName}</a></span>
							{/snippet}
							{#snippet children()}
								<a href="/" onclick={onClickSignOut}>Sign out</a>
							{/snippet}
						</Popup></span>
					{/if}
				</li>
			{/if}
		</ul>
	</nav></div>
</header>

{#if expanded}
	<LightDismiss onclose={closeHeader} zIndex={99998} />
{/if}
