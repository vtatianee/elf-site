/**
 * Placeholder kit — PROP LIBRARY. Small, flat, reusable props.
 *
 * Every prop returns SVG in LOCAL units with its anchor at (0,0):
 * the bottom-centre (where it touches the surface), unless the comment says
 * otherwise. y grows downward, so "up" is negative. Scenes place a prop with
 * at(prop, x, y, scale, rotation).
 *
 * House rules: palette tokens only, no text, no letters, no numbers. Cards,
 * signs, labels, tags and sheets are always BLANK — words live in the HTML
 * text layer of the page or pin. No scissors anywhere.
 */
import { C, at, circ, ell, line, n, outline, path, rect } from './core.mjs'

const { red, pine, gold, night, wood, snow } = C
const r7 = C['red-700'], r3 = C['red-300']
const p8 = C['pine-800'], p4 = C['pine-400']
const g7 = C['gold-700'], g3 = C['gold-300'], g1 = C['gold-100']
const n9 = C['night-900'], n8 = C['night-800'], n6 = C['night-600'], n3 = C['night-300'], n2 = C['night-200'], n1 = C['night-100']
const w8 = C['wood-800'], w4 = C['wood-400'], w2 = C['wood-200'], w1 = C['wood-100']

const soft = outline(w4, 3) // soft contour for white/paper things

// ---- paper things (always blank) -----------------------------------------

export const card = ({ w = 110, h = 78, fill = snow } = {}) => rect(-w / 2, -h, w, h, fill, 6, soft)

/** Folded card standing on the surface. */
export const tentCard = ({ w = 120, h = 86 } = {}) =>
  path(`M${-w / 2 + 12},${-h} L${w / 2 + 12},${-h} L${w / 2},0 L${-w / 2},0 Z`, snow, soft) +
  line(`M${-w / 2 + 12},${-h} L${-w / 2 + 30},${-h - 14} L${w / 2 + 30},${-h - 14} L${w / 2 + 12},${-h}`, w4, 3)

export const envelope = ({ w = 150, h = 100 } = {}) =>
  rect(-w / 2, -h, w, h, snow, 6, soft) + line(`M${-w / 2 + 5},${-h + 5} L0,${-h * 0.42} L${w / 2 - 5},${-h + 5}`, w4, 3)

/** Sheet lying flat on a surface, drawn in perspective. Anchor = front edge. */
export const flat = ({ w = 300, d = 110, fill = snow, inset = 34, stroke = w4 } = {}) =>
  path(`M${-w / 2 + inset},${-d} L${w / 2 - inset},${-d} L${w / 2},0 L${-w / 2},0 Z`, fill, outline(stroke, 3))

/** Blank sign on a little post. */
export const sign = ({ w = 150, h = 90, pole = 120 } = {}) =>
  ell(0, 0, 34, 9, w8) + rect(-6, -pole, 12, pole, wood, 4) + rect(-w / 2, -pole - h + 14, w, h, snow, 8, soft)

export const tag = ({ w = 96, h = 56 } = {}) =>
  path(`M${-w / 2},${-h / 2} L${-w / 2 + 22},${-h} L${w / 2},${-h} L${w / 2},0 L${-w / 2 + 22},0 Z`, snow, soft) +
  circ(-w / 2 + 22, -h / 2, 5, w4)

export const clipboard = ({ w = 72, h = 92 } = {}) =>
  rect(-w / 2, -h, w, h, w4, 6, outline(wood, 3)) + rect(-w / 2 + 8, -h + 13, w - 16, h - 21, snow, 3) + rect(-14, -h - 6, 28, 14, gold, 5)

/** Certificate with a gold border, blank. */
export const diploma = ({ w = 300, h = 200 } = {}) =>
  rect(-w / 2, -h, w, h, snow, 6, soft) +
  `<rect x="${n(-w / 2 + 14)}" y="${n(-h + 14)}" width="${n(w - 28)}" height="${n(h - 28)}" rx="4" fill="none" stroke="${gold}" stroke-width="5"/>`

export const stickyNote = ({ s = 54, fill = gold } = {}) => rect(-s / 2, -s, s, s, fill, 3)

// ---- containers -----------------------------------------------------------

/** Clear jar: outline only, so whatever is drawn before it shows through. */
export const jar = ({ w = 220, h = 280, lid = false } = {}) =>
  `<rect x="${n(-w / 2)}" y="${n(-h + 34)}" width="${n(w)}" height="${n(h - 34)}" rx="34" fill="none" stroke="${n3}" stroke-width="7"/>` +
  `<rect x="${n(-w / 2 + 28)}" y="${n(-h)}" width="${n(w - 56)}" height="38" rx="8" fill="none" stroke="${n3}" stroke-width="7"/>` +
  line(`M${-w / 2 + 26},${-h + 84} L${-w / 2 + 26},${-h + 170}`, n2, 8) +
  (lid ? rect(-w / 2 + 16, -h - 20, w - 32, 30, gold, 9) + line(`M${-w / 2 + 30},${-h - 5} L${w / 2 - 30},${-h - 5}`, g7, 3) : '')

export const jarLid = ({ w = 150 } = {}) => rect(-w / 2, -26, w, 26, gold, 9) + line(`M${-w / 2 + 14},-12 L${w / 2 - 14},-12`, g7, 3)

/** Bowl. `inside` is drawn at the rim (0,0 = rim centre) before the bowl front. */
export const bowl = ({ w = 240, h = 110, fill = red, rim = r7, inside = '', backRim = true } = {}) =>
  (backRim ? ell(0, -h, w / 2, 14, rim) : '') +
  at(inside, 0, -h) +
  path(`M${-w / 2},${-h} C${-w / 2},${-h * 0.12} ${-w * 0.3},0 ${-w * 0.16},0 L${w * 0.16},0 C${w * 0.3},0 ${w / 2},${-h * 0.12} ${w / 2},${-h} Z`, fill) +
  line(`M${-w / 2 + 6},${-h} L${w / 2 - 6},${-h}`, rim, 10)

/** A mound of `item`s (svg string anchored bottom-centre) piled in an arch. */
export function pile({ w = 200, rows = 3, step = 30, item, lift = 0 }) {
  const o = []
  for (let r = rows - 1; r >= 0; r--) {
    const count = Math.max(1, Math.round((w / step) * (1 - r / (rows + 0.4))))
    const span = (count - 1) * step
    for (let i = 0; i < count; i++) {
      const x = -span / 2 + i * step + (r % 2 ? step * 0.18 : 0)
      const wob = ((i * 7 + r * 5) % 5) - 2
      o.push(at(item, x, -r * step * 0.72 - lift + wob, 1, ((i * 37 + r * 11) % 30) - 15))
    }
  }
  return o.join('')
}

/** Rows of `item`s filling a box w x h (for a full jar). Anchor bottom-centre. */
export function fill({ w = 240, h = 240, step = 40, item }) {
  const o = []
  const cols = Math.floor(w / step)
  const rows = Math.floor(h / (step * 0.86))
  for (let r = 0; r < rows; r++) {
    const count = r % 2 ? cols - 1 : cols
    for (let i = 0; i < count; i++) o.push(at(item, (i - (count - 1) / 2) * step, -r * step * 0.86, 1, ((i * 31 + r * 17) % 24) - 12))
  }
  return o.join('')
}

export const marsh = ({ s = 28 } = {}) => rect(-s / 2, -s, s, s * 0.9, snow, s * 0.3, outline(w4, 2.5))
export const popcorn = ({ s = 16 } = {}) =>
  circ(-s * 0.5, -s * 0.6, s * 0.6, g1, outline(g3, 2.5)) + circ(s * 0.5, -s * 0.6, s * 0.6, g1, outline(g3, 2.5)) + circ(0, -s * 1.2, s * 0.62, snow, outline(g3, 2.5))
export const cerealRing = ({ r = 11, stroke = g7 } = {}) => `<circle cx="0" cy="${n(-r)}" r="${n(r)}" fill="none" stroke="${stroke}" stroke-width="7"/>`
export const cottonBall = ({ r = 22 } = {}) => circ(0, -r, r, snow, outline(w4, 2.5))

/** Soft heap: cotton, foam, sugar snow. Anchor bottom-centre. */
export function fluff({ w = 240, h = 90, stroke = w4 } = {}) {
  const o = []
  const k = Math.max(3, Math.round(w / 70))
  for (let i = 0; i < k; i++) {
    const t = k === 1 ? 0.5 : i / (k - 1)
    const x = -w / 2 + w * t
    const r = h * (0.42 + 0.3 * Math.sin(Math.PI * t))
    o.push(circ(x * 0.86, -r * 0.9, r, snow, outline(stroke, 3)))
  }
  o.push(rect(-w * 0.43, -h * 0.42, w * 0.86, h * 0.42, snow))
  o.push(line(`M${-w * 0.47},0 L${w * 0.47},0`, stroke, 3))
  return o.join('')
}

export const plate = ({ w = 200, fill = snow } = {}) => {
  const ry = w * 0.15
  return ell(0, -ry, w / 2, ry, fill, soft) + `<ellipse cx="0" cy="${n(-ry)}" rx="${n(w * 0.33)}" ry="${n(ry * 0.6)}" fill="none" stroke="${w1}" stroke-width="3"/>`
}

export const mug = ({ w = 110, h = 112, fill = red, shade = r7, top = '' } = {}) =>
  line(`M${w / 2 - 6},${-h * 0.76} C${w / 2 + 44},${-h * 0.76} ${w / 2 + 44},${-h * 0.24} ${w / 2 - 6},${-h * 0.24}`, fill, 15) +
  rect(-w / 2, -h, w, h, fill, 16) +
  ell(0, -h + 4, w / 2 - 6, 11, shade) +
  at(top, 0, -h + 6)

/** Small tapered cup or pot. `liquid` paints the top band. */
export const cup = ({ w = 74, h = 84, fill = snow, stroke = w4, liquid = '' } = {}) =>
  path(`M${-w / 2},${-h} L${w / 2},${-h} L${w * 0.36},0 L${-w * 0.36},0 Z`, fill, outline(stroke, 3)) +
  (liquid ? ell(0, -h, w / 2 - 4, 7, liquid) : '')

/** Shallow tray seen in perspective. Anchor = CENTRE of the tray. `wall` adds a high rim. */
export const tray = ({ w = 560, d = 130, rim = w8, fill = w4, wall = 0 } = {}) =>
  (wall ? ell(0, wall, w / 2, d / 2, rim) + rect(-w / 2, 0, w, wall, rim) : '') +
  ell(0, 0, w / 2, d / 2, rim) +
  ell(0, wall ? 6 : 2, w / 2 - 18, d / 2 - 12, fill)

export const basin = ({ w = 380, h = 120, fill = n3, rim = n6, inside = '', backRim = true } = {}) => bowl({ w, h, fill, rim, inside, backRim })

export const bubble = ({ r = 14 } = {}) => circ(0, -r, r, snow, outline(n3, 2.5))

export const boxBack = ({ w = 260, h = 170 } = {}) =>
  path(`M${-w / 2},${-h} L${-w / 2 - 66},${-h - 46} L${-w / 2 - 50},${-h + 30} Z`, w4, outline(wood, 3)) +
  path(`M${w / 2},${-h} L${w / 2 + 66},${-h - 46} L${w / 2 + 50},${-h + 30} Z`, w4, outline(wood, 3)) +
  rect(-w / 2 + 6, -h - 34, w - 12, 60, wood, 4)
export const boxFront = ({ w = 260, h = 170 } = {}) => rect(-w / 2, -h, w, h, w4, 5, outline(wood, 3)) + line(`M0,${-h + 6} L0,${-h + 50}`, wood, 4)

export const bottle = ({ h = 180, fill = snow, cap = pine, band = g3 } = {}) =>
  rect(-13, -h * 0.94, 26, h * 0.3, fill, 6, outline(n3, 3)) +
  rect(-30, -h * 0.72, 60, h * 0.72, fill, 13, outline(n3, 3)) +
  rect(-30, -h * 0.5, 60, h * 0.22, band) +
  rect(-17, -h, 34, h * 0.1, cap, 5)

export const container = ({ w = 140, h = 84, fill = n2, lid = red } = {}) =>
  rect(-w / 2, -h, w, h, fill, 10, outline(n3, 3)) + rect(-w / 2 - 6, -h - 12, w + 12, 20, lid, 8)

// ---- Christmas things -----------------------------------------------------

export function star({ r = 30, fill = gold, stroke = '' } = {}) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 ? r * 0.46 : r
    pts.push(`${n(Math.cos(a) * rr)},${n(Math.sin(a) * rr - r)}`)
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"${stroke || outline(fill, 4)}/>`
}

/** Tree. Light green so it reads on night blue; dark green for the shade. */
export function tree({ h = 560, lights = true, topper = true, tp = false } = {}) {
  const o = []
  const tiers = [
    [0.56, 0.06, 0.4],
    [0.8, 0.33, 0.31],
    [1.0, 0.6, 0.21],
  ]
  o.push(rect(-24, -h * 0.08, 48, h * 0.08, wood, 4))
  for (const [top, base, half] of tiers) {
    const tri = (dy, fill) =>
      path(`M0,${n(-h * top + dy)} L${n(-h * half)},${n(-h * base + dy)} L${n(h * half)},${n(-h * base + dy)} Z`, fill, outline(fill, 16))
    o.push(tri(12, pine), tri(0, p4))
  }
  if (tp) {
    // toilet-paper garland: loose white bands across the tiers
    o.push(line(`M${n(-h * 0.36)},${n(-h * 0.1)} C${n(-h * 0.1)},${n(-h * 0.02)} ${n(h * 0.14)},${n(-h * 0.22)} ${n(h * 0.34)},${n(-h * 0.16)}`, w4, 30))
    o.push(line(`M${n(-h * 0.36)},${n(-h * 0.1)} C${n(-h * 0.1)},${n(-h * 0.02)} ${n(h * 0.14)},${n(-h * 0.22)} ${n(h * 0.34)},${n(-h * 0.16)}`, snow, 24))
    o.push(line(`M${n(-h * 0.26)},${n(-h * 0.4)} C${n(-h * 0.06)},${n(-h * 0.3)} ${n(h * 0.1)},${n(-h * 0.5)} ${n(h * 0.26)},${n(-h * 0.44)}`, w4, 30))
    o.push(line(`M${n(-h * 0.26)},${n(-h * 0.4)} C${n(-h * 0.06)},${n(-h * 0.3)} ${n(h * 0.1)},${n(-h * 0.5)} ${n(h * 0.26)},${n(-h * 0.44)}`, snow, 24))
    o.push(line(`M${n(-h * 0.15)},${n(-h * 0.68)} C${n(-h * 0.04)},${n(-h * 0.6)} ${n(h * 0.06)},${n(-h * 0.76)} ${n(h * 0.15)},${n(-h * 0.7)}`, w4, 28))
    o.push(line(`M${n(-h * 0.15)},${n(-h * 0.68)} C${n(-h * 0.04)},${n(-h * 0.6)} ${n(h * 0.06)},${n(-h * 0.76)} ${n(h * 0.15)},${n(-h * 0.7)}`, snow, 22))
  } else if (lights) {
    const dots = [[-0.2, 0.16], [0.08, 0.2], [0.27, 0.13], [-0.1, 0.43], [0.14, 0.4], [-0.02, 0.7], [0.1, 0.66], [-0.3, 0.1]]
    dots.forEach(([dx, dy], i) => o.push(circ(h * dx, -h * dy, i % 3 === 0 ? 11 : 9, i % 2 ? gold : red)))
  }
  if (topper) o.push(at(star({ r: h * 0.06 }), 0, -h * 0.97))
  return o.join('')
}

export const bell = ({ r = 16 } = {}) => circ(0, -r, r, gold) + line(`M${-r * 0.6},${-r * 0.8} L${r * 0.6},${-r * 0.8}`, g7, 2.5) + circ(0, -r * 0.4, r * 0.16, g7)

/** Candy cane standing on its end, hook to the right. */
export function candyCane({ h = 130, w = 16 } = {}) {
  const d = `M0,0 L0,${-h + 34} C0,${-h - 10} 50,${-h - 10} 50,${-h + 34}`
  return (
    line(d, w4, w + 5) +
    line(d, snow, w) +
    `<path d="${d}" fill="none" stroke="${red}" stroke-width="${w}" stroke-dasharray="${n(w * 0.7)} ${n(w * 0.95)}" stroke-dashoffset="${n(w * 0.5)}"/>`
  )
}

/** Stocking (no hanging loop: the scene draws the loop to its hook). */
export const stocking = ({ h = 270 } = {}) =>
  path(`M-52,${-h + 36} L52,${-h + 36} L52,-78 C52,-44 96,-52 118,-30 C140,-6 116,8 84,8 L-8,8 C-40,8 -52,-10 -52,-42 Z`, red) +
  line('M74,-36 C96,-34 108,-22 106,-6', r7, 5) +
  rect(-64, -h, 128, 48, snow, 14, soft)

export const present = ({ w = 84, h = 72, fill = red, ribbon = gold } = {}) =>
  rect(-w / 2, -h, w, h, fill, 6) + rect(-7, -h, 14, h, ribbon) + at(bow({ w: w * 0.6, fill: ribbon, knot: ribbon }), 0, -h - 4)

/** Bow. Anchor = the knot. */
export const bow = ({ w = 70, fill = red, knot = r7 } = {}) =>
  path(`M0,0 L${-w / 2},${-w * 0.3} L${-w / 2},${w * 0.3} Z`, fill, outline(fill, 4)) +
  path(`M0,0 L${w / 2},${-w * 0.3} L${w / 2},${w * 0.3} Z`, fill, outline(fill, 4)) +
  circ(0, 0, w * 0.15, knot)

export const rosette = ({ r = 26 } = {}) =>
  path(`M-12,${-r} L-22,${r * 0.9} L-4,${r * 0.5} Z`, g7) + path(`M12,${-r} L22,${r * 0.9} L4,${r * 0.5} Z`, g7) + circ(0, -r, r, gold) + circ(0, -r, r * 0.52, g3)

export function gingerHouse({ w = 260, h = 300 } = {}) {
  const wall = h * 0.58
  return (
    rect(-w / 2, -wall, w, wall, wood, 6) +
    path(`M${-w / 2 - 26},${-wall + 6} L0,${-h} L${w / 2 + 26},${-wall + 6} Z`, w8, outline(w8, 10)) +
    line(`M${-w / 2 - 22},${-wall + 4} L0,${-h + 6} L${w / 2 + 22},${-wall + 4}`, snow, 16) +
    path(`M-24,0 L-24,${-wall * 0.5} A24,24 0 0 1 24,${-wall * 0.5} L24,0 Z`, red) +
    circ(-w * 0.3, -wall * 0.56, 20, g3, outline(snow, 5)) +
    circ(w * 0.3, -wall * 0.56, 20, g3, outline(snow, 5)) +
    circ(-w * 0.16, -wall - (h - wall) * 0.34, 9, red) +
    circ(w * 0.16, -wall - (h - wall) * 0.34, 9, p4) +
    circ(0, -wall - (h - wall) * 0.62, 9, gold) +
    line(`M${-w / 2 + 4},-3 L${w / 2 - 4},-3`, snow, 8)
  )
}

export function snowflake({ r = 30, stroke = snow } = {}) {
  const arms = [0, 60, 120].map((a) => at(line(`M${-r},0 L${r},0`, stroke, r * 0.2) + line(`M${r * 0.55},${-r * 0.22} L${r * 0.75},0 L${r * 0.55},${r * 0.22}`, stroke, r * 0.13) + line(`M${-r * 0.55},${-r * 0.22} L${-r * 0.75},0 L${-r * 0.55},${r * 0.22}`, stroke, r * 0.13), 0, 0, 1, a))
  return arms.join('') // anchor = centre
}

/** Blank bunting strip on a string. Anchor = middle of the top edge. */
export const banner = ({ w = 520, sag = 56, h = 92 } = {}) =>
  line(`M${-w / 2 - 70},-26 L${-w / 2},0 M${w / 2},0 L${w / 2 + 70},-26`, w4, 4) +
  path(`M${-w / 2},0 Q0,${sag} ${w / 2},0 L${w / 2},${h} Q0,${h + sag} ${-w / 2},${h} Z`, snow, soft) +
  rect(-w / 2 - 88, -38, 34, 20, g3, 3) +
  rect(w / 2 + 54, -38, 34, 20, g3, 3)

export function paperChain(points, { r = 26 } = {}) {
  const o = []
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const len = Math.hypot(x2 - x1, y2 - y1)
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
    o.push(at(`<ellipse cx="0" cy="0" rx="${n(len * 0.64)}" ry="${n(r * 0.5)}" fill="none" stroke="${i % 2 ? pine : red}" stroke-width="10"/>`, (x1 + x2) / 2, (y1 + y2) / 2, 1, ang))
  }
  return o.join('')
}

/** String of lights through the given points; a bulb at each point. */
export function lightString(points, { wire = p8, wireW = 5 } = {}) {
  let d = `M${n(points[0][0])},${n(points[0][1])}`
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1]
    const [x, y] = points[i]
    d += ` Q${n((px + x) / 2 + (i % 2 ? 26 : -26))},${n((py + y) / 2 + 22)} ${n(x)},${n(y)}`
  }
  return line(d, wire, wireW) + points.map(([x, y], i) => circ(x, y, 11, i % 3 === 2 ? g3 : gold) + circ(x - 3, y - 3, 3.5, g1)).join('')
}

export const miniDoor = ({ w = 130, h = 200 } = {}) =>
  path(`M${-w / 2 - 12},0 L${-w / 2 - 12},${-h + w / 2} A${w / 2 + 12},${w / 2 + 12} 0 0 1 ${w / 2 + 12},${-h + w / 2} L${w / 2 + 12},0 Z`, w4) +
  path(`M${-w / 2},0 L${-w / 2},${-h + w / 2} A${w / 2},${w / 2} 0 0 1 ${w / 2},${-h + w / 2} L${w / 2},0 Z`, red) +
  line(`M0,-6 L0,${-h + 6}`, r7, 4) +
  at(bell({ r: 12 }), w * 0.26, -h * 0.4)

// ---- food -----------------------------------------------------------------

export function cookie({ r = 36, kind = 'round' } = {}) {
  if (kind === 'star') return star({ r, fill: g3, stroke: outline(g7, 4) })
  if (kind === 'heart')
    return at(path('M0,0.92 C-1.5,-0.1 -1.05,-1.2 0,-0.42 C1.05,-1.2 1.5,-0.1 0,0.92 Z', wood, ` stroke="${w8}" stroke-width="0.09" stroke-linejoin="round"`) + path('M0,0.5 C-0.9,-0.1 -0.62,-0.72 0,-0.14 C0.62,-0.72 0.9,-0.1 0,0.5 Z', 'none', ` stroke="${snow}" stroke-width="0.09" stroke-linejoin="round"`), 0, -r, r)
  const chips = circ(-r * 0.36, -r * 1.2, r * 0.12, wood) + circ(r * 0.2, -r * 0.72, r * 0.12, wood) + circ(-r * 0.1, -r * 0.6, r * 0.1, wood) + circ(-r * 0.5, -r * 0.8, r * 0.1, wood)
  if (kind === 'bitten') {
    const a1 = (-75 * Math.PI) / 180, a2 = (-15 * Math.PI) / 180
    const p1 = [Math.cos(a1) * r, Math.sin(a1) * r - r], p2 = [Math.cos(a2) * r, Math.sin(a2) * r - r]
    return path(`M${n(p2[0])},${n(p2[1])} A${n(r)},${n(r)} 0 1 1 ${n(p1[0])},${n(p1[1])} A${n(r * 0.36)},${n(r * 0.36)} 0 0 0 ${n(p2[0])},${n(p2[1])} Z`, g3, outline(g7, 3)) + chips
  }
  return circ(0, -r, r, g3, outline(g7, 3)) + chips + circ(r * 0.4, -r * 1.3, r * 0.1, wood)
}

export const strawberry = ({ s = 1 } = {}) =>
  at(path('M0,0 C-36,-20 -32,-58 0,-58 C32,-58 36,-20 0,0 Z', red) + path('M-18,-56 L0,-70 L18,-56 L0,-48 Z', pine, outline(pine, 4)) + circ(-10, -32, 2.6, g3) + circ(9, -36, 2.6, g3) + circ(0, -18, 2.6, g3), 0, 0, s)

export function pancakes({ count = 4, w = 150 } = {}) {
  const o = []
  for (let i = 0; i < count; i++) o.push(ell(0, -14 - i * 19, w / 2 - i * 3, 15, g3, outline(g7, 3)))
  return o.join('')
}

/** Bunch of bananas fanned from the stem, each with a drawn-on face. */
export function bananas({ count = 4 } = {}) {
  const o = []
  const xs = count === 5 ? [-128, -64, 0, 64, 128] : [-99, -33, 33, 99]
  xs.forEach((dx, i) => {
    const d = `M0,-178 C${n(dx * 0.5)},-150 ${n(dx * 1.1)},-90 ${n(dx)},-22`
    o.push(line(d, g7, 46), line(d, gold, 40))
    o.push(circ(dx, -22, 7, g7))
    // the face, around 60% of the way down
    const fx = dx * 0.93, fy = -74
    o.push(circ(fx - 8, fy, 3.6, n9), circ(fx + 8, fy, 3.6, n9))
    o.push(i % 2 ? line(`M${n(fx - 7)},${fy + 13} Q${n(fx)},${fy + 21} ${n(fx + 7)},${fy + 13}`, n9, 3) : ell(fx, fy + 15, 5, 6, n9))
  })
  o.push(rect(-13, -204, 26, 34, w8, 7))
  return o.join('')
}

export const fish = ({ w = 46 } = {}) =>
  path(`M${-w / 2 + 6},-12 L${-w / 2 - 14},-25 L${-w / 2 - 14},1 Z`, gold, outline(g7, 2.5)) + ell(0, -12, w / 2, 12, gold, outline(g7, 2.5)) + circ(w * 0.24, -15, 2.6, n9)

export function snowman() {
  return (
    line('M-30,-64 L-74,-92', wood, 5) +
    line('M30,-64 L74,-92', wood, 5) +
    rect(-38, -66, 76, 66, snow, 20, soft) +
    rect(-30, -122, 60, 58, snow, 18, soft) +
    rect(-24, -168, 48, 48, snow, 15, soft) +
    circ(-9, -150, 3.6, n9) +
    circ(9, -150, 3.6, n9) +
    circ(0, -140, 4, red) +
    circ(0, -98, 4, pine) +
    circ(0, -82, 4, pine)
  )
}

/** Plate of spaghetti with syrup and sprinkles. */
export const spaghetti = ({ w = 260 } = {}) =>
  plate({ w }) +
  ell(0, -w * 0.2, w * 0.3, w * 0.12, g3, outline(g7, 3)) +
  line(`M${-w * 0.24},${-w * 0.2} C${-w * 0.1},${-w * 0.34} ${w * 0.05},${-w * 0.08} ${w * 0.22},${-w * 0.22}`, g7, 4) +
  line(`M${-w * 0.2},${-w * 0.14} C${-w * 0.05},${-w * 0.28} ${w * 0.1},${-w * 0.3} ${w * 0.2},${-w * 0.15}`, g7, 4) +
  line(`M${-w * 0.14},${-w * 0.27} C${-w * 0.04},${-w * 0.2} ${w * 0.06},${-w * 0.2} ${w * 0.14},${-w * 0.27}`, wood, 9) +
  circ(-w * 0.12, -w * 0.21, 5, red) + circ(w * 0.04, -w * 0.3, 5, pine) + circ(w * 0.13, -w * 0.19, 5, red) + circ(-w * 0.02, -w * 0.15, 5, night) +
  at(marsh({ s: 24 }), -w * 0.02, -w * 0.26, 1, 12)

// ---- toys and soft things ---------------------------------------------------

/** Sitting teddy. back = seen from behind (no face). headOnly = chin at (0,0). */
export function teddy({ fill = wood, belly = w2, back = false, headOnly = false } = {}) {
  const headAt = (cy) =>
    circ(-34, cy - 36, 17, fill) + circ(34, cy - 36, 17, fill) +
    (back ? '' : circ(-34, cy - 36, 8, belly) + circ(34, cy - 36, 8, belly)) +
    circ(0, cy, 46, fill) +
    (back ? '' : ell(0, cy + 13, 21, 16, belly) + circ(0, cy + 7, 5.5, n9) + circ(-17, cy - 8, 5, n9) + circ(17, cy - 8, 5, n9))
  if (headOnly) return headAt(-46)
  return (
    ell(-40, -14, 24, 17, fill) + ell(40, -14, 24, 17, fill) +
    (back ? '' : circ(-42, -13, 9, belly) + circ(42, -13, 9, belly)) +
    ell(0, -56, 52, 54, fill) +
    (back ? circ(0, -16, 12, belly) : ell(0, -50, 30, 32, belly)) +
    at(ell(0, 0, 15, 27, fill), -50, -68, 1, 24) + at(ell(0, 0, 15, 27, fill), 50, -68, 1, -24) +
    headAt(-132)
  )
}

export const duck = () =>
  path('M-38,-38 L-62,-58 L-30,-52 Z', gold, outline(gold, 4)) + ell(0, -28, 46, 28, gold) + ell(-6, -30, 20, 12, g3) + path('M46,-74 L72,-66 L46,-56 Z', red, outline(red, 3)) + circ(28, -66, 25, gold) + circ(34, -72, 4.2, n9)

export const cushion = ({ w = 160, h = 120, fill = g3, mark = g7 } = {}) => rect(-w / 2, -h, w, h, fill, 34) + circ(0, -h / 2, 7, mark)

export const book = ({ w = 170, h = 100, cover = pine, open = true } = {}) =>
  open
    ? rect(-w / 2 - 7, -h - 2, w + 14, h + 10, cover, 8) +
      path(`M0,${-h + 6} Q${-w / 4},${-h - 12} ${-w / 2},${-h} L${-w / 2},0 Q${-w / 4},-12 0,4 Z`, snow, soft) +
      path(`M0,${-h + 6} Q${w / 4},${-h - 12} ${w / 2},${-h} L${w / 2},0 Q${w / 4},-12 0,4 Z`, snow, soft)
    : rect(-w / 2, -h, w, h, cover, 6) + rect(-w / 2 + 8, -h + 6, w - 12, 8, snow, 2) + rect(-w / 2, -h * 0.62, w, h * 0.2, gold)

export const toyCar = ({ w = 160, fill = red, frontWheel = true } = {}) =>
  path(`M${-w * 0.26},-52 L${-w * 0.15},-90 L${w * 0.2},-90 L${w * 0.33},-52 Z`, fill, outline(fill, 6)) +
  rect(-w * 0.12, -84, w * 0.28, 26, n1, 5) +
  rect(-w / 2, -58, w, 40, fill, 15) +
  circ(-w * 0.28, -17, 18, n8) + circ(-w * 0.28, -17, 7, n3) + (frontWheel ? circ(w * 0.28, -17, 18, n8) + circ(w * 0.28, -17, 7, n3) : '')

export const block = ({ s = 62, fill = red } = {}) => rect(-s / 2, -s, s, s, fill, 8)
export const hammer = ({ h = 112 } = {}) => rect(-6, -h, 12, h, w4, 6, outline(wood, 2.5)) + rect(-34, -h - 16, 68, 32, pine, 8)

/** A tucked-in sleeper: the blanket mound that covers the body. */
export const sleepingBag = ({ w = 190, h = 120, fill = pine, stripe = p4 } = {}) =>
  path(`M${-w / 2},0 C${-w / 2},${-h * 1.3} ${w / 2},${-h * 1.3} ${w / 2},0 Z`, fill) + line(`M${-w * 0.34},${-h * 0.62} Q0,${-h * 0.44} ${w * 0.34},${-h * 0.62}`, stripe, 10)

export const flashlight = ({ len = 130 } = {}) =>
  path(`M${len * 0.16},-36 L${len / 2},-46 L${len / 2},4 L${len * 0.16},-6 Z`, g7) + rect(-len / 2, -36, len * 0.7, 30, n3, 8) + ell(len / 2, -21, 6, 25, n1) + rect(-len * 0.2, -40, 26, 10, red, 4)

export function pompom({ r = 24, fill = red } = {}) {
  const o = [circ(0, -r, r, fill)]
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i
    o.push(circ(Math.cos(a) * r * 0.86, -r + Math.sin(a) * r * 0.86, r * 0.3, fill))
  }
  return o.join('')
}

/** Blanket fort. Draw fortBack, then the peeking elf, then fortFront. */
export const fortBack = ({ w = 620, h = 330 } = {}) =>
  rect(-w / 2 + 16, -h * 0.5, 16, h * 0.5, wood, 4) + rect(w / 2 - 32, -h * 0.5, 16, h * 0.5, wood, 4) +
  path(`M${-w / 2},0 L${-w * 0.36},${-h * 0.92} Q0,${-h * 1.1} ${w * 0.36},${-h * 0.92} L${w / 2},0 Z`, n8)
export const fortFront = ({ w = 620, h = 330, fill = g3, stripe = r3 } = {}) =>
  path(`M${-w / 2},0 L${-w * 0.36},${-h * 0.92} Q0,${-h * 1.1} ${w * 0.36},${-h * 0.92} L${w / 2},0 L${w * 0.2},0 L${w * 0.17},${-h * 0.42} Q0,${-h * 0.82} ${-w * 0.17},${-h * 0.42} L${-w * 0.2},0 Z`, fill) +
  line(`M${-w * 0.4},${-h * 0.5} L${-w * 0.2},${-h * 0.5}`, stripe, 16) + line(`M${w * 0.2},${-h * 0.5} L${w * 0.4},${-h * 0.5}`, stripe, 16) +
  line(`M${-w * 0.43},${-h * 0.2} L${-w * 0.19},${-h * 0.2}`, stripe, 16) + line(`M${w * 0.19},${-h * 0.2} L${w * 0.43},${-h * 0.2}`, stripe, 16)

/** Tiny outfit on a clothesline. Anchor = top-centre (the line). */
export const outfit = ({ fill = gold } = {}) => path('M-22,60 L-22,24 L-36,30 L-44,14 L-16,0 Q0,10 16,0 L44,14 L36,30 L22,24 L22,60 Z', fill, outline(fill, 4)) + rect(-5, -10, 10, 20, w4, 3)

// ---- household things -------------------------------------------------------

export const remote = ({ w = 60, h = 176, fill = n3 } = {}) =>
  rect(-w / 2, -h, w, h, fill, 17) + circ(0, -h + 28, 11, red) +
  [0, 1, 2].map((r) => circ(-13, -h + 62 + r * 26, 6.5, n8) + circ(13, -h + 62 + r * 26, 6.5, n8)).join('')

export const toothbrush = ({ h = 200, fill = pine } = {}) =>
  rect(11, -h + 4, 18, 40, snow, 5, outline(n3, 2.5)) + rect(-8, -h, 20, 50, fill, 9) + rect(-5, -h + 40, 12, 60, fill, 5) + rect(-8, -h + 90, 16, h - 90, fill, 8)

/** Toothpaste tube lying down, cap to the right. */
export const toothpaste = ({ len = 150 } = {}) =>
  path(`M${-len / 2},-34 L${len * 0.3},-30 L${len * 0.3},-4 L${-len / 2},0 Z`, snow, outline(n3, 3)) +
  rect(-len * 0.2, -31, len * 0.26, 29, red) +
  rect(-len / 2 - 6, -37, 12, 40, n3, 3) +
  rect(len * 0.3, -26, 24, 18, pine, 4)

export const mirror = ({ w = 270, h = 330 } = {}) =>
  rect(-w / 2, -h, w, h, n1, 34, outline(w4, 14)) + line(`M${-w * 0.24},${-h * 0.66} L${-w * 0.06},${-h * 0.84}`, snow, 10) + line(`M${-w * 0.16},${-h * 0.56} L${-w * 0.06},${-h * 0.66}`, snow, 8)

export const shoe = ({ len = 210, h = 96, fill = n3 } = {}) =>
  path(`M${-len / 2 + 6},-14 L${-len / 2 + 6},${-h} L${-len * 0.06},${-h} L${len * 0.12},${-h * 0.5} C${len * 0.32},${-h * 0.46} ${len / 2},${-h * 0.36} ${len / 2 - 4},-14 Z`, fill, outline(fill, 6)) +
  line(`M${len * 0.0},${-h * 0.78} L${len * 0.1},${-h * 0.66} M${len * 0.07},${-h * 0.9} L${len * 0.17},${-h * 0.76}`, snow, 5) +
  rect(-len / 2, -18, len, 18, snow, 9, soft)

export const fork = ({ h = 300 } = {}) =>
  rect(-8, -h * 0.62, 16, h * 0.62, n3, 8) + rect(-23, -h * 0.8, 46, h * 0.22, n3, 10) +
  rect(-23, -h, 10, h * 0.28, n3, 5) + rect(-5, -h, 10, h * 0.28, n3, 5) + rect(13, -h, 10, h * 0.28, n3, 5)

export const rollingPin = ({ w = 250 } = {}) => rect(-w / 2, -34, w, 14, wood, 7, outline(w8, 2.5)) + rect(-w * 0.34, -50, w * 0.68, 46, w4, 20, outline(w8, 3))

export const starCutter = ({ r = 40 } = {}) => star({ r, fill: 'none', stroke: outline(n3, 8) })

export const magnifier = ({ r = 30 } = {}) => line('M0,0 L0,-40', wood, 11) + `<circle cx="0" cy="${n(-40 - r)}" r="${n(r)}" fill="none" stroke="${gold}" stroke-width="9"/>`

/** Leaning picture frame with a faceless silhouette (never a real face). */
export const frame = ({ w = 140, h = 170 } = {}) =>
  rect(-w / 2, -h, w, h, gold, 8) + rect(-w / 2 + 15, -h + 15, w - 30, h - 30, n1, 4) +
  circ(0, -h * 0.6, w * 0.15, n3) + path(`M${-w * 0.26},-15 C${-w * 0.26},${-h * 0.46} ${w * 0.26},${-h * 0.46} ${w * 0.26},-15 Z`, n3)

export const pencil = ({ len = 120, fill = gold } = {}) =>
  path('M0,0 L-7,-20 L7,-20 Z', w2, outline(w4, 2)) + path('M0,0 L-3,-8 L3,-8 Z', n9) + rect(-7, -len, 14, len - 20, fill, 2) + rect(-7, -len - 9, 14, 12, r3, 4)

export const marker = ({ len = 112, fill = night } = {}) => rect(-5, -22, 10, 22, n3, 3) + rect(-10, -len, 20, len - 20, fill, 6) + rect(-10, -len, 20, 22, n6, 6)

export const batteryBox = () => rect(-30, -38, 60, 38, n3, 7) + rect(-18, -46, 16, 10, n6, 3) + line('M-16,-19 L16,-19', n6, 4)

/** Toilet-paper roll standing on its side. Anchor bottom-centre. */
export const tpRoll = ({ r = 34 } = {}) => circ(0, -r, r, snow, soft) + circ(0, -r, r * 0.36, w4)

export const stool = ({ w = 120, h = 96 } = {}) =>
  line(`M${-w / 2 + 16},${-h + 10} L${-w / 2 + 4},0 M${w / 2 - 16},${-h + 10} L${w / 2 - 4},0`, wood, 12) + rect(-w / 2, -h, w, 20, w4, 9, outline(wood, 3))

export const bookshelf = ({ w = 180, h = 430 } = {}) =>
  rect(-w / 2, -h, w, h, wood, 8, outline(w8, 4)) +
  line(`M${-w / 2 + 6},${-h * 0.36} L${w / 2 - 6},${-h * 0.36} M${-w / 2 + 6},${-h * 0.68} L${w / 2 - 6},${-h * 0.68}`, w8, 9) +
  rect(-w * 0.36, -h * 0.36 - 74, 24, 70, red, 3) + rect(-w * 0.2, -h * 0.36 - 60, 22, 56, g3, 3) + rect(w * 0.06, -h * 0.36 - 68, 26, 64, p4, 3) +
  rect(-w * 0.3, -h * 0.68 - 62, 26, 58, n3, 3) + rect(-w * 0.12, -h * 0.68 - 72, 22, 68, gold, 3) +
  rect(-w * 0.34, -78, 24, 70, p4, 3) + rect(-w * 0.18, -70, 26, 62, r3, 3) + rect(w * 0.14, -64, 24, 56, g3, 3)

export const sofa = ({ w = 430, h = 210, fill = w4, seat = w2 } = {}) =>
  rect(-w * 0.4, -10, 22, 16, w8, 4) + rect(w * 0.4 - 22, -10, 22, 16, w8, 4) +
  rect(-w / 2 + 30, -h, w - 60, h - 20, fill, 34) +
  rect(-w / 2 + 44, -h * 0.5, w - 88, h * 0.34, seat, 18) +
  rect(-w / 2, -h * 0.68, 66, h * 0.68 - 6, fill, 26) + rect(w / 2 - 66, -h * 0.68, 66, h * 0.68 - 6, fill, 26)

/** Window at night. Anchor = top of the sill, centre. */
export const windowFrame = ({ w = 440, h = 400 } = {}) =>
  rect(-w / 2, -h, w, h, w4, 10) + rect(-w / 2 + 22, -h + 22, w - 44, h - 44, n8, 4) +
  line(`M0,${-h + 22} L0,-22 M${-w / 2 + 22},${-h / 2} L${w / 2 - 22},${-h / 2}`, w4, 14) +
  rect(-w / 2 - 38, 0, w + 76, 28, w4, 9, outline(wood, 3))

/** Cardboard-box sleigh on candy-cane runners. */
export function sleigh({ w = 330 } = {}) {
  const runner = `M${-w / 2},-8 L${w / 2 - 20},-8 C${w / 2 + 36},-8 ${w / 2 + 36},-70 ${w / 2 - 4},-70`
  return (
    line(`M${-w * 0.3},-8 L${-w * 0.3},-44 M${w * 0.22},-8 L${w * 0.22},-44`, w4, 9) +
    line(runner, w4, 21) + line(runner, snow, 16) +
    `<path d="${runner}" fill="none" stroke="${red}" stroke-width="16" stroke-dasharray="11 15"/>` +
    path(`M${-w / 2 + 6},-40 L${-w / 2 + 6},-190 Q${-w / 2 + 40},-200 ${-w / 2 + 70},-150 L${-w / 2 + 96},-110 L${w / 2 - 56},-110 Q${w / 2 - 10},-112 ${w / 2 - 6},-150 L${w / 2 - 6},-40 Z`, red, outline(red, 8)) +
    line(`M${-w / 2 + 20},-66 L${w / 2 - 20},-66`, r7, 6)
  )
}

/** Small sled: candy-cane runners under a base of sticks. */
export function candySled({ w = 280 } = {}) {
  const runner = `M${-w / 2},-8 L${w / 2 - 30},-8 C${w / 2 + 22},-8 ${w / 2 + 22},-60 ${w / 2 - 12},-60`
  return (
    line(runner, w4, 21) + line(runner, snow, 16) +
    `<path d="${runner}" fill="none" stroke="${red}" stroke-width="16" stroke-dasharray="11 15"/>` +
    rect(-w / 2 + 6, -40, w - 70, 22, w4, 8, outline(wood, 3)) +
    line(`M${-w * 0.2},-38 L${-w * 0.2},-20 M${w * 0.05},-38 L${w * 0.05},-20`, wood, 3)
  )
}

/** Object wrapped in gift paper with a bow on top. */
export const wrapped = ({ w = 150, h = 110, rx = 12, fill = pine, dot = g3, ribbon = red, withBow = true } = {}) => {
  const dots = []
  for (let yy = -h + 22; yy < -10; yy += 30) for (let xx = -w / 2 + 24, k = 0; xx < w / 2 - 12; xx += 34, k++) dots.push(circ(xx + ((yy / 30) % 2 ? 14 : 0), yy, 5, dot))
  return rect(-w / 2, -h, w, h, fill, rx) + dots.join('') + rect(-8, -h, 16, h, ribbon) + (withBow ? at(bow({ w: Math.min(70, w * 0.5), fill: ribbon, knot: r7 }), 0, -h - 4) : '')
}

export const magnet = ({ s = 52, fill = red } = {}) => rect(-s / 2, -s, s, s, fill, 12)

export const towelStripe = ({ w = 520, d = 110, fill = g3, stripe = r3 } = {}) =>
  flat({ w, d, fill, inset: 40, stroke: fill }) + line(`M${-w / 2 + 34},${-d * 0.3} L${w / 2 - 34},${-d * 0.3}`, stripe, 10) + line(`M${-w / 2 + 44},${-d * 0.66} L${w / 2 - 44},${-d * 0.66}`, stripe, 8)

/** Floured footprints: pairs of tiny boot soles. Anchor = centre of the pair. */
export const footprint = ({ fill = snow } = {}) => ell(-12, 0, 11, 6, fill, outline(w4, 2)) + ell(12, 6, 11, 6, fill, outline(w4, 2))

