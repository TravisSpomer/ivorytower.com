import { call } from "./api"

/** Information about a single image in user storage. */
export interface Image
{
	/** The title of the image. */
	title: string
	/** The URL of the full-size image. */
	imageUrl: string
	/** The URL of a thumbnail of the image. */
	thumbnailUrl: string
	/** The width of the image in pixels. */
	width: number
	/** The height of the image in pixels. */
	height: number
}

/** A response from the uploadImage API. */
export interface UploadImageResponse
{
	/** Information about the image uploaded. */
	image: Image
	/** True if the image was resized by the server. */
	wasResized?: boolean
}

/** Uploads an image to user storage. */
export async function uploadImage(file: File): Promise<UploadImageResponse>
{
	const formData = new FormData
	formData.append("file", file, file.name)

	return call(`/images`, { body: formData, method: "POST" })
}
