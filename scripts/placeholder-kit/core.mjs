/**
 * Placeholder kit — core: palette loader + tiny SVG helpers.
 * Dependency-free (Node built-ins only).
 *
 * The palette is READ from src/styles/tokens.css, so the illustrations can
 * never drift from the approved tokens. Asking for a token that does not
 * exist throws — a new colour cannot sneak in through a typo.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const TOKENS_PATH = join(ROOT, 'src', 'styles', 'tokens.css')

/** Returns { 'red': '#B42318', 'red-700': '#902625', ... } from tokens.css. */
export function readColorTokens(tokensPath = TOKENS_PATH) {
  const css = readFileSync(tokensPath, 'utf8')
  const map = {}
  for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\b/g)) {
    map[m[1]] = m[2].toUpperCase()
  }
  return map
}

const tokens = readColorTokens()

/** C.red, C['night-200'] ... throws on an unknown token. */
export const C = new Proxy(tokens, {
  get(target, key) {
    if (typeof key === 'symbol') return target[key]
    if (!(key in target)) throw new Error(`Unknown colour token "--color-${String(key)}" (not in tokens.css)`)
    return target[key]
  },
})

// ---- number + element helpers -------------------------------------------

export const n = (v) => String(Math.round(v * 10) / 10)

export const circ = (cx, cy, r, fill, extra = '') =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${extra}/>`

export const ell = (cx, cy, rx, ry, fill, extra = '') =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${extra}/>`

export const rect = (x, y, w, h, fill, rx = 0, extra = '') =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${rx ? ` rx="${n(rx)}"` : ''} fill="${fill}"${extra}/>`

export const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`

/** Open stroke with round caps/joins. */
export const line = (d, stroke, width, extra = '') =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${n(width)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`

/** Outline attribute string (soft contour). */
export const outline = (stroke, width = 3) =>
  ` stroke="${stroke}" stroke-width="${n(width)}" stroke-linejoin="round"`

/** Group with translate → rotate → scale (in that order). */
export function at(inner, x = 0, y = 0, s = 1, rot = 0, sy = null) {
  const parts = []
  if (x || y) parts.push(`translate(${n(x)} ${n(y)})`)
  if (rot) parts.push(`rotate(${n(rot)})`)
  if (s !== 1 || sy !== null) parts.push(sy === null ? `scale(${n(s * 100) / 100})` : `scale(${n(s * 100) / 100} ${n(sy * 100) / 100})`)
  const body = Array.isArray(inner) ? inner.join('') : inner
  return parts.length ? `<g transform="${parts.join(' ')}">${body}</g>` : `<g>${body}</g>`
}

/** Deterministic random numbers from a string seed (same input → same art). */
export function rng(seed) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
