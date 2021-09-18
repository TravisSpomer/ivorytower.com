import { call } from "./api"

/** A response from the hello API. */
export interface HelloResponse
{
	/** The current server API version. */
	version: number
	/** The date/time that the server code was built. */
	built: Date
}

/**
	Returns the current server version.
*/
export async function hello(): Promise<HelloResponse>
{
	const response = await call("/hello")
	if (response.built) response.built = new Date(response.built as unknown as string)
	return response
}
