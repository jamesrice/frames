/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the app is fully client-side; /api/generate is served by the
  // Worker (worker/index.ts), which also serves this export as static assets.
  output: 'export',
  images: { unoptimized: true },
}

export default nextConfig
