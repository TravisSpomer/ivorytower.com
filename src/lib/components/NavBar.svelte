<script lang="ts">
	import { browser } from "$app/env"
	import { darkMode } from "$lib/utils/settings"
	import { currentUser, loginState, LoginState, logout, unreadThreads } from "$lib/data"
	import LightDismiss from "./LightDismiss.svelte"
	import Popup from "./Popup.svelte"
	import User from "./User.svelte"
	
	let header: HTMLElement
	let expanded: boolean

	function toggleHeader()
	{
		expanded = !expanded
	}

	function closeHeader()
	{
		if (expanded) expanded = false
	}

	$: if (browser)
	{
		const element = document.activeElement as (HTMLElement | null)
		if (!expanded && element && "blur" in element as any) element.blur()
	}
</script>

<header bind:this={header} aria-expanded={expanded} tabindex="-1">
	<div><nav>
		<a href="#top" class="skip-to-content">Skip to content</a>
		<div id="expander" tabindex="-1" class="expander"  on:click={toggleHeader}>
			<svg width="48" height="48">
				<path d="M14,17h20m0,7h-20m0,7h20" />
			</svg>
		</div>
		<ul on:click={closeHeader}>
			<li><a href="/"><img src="/images/logotype{$darkMode ? "-dark" : ""}.svg" alt="IvoryTower" width="100" height="32" /></a></li>
			<li class="phone-only"><a href="/">Home</a></li>
			{#if $loginState === LoginState.LoggedIn}
				<li><a href="/forums">Forums</a></li>
			{/if}
			<li><a href="https://old.ivorytower.com/" class="external">Old site</a></li>
			<li class="not-phone flexspacer"></li>
			{#if $unreadThreads.next}
				<li><a href="/threads/{$unreadThreads.next.id}" sveltekit:noscroll title="Next: {$unreadThreads.next.title}">{$unreadThreads.length} unread ›</a></li>
			{/if}
			<li>
				{#if $loginState === LoginState.LoggedIn && $currentUser}
					<Popup onHover>
						<span slot="anchor"><User username={$currentUser.username} on:click={ev => ev.preventDefault()}>Hi {$currentUser.shortName}</User></span>
						<a href="/" on:click|preventDefault={logout}>Sign out</a>
					</Popup>
				{/if}
			</li>
		</ul>
	</nav></div>
</header>

{#if expanded}
	<LightDismiss on:close={closeHeader} zIndex={99998} />
{/if}
