#!/usr/bin/env node
/**
 * PLACEHOLDER ILLUSTRATIONS — generator.   Run:  node scripts/generate-placeholders.mjs
 *
 * Reads   src/data/ideas.json   (slugs + rooms; read-only)
 *         src/styles/tokens.css (the only colours allowed)
 * Writes  public/illustrations/<slug>/vertical.svg    1000 x 1500
 *         public/illustrations/<slug>/horizontal.svg  1200 x 628
 *         public/illustrations/<slug>/square.svg      1080 x 1080     (60 x 3 = 180 files)
 *         public/illustrations/_site/horizontal.svg   site-wide sharing image
 *         design/elf-master.svg                       character sheet
 *         design/mascot/*.svg                         UI mascots (source files)
 *         design/illustration-alt.json                alt text per slug
 *         design/pin-template/pin-data.js             titles/rooms for the pin template
 *         design/preview/placeholders.html            contact sheet of all 180
 *
 * Dependency-free: Node built-ins only. Deterministic: same input, same files.
 * It only ever writes `.svg` files it owns — a final image dropped into the same
 * folder (vertical.webp/.png/.jpg ...) is never touched and wins at build time.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { C, ROOT, circ, n, rect, rng } from './placeholder-kit/core.mjs'
import { elfMasterSvg, mascotSvgs } from './placeholder-kit/master.mjs'
import { SCENES, SITE_SCENE } from './placeholder-kit/scenes.mjs'

/** Canvas size + where the stage origin (surface line, centre) sits and its scale. */
export const FORMATS = {
  vertical: { w: 1000, h: 1500, ox: 500, oy: 1300, s: 1.1, cleanTop: 500 },
  horizontal: { w: 1200, h: 628, ox: 600, oy: 496, s: 0.74, cleanTop: 0 },
  square: { w: 1080, h: 1080, ox: 540, oy: 890, s: 1.08, cleanTop: 0 },
}

/**
 * Room treatments: 2-3 flat areas. wall + surface (floor/counter/table) + a thin
 * edge strip. `above: true` = skirting board on the wall; false = front lip of a
 * counter/table. fleck = paper-grain tone for each area.
 */
export const ROOMS = {
  kitchen: { wall: C.cream, floor: C.wood, edge: C['wood-400'], above: false, fleckWall: C['wood-100'], fleckFloor: C['wood-800'] },
  'living-room-tree': { wall: C.night, floor: C['night-800'], edge: C['night-600'], above: true, fleckWall: C['night-600'], fleckFloor: C.night, lights: true },
  bathroom: { wall: C['night-200'], floor: C['night-100'], edge: C.snow, above: false, fleckWall: C['night-100'], fleckFloor: C['night-200'] },
  bedroom: { wall: C['red-100'], floor: C['red-200'], edge: C['red-300'], above: true, fleckWall: C['red-200'], fleckFloor: C['red-300'] },
  table: { wall: C['gold-100'], floor: C.wood, edge: C['wood-800'], above: false, fleckWall: C['gold-300'], fleckFloor: C['wood-800'] },
  entryway: { wall: C['pine-100'], floor: C.wood, edge: C.snow, above: true, fleckWall: C.cream, fleckFloor: C['wood-800'] },
  fridge: { wall: C['night-100'], floor: C.snow, edge: C['night-300'], above: false, fleckWall: C['night-200'], fleckFloor: C['wood-100'] },
  'whole-house': { wall: C.cream, floor: C['pine-400'], edge: C['wood-400'], above: true, fleckWall: C['wood-100'], fleckFloor: C['pine-100'] },
}

/** Light paper grain: short flecks, one path per area. */
function flecks(rand, x0, y0, x1, y1, tone, density) {
  const count = Math.round(((x1 - x0) * (y1 - y0)) / density)
  if (count <= 0) return ''
  let d = ''
  for (let i = 0; i < count; i++) {
    const x = x0 + rand() * (x1 - x0)
    const y = y0 + rand() * (y1 - y0)
    const a = rand() * Math.PI
    const len = 2 + rand() * 4
    d += `M${n(x)},${n(y)}l${n(Math.cos(a) * len)},${n(Math.sin(a) * len)}`
  }
  return `<path d="${d}" fill="none" stroke="${tone}" stroke-width="2" stroke-linecap="round"/>`
}

function background(roomKey, fmt, rand) {
  const room = ROOMS[roomKey]
  if (!room) throw new Error(`No room treatment for "${roomKey}"`)
  const { w, h, oy, s, cleanTop } = fmt
  const o = [rect(0, 0, w, h, room.wall), rect(0, oy, w, h - oy, room.floor)]
  const edgeH = 16 * s
  o.push(rect(0, room.above ? oy - edgeH : oy, w, edgeH, room.edge))
  o.push(flecks(rand, 0, 0, w, oy - edgeH, room.fleckWall, 22000))
  o.push(flecks(rand, 0, oy + edgeH, w, h, room.fleckFloor, 13000))
  if (room.lights) {
    // out-of-focus tree lights: gold dots on the wall, never in the clean title band
    const top = cleanTop + 40
    const count = Math.round((w * (oy - top)) / 52000)
    for (let i = 0; i < count; i++) {
      const r = (5 + rand() * 9) * s
      o.push(circ(rand() * w, top + rand() * (oy - top - 70 * s), r, rand() < 0.6 ? C.gold : C['gold-300']))
    }
  }
  return o.join('\n')
}

export function renderSvg(slug, roomKey, scene, formatName) {
  const fmt = FORMATS[formatName]
  const rand = rng(`${slug}/${formatName}`)
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt.w} ${fmt.h}" width="${fmt.w}" height="${fmt.h}">`,
    background(roomKey, fmt, rand),
    `<g transform="translate(${n(fmt.ox + (scene.dx ?? 0) * fmt.s)} ${fmt.oy}) scale(${n(fmt.s * (scene.zoom ?? 1) * 100) / 100})">`,
    scene.draw().join('\n'),
    '</g>',
    '</svg>',
    '',
  ].join('\n')
}

function write(relPath, content) {
  const full = join(ROOT, relPath)
  mkdirSync(join(full, '..'), { recursive: true })
  writeFileSync(full, content)
}

function main() {
  const { ideas } = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'ideas.json'), 'utf8'))
  const missing = ideas.filter((idea) => !SCENES[idea.slug]).map((idea) => idea.slug)
  const extra = Object.keys(SCENES).filter((slug) => !ideas.some((idea) => idea.slug === slug))
  if (missing.length || extra.length) {
    throw new Error(`Scene map out of sync with ideas.json. Missing: [${missing}] Unknown: [${extra}]`)
  }

  let files = 0
  const alt = {}
  for (const idea of ideas) {
    const scene = SCENES[idea.slug]
    if (!scene.alt.startsWith('Illustration of ')) throw new Error(`Alt text for ${idea.slug} must start with "Illustration of"`)
    alt[idea.slug] = scene.alt
    for (const formatName of Object.keys(FORMATS)) {
      write(join('public', 'illustrations', idea.slug, `${formatName}.svg`), renderSvg(idea.slug, idea.room, scene, formatName))
      files++
    }
  }

  // site-wide sharing image (pages that are not an idea)
  write(join('public', 'illustrations', '_site', 'horizontal.svg'), renderSvg('_site', SITE_SCENE.room, SITE_SCENE, 'horizontal'))

  // character sheet + UI mascots
  write(join('design', 'elf-master.svg'), elfMasterSvg())
  const mascots = mascotSvgs()
  for (const [name, svg] of Object.entries(mascots)) write(join('design', 'mascot', name), svg)

  // alt text for the Developer (placeholder scenes; re-check when final art lands)
  write(join('design', 'illustration-alt.json'), `${JSON.stringify({ _note: 'Alt text for the PLACEHOLDER scenes. Always starts with "Illustration of". Re-check each line when the final illustration replaces the placeholder.', _site: SITE_SCENE.alt, ...alt }, null, 2)}\n`)

  // data for the pin template (titles come from ideas.json, never retyped)
  const pinData = Object.fromEntries(ideas.map((idea) => [idea.slug, { id: idea.id, title: idea.title, room: idea.room, time: idea.time.label, mess: idea.mess }]))
  write(join('design', 'pin-template', 'pin-data.js'), `// GENERATED by scripts/generate-placeholders.mjs from src/data/ideas.json — do not edit.\nwindow.PIN_DATA = ${JSON.stringify(pinData, null, 1)}\n`)

  // contact sheet for visual review
  const cells = ideas
    .map(
      (idea) =>
        `<figure><div class="row"><img src="../../public/illustrations/${idea.slug}/vertical.svg" width="1000" height="1500" alt="${alt[idea.slug]}"><div class="col"><img src="../../public/illustrations/${idea.slug}/square.svg" width="1080" height="1080" alt=""><img src="../../public/illustrations/${idea.slug}/horizontal.svg" width="1200" height="628" alt=""></div></div><figcaption><b>${idea.id}. ${idea.title}</b> <span>${idea.room}</span></figcaption></figure>`,
    )
    .join('\n')
  write(
    join('design', 'preview', 'placeholders.html'),
    `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Placeholder illustrations — contact sheet (design review)</title>\n<link rel="stylesheet" href="../../src/styles/tokens.css">\n<style>\nbody{margin:0;padding:var(--space-4);background:var(--bg-page);color:var(--text);font-family:var(--font-body)}\nh1{font-family:var(--font-display);font-size:var(--text-xl);margin:0 0 var(--space-2)}\np{margin:0 0 var(--space-5);max-width:var(--measure)}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4)}\nfigure{margin:0;background:var(--bg-surface);border:2px solid var(--border);border-radius:var(--radius-md);padding:var(--space-2)}\n.row{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);align-items:start}\n.col{display:grid;gap:var(--space-2)}\nimg{display:block;width:100%;height:auto;border-radius:var(--radius-sm)}\nfigcaption{font-size:var(--text-sm);padding:var(--space-2) var(--space-1) 0}\nfigcaption span{color:var(--text-muted)}\n</style>\n</head>\n<body>\n<h1>Placeholder illustrations — all 60 ideas, 3 formats</h1>\n<p>Design review sheet, generated by <code>scripts/generate-placeholders.mjs</code>. Illustrated placeholders, not photos and not final art. Each card: vertical (left), square and horizontal (right).</p>\n<div class="grid">\n${cells}\n</div>\n</body>\n</html>\n`,
  )

  console.log(`Wrote ${files} placeholder SVGs for ${ideas.length} ideas (+ _site/horizontal.svg, elf-master.svg, ${Object.keys(mascots).length} mascots, alt JSON, pin data, contact sheet).`)
}

main()
