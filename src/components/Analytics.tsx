import { siteConfig } from '@/config/site'

/**
 * OPTIONAL ANALYTICS SLOT — Cloudflare Web Analytics only.
 *
 * OFF by default: while `analytics.cloudflareWebAnalyticsToken` in
 * `src/config/site.ts` is `null`, this renders nothing and no analytics
 * script is loaded.
 *
 * Cloudflare Web Analytics is cookieless and collects no personal data.
 * No other tracking tool may be added to this site. No ad script, ever.
 * (The two Cloudflare hosts used here are already allowed in public/_headers.)
 */
export function Analytics() {
  const token = siteConfig.analytics.cloudflareWebAnalyticsToken
  if (token === null || token.trim() === '') return null
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: token.trim() })}
    />
  )
}
