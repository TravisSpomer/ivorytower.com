type ActionReturnType = ActionOptions | void

interface ActionOptions
{
	update?: (parameters: any) => void
	destroy?: () => void
}

export function scrollIntoView(node: HTMLElement, { enabled, defer } : { enabled?: boolean, defer?: boolean } = { enabled: true, defer: false }): ActionReturnType
{
	if (enabled)
	{
		if (defer)
			setTimeout(() => node.scrollIntoView({ behavior: "smooth" }), 0)
		else
			node.scrollIntoView({ behavior: "smooth" })
	}
}
