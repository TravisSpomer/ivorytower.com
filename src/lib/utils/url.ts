export function expandUserUrl(input: string): string
{
	if (input.indexOf("/") >= 0 || input.indexOf(".aspx") >= 0) return input
	return `https://${input}`
}
