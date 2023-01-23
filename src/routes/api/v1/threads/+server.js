import { GET as GET1 } from "./1/+server"
import { sleep } from "$lib/utils/promise"

export async function POST()
{
	await sleep(2000)
	return GET1()
}
