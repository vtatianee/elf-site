/**
 * Illustration contract — the file rules, shared by the site and by the
 * build scripts. Pure Node code: no path aliases, no imports from the app.
 *
 * WHERE THE FILES LIVE
 *
 *   public/illustrations/<slug>/vertical.*     1000 x 1500  (idea page + Pinterest)
 *   public/illustrations/<slug>/horizontal.*   1200 x 628   (Google + link sharing)
 *   public/illustrations/<slug>/square.*       1080 x 1080  (grid + Instagram, optional)
 *
 * HOW A FILE IS CHOSEN
 *
 * The folder is read at build time and the file is picked by its name
 * (`vertical`, `horizontal`, `square`), whatever its extension. When a folder
 * holds both the placeholder (`vertical.svg`) and a final image
 * (`vertical.webp`, `.png`, `.jpg`...), the final image wins.
 *
 * So the owner swaps an illustration by dropping files into ONE folder per
 * idea. No code edit, no data edit. Deleting the `.svg` is optional.
 */
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

export const ILLUSTRATION_FORMATS = {
  vertical: { width: 1000, height: 1500 },
  horizontal: { width: 1200, height: 628 },
  square: { width: 1080, height: 1080 },
} as const

export type IllustrationFormat = keyof typeof ILLUSTRATION_FORMATS

/**
 * Accepted file types, best first. Everything before `svg` counts as a final
 * image; `svg` is the placeholder.
 */
export const ILLUSTRATION_EXTENSIONS = ['webp', 'avif', 'png', 'jpg', 'jpeg', 'svg'] as const

/** Folder with one sub-folder per idea, relative to the project root. */
export const ILLUSTRATIONS_DIR = path.join('public', 'illustrations')

/** Public address prefix of that folder. */
export const ILLUSTRATIONS_URL_PREFIX = '/illustrations'

/**
 * Folder (inside public/) where the build writes the JPEG copies used for
 * link previews and Pinterest. Generated on every build — never edit, never
 * commit.
 */
export const SOCIAL_DIR = path.join('public', 'social')
export const SOCIAL_URL_PREFIX = '/social'

/**
 * Folder name reserved for the site-wide default sharing image (used by
 * pages that are not an idea): public/illustrations/_site/horizontal.*
 */
export const SITE_ILLUSTRATION_FOLDER = '_site'

export type IllustrationFile = {
  /** Idea slug (= folder name). */
  folder: string
  format: IllustrationFormat
  /** File name as it is on disk, e.g. "vertical.webp". */
  fileName: string
  /** Path on disk relative to the project root. */
  filePath: string
  /** Public address, e.g. "/illustrations/some-idea/vertical.webp". */
  src: string
  /** Contract size of the format. Use for the width/height attributes. */
  width: number
  height: number
  /** True while the chosen file is still the SVG placeholder. */
  isPlaceholder: boolean
}

/**
 * Finds the file for one idea and one format. Returns null when the folder
 * or the file does not exist yet.
 */
export function findIllustrationFile(
  folder: string,
  format: IllustrationFormat,
  projectRoot: string = process.cwd(),
): IllustrationFile | null {
  const dir = path.join(projectRoot, ILLUSTRATIONS_DIR, folder)
  if (!existsSync(dir)) return null

  let best: { fileName: string; rank: number } | null = null
  for (const fileName of readdirSync(dir)) {
    const ext = path.extname(fileName).slice(1).toLowerCase()
    const base = path.basename(fileName, path.extname(fileName)).toLowerCase()
    const rank = (ILLUSTRATION_EXTENSIONS as readonly string[]).indexOf(ext)
    if (base !== format || rank === -1) continue
    if (best === null || rank < best.rank) best = { fileName, rank }
  }
  if (best === null) return null

  const { width, height } = ILLUSTRATION_FORMATS[format]
  return {
    folder,
    format,
    fileName: best.fileName,
    filePath: path.join(ILLUSTRATIONS_DIR, folder, best.fileName),
    // The real file name is kept as-is: the web server is case-sensitive.
    src: `${ILLUSTRATIONS_URL_PREFIX}/${folder}/${encodeURIComponent(best.fileName)}`,
    width,
    height,
    isPlaceholder: path.extname(best.fileName).toLowerCase() === '.svg',
  }
}

/** Public address of the generated JPEG copy of one illustration. */
export function socialImageSrc(folder: string, format: IllustrationFormat): string {
  return `${SOCIAL_URL_PREFIX}/${folder}/${format}.jpg`
}

/** Where that JPEG copy is written, relative to the project root. */
export function socialImagePath(folder: string, format: IllustrationFormat): string {
  return path.join(SOCIAL_DIR, folder, `${format}.jpg`)
}
