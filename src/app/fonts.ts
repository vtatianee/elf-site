/**
 * Fonts — self-hosted at build time.
 *
 * `next/font` downloads the font files while the site is built and ships
 * them with the site. Visitors' browsers never contact a third-party font
 * host (no request to Google at runtime).
 *
 * DESIGNER / DEVELOPER: the two families below are PLACEHOLDERS. To change a
 * typeface, change it in this file only. The layout exposes them as CSS
 * custom properties:
 *
 *   --font-face-display   headings
 *   --font-face-body      text
 *
 * `src/styles/tokens.css` should build its own font tokens on top of these,
 * e.g.  --font-display: var(--font-face-display), Georgia, serif;
 *
 * Budget: at most 2 families, `latin` subset only, variable fonts preferred.
 */
import { Fredoka, Nunito } from 'next/font/google'

export const fontDisplay = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-display',
})

export const fontBody = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-body',
})
