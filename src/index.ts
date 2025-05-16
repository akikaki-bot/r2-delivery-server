import { Hono } from 'hono'
import { FileUploadBody } from '../types/upload';


const app = new Hono<{ Bindings: Env }>()

app.get('*', async (c, next) => {
	const cacheKey = c.req.url
	const cache = caches.default

	const cachedResponse = await cache.match(cacheKey)
	if (cachedResponse) {
		return cachedResponse
	}

	await next()

	if (!c.res.ok) {
		return
	}

	// キャッシュつける
	c.header('Cache-Control', 's-maxage=60')

	const res = c.res.clone()
	c.executionCtx.waitUntil(cache.put(cacheKey, res))
})

app.post('/upload', async (c) => {
	const { file, name } = await c.req.parseBody<FileUploadBody>();

	const result = await c.env.BUCKET.put(name, file, {
		httpMetadata: {
			contentType: file.type,
		}
	})

	return c.json(result);
})

export default app