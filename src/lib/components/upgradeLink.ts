const specialLinkTypes: Record<string, any> = {}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function registerSpecialLinkType(typename: string, ctor: any): void
{
	// This allows us to avoid circular dependencies, which ES Modules don't like.
	// For example, if we used PostLink directly here:
	// UserHtml -> upgradeLinks -> PostLink -> PostView -> UserHtml
	specialLinkTypes[typename] = ctor
}

const postPath = /^\/?ForumThread\.aspx\?Thread=(\d+)(?:&ShowAll=True)?#Post(\d+)$/i

interface PostLinkProps
{
	threadID: number
	postIndex: number
}

/**
	Tests a link to see if it's a forums post link.
	Returns props that can be passed to PostLink if so, and null if not.
*/
export function parseLink(href: string): PostLinkProps | null
{
	const match = postPath.exec(href)
	if (match)
	{
		const threadID = parseInt(match[1], 10)
		const postIndex = parseInt(match[2], 10)
		if (!isNaN(threadID) && !isNaN(postIndex))
			return { threadID, postIndex }
	}
	return null
}

export function upgradeLink(link: HTMLAnchorElement): void
{
	const href = link.getAttribute("href")
	if (href)
	{
		const linkProps = parseLink(href)
		if (linkProps)
		{
			new specialLinkTypes.PostLink({
				target: link.parentElement!,
				anchor: link,
				props: {
					...linkProps,
					children: link.childNodes
				},
			})
			link.remove()
		}
	}
}
