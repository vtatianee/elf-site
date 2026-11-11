/**
 * Illustration resolver for pages. Runs at BUILD TIME only (it reads the
 * disk): call it from Server Components and from `generateMetadata`, then
 * pass the returned object down as props.
 *
 * The file rules themselves are documented in `./illustration-files.ts`.
 * Short version: the owner drops `vertical.*`, `horizontal.*` and `square.*`
 * into `public/illustrations/<slug>/` and the site picks them up — a final
 * image always wins over the `.svg` placeholder.
 */
import { siteConfig } from '@/config/site'
import {
  ILLUSTRATION_FORMATS,
  SITE_ILLUSTRATION_FOLDER,
  findIllustrationFile,
  socialImageSrc,
  type IllustrationFormat,
} from '@/lib/illustration-files'

export type { IllustrationFormat } from '@/lib/illustration-files'

/** Everything an <img> needs. Safe to pass to Client Components. */
export type Illustration = {
  src: string
  width: number
  height: number
  alt: string
  /** True while the idea still shows the SVG placeholder. */
  isPlaceholder: boolean
}

/** A raster (JPEG) image for link previews and Pinterest, with its full address. */
export type SocialImage = {
  url: string
  width: number
  height: number
  alt: string
}

const ALT_PREFIX = 'Illustration of'

/**
 * Alt text for an illustration. ALWAYS starts with "Illustration of" — an
 * illustration is never described as a photo.
 *
 * Pass `description` when better wording exists (e.g. written by Marketing):
 * "an elf sitting in a bowl of mini marshmallows". Without it, a neutral
 * sentence is built from the idea title.
 */
export function illustrationAlt(title: string, description?: string): string {
  const custom = description?.trim()
  if (custom) {
    if (custom.toLowerCase().startsWith(ALT_PREFIX.toLowerCase())) return custom
    return `${ALT_PREFIX} ${custom}`
  }
  return `${ALT_PREFIX} the Christmas elf scene “${title}”`
}

/**
 * The illustration of one idea in one format, or null when no file exists
 * yet. When it returns null, render nothing (never a broken image).
 */
export function getIllustration(
  idea: { slug: string; title: string },
  format: IllustrationFormat,
  altDescription?: string,
): Illustration | null {
  const file = findIllustrationFile(idea.slug, format)
  if (file === null) return null
  return {
    src: file.src,
    width: file.width,
    height: file.height,
    alt: illustrationAlt(idea.title, altDescription),
    isPlaceholder: file.isPlaceholder,
  }
}

/**
 * The JPEG copy of an idea's illustration, for Open Graph / Twitter
 * (`horizontal`) and for Pinterest (`vertical`).
 *
 * Why a copy: link previews and Pinterest do not accept SVG, and the
 * placeholders are SVG. `scripts/prebuild.ts` converts whatever file is in
 * the idea's folder into `/social/<slug>/<format>.jpg` on every build, so the
 * address stays the same when the owner swaps the illustration.
 */
export function getSocialImage(
  idea: { slug: string; title: string },
  format: IllustrationFormat = 'horizontal',
  altDescription?: string,
): SocialImage | null {
  if (findIllustrationFile(idea.slug, format) === null) return null
  return {
    url: `${siteConfig.url}${socialImageSrc(idea.slug, format)}`,
    ...ILLUSTRATION_FORMATS[format],
    alt: illustrationAlt(idea.title, altDescription),
  }
}

/**
 * Site-wide sharing image for pages that are not an idea (home, hubs, ...).
 * Comes from `public/illustrations/_site/horizontal.*`; null until that file
 * exists.
 */
export function getDefaultSocialImage(): SocialImage | null {
  return getSocialImage(
    { slug: SITE_ILLUSTRATION_FOLDER, title: siteConfig.name },
    'horizontal',
    `a Christmas elf, the mascot of ${siteConfig.name}`,
  )
}
