import { browser } from "$app/environment"
import { autoLogin } from "$lib/data"

const enum StartupStage
{
	NotStarted,
	Starting,
	Started,
}

let stage: StartupStage = StartupStage.NotStarted

/**
	Initializes the app. It's safe to call this multiple times, as long as it isn't called recursively from something called by startup().
	This is only used in the browser.
*/
export function startup(): void
{
	// Browsers only! No servers allowed!
	if (!browser) return

	// This only needs to be called once, and can't be reentrant.
	if (stage === StartupStage.Started) return
	if (stage === StartupStage.Starting) throw new Error("Something called by startup() is itself calling startup()!")

	// Now, do all of the startup-time stuff here.
	autoLogin()

	// Yay, all done!
	stage = StartupStage.Started
}
