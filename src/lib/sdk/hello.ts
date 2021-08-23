import { call } from "./api"

/** A response from the hello API. */
export interface HelloResponse
{
	/** The current server version */
	version: number
}

/**
	Returns the current server version.
*/
export async function hello(): Promise<HelloResponse>
{
	return call("/hello")
}
