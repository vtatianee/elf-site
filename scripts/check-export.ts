/**
 * EXPORT CHECK — runs after `next build` (see "build" in package.json) and
 * inspects the finished site in out/. Any ERROR fails the build, locally, in
 * GitHub Actions and on Cloudflare Pages, so a broken rule cannot be deployed.
 *
 * What it proves on every build:
 *   - pages: the 60 idea pages exist; sitemap and exported pages match 1:1
 *   - SEO: every page has the right canonical address; no `noindex` anywhere
 *   - rules: no ad / tracker / third-party font host, no masked Amazon link,
 *     no trademark used as the brand, no internal data field in the output
 *   - performance budget: JS, CSS, HTML and font weight per page
 *
 * The numbers of the budget are in BUDGET below and explained in
 * docs/handoffs/02a-solutions-architecture.md.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { ILLUSTRATIONS_DIR, SOCIAL_DIR } from '../src/lib/illustration-files.ts'

const root = process.cwd()
const outDir = path.join(root, 'out')

for (const envFile of ['.env.production.local', '.env.local', '.env.production', '.env']) {
  if (existsSync(path.join(root, envFile))) process.loadEnvFile(path.join(root, envFile))
}
const { siteConfig } = await import('../src/config/site.ts')

const KB = 1024

/** Performance budget. Transfer sizes are gzip, per page. */
const BUDGET = {
  /**
   * All JavaScript a page loads on first visit. The framework alone
   * (React + Next.js runtime) is about 139 kB, so the room for our own code
   * is ~40 kB on interactive pages and ~15 kB on idea pages.
   */
  jsPerPage: 180 * KB,
  jsPerIdeaPage: 155 * KB,
  /** All CSS a page loads. */
  cssPerPage: 20 * KB,
  /** The HTML document itself. */
  htmlPerPage: 40 * KB,
  /** Font files a page preloads (woff2, already compressed). */
  fontsPerPage: 110 * KB,
  /** Illustration files (bytes on disk). Over budget = WARNING, not error. */
  svgPlaceholder: 80 * KB,
  finalIllustration: { vertical: 200 * KB, horizontal: 150 * KB, square: 150 * KB },
  socialJpeg: 300 * KB,
} as const

const EXPECTED_IDEA_PAGES = 60

/** Hosts a page may load resources from, besides the site itself. */
const ALLOWED_THIRD_PARTY_HOSTS = ['static.cloudflareinsights.com']

/** Strings that must never appear in the built site (HTML, JS, CSS, headers). */
const FORBIDDEN: { pattern: RegExp; why: string }[] = [
  { pattern: /adsbygoogle|googlesyndication\.com|doubleclick\.net/i, why: 'ad script (AdSense)' },
  { pattern: /mediavine|journeymv|grow\.me\//i, why: 'ad network script (Mediavine / Journey / Grow)' },
  { pattern: /googletagmanager\.com|google-analytics\.com/i, why: 'tracker (only Cloudflare Web Analytics is allowed)' },
  { pattern: /fonts\.googleapis\.com|fonts\.gstatic\.com/i, why: 'third-party font host (fonts must be self-hosted)' },
  { pattern: /amzn\.to|bit\.ly\//i, why: 'shortened / masked link' },
  { pattern: /wp-content|wp-includes/i, why: 'WordPress' },
  { pattern: /elfontheshelf/i, why: 'registered trademark used as an identifier' },
]

const errors: string[] = []
const warnings: string[] = []

function fail(message: string): void {
  errors.push(message)
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

function kb(bytes: number): string {
  return `${(bytes / KB).toFixed(1)} kB`
}

if (!existsSync(outDir)) {
  console.error('out/ does not exist — run `next build` first.')
  process.exit(1)
}

const allFiles = walk(outDir)
const rel = (file: string) => path.relative(outDir, file).split(path.sep).join('/')

// ---------------------------------------------------------------------------
// Pages and sitemap
// ---------------------------------------------------------------------------

/** URL path ("/ideas/x/") of every exported page. 404 pages are not pages of the site. */
const pagePaths = allFiles
  .map(rel)
  .filter((file) => file === 'index.html' || file.endsWith('/index.html'))
  .filter((file) => !/^(404|_not-found)\//.test(file))
  .map((file) => `/${file.replace(/index\.html$/, '')}`)
  .sort()

const ideaPagePaths = pagePaths.filter((p) => /^\/ideas\/[^/]+\/$/.test(p))
if (ideaPagePaths.length !== EXPECTED_IDEA_PAGES) {
  fail(`Expected ${EXPECTED_IDEA_PAGES} idea pages, exported ${ideaPagePaths.length}.`)
}

const sitemapFile = path.join(outDir, 'sitemap.xml')
const robotsFile = path.join(outDir, 'robots.txt')
if (!existsSync(sitemapFile)) fail('sitemap.xml was not exported.')
if (!existsSync(robotsFile)) fail('robots.txt was not exported.')

const sitemapUrls = existsSync(sitemapFile)
  ? [...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? '')
  : []
const sitemapPaths = new Set<string>()
for (const url of sitemapUrls) {
  if (!url.startsWith(`${siteConfig.url}/`)) {
    fail(`Sitemap entry is not on the configured domain: ${url}`)
    continue
  }
  sitemapPaths.add(url.slice(siteConfig.url.length))
}
for (const p of pagePaths) {
  if (!sitemapPaths.has(p)) fail(`Page ${p} is missing from the sitemap (add it to staticPaths in src/lib/routes.ts).`)
}
for (const p of sitemapPaths) {
  if (!pagePaths.includes(p)) fail(`Sitemap lists ${p}, but that page was not exported.`)
}
if (existsSync(robotsFile)) {
  const robots = readFileSync(robotsFile, 'utf8')
  if (!robots.includes(`Sitemap: ${siteConfig.url}/sitemap.xml`)) fail('robots.txt does not point to the sitemap.')
  if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt blocks the whole site.')
}

// ---------------------------------------------------------------------------
// Per-page checks: canonical, noindex, resources, weight
// ---------------------------------------------------------------------------

const gzipCache = new Map<string, number>()
function gzipSize(file: string): number {
  let size = gzipCache.get(file)
  if (size === undefined) {
    size = gzipSync(readFileSync(file)).length
    gzipCache.set(file, size)
  }
  return size
}

/** Sums the gzip size of local files referenced by the given addresses. */
function localWeight(urls: string[], page: string): number {
  let total = 0
  for (const url of new Set(urls)) {
    const file = path.join(outDir, decodeURIComponent(url.split('?')[0] ?? ''))
    if (!existsSync(file)) {
      fail(`${page} references ${url}, which is not in the export.`)
      continue
    }
    total += gzipSize(file)
  }
  return total
}

const siteHost = new URL(siteConfig.url).host
const worst = {
  js: { size: 0, page: '' },
  css: { size: 0, page: '' },
  html: { size: 0, page: '' },
  fonts: { size: 0, page: '' },
}

for (const pagePath of pagePaths) {
  const file = path.join(outDir, pagePath, 'index.html')
  const html = readFileSync(file, 'utf8')

  // Canonical
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const expected = `${siteConfig.url}${pagePath}`
  if (canonical === undefined) {
    fail(`${pagePath} has no canonical address (use buildMetadata from src/lib/seo.ts).`)
  } else if (canonical !== expected) {
    fail(`${pagePath} has canonical ${canonical}, expected ${expected}.`)
  }

  // No noindex
  if (/<meta[^>]+name="(robots|googlebot)"[^>]+noindex/i.test(html)) {
    fail(`${pagePath} carries noindex. Nothing on this site may be noindex.`)
  }

  // Title and description
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${pagePath} has no <title>.`)
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(`${pagePath} has no meta description.`)
  if (!/<html[^>]+lang="en-US"/.test(html)) fail(`${pagePath} is not marked lang="en-US".`)

  // Sharing image must exist in the export
  for (const match of html.matchAll(/<meta (?:property|name)="(?:og:image|twitter:image)" content="([^"]+)"/g)) {
    const url = match[1] ?? ''
    if (!url.startsWith(`${siteConfig.url}/`)) {
      fail(`${pagePath}: sharing image is not on the configured domain: ${url}`)
    } else if (!existsSync(path.join(outDir, decodeURIComponent(url.slice(siteConfig.url.length))))) {
      fail(`${pagePath}: sharing image ${url} is not in the export.`)
    } else if (!/\.(jpe?g|png)$/i.test(url)) {
      fail(`${pagePath}: sharing image must be JPEG or PNG: ${url}`)
    }
  }

  // Resources loaded from other hosts
  for (const match of html.matchAll(/<(?:script|link|img|iframe|source|video|audio)\b[^>]*?\s(?:src|href)="(?:https?:)?\/\/([^/"]+)[^"]*"/g)) {
    const host = match[1] ?? ''
    const isCanonicalOrAlternate = /rel="(canonical|alternate)"/.test(match[0])
    if (host !== siteHost && !ALLOWED_THIRD_PARTY_HOSTS.includes(host) && !isCanonicalOrAlternate) {
      fail(`${pagePath} loads a resource from another host: ${host}`)
    }
  }

  // Weight
  // `noModule` scripts are polyfills that only very old browsers download.
  const scripts = [...html.matchAll(/<script\b[^>]*?\ssrc="(\/[^"]+)"[^>]*>/g)]
    .filter((m) => !/\snomodule\b/i.test(m[0]))
    .map((m) => m[1] ?? '')
  const fonts = [...html.matchAll(/<link\b[^>]*?rel="preload"[^>]*?href="(\/[^"]+)"[^>]*?as="font"/g)].map((m) => m[1] ?? '')
  const fontSize = [...new Set(fonts)].reduce((sum, url) => {
    const fontFile = path.join(outDir, url)
    return sum + (existsSync(fontFile) ? statSync(fontFile).size : 0)
  }, 0)
  const styles = [...html.matchAll(/<link\b[^>]*?rel="stylesheet"[^>]*?href="(\/[^"]+)"|<link\b[^>]*?href="(\/[^"]+)"[^>]*?rel="stylesheet"/g)].map(
    (m) => m[1] ?? m[2] ?? '',
  )
  const js = localWeight(scripts, pagePath)
  const css = localWeight(styles, pagePath)
  const htmlSize = gzipSize(file)
  if (js > worst.js.size) worst.js = { size: js, page: pagePath }
  if (css > worst.css.size) worst.css = { size: css, page: pagePath }
  if (htmlSize > worst.html.size) worst.html = { size: htmlSize, page: pagePath }
  if (fontSize > worst.fonts.size) worst.fonts = { size: fontSize, page: pagePath }
  const jsBudget = ideaPagePaths.includes(pagePath) ? BUDGET.jsPerIdeaPage : BUDGET.jsPerPage
  if (js > jsBudget) fail(`${pagePath}: JavaScript ${kb(js)} is over the budget of ${kb(jsBudget)}.`)
  if (fontSize > BUDGET.fontsPerPage) fail(`${pagePath}: preloaded fonts ${kb(fontSize)} are over the budget of ${kb(BUDGET.fontsPerPage)}.`)
  if (css > BUDGET.cssPerPage) fail(`${pagePath}: CSS ${kb(css)} is over the budget of ${kb(BUDGET.cssPerPage)}.`)
  if (htmlSize > BUDGET.htmlPerPage) fail(`${pagePath}: HTML ${kb(htmlSize)} is over the budget of ${kb(BUDGET.htmlPerPage)}.`)
}

// ---------------------------------------------------------------------------
// Whole-site checks
// ---------------------------------------------------------------------------

const textFiles = allFiles.filter((file) => /\.(html|js|css|txt|xml|json)$/.test(file) || rel(file) === '_headers')

// Internal fields of the idea data must never be in the output. A long,
// distinctive piece of each internal text is searched for; pieces that also
// occur in the public fields are skipped.
type RawIdea = Record<string, unknown> & { illustrationBrief: string; editorNotes: string[] }
const ideasFile = JSON.parse(readFileSync(path.join(root, 'src/data/ideas.json'), 'utf8')) as { ideas: RawIdea[] }
const publicText = JSON.stringify(
  ideasFile.ideas.map(({ illustrationBrief: _b, editorNotes: _n, ...rest }) => rest),
)
const needles = new Set<string>()
for (const idea of ideasFile.ideas) {
  for (const text of [idea.illustrationBrief, ...idea.editorNotes]) {
    const runs = text.match(/[A-Za-z0-9 ,]{24,}/g) ?? []
    const longest = runs.sort((a, b) => b.length - a.length)[0]?.trim()
    if (longest && !publicText.includes(longest)) needles.add(longest)
  }
}

for (const file of textFiles) {
  const content = readFileSync(file, 'utf8')
  for (const { pattern, why } of FORBIDDEN) {
    const found = content.match(pattern)
    if (found) fail(`${rel(file)} contains "${found[0]}" — ${why}.`)
  }
  if (rel(file) === '_headers') {
    // Comment lines (#) may mention the word; real header lines may not.
    const headerLines = content.split('\n').filter((l) => !l.trim().startsWith('#'))
    if (headerLines.some((l) => /noindex/i.test(l))) fail('_headers sets noindex.')
  }
  for (const needle of needles) {
    if (content.includes(needle)) {
      fail(`${rel(file)} contains internal idea data (editorNotes / illustrationBrief): "${needle.slice(0, 40)}..."`)
      break
    }
  }
}

// The trademark may describe the tradition inside a text, never be the brand.
const TRADEMARK = /elf\s*on\s*the\s*shelf/i
for (const pagePath of pagePaths) {
  const html = readFileSync(path.join(outDir, pagePath, 'index.html'), 'utf8')
  const branding = [
    html.match(/<title>([^<]*)<\/title>/)?.[1],
    html.match(/<meta property="og:site_name" content="([^"]*)"/)?.[1],
    html.match(/<meta property="og:title" content="([^"]*)"/)?.[1],
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1],
  ]
  if (branding.some((text) => text !== undefined && TRADEMARK.test(text))) {
    fail(`${pagePath} uses a registered trademark in its title / H1 / site name.`)
  }
}

// Illustrations (warnings: the owner must be able to deploy, but should know)
const heavy: string[] = []
for (const file of walk(path.join(root, ILLUSTRATIONS_DIR))) {
  const size = statSync(file).size
  const ext = path.extname(file).slice(1).toLowerCase()
  const base = path.basename(file, path.extname(file)).toLowerCase()
  const limit =
    ext === 'svg'
      ? BUDGET.svgPlaceholder
      : base in BUDGET.finalIllustration
        ? BUDGET.finalIllustration[base as keyof typeof BUDGET.finalIllustration]
        : undefined
  if (limit !== undefined && size > limit) {
    heavy.push(`${path.relative(root, file)} ${kb(size)} (budget ${kb(limit)})`)
  }
}
for (const file of walk(path.join(root, SOCIAL_DIR))) {
  const size = statSync(file).size
  if (size > BUDGET.socialJpeg) heavy.push(`${path.relative(root, file)} ${kb(size)} (budget ${kb(BUDGET.socialJpeg)})`)
}
if (heavy.length > 0) {
  warnings.push(
    `${heavy.length} image file(s) over the weight budget — export them smaller (WebP, quality ~80):\n           ${heavy.slice(0, 10).join('\n           ')}${heavy.length > 10 ? '\n           ...' : ''}`,
  )
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const line = '─'.repeat(72)
console.log(`\n${line}\nEXPORT CHECK — out/\n${line}`)
console.log(`  pages exported     ${pagePaths.length}  (idea pages: ${ideaPagePaths.length}, other: ${pagePaths.length - ideaPagePaths.length})`)
console.log(`  sitemap entries    ${sitemapPaths.size}`)
console.log(`  JS, heaviest page  ${kb(worst.js.size)} gzip of ${kb(BUDGET.jsPerPage)}  ${worst.js.page}`)
console.log(`  CSS, heaviest page ${kb(worst.css.size)} gzip of ${kb(BUDGET.cssPerPage)}  ${worst.css.page}`)
console.log(`  HTML, heaviest     ${kb(worst.html.size)} gzip of ${kb(BUDGET.htmlPerPage)}  ${worst.html.page}`)
console.log(`  fonts, heaviest    ${kb(worst.fonts.size)} of ${kb(BUDGET.fontsPerPage)}  ${worst.fonts.page}`)
for (const warning of warnings) console.log(`  WARNING  ${warning}`)
for (const error of errors) console.log(`  ERROR    ${error}`)
console.log(`${line}\n`)

if (errors.length > 0) {
  console.error(`Export check failed with ${errors.length} error(s).\n`)
  process.exit(1)
}
console.log('Export check passed.\n')
