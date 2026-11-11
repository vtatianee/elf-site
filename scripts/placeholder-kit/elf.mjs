/**
 * Placeholder kit — THE ELF. One definition, used by every illustration,
 * by design/elf-master.svg and by the UI mascot files.
 *
 * Character bible (design/character-bible.md): generic child elf — big head,
 * round face, round black eyes, rosy cheeks, short brown hair, small pointy
 * ears, simple smile, small body, mitten hands. Outfit, always: droopy red
 * hat tipped to one side with a green band and ONE gold bell, red tunic,
 * green scarf tied at the neck, green trousers, red boots. Nothing else:
 * no emblem, no collar, no belt, no buttons.
 *
 * Local units: origin (0,0) = the point on the ground between the feet,
 * y grows downward. Standing height ≈ 304 units, head radius 58.
 * "L"/"R" always mean the VIEWER's left/right. The hat droops to the right.
 */
import { C, at, circ, ell, line, outline, path, rect } from './core.mjs'

const SKIN = C['wood-200']
const SKIN_LINE = C['wood-400']
const HAIR = C.wood
const EYE = C['night-900']
const CHEEK = C['red-300']
const RED = C.red
const RED_SHADE = C['red-700']
const GREEN = C.pine
const GREEN_SHADE = C['pine-800']
const GOLD = C.gold
const GOLD_SHADE = C['gold-700']

export const HEAD_R = 58

/** Head + hat, centred on (0,0). eyes: 'open' | 'closed'. */
export function head({ eyes = 'open' } = {}) {
  const o = []
  // small pointy ears
  o.push(path('M-50,-12 L-76,-22 L-54,14 Z', SKIN, outline(SKIN_LINE)))
  o.push(path('M50,-12 L76,-22 L54,14 Z', SKIN, outline(SKIN_LINE)))
  // round face
  o.push(circ(0, 0, HEAD_R, SKIN, outline(SKIN_LINE)))
  // short brown hair with a soft fringe
  o.push(
    path(
      'M-58,0 C-63,-44 -34,-62 0,-60 C34,-62 63,-44 58,0 C53,-17 45,-24 35,-16 C27,-29 10,-31 0,-21 C-10,-31 -27,-29 -35,-16 C-45,-24 -53,-17 -58,0 Z',
      HAIR,
    ),
  )
  // rosy cheeks
  o.push(circ(-37, 25, 10, CHEEK), circ(37, 25, 10, CHEEK))
  // round black eyes (or closed, for sleeping)
  if (eyes === 'closed') {
    o.push(line('M-29,7 Q-21,14 -13,7', EYE, 3.5), line('M13,7 Q21,14 29,7', EYE, 3.5))
  } else {
    o.push(circ(-21, 7, 7.5, EYE), circ(21, 7, 7.5, EYE))
    o.push(circ(-18.5, 4.5, 2.2, C.snow), circ(23.5, 4.5, 2.2, C.snow))
  }
  // simple smile
  o.push(line('M-11,28 Q0,38 11,28', EYE, 3.5))
  // droopy red hat, tipped to the viewer's right
  o.push(path('M-60,-40 C-66,-100 -26,-138 22,-126 C68,-114 102,-94 110,-50 C96,-68 78,-72 60,-40 Z', RED, outline(RED, 4)))
  o.push(line('M36,-112 C58,-102 76,-88 84,-68', RED_SHADE, 4))
  // green band
  o.push(path('M-62,-24 Q0,-50 62,-24 L62,-46 Q0,-72 -62,-46 Z', GREEN, outline(GREEN, 3)))
  // ONE gold bell at the tip
  o.push(circ(112, -40, 12, GOLD))
  o.push(line('M104,-38 L120,-38', GOLD_SHADE, 2.5), circ(112, -32.5, 2, GOLD_SHADE))
  return o.join('')
}

/** Green scarf tied at the neck. `cy` = y of the head centre. */
function scarf(cy) {
  const y = cy + 44
  return [
    at(rect(-6.5, 0, 13, 36, GREEN, 6), -27, y + 10, 1, 16),
    at(rect(-6.5, 0, 13, 31, GREEN, 6), -19, y + 10, 1, -9),
    rect(-37, y, 74, 19, GREEN, 9.5),
    circ(-23, y + 11, 9.5, GREEN),
    line(`M-27,${y + 7} L-20,${y + 14}`, GREEN_SHADE, 2.5),
  ].join('')
}

const DEFAULT_ARMS = {
  stand: { L: [-60, -72], R: [60, -72] },
  sit: { L: [-50, -42], R: [50, -42] },
}

/**
 * Full figure in local units.
 *   pose   'stand' | 'sit'
 *   armL / armR   [x, y] of the hand in local units (defaults: relaxed)
 *   holdL / holdR SVG drawn at the hand, under the mitten (the held prop)
 *   eyes   'open' | 'closed'
 */
export function elfFigure({ pose = 'stand', armL, armR, holdL = '', holdR = '', eyes = 'open' } = {}) {
  const sit = pose === 'sit'
  const cy = sit ? -150 : -178 // head centre
  const shoulderY = cy + 64
  const hands = { L: armL ?? DEFAULT_ARMS[pose].L, R: armR ?? DEFAULT_ARMS[pose].R }
  const o = []

  if (sit) {
    o.push(path(`M-36,${cy + 54} Q0,${cy + 44} 36,${cy + 54} L54,-12 Q0,2 -54,-12 Z`, RED, outline(RED, 6)))
    o.push(line('M-22,-18 L-56,-13', GREEN, 26), line('M22,-18 L56,-13', GREEN, 26))
    // boot soles face the viewer
    o.push(ell(-70, -17, 17, 21, RED), ell(-70, -16, 10, 13.5, RED_SHADE))
    o.push(ell(70, -17, 17, 21, RED), ell(70, -16, 10, 13.5, RED_SHADE))
  } else {
    o.push(rect(-36, -66, 27, 56, GREEN, 9), rect(9, -66, 27, 56, GREEN, 9))
    o.push(ell(-27, -12, 26, 13.5, RED), ell(27, -12, 26, 13.5, RED))
    o.push(path(`M-36,${cy + 54} Q0,${cy + 44} 36,${cy + 54} L50,-58 Q0,-46 -50,-58 Z`, RED, outline(RED, 6)))
  }

  // arms: red sleeve from the shoulder, mitten hand at the end
  for (const side of ['L', 'R']) {
    const sx = side === 'L' ? -33 : 33
    const [hx, hy] = hands[side]
    const ex = sx + (hx - sx) * 0.84
    const ey = shoulderY + (hy - shoulderY) * 0.84
    o.push(line(`M${sx},${shoulderY} L${ex.toFixed(1)},${ey.toFixed(1)}`, RED, 23))
    const held = side === 'L' ? holdL : holdR
    if (held) o.push(at(held, hx, hy))
    o.push(circ(hx, hy, 11.5, SKIN, outline(SKIN_LINE, 2.5)))
  }

  o.push(at(head({ eyes }), 0, cy))
  o.push(scarf(cy))
  return o.join('')
}

/**
 * Places the elf on the stage.
 *   x, y  ground point (between the feet; for 'lie' the middle of the body)
 *   s     scale (1 = 304 units tall standing)
 *   pose  'stand' | 'sit' | 'lie'
 *   flip  mirror left-right
 *   rot   extra lean in degrees
 */
export function elf({ x = 0, y = 0, s = 1.25, pose = 'stand', flip = false, rot = 0, ...opts } = {}) {
  if (pose === 'lie') {
    // the standing figure laid on its back: head to the left, hat tip up
    const fig = at(at(elfFigure({ ...opts, pose: 'stand' }), 150, -HEAD_R, 1, -90), 0, 0, flip ? -1 : 1, 0, 1)
    return at(fig, x, y, s, rot)
  }
  const fig = elfFigure({ ...opts, pose })
  return at(flip ? at(fig, 0, 0, -1, 0, 1) : fig, x, y, s, rot)
}

/**
 * Head only, for "peeking out of / over something". (x, y) = the chin.
 * Draw the thing the elf hides behind AFTER this, then call mittens().
 */
export function peek({ x = 0, y = 0, s = 1.25, eyes = 'open', flip = false, rot = 0, withScarf = true } = {}) {
  const inner = at(head({ eyes }), 0, -HEAD_R) + (withScarf ? scarf(-HEAD_R) : '')
  return at(flip ? at(inner, 0, 0, -1, 0, 1) : inner, x, y, s, rot)
}

/** Two mitten hands gripping an edge at height y (use with peek). */
export function mittens({ x = 0, y = 0, s = 1.25, gap = 46 } = {}) {
  return at(
    circ(-gap, 0, 12, SKIN, outline(SKIN_LINE, 2.5)) + circ(gap, 0, 12, SKIN, outline(SKIN_LINE, 2.5)),
    x,
    y,
    s,
  )
}

/** Two red boots poking up out of something (soles toward the viewer). */
export function bootsUp({ x = 0, y = 0, s = 1.25, gap = 24 } = {}) {
  const boot = (cx) => ell(cx, -20, 17, 22, RED) + ell(cx, -19, 10, 14, RED_SHADE)
  return at(boot(-gap) + boot(gap), x, y, s)
}
