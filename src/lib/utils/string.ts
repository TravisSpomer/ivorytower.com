const xmlCharactersToEscape = /([<>&])/g
const xmlEscapedCharacters: Record<string, string> =
{
	"<": "&lt;",
	">": "&gt;",
	"&": "&amp;",
}

/** Escapes a string for use in XML or HTML output. */
export function escapeXml(text: string | any): string
{
	return ((typeof text === "string" ? text : text.toString()) as string).replace(xmlCharactersToEscape, char => xmlEscapedCharacters[char])
}
