import type { NextConfig } from 'next'

/**
 * Static export only: `next build` writes plain HTML/CSS/JS to `out/`.
 * There is no server, no API route, no database and no middleware in this
 * project — Cloudflare Pages just serves the files in `out/`.
 */
const nextConfig: NextConfig = {
  output: 'export',
  // Every page is a folder with an index.html: /ideas/some-idea/
  trailingSlash: true,
  // No image server exists in a static export. Illustrations are served as
  // the files in public/illustrations/ (see src/lib/illustrations.ts).
  images: { unoptimized: true },
  reactStrictMode: true,
  // Do not advertise the framework in a response header / meta tag.
  poweredByHeader: false,
}

export default nextConfig
