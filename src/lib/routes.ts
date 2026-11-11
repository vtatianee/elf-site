/**
 * Every internal address of the site is built here — never by hand in a page.
 * All paths start and end with a slash (`trailingSlash: true`).
 */
import { siteConfig } from '@/config/site'
import type { Hub } from '@/lib/ideas'

/**
 * Filters of the /ideas/ grid live in the query string, so a filtered view
 * can be linked to: /ideas/?room=kitchen&mess=zero
 * Keys are the 6 filter dimensions; values are the tag values of ideas.json.
 * The canonical address of every filtered view is /ideas/ itself.
 */
export type IdeasFilter = Partial<
  Record<'time' | 'mess' | 'age' | 'room' | 'material' | 'type', string>
>

export const routes = {
  home: '/',
  ideas: '/ideas/',
  /** /ideas/ with filters pre-selected, e.g. "more ideas in the kitchen". */
  ideasWith: (filter: IdeasFilter) => {
    const query = new URLSearchParams(filter as Record<string, string>).toString()
    return query === '' ? '/ideas/' : `/ideas/?${query}`
  },
  idea: (slug: string) => `/ideas/${slug}/`,
  hub: (hub: Hub) => `/${hub}/`,
  planner: '/planner/',
  printables: '/printables/',
  shop: '/shop/',
  about: '/about/',
  contact: '/contact/',
  privacy: '/privacy/',
} as const

/**
 * Static pages (everything except the 60 idea pages) that EXIST today and
 * must be listed in the sitemap.
 *
 * DEVELOPER: add each page here when you build it (/ideas/, the 8 hubs,
 * /planner/, /printables/, /shop/, /about/, /contact/, /privacy/). You cannot
 * forget: `npm run build` fails when an exported page is missing from the
 * sitemap, or the sitemap lists a page that was not exported.
 */
export const staticPaths: string[] = [routes.home]

/** Makes sure a path starts and ends with exactly one slash. */
export function normalizePath(path: string): string {
  const trimmed = path.trim().replace(/^\/+|\/+$/g, '')
  return trimmed === '' ? '/' : `/${trimmed}/`
}

/** Full public address for a path or a file, using the configured domain. */
export function absoluteUrl(pathOrFile: string): string {
  const path = pathOrFile.startsWith('/') ? pathOrFile : `/${pathOrFile}`
  return `${siteConfig.url}${path}`
}
