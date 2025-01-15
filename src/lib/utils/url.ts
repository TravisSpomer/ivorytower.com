export function expandUserUrl(input: string): string
{
	if (input.indexOf("/") >= 0) return input
	return `https://${input}`
}