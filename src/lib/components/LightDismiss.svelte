<script context="module" lang="ts">
	import { browser } from "$app/env"

	interface Closeable
	{
		/** A callback that is executed when the light-dismiss surface is closed. (Typically you'd want to unmount LightDismiss at that time.) */
		onClose: () => void
		/** Normally, the light-dismiss forcefield has a very high z-index. Set this to a *lower* z-index if you want the forcefield to appear below this element. */
		zIndex?: number
	}

	let forcefield: HTMLDivElement | undefined
	let isForcefieldActive: boolean = false
	let dependents: Closeable[] | undefined
	const maxZIndex: number = 100000

	function getForcefield(): HTMLDivElement | undefined
	{
		// Create the forcefield only once per page, on first use, only on the browser.
		if (browser && !forcefield)
		{
			forcefield = document.createElement("div")
			forcefield.style.position = "fixed"
			forcefield.style.top = "0"
			forcefield.style.right = "0"
			forcefield.style.bottom = "0"
			forcefield.style.left = "0"
			forcefield.style.zIndex = maxZIndex.toString()
			forcefield.addEventListener("click", closeAll)
		}
		return forcefield
	}

	function updateForcefield()
	{
		getForcefield()
		if (!forcefield) return

		if (!isForcefieldActive && dependents && dependents.length)
		{
			isForcefieldActive = true
			document.body.appendChild(forcefield)
		}
		else if (isForcefieldActive && (!dependents || dependents.length === 0))
		{
			isForcefieldActive = false
			document.body.removeChild(forcefield)
		}

		if (isForcefieldActive && dependents && dependents.length)
		{
			// Find an appropriate z-index for the forcefield.
			let zIndex = maxZIndex
			for (const closeable of dependents)
				if (closeable.zIndex !== undefined && closeable.zIndex < zIndex) zIndex = closeable.zIndex
			forcefield.style.zIndex = zIndex.toString()
		}
	}

	function closeAll(): boolean
	{
		if (dependents && dependents.length)
		{
			for (const closeable of dependents)
				closeable.onClose()
			dependents = undefined
			return true
		}
		return false
	}

	function addCloseable(closeable: Closeable): void
	{
		if (!closeable) throw new Error()

		if (dependents)
			dependents.push(closeable)
		else
			dependents = [closeable]

		updateForcefield()
	}

	function removeCloseable(closeable: Closeable): void
	{
		if (!dependents) throw new Error()
		const index = dependents.indexOf(closeable)
		if (index >= 0)
			dependents.splice(index, 1)
		else
			throw new Error()

		updateForcefield()
	}

</script>

<script lang="ts">
	import { onMount } from "svelte"

	import { createEventDispatcher } from "svelte"
	const dispatch = createEventDispatcher()

	/**
		Normally, the light-dismiss forcefield has a very high z-index. Set this to a *lower* z-index if you want the forcefield to
		appear below this element. This property cannot be changed after the component is mounted.
	*/
	export let zIndex: number | undefined = undefined

	onMount(() =>
	{
		let isOpen: boolean = false

		const closeMe = () =>
		{
			if (isOpen)
			{
				isOpen = false
				removeCloseable(closeable)
				dispatch("close")
			}
		}

		const closeable = { onClose: closeMe, zIndex }

		isOpen = true
		addCloseable(closeable)
		return closeMe
	})
</script>
