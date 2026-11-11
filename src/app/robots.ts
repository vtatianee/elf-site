import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/routes'

// Required for a static export: the file is written once, at build time.
export const dynamic = 'force-static'

/** /robots.txt — everything may be crawled; nothing is blocked or noindexed. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
