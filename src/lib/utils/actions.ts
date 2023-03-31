type ActionReturnType = ActionOptions | void
type Action = (node: HTMLElement, options: Record<string, unknown>) => ActionReturnType

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
// The following is valid in TypeScript 5 and produces no output change, but ESLint doesn't support it yet:
// scrollIntoView satisfies Action
