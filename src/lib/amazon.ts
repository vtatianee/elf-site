/**
 * Amazon links — the only place where an Amazon address is built.
 *
 * Rules encoded here (Amazon Associates programme + project decisions):
 * - Links are always full, readable amazon addresses. No shortening, no
 *   masking, no redirect through our own domain.
 * - The affiliate tag comes from `src/config/site.ts`. While it is empty,
 *   links are plain search links WITHOUT a tag.
 * - The "Buy the kit" button exists only when the idea has an Idea List
 *   address in the config. No address = no button.
 * - No prices and no Amazon product photos anywhere on the site.
 *
 * DEVELOPER: whenever a page renders at least one link from this module, it
 * must also show `AMAZON_DISCLOSURE` close to the links (not only in the
 * footer), and each link must carry `rel={AMAZON_LINK_REL}`.
 *
 * This module is also loaded by Node in `scripts/` — keep the relative
 * import with the `.ts` extension and no path alias.
 */
import { siteConfig } from '../config/site.ts'

/** `rel` for every Amazon link. `sponsored` is what search engines expect for affiliate links. */
export const AMAZON_LINK_REL = 'sponsored nofollow noopener'

/** True when the owner has filled in the affiliate tag. */
export function hasAffiliateTag(): boolean {
  return siteConfig.amazon.associateTag.trim() !== ''
}

/** Hosts an Amazon link may use: the configured store, with or without "www.". */
function allowedHosts(): string[] {
  const host = siteConfig.amazon.marketplaceHost.toLowerCase()
  return [host, host.replace(/^www\./, '')]
}

/**
 * Search link for one material, e.g. "mini marshmallows".
 * With a tag:    https://www.amazon.com/s?k=mini+marshmallows&tag=yourname-20
 * Without a tag: https://www.amazon.com/s?k=mini+marshmallows
 */
export function amazonSearchUrl(searchTerm: string): string {
  const url = new URL(`https://${siteConfig.amazon.marketplaceHost}/s`)
  url.searchParams.set('k', searchTerm.trim())
  const tag = siteConfig.amazon.associateTag.trim()
  if (tag !== '') url.searchParams.set('tag', tag)
  return url.toString()
}

/**
 * Checks one Idea List address from the config. Returns a readable problem,
 * or null when the address is fine.
 */
export function ideaListUrlProblem(rawUrl: string): string | null {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return 'is not a valid web address'
  }
  if (url.protocol !== 'https:') return 'must start with https://'
  if (!allowedHosts().includes(url.hostname.toLowerCase())) {
    return `must be a full ${siteConfig.amazon.marketplaceHost} address (shortened or masked links are not allowed)`
  }
  const existingTag = url.searchParams.get('tag')
  const tag = siteConfig.amazon.associateTag.trim()
  if (existingTag !== null && existingTag !== tag) {
    return `already carries a different affiliate tag ("${existingTag}")`
  }
  return null
}

/**
 * Address for the "Buy the kit" button of one idea, or `null` when the idea
 * has no Idea List in the config. `null` means: do NOT render the button.
 */
export function amazonKitUrl(slug: string): string | null {
  const rawUrl = siteConfig.amazon.ideaListUrls[slug]
  if (rawUrl === undefined || rawUrl.trim() === '') return null
  const problem = ideaListUrlProblem(rawUrl.trim())
  if (problem !== null) {
    throw new Error(`[config] Idea List address for "${slug}" ${problem}: ${rawUrl}`)
  }
  const url = new URL(rawUrl.trim())
  const tag = siteConfig.amazon.associateTag.trim()
  if (tag !== '') url.searchParams.set('tag', tag)
  return url.toString()
}
