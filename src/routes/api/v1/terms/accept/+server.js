import { json } from "@sveltejs/kit"

/** @type {import("./$types").RequestHandler} */
export async function POST()
{
	return json({
		acceptedTerms: true
	})
}
