export async function get()
{
	return {
		body:

		{
			version: 0.0001,
			built: (new Date()).toISOString(),
		}

	}
}
