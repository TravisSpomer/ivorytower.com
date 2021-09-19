/**
	How often we should check for unread threads in the background whenever logged in.
*/
export const UnreadThreadsRefreshIntervalMs = 5 * 60 * 1000 // 5 minutes

/**
	The maximum number of days worth of posts to show when post clipping is enabled.
*/
export const ThreadClippingMaxAgeDays = 7

/**
	The minimum number of latest posts to show when post clipping is enabled, even if those are beyond the maximum age.
*/
export const ThreadClippingMinLatestPosts = 3
