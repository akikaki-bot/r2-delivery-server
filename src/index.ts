import { Hono } from 'hono'
import { FileUploadBody } from '../types/upload';


const app = new Hono<{ Bindings: Env }>()

app.post('/upload', async (c) => {
	const { file, name } = await c.req.parseBody<FileUploadBody>();

	const key = name || file.name;

	const result = await c.env.BUCKET.put(key, file, {
		httpMetadata: {
			contentType: file.type,
		}
	})

	return c.json(result);
})

export default app