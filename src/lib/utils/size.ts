/**
	Creates a semicolon-terminated CSS style rule based on a size property and a value.
	@param prop The name of the CSS property to set.
	@param value A value, either as a number, string, or undefined/null. If a number, the value will be interpreted as pixels.
	@returns A semicolon-terminated CSS style rule setting prop to value[px], or an empty string if value is undefined or null.
*/
export function sizeToCss(prop: string, value: number | string | undefined | null): string
{
	return value ? `${prop}: ${typeof value === "number" ? `${value}px` : value};` : ""
}
