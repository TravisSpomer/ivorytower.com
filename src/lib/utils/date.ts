const fullFormatter = new Intl.DateTimeFormat([], {
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
})

const sameYearFormatter = new Intl.DateTimeFormat([], {
	month: "long",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
})

const sameWeekFormatter = new Intl.DateTimeFormat([], {
	weekday: "long",
	hour: "numeric",
	minute: "2-digit",
})

const onlyTimeFormatter = new Intl.DateTimeFormat([], {
	hour: "numeric",
	minute: "2-digit",
})

let nowString: string
let todayPlusSpaceString: string
let yesterdayPlusSpaceString: string
let tomorrowPlusSpaceString: string
const relativeFormatter = ("RelativeTimeFormat" in Intl) ? new Intl.RelativeTimeFormat([], {
	numeric: "auto",
	style: "long",
}) : undefined
if (relativeFormatter)
{
	nowString = relativeFormatter.format(0, "second")
	todayPlusSpaceString = relativeFormatter.format(0, "day") + " "
	yesterdayPlusSpaceString = relativeFormatter.format(-1, "day") + " "
	tomorrowPlusSpaceString = relativeFormatter.format(1, "day") + " "
}

/** The number of milliseconds in a (typical) day. */
const MsPerDay = 86400000

/** Which types of relative formatting to allow: "none", "dates" to allow "yesterday" and "today", or "times" to allow "in 15 minutes". */
type FormatDateRelative = "none" | "dates" | "times"

/**
	Converts a date to a friendly string.
	@param date The date to format.
	@param extraRelative A setting for what kinds of relative dates to allow.
	@returns A formatted string.
*/
export function formatDate(date: Date, relative: FormatDateRelative = "dates"): string
{
	if (relativeFormatter)
	{
		// Old browsers don't get any friendly date formatting.

		const ms = date.getTime()
		const now = new Date()
		const nowMs = now.getTime()
		const diff = ms - nowMs

		// Within 2 seconds
		if (relative !== "none" && diff > -2000 && diff < 2000)
			return nowString

		if (relative === "times")
		{
			// Within a minute
			if (diff > -60000 && diff < 60000)
				return relativeFormatter.format(Math.trunc(diff / 1000), "second")
			// Within 30 minutes
			if (diff > -1800000 && diff < 1800000)
				return relativeFormatter.format(Math.trunc(diff / 60000), "minute")
		}

		if (relative !== "none" && now.getFullYear() === date.getFullYear())
		{
			if (diff > (-2 * MsPerDay) && diff < (2 * MsPerDay))
			{
				// Today
				const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
				const tomorrowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime()
				if (ms >= todayMs && ms < tomorrowMs)
					return todayPlusSpaceString + onlyTimeFormatter.format(date)

				// Yesterday
				const yesterdayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime()
				if (ms >= yesterdayMs && ms < todayMs)
					return yesterdayPlusSpaceString + onlyTimeFormatter.format(date)

				// Tomorrow
				const dayAfterTomorrowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).getTime()
				if (ms >= tomorrowMs && ms < dayAfterTomorrowMs)
					return tomorrowPlusSpaceString + onlyTimeFormatter.format(date)

				// Earlier this week
				const startOfWeekMs = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime()
				if (ms >= startOfWeekMs && ms < todayMs)
					return sameWeekFormatter.format(date)
			}

			// Same calendar year
			return sameYearFormatter.format(date)
		}
	}

	// Not the same calendar year (or old browser with no relative formatting)
	return fullFormatter.format(date)
}
