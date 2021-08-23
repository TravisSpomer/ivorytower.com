import { browser } from "$app/env"
import { readable } from "svelte/store"

/** False when the user has enabled an OS setting to disable or reduce animations. */
export const animations = createMediaQueryStore("(prefers-reduced-motion: reduce)", /* invert */ true)
/** True when the user has enabled dark mode. */
export const darkMode = createMediaQueryStore("(prefers-color-scheme: dark)")
/** True when the user's input method is touch (coarse). */
export const touch = createMediaQueryStore("(pointer: coarse)")

/**
	Creates a read-only Svelte store that tracks whether a media query matches.
	(When server rendering, the media query is assumed to always returns false.)
	@param mediaQuery The media query to monitor. It should be a string surrounded by parentheses.
	@param invert If true, the store's value will be false when the media query returns true and vice-versa.
	@returns A store that tracks a media query.
*/
export function createMediaQueryStore(mediaQuery: string, invert: boolean = false): ReturnType<typeof readable>
{
	if (browser)
	{
		const query = window.matchMedia(mediaQuery)
		return readable(
			// Initial value:
			invert ? !query.matches : query.matches,
			set =>
			{
				// Subscribe:
				const handler = (ev: MediaQueryListEvent) => set(invert ? !ev.matches : ev.matches)
				query.addEventListener("change", handler)
				// Unsubscribe:
				return () => query.removeEventListener("change", handler)
			}
		)
	}
	else
	{
		return readable(false, () => undefined)
	}
}
