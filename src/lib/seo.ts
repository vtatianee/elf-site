/**
 * Metadata helper: title, description, canonical address, Open Graph and
 * Twitter card for one page.
 *
 * DEVELOPER: every page exports its metadata through `buildMetadata()`:
 *
 *   export const metadata = buildMetadata({
 *     title: 'No-Mess Elf Ideas',
 *     description: '...',
 *     path: routes.hub('no-mess'),
 *   })
 *
 * The build fails when a page has no canonical address, when the canonical
 * does not match the page, or when a page carries `noindex`.
 */
import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { getDefaultSocialImage, type SocialImage } from '@/lib/illustrations'
import { absoluteUrl, normalizePath } from '@/lib/routes'

type PageMetadataInput = {
  /**
   * Page title WITHOUT the site name — the root layout appends it
   * ("Title | Site name"). Leave out on the home page.
   */
  title?: string
  description: string
  /** Path of the page, e.g. "/ideas/marshmallow-bubble-bath/". */
  path: string
  /** Horizontal sharing image. Defaults to the site-wide one, when it exists. */
  image?: SocialImage | null
  /** Open Graph type. Idea pages are articles; everything else is a website. */
  type?: 'website' | 'article'
}

export function buildMetadata(input: PageMetadataInput): Metadata {
  const path = normalizePath(input.path)
  const url = absoluteUrl(path)
  const image = input.image ?? getDefaultSocialImage()
  const socialTitle = input.title ?? siteConfig.name
  const images = image
    ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }]
    : undefined

  return {
    ...(input.title ? { title: input.title } : {}),
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? 'website',
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale.replace('-', '_'),
      title: socialTitle,
      description: input.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      // The large card needs a raster image; fall back to the small card.
      card: images ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description: input.description,
      ...(images ? { images } : {}),
    },
  }
}

/**
 * Address for a "Pin it" link. A plain link — no Pinterest script is loaded
 * on the site.
 *
 * `image` must be the VERTICAL social image of the idea
 * (`getSocialImage(idea, 'vertical')`). The pin title goes in `description`
 * (text layer) — never inside the image.
 */
export function pinterestPinUrl(path: string, image: SocialImage, description: string): string {
  const pin = new URL('https://www.pinterest.com/pin/create/button/')
  pin.searchParams.set('url', absoluteUrl(normalizePath(path)))
  pin.searchParams.set('media', image.url)
  pin.searchParams.set('description', description)
  return pin.toString()
}
