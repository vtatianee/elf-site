/**
 * Every internal address of the site is built here — never by hand in a page.
 * Server-side only: it imports the ideas data (for the hub list). Client
 * Components receive ready-made addresses as props.
 * All paths start and end with a slash (`trailingSlash: true`).
 */
import { siteConfig } from '@/config/site'
import { HUBS, type Hub } from '@/lib/ideas'

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
 * Static pages (everything except the 60 idea pages), in sitemap order.
 * `npm run build` fails when an exported page is missing from the sitemap,
 * or the sitemap lists a page that was not exported — add new pages here.
 */
export const staticPaths: string[] = [
  routes.home,
  routes.ideas,
  ...HUBS.map((hub) => routes.hub(hub)),
  routes.planner,
  routes.printables,
  routes.shop,
  routes.about,
  routes.contact,
  routes.privacy,
]

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
