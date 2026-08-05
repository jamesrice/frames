/**
 * Imagology Worker — serves the Next.js static export (assets binding) and the
 * Gemini generation endpoint. The endpoint logic lives in ./generate.ts,
 * unchanged from its Pages Functions days; this file only routes to it.
 */
import { onRequestPost } from './generate'

interface Env {
  GEMINI_API_KEY?: string
  ASSETS: Fetcher
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/generate') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
      }
      return onRequestPost({ request, env })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
