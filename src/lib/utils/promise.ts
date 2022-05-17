/**
	Returns a promise that resolves after a specified period of time. Great for horrible testing hacks!
	@param ms The time to wait, in milliseconds, as you would specify in a call to setTimeout.
	@returns A Promise.
*/
export function sleep(ms: Parameters<typeof setTimeout>[1]): Promise<void>
{
	return new Promise(resolve =>
	{
		setTimeout(resolve, ms)
	})
}
