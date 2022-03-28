/**
	Converts a string to a Boolean in a cross-platform manner. Unknown values return null instead.
	@param value The string to convert to a Boolean.
	@returns A Boolean value if the string could be unambiguously converted, or null if it could not.
 */
export function toBoolOrNull(value: string): boolean | null
{
	switch (value.trim())
	{
		case "true":
		case "1":
			return true
		case "false":
		case "0":
			return false
	}
	return null
}

/**
	Converts a string to a Boolean in a cross-platform manner. Unknown values are converted to false.
	@param value The string to convert to a Boolean.
	@return true for "true" or "1", or false for anything else.
*/
export function toBool(value: string): boolean
{
	switch (value.trim())
	{
		case "true":
		case "1":
			return true
	}
	return false
}
