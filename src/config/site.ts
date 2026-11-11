/**
 * SITE CONFIG — the ONE file the owner edits.
 * ---------------------------------------------------------------------------
 * Everything that changes between "placeholder" and "launch" lives here:
 * domain, site name, operator, contact email, Amazon affiliate tag, Idea List
 * links, email provider and analytics.
 *
 * How to change a value: edit the text between the quotes, save, commit and
 * push. Cloudflare Pages rebuilds the site by itself. No other file needs to
 * be touched.
 *
 * Lines marked TODO-OWNER must be filled in before launch (Gate 5).
 *
 * Technical note for developers: this file is also loaded directly by Node in
 * `scripts/` (before the Next.js build). Keep it free of imports and of
 * TypeScript-only runtime syntax (no enums, no path aliases).
 */

// ---------------------------------------------------------------------------
// Fixed legal strings. Do NOT reword — the exact wording is required.
// ---------------------------------------------------------------------------

/** Amazon Associates disclosure. Must appear on every page that has an Amazon link. */
export const AMAZON_DISCLOSURE =
  'As an Amazon Associate I earn from qualifying purchases.'

/** Shown on /about/ and under the main illustration of every idea page. */
export const ILLUSTRATION_DISCLOSURE =
  'Illustrated guide — scenes are original illustrations, not photos.'

// ---------------------------------------------------------------------------
// 1. DOMAIN
// ---------------------------------------------------------------------------
// The final domain is NOT chosen yet. `https://dailyelfmagic.com` is a
// placeholder. To change the domain, set the environment variable
// NEXT_PUBLIC_SITE_URL in Cloudflare Pages (Settings > Variables and Secrets)
// — or change the placeholder below. Nothing else in the code names the domain.

const PLACEHOLDER_SITE_URL = 'https://dailyelfmagic.com' // TODO-OWNER: final domain

/** Removes spaces and any trailing slash, so URLs can be joined safely. */
function cleanUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

// ---------------------------------------------------------------------------
// 2. THE CONFIG
// ---------------------------------------------------------------------------

export const siteConfig = {
  /** Public address of the site, without a trailing slash. */
  url: cleanUrl(envSiteUrl && envSiteUrl.trim() !== '' ? envSiteUrl : PLACEHOLDER_SITE_URL),

  /** True while the site still runs on the placeholder domain. */
  urlIsPlaceholder: !(envSiteUrl && envSiteUrl.trim() !== ''),

  /**
   * Site name. Placeholder derived from the placeholder domain — not final.
   * TODO-OWNER: confirm together with the domain.
   * Rule: never use the trademark "Elf on the Shelf" as the name or brand.
   */
  name: 'Daily Elf Magic',

  /**
   * One-line description used as the default meta description.
   * Placeholder copy (the promise from the source document); Marketing may
   * replace it.
   */
  description:
    'A new elf idea every night - in under 5 minutes, with stuff you already have.',

  /** Language and region of the site. Do not change. */
  locale: 'en-US',

  /**
   * Site operator and Amazon Associates account holder. Named on /privacy/,
   * /about/ and in the affiliate disclosure.
   */
  operator: {
    name: 'Vanessa Tatiane Evangelista Assink',
  },

  /**
   * Contact email shown on /contact/ and /privacy/.
   * TODO-OWNER: placeholder — may be changed before launch.
   */
  contactEmail: 'arche.boost@gmail.com',

  // -------------------------------------------------------------------------
  // 3. AMAZON ASSOCIATES (the only monetization — no ads on this site)
  // -------------------------------------------------------------------------
  amazon: {
    /**
     * TODO-OWNER: Amazon Associates tracking ID of the account holder,
     * for example 'yourname-20'. Leave '' until the account exists.
     *
     * While it is empty: every Amazon link is a plain search link WITHOUT a
     * tag, and the build prints the warning "affiliate tag not set".
     * Never invent a value here.
     */
    associateTag: '',

    /**
     * Amazon store the links point to. The Canadian store (amazon.ca) is
     * linked through OneLink inside the Amazon Associates account, not here.
     */
    marketplaceHost: 'www.amazon.com',

    /**
     * "Buy the kit" button: one Amazon Idea List per idea.
     *
     * TODO-OWNER: paste the full Idea List address for each idea, using the
     * idea's slug (the last part of its page address) as the key. Example:
     *
     *   'marshmallow-bubble-bath': 'https://www.amazon.com/shop/...',
     *
     * Rules:
     * - An idea that is NOT listed here has no kit button; its per-material
     *   search links still show.
     * - Paste the full amazon.com address. Shortened or masked links
     *   (amzn.to, bit.ly, redirects) are not allowed and stop the build.
     */
    ideaListUrls: {} as Record<string, string>,
  },

  // -------------------------------------------------------------------------
  // 4. EMAIL CAPTURE ("1 idea a day in December")
  // -------------------------------------------------------------------------
  email: {
    /**
     * TODO-OWNER: no email provider has been chosen. Keep `null`.
     *
     * While it is `null`, every email form on the site shows a clear
     * "coming soon" state, collects nothing and sends nothing. Connecting a
     * provider later is a separate task for a developer (it is out of the
     * MVP) — do not type a provider name, API key or list ID here.
     */
    provider: null as EmailProvider | null,
  },

  // -------------------------------------------------------------------------
  // 5. ANALYTICS (optional, OFF by default)
  // -------------------------------------------------------------------------
  analytics: {
    /**
     * Cloudflare Web Analytics token (cookieless, no personal data).
     * `null` = analytics OFF: no analytics script is loaded at all.
     *
     * To turn it on: Cloudflare dashboard > Analytics & Logs > Web Analytics >
     * add the site > copy the token and paste it here between quotes.
     * (If you enable Web Analytics from the Pages project settings instead,
     * Cloudflare injects it by itself — then leave this `null`.)
     * No other tracking tool is allowed on this site.
     */
    cloudflareWebAnalyticsToken: null as string | null,
  },
}

/**
 * Shape of a future email provider setting. Intentionally minimal: the MVP
 * ships with `provider: null`. A developer extends this when the owner
 * chooses a provider.
 */
export type EmailProvider = {
  /** Provider name, for example the service the owner signs up for. */
  name: string
  /** Public form endpoint the browser posts to. Never a secret key. */
  formAction: string
}

export type SiteConfig = typeof siteConfig
