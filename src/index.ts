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

app.patch('/upload', async (c) => {
	const { file, name } = await c.req.parseBody<FileUploadBody>();

	const key = name || file.name

	const existingFile = await c.env.BUCKET.get(key);
	if (!existingFile) {
		return c.json({ error: 'File not found' }, 404);
	}

	// If the file exists, update it
	await c.env.BUCKET.delete(key);
	await c.env.BUCKET.put(key, file, {
		httpMetadata: {
			contentType: file.type,
		}
	})
	
	return c.json({ message: 'File updated successfully', key });
})

export default app