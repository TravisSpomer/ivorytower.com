<script lang="ts">
	import "../app.css"
	import { onMount, onDestroy } from "svelte"
	import { browser } from "$app/environment"
	import { beforeNavigate } from "$app/navigation"
	import { updated } from "$app/state"
	import { page } from "$app/stores"
	import { loginState, LoginState, Settings, unreadThreads } from "$lib/data"
	import { darkMode } from "$lib/utils/settings"
	import Footer from "./_Footer.svelte"
	import Login from "./login/_Login.svelte"
	import LoginBackground from "./login/_LoginBackground.svelte"
	import NavBar from "./_NavBar.svelte"
	import Terms from "./login/terms/+page.svelte"

	// If a new version of the site has been deployed, the next page navigation should do a full reload.
	// https://svelte.dev/docs/kit/configuration#version
	beforeNavigate(({ willUnload, to }) =>
	{
		if (updated.current && !willUnload && to?.url)
			location.href = to.url.href
	})

	let timerID: ReturnType<typeof setInterval>
	let useLoginBackground: boolean = false

	$: isAnyLoginPage = $page.url.pathname.startsWith("/login")
	$: isTheLoginPage = $page.url.pathname === "/login"
	$: isATestPage = $page.url.pathname.startsWith("/test")
	$: useLoginVisuals = $loginState === LoginState.Anonymous || $loginState === LoginState.MustAcceptTerms || $loginState === LoginState.LoggingIn || isAnyLoginPage
	$: if ($loginState !== LoginState.LoggingIn)
	{
		// Don't reevaluate whether or not to use the login background during the "logging in" state; just use what they were before.
		useLoginBackground = useLoginVisuals
	}

	$: if (browser)
	{
		if ($darkMode)
			document.documentElement.classList.add("theme-dark")
		else
			document.documentElement.classList.remove("theme-dark")
	}

	onMount(() =>
	{
		// Periodically refresh our cache of unread threads in the background while logged in.
		timerID = setInterval(() =>
		{
			if ($loginState === LoginState.LoggedIn)
			{
				$unreadThreads.refresh()
			}
		}, Settings.UnreadThreadsRefreshIntervalMs)
	})

	onDestroy(() =>
	{
		if (timerID) clearInterval(timerID)
	})

</script>

<style lang="scss">
	@import "../core";

	main
	{
		position: relative;
		flex: 1 1 auto; /* required for IE11 instead of flex: 1; */
		margin: var(--indent-half);

		overflow-wrap: anywhere;

		scroll-margin-top: 120px;

		& > .content
		{
			margin: 0 auto;
			max-width: 900px;
		}
	}
</style>

<svelte:head>
	<link rel="icon" href={$unreadThreads.length ? "/images/app/logo-icon-badge.svg" : "/images/app/logo-icon.svg"} />
</svelte:head>

<NavBar minimal={useLoginVisuals} />

{#if !isATestPage && useLoginVisuals}
	<!-- Page will be shown in overlay -->
{:else}
	<main id="top">
		<div class="content">
			<slot></slot>
		</div>
	</main>
{/if}

<LoginBackground visible={!isATestPage && useLoginBackground} />

{#if !isATestPage && useLoginVisuals}
	<main id="top">
		<div class="content">
			{#if isTheLoginPage || (!isAnyLoginPage && ($loginState === LoginState.Anonymous || $loginState === LoginState.LoggingIn))}
				<Login />
			{:else if $loginState === LoginState.MustAcceptTerms}
				<Terms />
			{:else}
				<slot></slot>
			{/if}
		</div>
	</main>
{/if}

<Footer />
