import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/ideas'
import { absoluteUrl, routes, staticPaths } from '@/lib/routes'

// Required for a static export: the file is written once, at build time.
export const dynamic = 'force-static'

/**
 * /sitemap.xml — every page of the site, with the configured domain.
 *
 * The 60 idea pages are added automatically. Other pages are listed in
 * `staticPaths` (src/lib/routes.ts). The build fails when this list and the
 * exported pages disagree (scripts/check-export.ts), so the sitemap can never
 * miss a page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticPaths, ...getAllSlugs().map((slug) => routes.idea(slug))]
  return paths.map((path) => ({ url: absoluteUrl(path) }))
}
