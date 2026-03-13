import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { compressImage } from './compressor'

/**
 * Define the main Elysia app instance
 */
export const app = new Elysia()
    .use(cors())
    .use(swagger({
        path: '/v1/spec',
        documentation: {
            info: {
                title: 'Sharp Compress Skill',
                version: '1.0.0',
                description: 'Elite image optimization skill for AI agents.'
            }
        }
    }))
    .post('/compress', async ({ body }) => {
        return await compressImage(body.path, body.quality);
    }, {
        body: t.Object({
            path: t.String({ description: 'Absolute path to image' }),
            quality: t.Optional(t.Number({ default: 80, description: 'Quality (1-100)' }))
        }),
        detail: {
            tags: ['Skill'],
            summary: 'Optimize Image'
        }
    });

/**
 * For Smithery Deploy: Export a sandbox server function for capability scanning.
 * This allows Smithery to discover tools without needing actual credentials/config.
 */
export function createSandboxServer() {
    return app;
}

/**
 * Standard Web Fetch export for serverless/sandboxed environments
 */
export default {
    fetch: app.fetch
};

/**
 * Only listen to port if running directly (e.g., via bun run)
 */
if (import.meta.main) {
    app.listen(3001);
    console.log(`🚀 Skill HTTP Server: http://localhost:3001`);
    console.log(`📄 Spec: http://localhost:3001/v1/spec`);
}
