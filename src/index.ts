import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { compressImage } from './compressor'

const app = new Elysia()
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
    })
    .listen(3001);

console.log(`🚀 Skill HTTP Server: http://localhost:3001`);
console.log(`📄 Spec: http://localhost:3001/v1/spec`);
