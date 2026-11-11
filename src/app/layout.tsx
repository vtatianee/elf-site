import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Analytics } from '@/components/Analytics'
import { siteConfig } from '@/config/site'
import { fontBody, fontDisplay } from './fonts'

// STYLES — order matters: design tokens first, then the reset.
// The Designer owns src/styles/tokens.css.
import '@/styles/tokens.css'
import '@/styles/globals.css'

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
        {/* DEVELOPER: site header goes here. */}
        {children}
        {/*
          DEVELOPER: site footer goes here. It must carry, on every page:
          the operator name (siteConfig.operator.name), the Amazon disclosure
          where the page has Amazon links, and the non-affiliation notice
          (handoff 01, item C7).
        */}
        <Analytics />
      </body>
    </html>
  )
}
