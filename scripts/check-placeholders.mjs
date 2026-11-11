#!/usr/bin/env node
/**
 * PLACEHOLDER ILLUSTRATIONS — check.   Run:  node scripts/check-placeholders.mjs
 *
 * Proves, for every placeholder SVG:
 *   1. all 180 files exist (60 slugs from ideas.json x vertical/horizontal/square)
 *   2. no text: no <text>, <tspan>, <textPath>, <title>, <desc>, <foreignObject>
 *   3. every colour is an approved token from src/styles/tokens.css
 *      (fill/stroke are a token hex or "none"; no other hex anywhere; no rgb()/hsl()/
 *      named colours; no opacity, gradients or filters that would blend new colours)
 *   4. each file is well-formed XML with one <svg> root and the contract viewBox
 *   5. self-contained: no <image>, href, url(), style, CSS variables or scripts
 *
 * Also checks the extra files built from the same kit (_site image, character
 * sheet, UI mascots). Exits with code 1 on any failure. Dependency-free.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT, readColorTokens } from './placeholder-kit/core.mjs'

const SIZES = { vertical: [1000, 1500], horizontal: [1200, 628], square: [1080, 1080] }
const tokens = readColorTokens()
const approved = new Set(Object.values(tokens))
const failures = []
const fail = (file, message) => failures.push(`${file}: ${message}`)

/** Minimal well-formedness check: balanced tags, quoted attributes, single root. */
function wellFormed(xml) {
  const stack = []
  let roots = 0
  const tagRe = /<(\/?)([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"<]*")*)\s*(\/?)>/g
  let last = 0
  let m
  while ((m = tagRe.exec(xml))) {
    const between = xml.slice(last, m.index)
    if (between.includes('<') || between.includes('>')) return `stray markup near offset ${last}`
    if (stack.length === 0 && between.trim() !== '') return 'content outside the root element'
    last = tagRe.lastIndex
    const [, closing, name, , selfClosing] = m
    if (closing) {
      if (stack.pop() !== name) return `unbalanced </${name}>`
    } else {
      if (stack.length === 0) roots++
      if (!selfClosing) stack.push(name)
    }
  }
  const tail = xml.slice(last)
  if (tail.trim() !== '') return 'unparsed content at the end (malformed tag?)'
  if (stack.length) return `unclosed <${stack.pop()}>`
  if (roots !== 1) return `expected 1 root element, found ${roots}`
  return null
}

function checkSvg(relPath, expectedSize) {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) return fail(relPath, 'file is missing')
  const xml = readFileSync(full, 'utf8')

  const bad = wellFormed(xml)
  if (bad) fail(relPath, `not well-formed: ${bad}`)
  if (!/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(xml)) fail(relPath, 'root is not <svg xmlns=...>')

  if (expectedSize) {
    const vb = xml.match(/viewBox="0 0 (\d+) (\d+)"/)
    if (!vb || +vb[1] !== expectedSize[0] || +vb[2] !== expectedSize[1]) fail(relPath, `viewBox is not 0 0 ${expectedSize[0]} ${expectedSize[1]}`)
  }

  for (const tag of ['text', 'tspan', 'textPath', 'title', 'desc', 'foreignObject']) {
    if (new RegExp(`<${tag}[\\s>/]`, 'i').test(xml)) fail(relPath, `contains <${tag}> (no text inside illustrations)`)
  }
  for (const [label, re] of [
    ['<image>', /<image[\s>/]/i], ['href', /href=/i], ['url()', /url\(/i], ['style', /<style|style=/i], ['CSS variable', /var\(/i], ['<script>', /<script/i],
    ['opacity', /opacity/i], ['gradient', /gradient/i], ['filter', /<filter|filter=/i], ['pattern/mask', /<pattern|<mask/i],
  ]) {
    if (re.test(xml)) fail(relPath, `contains ${label} (must be flat and self-contained)`)
  }

  // colours: every fill/stroke is a token hex or none; no other hex anywhere
  for (const m of xml.matchAll(/\b(fill|stroke|stop-color|color)="([^"]*)"/g)) {
    const value = m[2]
    if (value === 'none') continue
    if (!/^#[0-9A-F]{6}$/.test(value)) fail(relPath, `${m[1]}="${value}" is not an upper-case 6-digit hex token`)
    else if (!approved.has(value)) fail(relPath, `${m[1]}="${value}" is not in tokens.css`)
  }
  const withoutXmlns = xml.replace(/xmlns="[^"]*"/, '')
  for (const m of withoutXmlns.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)) {
    if (!approved.has(m[0].toUpperCase())) fail(relPath, `colour ${m[0]} is not in tokens.css`)
  }
  if (/\b(rgb|rgba|hsl|hsla)\(/i.test(xml)) fail(relPath, 'uses rgb()/hsl() colour')
  return xml
}

// ---- run -------------------------------------------------------------------

const { ideas } = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'ideas.json'), 'utf8'))
const usedColours = new Set()
let checked = 0
let bytes = 0

for (const idea of ideas) {
  for (const [format, size] of Object.entries(SIZES)) {
    const xml = checkSvg(join('public', 'illustrations', idea.slug, `${format}.svg`), size)
    if (xml) {
      checked++
      bytes += xml.length
      for (const m of xml.matchAll(/#[0-9A-F]{6}/g)) usedColours.add(m[0])
    }
  }
}

// no stray placeholder folders (e.g. a renamed slug left behind)
const slugs = new Set(ideas.map((idea) => idea.slug))
const dir = join(ROOT, 'public', 'illustrations')
const strays = existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && !slugs.has(e.name) && e.name !== '_site').map((e) => e.name) : []
for (const name of strays) fail(`public/illustrations/${name}`, 'folder does not match any slug in ideas.json')

// extras built from the same kit
const extras = [[join('public', 'illustrations', '_site', 'horizontal.svg'), SIZES.horizontal], [join('design', 'elf-master.svg'), null]]
const mascotDir = join(ROOT, 'design', 'mascot')
if (existsSync(mascotDir)) for (const name of readdirSync(mascotDir).filter((f) => f.endsWith('.svg')).sort()) extras.push([join('design', 'mascot', name), null])
let extrasChecked = 0
for (const [relPath, size] of extras) {
  const xml = checkSvg(relPath, size)
  if (xml) {
    extrasChecked++
    for (const m of xml.matchAll(/#[0-9A-F]{6}/g)) usedColours.add(m[0])
  }
}

const expected = ideas.length * 3
const nameOf = (hex) => Object.keys(tokens).find((key) => tokens[key] === hex)
console.log('Placeholder illustration check')
console.log(`  ideas in ideas.json ............ ${ideas.length}`)
console.log(`  placeholder files found ........ ${checked} of ${expected} expected`)
console.log(`  extra kit files checked ........ ${extrasChecked} of ${extras.length} (_site image, character sheet, mascots)`)
console.log(`  files containing <text> ........ ${failures.filter((f) => f.includes('<text>')).length}`)
console.log(`  colour tokens in tokens.css .... ${approved.size}`)
console.log(`  distinct colours used .......... ${usedColours.size} (all approved: ${[...usedColours].every((c) => approved.has(c)) ? 'yes' : 'NO'})`)
console.log(`    ${[...usedColours].map((c) => `${nameOf(c)} ${c}`).sort().join(', ')}`)
console.log(`  total size of the ${expected} files ..... ${(bytes / 1024).toFixed(0)} KB (average ${(bytes / 1024 / Math.max(checked, 1)).toFixed(1)} KB)`)

if (failures.length) {
  console.log(`\nFAIL — ${failures.length} problem(s):`)
  for (const f of failures.slice(0, 60)) console.log(`  - ${f}`)
  if (failures.length > 60) console.log(`  ... and ${failures.length - 60} more`)
  process.exit(1)
}
console.log(`\nPASS — ${checked} placeholder files + ${extrasChecked} extras: present, well-formed, text-free, flat, self-contained, approved colours only.`)
