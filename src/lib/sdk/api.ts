import { browser } from "$app/environment"

// See the readme for details on how to change the API endpoint.
export const apiEndpoint: string =
		((import.meta.env.VITE_API_SERVER === "http://localhost" ||
		import.meta.env.VITE_API_SERVER === "https://localhost") ?
			"" :
			(import.meta.env.VITE_API_SERVER || "https://api.ivorytower.com")
		)
		+ "/api/v1"

/**
	A wrapper around fetch() that lets you pass API-relative URLs such as "/hello", and automatically decodes the response.
	@param api The name of the web API to call, starting with a "/".
	@param init The extra options to pass to fetch().
	@returns A Promise for the response data in the same form as (await fetch()).json().
*/
export async function call(api: string, init?: RequestInit): Promise<any>
{
	return (await callWithFullResponse(api, init)).json()
}

/**
	A version of call() that returns the raw Response instead of decoding the body as JSON.
	@param api The name of the web API to call, starting with a "/".
	@param init The extra options to pass to fetch().
	@returns A Promise for the response data in the same form as (await fetch()).
*/
export async function callWithFullResponse(api: string, init?: RequestInit): Promise<Response>
{
	if (!browser) return new Response()
	if (!api.startsWith("/")) throw new Error()
	return fetch(apiEndpoint + api, { ...init, credentials: "include" })

	// REVIEW: Should you include more headers in the init parameter to be "extra correct"?
	// headers: {
	//     'Accept': 'application/json',
	//     'Content-Type': 'application/json'
	// },
}
