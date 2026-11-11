/**
 * PREBUILD — runs before `next build` (see "build" in package.json).
 *
 *   1. Checks src/config/site.ts and prints what is still a placeholder.
 *      Mistakes that would break a rule (masked Amazon link, trademark used
 *      as the site name, ...) stop the build with a readable message.
 *   2. Writes a JPEG copy of every illustration to public/social/, for link
 *      previews (Open Graph / Twitter) and Pinterest, which do not accept SVG.
 *
 * Run by Node directly (Node 22.18+ reads TypeScript files). That is why the
 * imports below are relative and end in `.ts`.
 *
 *   node scripts/prebuild.ts               full run
 *   node scripts/prebuild.ts --check-only  config check only (npm run check:config)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import {
  ILLUSTRATIONS_DIR,
  ILLUSTRATION_FORMATS,
  SITE_ILLUSTRATION_FOLDER,
  SOCIAL_DIR,
  findIllustrationFile,
  socialImagePath,
  type IllustrationFormat,
} from '../src/lib/illustration-files.ts'

const root = process.cwd()
const checkOnly = process.argv.includes('--check-only')

// Same files Next.js reads, so a local .env.local behaves the same here.
// Values already set in the environment (e.g. by Cloudflare Pages) win.
for (const envFile of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  if (existsSync(path.join(root, envFile))) process.loadEnvFile(path.join(root, envFile))
}

// Imported only now, after the env files are loaded.
const { siteConfig } = await import('../src/config/site.ts')
const { ideaListUrlProblem } = await import('../src/lib/amazon.ts')

const errors: string[] = []
const warnings: string[] = []
const notes: string[] = []

// ---------------------------------------------------------------------------
// 1. Config check
// ---------------------------------------------------------------------------

type IdeaRow = { slug: string }
const ideasFile = JSON.parse(readFileSync(path.join(root, 'src/data/ideas.json'), 'utf8')) as {
  ideas: IdeaRow[]
}
const slugs = ideasFile.ideas.map((idea) => idea.slug)

// Domain
try {
  const url = new URL(siteConfig.url)
  if (url.protocol !== 'https:') errors.push(`Site URL must start with https:// (found "${siteConfig.url}").`)
  if (url.pathname !== '/' || url.search !== '' || url.hash !== '') {
    errors.push(`Site URL must be only the domain, without a path (found "${siteConfig.url}").`)
  }
} catch {
  errors.push(`Site URL is not a valid address: "${siteConfig.url}".`)
}
if (siteConfig.urlIsPlaceholder) {
  warnings.push(
    `domain not set — using the placeholder ${siteConfig.url}. Set NEXT_PUBLIC_SITE_URL before launch.`,
  )
}

// Name: the trademark of the doll brand may never be the site name or brand.
const TRADEMARK = /elf\s*on\s*the\s*shelf/i
if (TRADEMARK.test(siteConfig.name) || TRADEMARK.test(siteConfig.url)) {
  errors.push('The site name / domain uses a registered trademark. Choose a generic name.')
}
if (siteConfig.name.trim() === '') errors.push('Site name is empty.')
if (siteConfig.operator.name.trim() === '') errors.push('Operator name is empty.')
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(siteConfig.contactEmail)) {
  errors.push(`Contact email is not a valid address: "${siteConfig.contactEmail}".`)
}

// Amazon
const tag = siteConfig.amazon.associateTag.trim()
if (tag === '') {
  warnings.push(
    'affiliate tag not set — every Amazon link is a plain search link without a tag (no commission).',
  )
} else if (!/^[A-Za-z0-9][A-Za-z0-9-]*-\d{2}$/.test(tag)) {
  errors.push(`Affiliate tag "${tag}" does not look like an Amazon tracking ID (example: yourname-20).`)
}

const ideaLists = Object.entries(siteConfig.amazon.ideaListUrls)
for (const [slug, url] of ideaLists) {
  if (!slugs.includes(slug)) {
    errors.push(`Idea List: "${slug}" is not the slug of any idea (typo?).`)
    continue
  }
  const problem = ideaListUrlProblem(url.trim())
  if (problem !== null) errors.push(`Idea List for "${slug}" ${problem}: ${url}`)
}
notes.push(
  `Idea Lists: ${ideaLists.length} of ${slugs.length} ideas have a "Buy the kit" button (the others show search links only).`,
)

// Email + analytics
if (siteConfig.email.provider === null) {
  notes.push('Email provider: none — email forms show the "coming soon" state.')
}
notes.push(
  siteConfig.analytics.cloudflareWebAnalyticsToken === null
    ? 'Analytics: OFF.'
    : 'Analytics: Cloudflare Web Analytics ON.',
)

// ---------------------------------------------------------------------------
// 2. Social images (JPEG copies of the illustrations)
// ---------------------------------------------------------------------------

/** Formats that need a raster copy: link previews and Pinterest. */
const SOCIAL_FORMATS: IllustrationFormat[] = ['horizontal', 'vertical']

async function buildSocialImages(): Promise<void> {
  const started = Date.now()
  rmSync(path.join(root, SOCIAL_DIR), { recursive: true, force: true })

  const illustrationsRoot = path.join(root, ILLUSTRATIONS_DIR)
  const folders = existsSync(illustrationsRoot)
    ? readdirSync(illustrationsRoot).filter((name) =>
        statSync(path.join(illustrationsRoot, name)).isDirectory(),
      )
    : []

  let written = 0
  let placeholders = 0
  const missing: string[] = []

  for (const folder of [...slugs, SITE_ILLUSTRATION_FOLDER]) {
    for (const format of SOCIAL_FORMATS) {
      // The site-wide image is only needed in the horizontal format.
      if (folder === SITE_ILLUSTRATION_FOLDER && format !== 'horizontal') continue
      const file = findIllustrationFile(folder, format, root)
      if (file === null) {
        missing.push(`${folder}/${format}`)
        continue
      }
      const { width, height } = ILLUSTRATION_FORMATS[format]
      const target = path.join(root, socialImagePath(folder, format))
      mkdirSync(path.dirname(target), { recursive: true })
      await sharp(path.join(root, file.filePath))
        .resize(width, height, { fit: 'cover' })
        // JPEG has no transparency: fill with the palette cream.
        .flatten({ background: '#FDF6E3' })
        .jpeg({ quality: 86, chromaSubsampling: '4:4:4', mozjpeg: true })
        .toFile(target)
      written += 1
      if (file.isPlaceholder) placeholders += 1
    }
  }

  const unknown = folders.filter(
    (name) => !slugs.includes(name) && name !== SITE_ILLUSTRATION_FOLDER,
  )
  if (unknown.length > 0) {
    warnings.push(
      `illustration folders that match no idea (ignored): ${unknown.join(', ')}. The folder name must be the idea's slug.`,
    )
  }
  if (missing.length > 0) {
    const sample = missing.slice(0, 6).join(', ')
    warnings.push(
      `${missing.length} illustration file(s) not found — those pages get no sharing image: ${sample}${missing.length > 6 ? ', ...' : ''}`,
    )
  }
  notes.push(
    `Social images: ${written} JPEG written to ${SOCIAL_DIR}/ in ${((Date.now() - started) / 1000).toFixed(1)}s (${placeholders} still from SVG placeholders).`,
  )
}

if (errors.length === 0 && !checkOnly) await buildSocialImages()

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const line = '─'.repeat(72)
console.log(`\n${line}\nSITE CONFIG — ${siteConfig.name} — ${siteConfig.url}\n${line}`)
for (const note of notes) console.log(`  ok       ${note}`)
for (const warning of warnings) console.log(`  WARNING  ${warning}`)
for (const error of errors) console.log(`  ERROR    ${error}`)
console.log(`${line}\n`)

if (errors.length > 0) {
  console.error(`Build stopped: fix the ${errors.length} error(s) above in src/config/site.ts.\n`)
  process.exit(1)
}
