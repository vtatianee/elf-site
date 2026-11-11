/**
 * Structured data (JSON-LD) for idea pages: schema.org HowTo.
 * Built only from the idea's own data — nothing invented.
 */
import { siteConfig } from '@/config/site'
import type { Idea } from '@/lib/ideas'
import type { SocialImage } from '@/lib/illustrations'
import { absoluteUrl, routes } from '@/lib/routes'

export function howToJsonLd(idea: Idea, description: string, image: SocialImage | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: idea.title,
    description,
    url: absoluteUrl(routes.idea(idea.slug)),
    inLanguage: siteConfig.locale,
    ...(idea.time.minutes !== null ? { totalTime: `PT${idea.time.minutes}M` } : {}),
    ...(image ? { image: { '@type': 'ImageObject', url: image.url, width: image.width, height: image.height } } : {}),
    supply: idea.materials.map((name) => ({ '@type': 'HowToSupply', name })),
    step: idea.steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
      url: `${absoluteUrl(routes.idea(idea.slug))}#step-${index + 1}`,
    })),
  }
}

/** Serialises JSON-LD for a <script> tag; `<` is escaped so the text can never close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
