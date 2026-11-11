/**
 * Placeholder kit — reference sheet and UI mascot files, built from the same
 * elf definition as the 180 placeholders.
 *
 *   design/elf-master.svg     the character sheet (no text: labels live in
 *                             design/character-bible.md)
 *   design/mascot/*.svg       small transparent mascots for the UI (source files)
 */
import { C, at, circ, ell, rect } from './core.mjs'
import { elf, mittens, peek } from './elf.mjs'

const svgOpen = (w, h, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">`

/** 1600 x 1000 sheet: front, sitting, peeking, waving, lying asleep + the 6 base colours. */
export function elfMasterSvg() {
  const o = [svgOpen(1600, 1000, 'Illustration of the elf mascot reference sheet: standing, sitting, peeking and lying poses')]
  o.push(rect(0, 0, 1600, 1000, C.cream))
  o.push(rect(0, 800, 1600, 200, C['wood-100']))
  // 6 base colours, top-left, as plain swatches (legend is in the .md)
  ;[C.red, C.pine, C.cream, C.gold, C.night, C.wood].forEach((hex, i) => {
    o.push(circ(90 + i * 84, 90, 32, hex, ` stroke="${C['wood-400']}" stroke-width="3"`))
  })
  // 1. front view, standing (the master pose)
  o.push(elf({ x: 300, y: 800, s: 1.9, pose: 'stand' }))
  // 2. sitting
  o.push(elf({ x: 720, y: 800, s: 1.45, pose: 'sit' }))
  // 3. peeking over an edge (head + mittens only)
  o.push(peek({ x: 1060, y: 620, s: 1.45 }))
  o.push(rect(920, 600, 280, 200, C['wood-400'], 14))
  o.push(rect(920, 600, 280, 26, C.wood, 13))
  o.push(mittens({ x: 1060, y: 606, s: 1.45, gap: 62 }))
  // 4. waving (arm poses are free; proportions are not)
  o.push(elf({ x: 1440, y: 800, s: 1.05, pose: 'stand', armR: [84, -150] }))
  // 5. lying down, asleep (in front)
  o.push(ell(1150, 978, 230, 16, C['wood-400']))
  o.push(elf({ x: 1150, y: 975, s: 1, pose: 'lie', eyes: 'closed', armL: [-52, -70], armR: [52, -70] }))
  o.push('</svg>')
  return o.join('\n')
}

/** Transparent UI mascots (tight viewBox, no background). */
export function mascotSvgs() {
  const wrap = (w, h, label, inner) => `${svgOpen(w, h, label)}\n${inner}\n</svg>`
  return {
    'elf-stand.svg': wrap(300, 400, 'Illustration of the elf mascot standing', elf({ x: 136, y: 392, s: 1.25, pose: 'stand' })),
    'elf-wave.svg': wrap(300, 400, 'Illustration of the elf mascot waving', elf({ x: 136, y: 392, s: 1.25, pose: 'stand', armR: [84, -150] })),
    'elf-sit.svg': wrap(300, 360, 'Illustration of the elf mascot sitting', elf({ x: 136, y: 352, s: 1.25, pose: 'sit' })),
    // head + mittens: sits on top of a card/panel edge. Bottom edge of the file = the edge it peeks over.
    'elf-peek.svg': wrap(
      300,
      250,
      'Illustration of the elf mascot peeking over an edge',
      peek({ x: 136, y: 262, s: 1.25, withScarf: false }) + mittens({ x: 136, y: 240, s: 1.25, gap: 58 }),
    ),
    'elf-sleep.svg': wrap(
      420,
      180,
      'Illustration of the elf mascot lying down asleep',
      elf({ x: 196, y: 172, s: 1.25, pose: 'lie', eyes: 'closed', armL: [-52, -70], armR: [52, -70] }),
    ),
    // head only, for the logo mark / favicon source
    'elf-head.svg': wrap(300, 260, 'Illustration of the elf mascot face', at(peek({ x: 0, y: 0, s: 1.25, withScarf: false }), 122, 250)),
  }
}
