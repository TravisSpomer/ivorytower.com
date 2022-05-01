<script context="module" lang="ts">
	import type { Load } from "./__layout"
	type LoadInput = Parameters<Load>[0]
	type LoadOutput = Promise<ReturnType<Load>>

	import { startup } from "$lib/utils/startup"

	export async function load({ url: _url, params: _params }: LoadInput): Promise<LoadOutput>
	{
		// When loading this layout for the first time, do app startup stuff.
		startup()
	
		return {}
	}
</script>

<script lang="ts">
	import "../app.scss"
	import { onMount, onDestroy } from "svelte"
	import { browser } from "$app/env"
	import { page } from "$app/stores"
	import { loginState, LoginState, Settings, unreadThreads } from "$lib/data"
	import { darkMode } from "$lib/utils/settings"
	import Footer from "./_Footer.svelte"
	import Login from "./login/_Login.svelte"
	import LoginBackground from "./login/_LoginBackground.svelte"
	import NavBar from "./_NavBar.svelte"
	import Terms from "./login/terms.svelte"

	let timerID: ReturnType<typeof setInterval>

	$: isAnyLoginPage = $page.url.pathname.startsWith("/login")
	$: isTheLoginPage = $page.url.pathname === "/login"
	$: isATestPage = $page.url.pathname.startsWith("/test")
	$: useLoginVisuals = $loginState === LoginState.Anonymous || $loginState === LoginState.LoggingIn || $loginState === LoginState.MustAcceptTerms || isAnyLoginPage

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
		margin: ($indent * 0.5);

		overflow-wrap: anywhere;

		scroll-margin-top: 120px;

		& > .content
		{
			margin: 0 auto;
			max-width: $full-width;
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

<LoginBackground visible={!isATestPage && useLoginVisuals} />

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
