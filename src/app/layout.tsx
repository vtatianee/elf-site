import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Analytics } from '@/components/Analytics'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { siteConfig } from '@/config/site'
import { fontBody, fontDisplay } from './fonts'

// STYLES — order matters: design tokens first, then the reset.
// The Designer owns src/styles/tokens.css.
import '@/styles/tokens.css'
import '@/styles/globals.css'
import '@/styles/components.css'

/**
 * Defaults for every page. Each page adds its own title, description and
 * canonical address with `buildMetadata()` from src/lib/seo.ts.
 *
 * There is intentionally no `robots` entry: nothing on this site is
 * `noindex`.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale} className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
