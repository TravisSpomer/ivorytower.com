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
	import { Footer, NavBar } from "$lib/components"
	import Login from "./login/index.svelte"

	let timerID: ReturnType<typeof setInterval>

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
	@import "../core.scss";

	main
	{
		flex: 1 1 auto; /* required for IE11 instead of flex: 1; */
		display: block;
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

<NavBar />

<main id="top">
<div class="content">

{#if $loginState === LoginState.LoggedIn || $page.url.pathname.startsWith("/login")}
	<slot></slot>
{:else}
	<Login />
{/if}

</div>
</main>

<Footer />
