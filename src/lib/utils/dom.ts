/**
	Determines if an element is within a specific parent element.
	@param element The child element.
	@param parent The potential parent element.
	@returns True if element is within parent, and false otherwise.
*/
export function elementIsWithin(element: Element | null, parent: Element)
{
	while (element)
	{
		element = element.parentElement
		if (element === parent) return true
	}
	return false
}

/**
	Determines if an element is within a specific parent element, or is that element.
	@param element The child element.
	@param parent The potential parent element.
	@returns True if element is within or equal to parent, and false otherwise.
*/
export function elementIsEqualOrWithin(element: Element | null, parent: Element)
{
	while (element)
	{
		if (element === parent) return true
		element = element.parentElement
	}
	return false
}
