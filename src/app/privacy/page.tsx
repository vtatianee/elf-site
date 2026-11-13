/*
 * /privacy/ — privacy policy. Names the operator (Vanessa Tatiane Evangelista
 * Assink) and describes ONLY what the site actually does (handoff 01 §7).
 *
 * Keep it true: if the site starts doing something new (email provider,
 * analytics on, a new browser-storage key), this page changes in the same
 * commit. The analytics paragraph follows the config automatically.
 *
 * COPY STATUS: Developer draft. Not legal advice — the PM flags it for the
 * owner's review (and her lawyer, if she wants one) before launch.
 */
import Link from 'next/link'
import { AMAZON_DISCLOSURE, siteConfig } from '@/config/site'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `What ${siteConfig.name} collects (almost nothing), what stays on your device, and how affiliate links work.`,
  path: routes.privacy,
})

/** Date of the last change to this text. Update it whenever the text changes. */
const LAST_UPDATED = 'November 13, 2026'

export default function PrivacyPage() {
  const analyticsOn = Boolean(siteConfig.analytics.cloudflareWebAnalyticsToken?.trim())

  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Privacy Policy</h1>
        <p className="section__sub">Last updated: {LAST_UPDATED}</p>
      </header>
      <div className="prose section">
        <h2>Who runs this site</h2>
        <p>
          {siteConfig.name} is operated by <strong>{siteConfig.operator.name}</strong>, who is also the Amazon Associates
          account holder for this site. You can reach the operator at{' '}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        </p>

        <h2>The short version</h2>
        <ul>
          <li>No accounts, no comments, no contact form. We don’t ask for your name or email.</li>
          <li>No ads and no advertising trackers.</li>
          <li>This site sets no cookies.</li>
          <li>A few features remember your choices on your own device. That data never reaches us.</li>
        </ul>

        <h2>What stays on your device</h2>
        <p>Two features use your browser’s local storage. The data stays in your browser and is never sent to us:</p>
        <ul>
          <li>
            <strong>Tonight Mode</strong> remembers which ideas it showed you tonight and last night, so it doesn’t repeat
            them.
          </li>
          <li>
            <strong>The December planner</strong> remembers the plan you made.
          </li>
        </ul>
        <p>
          You can delete this data at any time by clearing this site’s data in your browser settings. The ticks you make
          on checklists (materials on idea pages, the planner’s shopping list) are not saved at all.
        </p>

        <h2>Email sign-up</h2>
        <p>
          The “1 idea a day in December” sign-up is not open yet. The form is switched off: nothing you type into it is
          saved or sent. If that changes, this policy will say which service handles the emails before the form is
          switched on.
        </p>

        <h2>Analytics</h2>
        {analyticsOn ? (
          <p>
            We use Cloudflare Web Analytics to count page views. It does not use cookies and does not track you across
            other websites; we see totals, not individual visitors.
          </p>
        ) : (
          <p>This site does not run any analytics or visitor-tracking tool.</p>
        )}

        <h2>Hosting</h2>
        <p>
          The site is hosted on Cloudflare Pages. Like any web host, Cloudflare processes technical information such as
          your IP address and browser type to deliver pages and protect the site from abuse. Our fonts and images are
          served from this site itself, not from third-party services.
        </p>

        <h2>Amazon links</h2>
        <p>
          {AMAZON_DISCLOSURE} Some pages link to products on Amazon. If you click one, you leave this site and Amazon’s
          own privacy policy applies; Amazon may use cookies to know that you came from here. We don’t receive your
          personal details or see what you buy — only summary reports of qualifying purchases.
        </p>

        <h2>Pinterest button</h2>
        <p>
          The “Pin” button on idea pages is a plain link to Pinterest. No Pinterest code runs on this site, and Pinterest
          only receives information if you click the button.
        </p>

        <h2>Children</h2>
        <p>
          This site is written for parents and other grown-ups. It is not directed to children under 13, and we don’t
          knowingly collect personal information from children.
        </p>

        <h2>Changes</h2>
        <p>
          If the site starts doing something new with data, this page will be updated first and the date above will
          change.
        </p>

        <p>
          Questions? See the <Link href={routes.contact}>contact page</Link>.
        </p>
      </div>
    </main>
  )
}
