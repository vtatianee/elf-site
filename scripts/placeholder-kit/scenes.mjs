/**
 * Placeholder kit — the 60 SCENES (one per idea slug) + the site-wide image.
 *
 * Stage units: x from -500 to 500, the surface line (floor / counter / table)
 * is y = 0, "up" is negative. Things standing on the surface use y between 0
 * and ~150 (larger y = closer to the viewer). Nothing above y = -640, so the
 * top third of the vertical format stays clean for the pin title.
 *
 * Each scene: { alt, draw() -> array of SVG strings, back to front }.
 * `alt` describes the PLACEHOLDER and always starts with "Illustration of".
 *
 * Honest-placeholder rules applied here (see docs/handoffs/02b-design-system.md):
 * one front-view staging for every idea; 1-6 flat props taken from the idea's
 * materials; cards, signs, tags, banners and sheets are blank; nothing floats;
 * no scissors; the elf never changes outfit.
 */
import { C, at, circ, ell, line, outline, path, rect } from './core.mjs'
import { bootsUp, elf, mittens, peek } from './elf.mjs'
import * as P from './props.mjs'

const { red, pine, gold, night, wood, snow } = C
const r7 = C['red-700'], r3 = C['red-300']
const p8 = C['pine-800'], p4 = C['pine-400']
const g7 = C['gold-700'], g3 = C['gold-300'], g1 = C['gold-100']
const n8 = C['night-800'], n6 = C['night-600'], n3 = C['night-300'], n2 = C['night-200'], n1 = C['night-100']
const w8 = C['wood-800'], w4 = C['wood-400'], w1 = C['wood-100']

/** Something lying flat on the surface: squash a top-view drawing. */
const lying = (inner, x, y, sy = 0.5, rot = 0, s = 1) => at(rot ? at(inner, 0, 0, 1, rot) : inner, x, y, s, 0, s * sy)

const brush = () => rect(-6, -52, 12, 52, w4, 5, outline(wood, 2.5)) + rect(-17, -82, 34, 32, snow, 6, outline(w4, 3))

export const SCENES = {
  'movie-night-popcorn-patrol': {
    alt: 'Illustration of a small elf sitting on a sofa holding a TV remote bigger than its arm, next to a bowl of popcorn with three pieces fallen on the floor',
    draw: () => [
      at(P.sofa(), 0, 20, 1.5),
      elf({ x: -70, y: -136, s: 1.05, pose: 'sit', armR: [66, -66], holdR: at(P.remote({ h: 200 }), 0, 60) }),
      at(P.bowl({ w: 170, h: 76, fill: red, inside: P.pile({ w: 130, rows: 2, step: 30, item: P.popcorn() }) }), 170, -136),
      at(P.popcorn(), -250, 70), at(P.popcorn(), -180, 110), at(P.popcorn(), 300, 90),
    ],
  },
  'storytime-reading-corner': {
    alt: 'Illustration of a small elf sitting on a pillow with an open book on its lap, and two stuffed bears sitting with their backs to the viewer',
    draw: () => [
      at(P.cushion({ w: 330, h: 96, fill: snow, mark: w4 }), 0, 46),
      elf({ x: 0, y: -34, pose: 'sit', armL: [-58, -52], armR: [58, -52], holdL: at(P.book({ w: 180, h: 96 }), 58, 34) }),
      at(P.teddy({ back: true }), -310, 90, 1.2),
      at(P.teddy({ back: true, fill: g7, belly: g3 }), 310, 90, 1.2),
    ],
  },
  'shoe-shoe-train': {
    alt: 'Illustration of three shoes lined up like train cars, with a small elf riding in the first shoe and a stuffed bear in each of the others',
    draw: () => [
      at(P.teddy({ headOnly: true }), -370, -56, 0.82), at(P.shoe({ fill: gold }), -300, 50, 1.15),
      at(P.teddy({ headOnly: true, fill: g7, belly: g3 }), -100, -56, 0.82), at(P.shoe({ fill: n3 }), -30, 50, 1.15),
      peek({ x: 172, y: -44, s: 0.92 }), at(P.shoe({ fill: night }), 245, 50, 1.15), mittens({ x: 172, y: -58, s: 0.92, gap: 52 }),
      at(P.bell({ r: 15 }), -250, -6), at(P.bell({ r: 15 }), 20, -6),
    ],
  },
  'toothbrush-delivery-elf': {
    alt: 'Illustration of a small elf sitting on a bathroom counter, holding up a new toothbrush tied with a red bow like a trophy',
    draw: () => [
      at(P.mirror({ w: 300, h: 360 }), -230, -190),
      elf({ x: 30, y: 20, pose: 'sit', armR: [74, -96], holdR: at(P.toothbrush({ h: 250 }) + at(P.bow({ w: 64 }), 0, -70), 0, 70) }),
      at(P.tentCard(), -280, 80),
    ],
  },
  'tangled-in-christmas-lights': {
    alt: 'Illustration of a small elf sitting on the floor tangled in a string of glowing lights, with a small battery box beside it',
    draw: () => [
      elf({ x: 0, y: 20, pose: 'sit', armL: [-70, -80], armR: [70, -80] }),
      P.lightString([[-330, 50], [-240, -10], [-150, -110], [-60, -40], [30, -150], [110, -60], [190, -130], [260, -20], [345, 40]], { wire: n3 }),
      at(P.batteryBox(), 380, 70),
      at(P.tentCard(), -380, 110, 0.9),
    ],
  },
  'hiding-in-the-christmas-tree': {
    alt: 'Illustration of a Christmas tree with a small elf hiding among the branches halfway up, only its head and one hand showing',
    draw: () => [
      at(P.tree({ h: 610 }), 0, 10),
      peek({ x: 34, y: -226, s: 0.9 }),
      ell(34, -214, 130, 26, p4), ell(-40, -200, 70, 18, pine),
      line('M150,-232 L128,-222', red, 22), circ(160, -238, 12, C['wood-200'], outline(w4, 2.5)),
    ],
  },
  'letter-to-santa-station': {
    dx: 30,
    alt: 'Illustration of a table set up for letter writing with blank paper, colored pencils and a small red mailbox, and a small elf holding a little envelope',
    draw: () => [
      rect(-440, -160, 170, 190, red, 12), rect(-410, -120, 110, 16, r7, 8), rect(-452, -176, 194, 30, r7, 12),
      at(P.flat({ w: 340, d: 120 }), -60, 130),
      lying(P.pencil({ len: 150, fill: red }), 60, 60, 0.5, 70), lying(P.pencil({ len: 150, fill: pine }), 80, 100, 0.5, 96), lying(P.pencil({ len: 150, fill: gold }), 50, 140, 0.5, 110),
      elf({ x: 300, y: 10, s: 1.15, pose: 'sit', armL: [-72, -104], holdL: at(P.envelope({ w: 96, h: 64 }), 0, 22) }),
    ],
  },
  'trapped-in-a-jar': {
    alt: 'Illustration of a small elf sitting inside a large open glass jar with its hands up against the glass, the lid lying beside it and a blank card in front',
    draw: () => [
      elf({ x: 0, y: 34, s: 1.05, pose: 'sit', armL: [-62, -118], armR: [62, -118] }),
      at(P.jar({ w: 340, h: 430 }), 0, 46),
      at(P.jarLid({ w: 190 }), 320, 80),
      at(P.tentCard(), -320, 90),
    ],
  },
  'christmas-countdown-chain': {
    alt: 'Illustration of a small elf holding up one end of a red and green paper chain that trails across the floor, with loose paper strips and a marker nearby',
    draw: () => [
      P.paperChain([[-150, -206], [-98, -160], [-44, -112], [14, -66], [76, -26], [144, 8], [214, 30], [286, 40], [358, 40]]),
      elf({ x: -250, y: 10, pose: 'stand', armR: [80, -172] }),
      lying(rect(-70, -9, 140, 18, red, 3), 150, 120, 0.6, -14), lying(rect(-70, -9, 140, 18, pine, 3), 230, 140, 0.6, 10),
      lying(P.marker({ len: 120 }), -400, 110, 0.6, 76),
    ],
  },
  'sleeping-in-a-stocking': {
    alt: 'Illustration of a red Christmas stocking hanging from a wall peg with a small elf tucked inside, eyes closed, only its head out and cotton for a pillow',
    draw: () => [
      rect(-320, -362, 640, 28, wood, 12), circ(-120, -348, 12, w8),
      line('M-66,-322 L-118,-346', red, 8),
      peek({ x: 0, y: -292, s: 0.88, eyes: 'closed', rot: -6 }),
      at(P.fluff({ w: 110, h: 44 }), 48, -300),
      at(P.stocking({ h: 270 }), 0, -24, 1.15),
    ],
  },
  'flour-snow-angel': {
    dx: 40,
    alt: 'Illustration of a shallow tray of flour with a snow-angel shape pressed into it, and a small elf sitting proudly beside the tray',
    draw: () => [
      at(P.tray({ w: 580, d: 150, rim: n3, fill: snow }), -90, 86),
      lying(circ(0, -78, 30, w1) + path('M0,-52 L-48,58 L48,58 Z', w1, outline(w1, 10)) + at(ell(0, 0, 50, 26, w1), -62, -14, 1, -24) + at(ell(0, 0, 50, 26, w1), 62, -14, 1, 24), -90, 90, 0.42),
      elf({ x: 330, y: 14, s: 1.12, pose: 'sit', armL: [-78, -76] }),
    ],
  },
  'toilet-paper-tree-makeover': {
    alt: 'Illustration of a Christmas tree wrapped in loose bands of toilet paper, with a small elf sitting beside it holding the roll',
    draw: () => [
      at(P.tree({ h: 590, tp: true }), -110, 10),
      line('M176,-40 Q120,26 30,-28', w4, 30), line('M176,-40 Q120,26 30,-28', snow, 24),
      elf({ x: 270, y: 16, s: 1.1, pose: 'sit', armL: [-76, -72], holdL: at(P.tpRoll({ r: 30 }), 0, 30) }),
    ],
  },
  'marshmallow-bubble-bath': {
    alt: 'Illustration of a small elf relaxing in a bowl filled with mini marshmallows like bath foam, only its head and boots showing, with a gold rubber duck and a blank card beside the bowl',
    draw: () => [
      at(
        P.bowl({
          w: 480, h: 176, fill: night, rim: n8,
          inside: P.pile({ w: 400, rows: 3, step: 42, item: P.marsh({ s: 40 }) }) + peek({ x: -86, y: -62, s: 1 }) + bootsUp({ x: 124, y: -62, s: 1 }) + P.pile({ w: 420, rows: 2, step: 42, item: P.marsh({ s: 40 }), lift: -8 }),
        }),
        -30, 56,
      ),
      at(P.duck(), 318, 78, 1.25),
      at(P.tentCard(), -370, 96, 0.9),
    ],
  },
  'toothpaste-mirror-message': {
    alt: 'Illustration of a small elf sitting on a bathroom counter holding an open tube of toothpaste, in front of a blank mirror with a dab of toothpaste in the corner',
    draw: () => [
      at(P.mirror({ w: 400, h: 400 }), 90, -160),
      circ(232, -214, 16, snow, outline(n3, 3)), circ(214, -196, 10, snow, outline(n3, 3)),
      elf({ x: -150, y: 16, pose: 'sit', armR: [80, -72], holdR: at(P.toothpaste({ len: 130 }), 34, 22, 1, -32) }),
      rect(150, 44, 34, 24, pine, 6),
    ],
  },
  'silly-banana-bunch': {
    alt: 'Illustration of a bunch of bananas in a fruit bowl, each banana with a different face drawn on it, and a small elf sitting beside the bowl holding a pen',
    draw: () => [
      at(P.bowl({ w: 440, h: 124, fill: p4, rim: pine, inside: at(P.bananas({ count: 5 }), 0, 34) }), -100, 66),
      elf({ x: 310, y: 14, s: 1.1, pose: 'sit', armL: [-74, -98], holdL: at(P.marker({ len: 100 }), 0, 32) }),
    ],
  },
  'sink-fishing-trip': {
    dx: -30,
    alt: 'Illustration of a small elf sitting on a counter fishing with a little stick-and-string rod over a blue bowl of fish-shaped crackers, with two caught crackers on a plate',
    draw: () => [
      line('M-131,-116 L140,-336', wood, 9), line('M140,-336 L140,-96', w8, 3), line('M140,-96 q10,10 0,18', n3, 5),
      elf({ x: -230, y: 12, s: 1.15, pose: 'sit', armR: [86, -110] }),
      at(P.bowl({ w: 310, h: 124, fill: night, rim: n8, inside: ell(0, 2, 140, 12, n2) + at(P.fish(), -70, 12, 1.2) + at(P.fish(), 12, 10, 1.2, 0) + at(P.fish(), 84, 14, 1.2) }), 150, 60),
      at(P.plate({ w: 190 }), 380, 120), at(P.fish(), 360, 102, 1.1), at(P.fish(), 404, 114, 1.1),
    ],
  },
  'sticky-note-surprise-wall': {
    alt: 'Illustration of colored sticky notes arranged in the shape of a Christmas tree on a door, a few of them blank, with a small elf sitting below holding a marker',
    draw: () => {
      const fills = [gold, r3, p4, snow, g3, n2, snow, p4, gold, snow]
      const o = []
      let k = 0
      ;[1, 2, 3, 4].forEach((count, row) => {
        for (let i = 0; i < count; i++) {
          const f = fills[k++ % fills.length]
          o.push(at(P.stickyNote({ s: 64, fill: f }).replace('/>', f === snow ? `${outline(w4, 3)}/>` : '/>'), -170 + (i - (count - 1) / 2) * 72, -500 + row * 72))
        }
      })
      o.push(at(P.stickyNote({ s: 64, fill: w4 }), -170, -212))
      o.push(elf({ x: 190, y: 14, s: 1.12, pose: 'sit', armL: [-72, -100], holdL: at(P.marker({ len: 104 }), 0, 30) }))
      o.push(rect(-210, 40, 80, 60, gold, 5), rect(-210, 34, 80, 12, g7, 4))
      return o
    },
  },
  'elf-zipline-adventure': {
    alt: 'Illustration of a small elf riding a string zipline across the living room, hanging from a candy cane hooked over the string between a bookshelf and a sofa',
    draw: () => [
      at(P.bookshelf(), -385, 10, 1.25),
      at(P.sofa(), 310, 14, 0.85),
      line('M-296,-522 L190,-166', snow, 5),
      elf({ x: -52, y: -92, s: 0.8, pose: 'stand', armL: [-64, -262], holdL: at(P.candyCane({ h: 120 }), 0, 30) }),
    ],
  },
  'sweet-spaghetti-breakfast': {
    alt: 'Illustration of a small plate of spaghetti topped with syrup, sprinkles and a marshmallow, and a small elf sitting beside it holding a fork taller than itself',
    draw: () => [
      at(P.spaghetti({ w: 360 }), -120, 120),
      elf({ x: 250, y: 12, s: 1.1, pose: 'sit', armL: [-78, -92], holdL: at(P.fork({ h: 310 }), 0, 96) }),
    ],
  },
  'candy-cane-sled': {
    alt: 'Illustration of a small elf sitting on a little sled made of candy canes and craft sticks, on cotton snow, with two tiny presents stacked behind it',
    draw: () => [
      at(P.fluff({ w: 700, h: 70 }), 0, 120),
      at(P.present({ w: 84, h: 70, fill: pine }), -140, -12, 0.95), at(P.present({ w: 70, h: 56, fill: gold, ribbon: red }), -136, -80, 0.8),
      elf({ x: 24, y: -10, s: 1.05, pose: 'sit' }),
      at(P.candySled({ w: 360 }), 0, 44),
    ],
  },
  'hot-cocoa-stand-helper': {
    alt: 'Illustration of a small elf standing behind a big mug like a cocoa stand, with a blank sign on a post and a little pot of mini marshmallows',
    draw: () => [
      at(P.sign({ w: 240, h: 120, pole: 300 }), -310, 30),
      peek({ x: 20, y: -118, s: 1.1 }),
      at(P.mug({ w: 200, h: 200, fill: pine, shade: p8 }), 20, 80),
      mittens({ x: 20, y: -122, s: 1.1, gap: 66 }),
      at(P.cup({ w: 110, h: 100, fill: g3, stroke: g7 }), 310, 80), at(P.pile({ w: 80, rows: 2, step: 30, item: P.marsh({ s: 28 }) }), 310, -14),
    ],
  },
  'cookie-baking-disaster': {
    alt: 'Illustration of a small elf sitting on a kitchen counter holding a star cookie cutter, with a rolling pin, a patch of flour, little flour footprints and a bitten cookie',
    draw: () => [
      at(P.rollingPin({ w: 260 }), -280, 36),
      ell(-270, 104, 190, 42, snow, outline(w4, 3)),
      at(P.footprint(), -110, 84, 0.9), at(P.footprint(), -40, 62, 0.8), at(P.footprint(), 24, 44, 0.7),
      elf({ x: 170, y: 12, s: 1.12, pose: 'sit', armR: [80, -100], holdR: at(P.starCutter({ r: 44 }), 0, 44) }),
      at(P.cookie({ r: 46, kind: 'bitten' }), 380, 120),
    ],
  },
  'milk-and-cookies-taste-test': {
    alt: 'Illustration of three different cookies in a row, each with a small cup of milk, and a small elf holding a pencil over a blank score sheet with empty stars',
    draw: () => [
      ...[-350, -210, -70].map((x) => at(P.cup({ w: 80, h: 90, fill: n1, stroke: n3, liquid: snow }), x, 30)),
      lying(P.cookie({ r: 50 }), -350, 124, 0.55), lying(P.cookie({ r: 50, kind: 'star' }), -210, 124, 0.55), lying(P.cookie({ r: 50, kind: 'heart' }), -70, 124, 0.55),
      elf({ x: 260, y: 10, s: 1.08, pose: 'sit', armL: [-70, -56], holdL: at(P.pencil({ len: 110, fill: red }), 0, 44) }),
      at(P.flat({ w: 300, d: 86 }) + [-80, 0, 80].map((x) => lying(P.star({ r: 26, fill: 'none', stroke: outline(g7, 4) }), x, -18, 0.5)).join(''), 250, 160),
    ],
  },
  'gingerbread-house-inspector': {
    alt: 'Illustration of a large gingerbread house with a small elf standing beside it, holding a blank clipboard and a magnifying glass',
    draw: () => [
      at(P.gingerHouse(), -170, 40, 1.55),
      elf({ x: 250, y: 30, s: 1.05, pose: 'stand', armL: [-72, -104], holdL: at(P.clipboard(), 0, 34), armR: [76, -128], holdR: P.magnifier({ r: 30 }) }),
    ],
  },
  'kindness-mission-card': {
    alt: 'Illustration of a small elf peeking over the top of a large blank envelope, with a small blank card beside it',
    draw: () => [
      peek({ x: 0, y: -252, s: 1.2 }),
      at(P.envelope({ w: 540, h: 340 }), 0, 70),
      mittens({ x: 0, y: -270, s: 1.2, gap: 78 }),
      at(P.card({ w: 130, h: 92 }), 370, 90, 1, -8),
    ],
  },
  'candy-cane-scavenger-hunt': {
    alt: 'Illustration of a candy cane half hidden behind a cushion, and a small elf standing nearby holding up a blank card',
    draw: () => [
      at(P.candyCane({ h: 190, w: 20 }), -190, -110, 1, 14),
      at(P.cushion({ w: 320, h: 230 }), -240, 50),
      elf({ x: 240, y: 24, s: 1.15, pose: 'stand', armR: [80, -134], holdR: at(P.card({ w: 104, h: 74 }), 0, 28) }),
    ],
  },
  'build-a-snowman-challenge': {
    dx: -20,
    alt: 'Illustration of a finished marshmallow snowman on a table next to a small elf pointing at three loose marshmallows, toothpicks and sprinkles',
    draw: () => [
      at(P.snowman(), -300, 70, 1.35),
      elf({ x: -20, y: 12, s: 1.1, pose: 'sit', armR: [98, -70] }),
      at(P.marsh({ s: 64 }), 220, 90), at(P.marsh({ s: 64 }), 300, 110, 1, 10), at(P.marsh({ s: 64 }), 262, 34, 1, -8),
      line('M370,120 L440,96 M380,140 L452,126 M366,100 L430,70', wood, 4),
      circ(330, 150, 5, red), circ(352, 158, 5, pine), circ(308, 160, 5, gold), circ(380, 160, 5, red),
    ],
  },
  'nice-list-certificate': {
    alt: 'Illustration of a blank certificate with a gold border lying on a bed, a gold ribbon rosette beside it and a small elf asleep on one corner',
    draw: () => [
      lying(P.diploma({ w: 520, h: 290 }), -90, 156, 0.5, -6),
      at(P.rosette({ r: 30 }), -390, 70, 1.1),
      lying(P.marker({ len: 120, fill: pine }), -260, 150, 0.6, 80),
      elf({ x: 190, y: 86, s: 1, pose: 'lie', eyes: 'closed', armL: [-52, -70], armR: [52, -70] }),
    ],
  },
  'would-you-rather-card': {
    alt: 'Illustration of a small elf sitting at a breakfast table holding up a large blank card, with a mug and a plate beside it',
    draw: () => [
      at(P.mug({ w: 110, h: 110, fill: pine, shade: p8 }), -320, 70),
      at(P.plate({ w: 220 }), 330, 110),
      elf({ x: 0, y: 12, s: 1.2, pose: 'sit', armL: [-64, -72], armR: [64, -72], holdL: at(P.card({ w: 220, h: 146 }), 64, 44) }),
    ],
  },
  'farewell-letter-and-photo': {
    alt: 'Illustration of a small elf sitting under a Christmas tree at night between an open blank letter and a small picture frame showing a plain silhouette',
    draw: () => [
      at(P.tree({ h: 600 }), -300, 4),
      at(P.frame(), 300, 50, 1.35, 4),
      elf({ x: 20, y: 14, s: 1.1, pose: 'sit' }),
      at(P.flat({ w: 320, d: 110 }) + line('M-126,-55 L126,-55', w4, 3), -250, 160),
    ],
  },
  'im-back-arrival-banner': {
    alt: 'Illustration of a blank paper banner hung across a wall with a little bell at each end, and a small elf standing underneath holding a marker',
    draw: () => [
      at(P.banner({ w: 580 }), 0, -520),
      at(P.bell({ r: 17 }), -360, -504), at(P.bell({ r: 17 }), 360, -504),
      elf({ x: 0, y: 20, s: 1, pose: 'stand', armR: [80, -124], holdR: at(P.marker({ len: 104, fill: red }), 0, 30) }),
      at(P.tentCard(), 290, 80),
    ],
  },
  'north-pole-arrival-breakfast': {
    alt: 'Illustration of a stack of mini pancakes topped with a strawberry on a small plate, with a small elf behind it holding a blank sign and a little cup beside it',
    draw: () => [
      elf({ x: 80, y: 6, s: 1.2, pose: 'sit', armR: [86, -124], holdR: at(P.card({ w: 136, h: 92 }), 0, 30) }),
      at(P.plate({ w: 330 }), -70, 130),
      at(P.pancakes({ count: 4, w: 200 }), -70, 106), at(P.strawberry({ s: 0.9 }), -70, 20),
      at(P.cup({ w: 90, h: 96, fill: snow, stroke: w4, liquid: w1 }), -340, 70),
    ],
  },
  'special-delivery-arrival-box': {
    alt: 'Illustration of an open kraft-paper box with a small elf inside on cotton, only its head showing, with a string bow and a blank tag beside the box',
    draw: () => [
      at(P.boxBack({ w: 390, h: 220 }), 0, 70),
      peek({ x: 0, y: -146, s: 1.15 }),
      at(P.fluff({ w: 330, h: 56 }), 0, -128),
      at(P.boxFront({ w: 390, h: 220 }), 0, 70),
      at(P.bow({ w: 90, fill: w4, knot: wood }), -350, 80), line('M-350,80 Q-330,120 -300,110 M-350,80 Q-380,124 -404,112', w4, 6),
      line('M286,24 Q300,-10 330,10', w4, 4), at(P.tag({ w: 140, h: 82 }), 340, 100),
    ],
  },
  'arrival-hide-and-seek-clue-trail': {
    alt: 'Illustration of three blank cards laid in a curving trail across the floor leading to a Christmas tree, with a small elf half hidden behind the tree and a little bell on the floor beside it',
    draw: () => [
      elf({ x: 96, y: 4, s: 0.95, pose: 'stand', rot: -7, armR: [64, -120] }),
      at(P.tree({ h: 480 }), 270, 6),
      at(P.bell({ r: 20 }), 20, 34),
      lying(P.card({ w: 130, h: 180 }), -20, 76, 0.42, 12, 0.8), lying(P.card({ w: 130, h: 180 }), -180, 122, 0.42, -10, 1), lying(P.card({ w: 130, h: 180 }), -350, 166, 0.42, 16, 1.2),
    ],
  },
  'snowy-footprints-arrival': {
    alt: 'Illustration of a doormat by a door left ajar, with a trail of five little white footprints curving across the floor to a small elf sitting at the end',
    draw: () => [
      rect(-480, -600, 250, 600, w4, 6), rect(-230, -600, 24, 600, n8), circ(-268, -290, 13, gold),
      at(P.flat({ w: 380, d: 110, fill: pine, stroke: p8, inset: 40 }) + line('M-150,-22 L150,-22', g3, 6), -300, 150),
      at(P.footprint(), -130, 126), at(P.footprint(), -30, 104, 0.92), at(P.footprint(), 60, 82, 0.85), at(P.footprint(), 140, 60, 0.78), at(P.footprint(), 210, 44, 0.7),
      elf({ x: 340, y: 12, s: 1.08, pose: 'sit' }),
    ],
  },
  'toddler-peekaboo-blanket-fort': {
    alt: 'Illustration of a blanket fort with a small elf peeking out through the opening, and two large stuffed bears sitting in front as the audience',
    draw: () => [
      at(P.fortBack({ w: 640, h: 360 }), 0, 30),
      elf({ x: 0, y: 34, s: 0.94, pose: 'sit' }),
      at(P.fortFront({ w: 640, h: 360 }), 0, 30),
      at(P.teddy({ back: true, fill: g7, belly: g3 }), -390, 110, 1.05), at(P.teddy({ back: true, fill: w4, belly: w1 }), 390, 110, 1.05),
    ],
  },
  'pom-pom-color-sorting-game': {
    alt: 'Illustration of a tray with three colored cups, large pom-poms already sorted into two of them, and a small elf holding a pom-pom next to the third cup',
    draw: () => [
      at(P.tray({ w: 700, d: 150, rim: n3, fill: snow }), -90, 96),
      at(P.pompom({ r: 26, fill: red }), -330, -24), at(P.pompom({ r: 26, fill: red }), -296, -44), at(P.cup({ w: 110, h: 116, fill: red, stroke: r7 }), -310, 84),
      at(P.pompom({ r: 26, fill: gold }), -150, -26), at(P.cup({ w: 110, h: 116, fill: gold, stroke: g7 }), -140, 84),
      at(P.cup({ w: 110, h: 116, fill: night, stroke: n8 }), 30, 84),
      at(P.pompom({ r: 22, fill: gold }), -230, 150), at(P.pompom({ r: 22, fill: night }), 130, 146),
      elf({ x: 330, y: 20, s: 1.1, pose: 'sit', armL: [-98, -110], holdL: at(P.pompom({ r: 24, fill: night }), 0, 20) }),
    ],
  },
  'breakfast-cereal-garland': {
    alt: 'Illustration of a small elf sitting on a kitchen table wearing a garland of cereal rings as a necklace that is far too big, with a small bowl beside it',
    draw: () => {
      const o = [elf({ x: -60, y: 14, pose: 'sit' })]
      for (let a = -30; a <= 210; a += 20) {
        const rad = (a * Math.PI) / 180
        o.push(at(P.cerealRing({ r: 13 }), -60 + Math.cos(rad) * 104, -62 + Math.sin(rad) * 86 + 13))
      }
      o.push(at(P.bowl({ w: 200, h: 86, fill: night, rim: n8, inside: [-50, -16, 18, 52].map((x, i) => at(P.cerealRing({ r: 13 }), x, i % 2 ? -6 : 4)).join('') }), 280, 90))
      o.push(at(P.tentCard(), -350, 100, 0.9))
      return o
    },
  },
  'my-first-sticker-scene': {
    alt: 'Illustration of a large poster with a simple tree outline and three stickers on it, and a small elf standing on a little stool holding a star, not reaching the top',
    draw: () => [
      rect(-380, -510, 440, 530, snow, 8, outline(w4, 3)),
      line('M-160,-430 L-270,-280 L-220,-280 L-310,-130 L-10,-130 L-100,-280 L-50,-280 Z', pine, 8), rect(-176, -130, 32, 50, wood, 3),
      at(P.present({ w: 60, h: 50 }), -280, -40), circ(-120, -200, 20, red), circ(-200, -320, 16, gold),
      at(P.stool({ w: 170, h: 130 }), 250, 30),
      elf({ x: 250, y: -98, s: 0.95, pose: 'stand', armL: [-86, -186], holdL: at(P.star({ r: 28 }), 0, 30) }),
    ],
  },
  'toy-car-wash-station': {
    dx: 30,
    alt: 'Illustration of a basin of soapy water on a towel with a toy car being washed, a second toy car waiting in line, and a small elf beside the basin holding a little brush',
    draw: () => [
      at(P.towelStripe({ w: 800, d: 150 }), 0, 170),
      at(P.basin({ w: 430, h: 130, inside: ell(0, 2, 196, 13, n1) + at(P.toyCar({ w: 200 }), -10, 46) + at(P.bubble({ r: 16 }), -150, 10) + at(P.bubble({ r: 11 }), -122, -12) + at(P.bubble({ r: 15 }), 140, 10) + at(P.bubble({ r: 10 }), 112, -14) }), -20, 124),
      at(P.toyCar({ w: 160, fill: gold }), 340, 140, 0.95),
      elf({ x: -350, y: 30, s: 1, pose: 'sit', armR: [80, -92], holdR: at(brush(), 0, 26) }),
    ],
  },
  'plush-friends-campout': {
    alt: 'Illustration of a row of three little sleeping bags on the floor with a stuffed bear, a small elf and another stuffed bear tucked in, only their heads showing, and a flashlight switched off beside them',
    draw: () => [
      at(P.teddy({ headOnly: true }), -300, -64, 1.1), at(P.sleepingBag({ w: 250, h: 150, fill: p4, stripe: pine }), -300, 70),
      peek({ x: 0, y: -66, s: 1.05, eyes: 'closed' }), at(P.sleepingBag({ w: 250, h: 150, fill: g3, stripe: gold }), 0, 70),
      at(P.teddy({ headOnly: true, fill: g7, belly: g3 }), 300, -64, 1.1), at(P.sleepingBag({ w: 250, h: 150, fill: n3, stripe: n6 }), 300, 70),
      at(P.flashlight(), 150, 160, 1, -6),
    ],
  },
  'fruit-face-breakfast-plate': {
    alt: 'Illustration of a large plate with a pancake face made with banana-slice hair, strawberry cheeks and halved-blueberry eyes, and a small elf sitting by the plate holding a strawberry',
    draw: () => [
      ell(-90, 84, 290, 86, snow, outline(w4, 3)), ell(-90, 84, 236, 66, 'none', ` stroke="${w1}" stroke-width="4"`),
      ell(-90, 92, 150, 48, g3, outline(g7, 3)),
      ...[-200, -146, -90, -34, 20].map((x, i) => ell(x, 46 - (i === 2 ? 8 : i === 1 || i === 3 ? 4 : 0), 26, 12, g1, outline(g3, 3))),
      ell(-150, 84, 13, 7, night), ell(-30, 84, 13, 7, night),
      ell(-176, 108, 20, 10, red), ell(-4, 108, 20, 10, red),
      line('M-116,112 Q-90,126 -64,112', w8, 4),
      elf({ x: 320, y: 16, s: 1.05, pose: 'sit', armL: [-78, -94], holdL: at(P.strawberry({ s: 0.8 }), 0, 30) }),
    ],
  },
  'elf-workshop-build-station': {
    alt: 'Illustration of a tiny workshop on a table with a stack of wooden blocks, a toy hammer, a blank sign and a half-built toy car with a small elf sitting on top of it',
    draw: () => [
      at(P.block({ fill: red }), -400, 50, 1.2), at(P.block({ fill: gold }), -322, 50, 1.2), at(P.block({ fill: pine }), -360, -24, 1.2), at(P.block({ fill: night }), -230, 50, 1.2),
      at(P.toyCar({ w: 230, frontWheel: false }), 50, 70, 1.2),
      circ(240, 100, 22, n8), circ(240, 100, 9, n3),
      elf({ x: 44, y: -40, s: 0.9, pose: 'sit', armR: [70, -90], holdR: at(P.hammer({ h: 90 }), 0, 30) }),
      at(P.sign({ w: 130, h: 80, pole: 90 }), 380, 60),
    ],
  },
  'paper-snowflake-window-invasion': {
    alt: 'Illustration of a window at night covered in paper snowflakes hanging on strings, with a small elf sitting on the windowsill holding one huge snowflake',
    draw: () => {
      const flakes = [[-250, -420, 30], [-170, -300, 24], [-100, -470, 22], [-40, -340, 34], [40, -480, 20], [230, -420, 28], [250, -260, 22], [-240, -220, 20]]
      return [
        at(P.windowFrame({ w: 620, h: 460 }), 0, -130),
        ...flakes.map(([x, y]) => line(`M${x},-568 L${x},${y}`, n3, 2.5)),
        ...flakes.map(([x, y, r]) => at(P.snowflake({ r }), x, y)),
        elf({ x: 110, y: -130, s: 0.95, pose: 'sit', armL: [-96, -104], holdL: at(P.snowflake({ r: 62 }), -10, -30) }),
        at(P.tentCard(), -350, 90, 0.9),
      ]
    },
  },
  'mini-elf-door-and-welcome-mat': {
    alt: 'Illustration of a tiny red arched door with a gold bell for a knob at the bottom of a wall, with a striped little mat in front and a small elf sitting on the mat',
    draw: () => [
      at(P.miniDoor(), -220, 0, 1.6),
      at(P.towelStripe({ w: 460, d: 110, fill: gold, stripe: red }), 60, 140),
      elf({ x: 130, y: 70, s: 1, pose: 'sit' }),
    ],
  },
  'cardboard-sleigh-build': {
    alt: 'Illustration of a small elf sitting in a red cardboard-box sleigh with candy-cane runners and cotton on the seat, holding string reins',
    draw: () => [
      elf({ x: -10, y: -40, s: 1.05, pose: 'sit', armL: [-40, -50], armR: [72, -64] }),
      at(P.fluff({ w: 150, h: 50 }), 150, -100),
      at(P.sleigh(), 0, 70, 1.5),
      line('M66,-106 Q160,-60 236,-36', w4, 5),
    ],
  },
  'gingerbread-village-street': {
    zoom: 0.9,
    alt: 'Illustration of four small gingerbread houses in two rows on a white board, a path of sprinkles down the middle, and a small elf standing in the street holding a clipboard',
    draw: () => [
      at(P.flat({ w: 940, d: 150, inset: 80 }), 0, 160),
      at(P.gingerHouse(), -230, 34, 0.72), at(P.gingerHouse(), 230, 34, 0.72),
      ...[[0, 60, red], [-14, 80, pine], [12, 98, gold], [-8, 116, red], [16, 134, night], [-20, 148, gold]].map(([x, y, f]) => ell(x, y, 8, 4.5, f)),
      elf({ x: 0, y: 56, s: 0.8, pose: 'stand', armL: [-70, -104], holdL: at(P.clipboard(), 0, 34) }),
      at(P.gingerHouse(), -350, 130, 0.9), at(P.gingerHouse(), 350, 130, 0.9),
    ],
  },
  'elf-photo-booth-props': {
    alt: 'Illustration of a small elf standing inside a gold cardboard frame holding a paper mustache on a stick in front of its face, with a pot of paper props beside it',
    draw: () => [
      `<rect x="-290" y="-470" width="440" height="500" rx="12" fill="none" stroke="${gold}" stroke-width="36"/>`,
      `<rect x="-290" y="-470" width="440" height="500" rx="12" fill="none" stroke="${g7}" stroke-width="4"/>`,
      elf({
        x: -70, y: 10, s: 1.08, pose: 'stand', armR: [58, -108],
        holdR: line('M0,10 L-54,-28', w4, 6) + at(path('M0,0 C-12,-20 -48,-16 -54,6 C-40,-2 -16,10 0,0 Z', w8) + path('M0,0 C12,-20 48,-16 54,6 C40,-2 16,10 0,0 Z', w8), -58, -30, 1.15),
      }),
      line('M290,-40 L270,-150 M330,-40 L350,-170', w4, 6),
      path('M240,-150 L270,-210 L300,-150 Z', r3, outline(r3, 6)), path('M350,-170 L320,-220 M350,-170 L350,-230 M350,-170 L380,-220', 'none', ` stroke="${wood}" stroke-width="9" stroke-linecap="round"`),
      at(P.cup({ w: 130, h: 120, fill: p4, stroke: pine }), 310, 60),
      at(P.tentCard(), -410, 90, 0.85),
    ],
  },
  'elf-story-mad-libs-card': {
    alt: 'Illustration of a large card on a table with five blank lines to fill in, a pencil resting on the first line, a small elf holding the pencil and an envelope beside it',
    draw: () => [
      at(P.flat({ w: 600, d: 170, inset: 70 }) + [0, 1, 2, 3, 4].map((i) => line(`M${-220 + i * 12},${-140 + i * 28} L${220 - i * 12 + (i === 4 ? -120 : 0)},${-140 + i * 28}`, n3, 4)).join(''), -110, 184),
      at(P.pencil({ len: 250, fill: gold }), -210, 46, 1, 74),
      elf({ x: 190, y: 12, s: 1.05, pose: 'sit', armL: [-106, -30] }),
      at(P.envelope({ w: 120, h: 82 }), 372, 90, 1, 6),
    ],
  },
  'elf-workout-challenge-cards': {
    zoom: 0.94,
    alt: 'Illustration of a small elf toppled over on a little exercise mat with its arms stretched out, three blank cards fanned on the floor in front and a cushion beside it',
    draw: () => [
      at(P.flat({ w: 680, d: 100, fill: p4, stroke: pine, inset: 50 }), -40, 112),
      at(P.cushion({ w: 170, h: 130 }), 400, 60),
      elf({ x: -40, y: 78, s: 1.05, pose: 'lie', armL: [-88, -150], armR: [88, -150] }),
      lying(P.card({ w: 110, h: 150 }), -150, 172, 0.42, -18), lying(P.card({ w: 110, h: 150 }), -40, 176, 0.42, 0), lying(P.card({ w: 110, h: 150 }), 70, 172, 0.42, 18),
    ],
  },
  'guess-how-many-jar': {
    alt: 'Illustration of a closed clear jar full of marshmallows with a small elf sitting on the lid holding a blank slip of paper, and three more slips and a pencil beside the jar',
    draw: () => [
      at(P.fill({ w: 290, h: 262, step: 44, item: P.marsh({ s: 38 }) }), -80, 52),
      at(P.jar({ w: 310, h: 330, lid: true }), -80, 62),
      elf({ x: -80, y: -288, s: 0.84, pose: 'sit', armR: [78, -90], holdR: at(P.card({ w: 76, h: 50 }), 0, 20) }),
      lying(P.card({ w: 110, h: 70 }), 230, 90, 0.6, -12), lying(P.card({ w: 110, h: 70 }), 320, 124, 0.6, 14), lying(P.card({ w: 110, h: 70 }), 390, 84, 0.6, 4),
      lying(P.pencil({ len: 150, fill: red }), 200, 150, 0.6, 84),
    ],
  },
  'draw-my-outfit-contest': {
    alt: 'Illustration of a sheet of paper with an elf outline to color in, one boot colored red and the other green, colored pencils fanned beside it and a small elf holding a pencil',
    draw: () => {
      const o5 = (d) => `<path d="${d}" fill="none" stroke="${n6}" stroke-width="5" stroke-linejoin="round"/>`
      const outlineElf =
        ell(-27, -12, 26, 13.5, red, outline(n6, 5)) + ell(27, -12, 26, 13.5, pine, outline(n6, 5)) +
        o5('M-36,-66 h27 v46 h-27 Z M9,-66 h27 v46 h-27 Z') + o5('M-36,-124 Q0,-134 36,-124 L50,-58 Q0,-46 -50,-58 Z') +
        `<circle cx="0" cy="-178" r="58" fill="none" stroke="${n6}" stroke-width="5"/>` + o5('M-60,-218 C-66,-278 -26,-316 22,-304 C68,-292 102,-272 110,-228 C96,-246 78,-250 60,-218 Z')
      return [
        at(P.flat({ w: 480, d: 176, inset: 60 }), -130, 184),
        at(outlineElf, -130, 172, 0.62, 0, 0.5),
        lying(P.pencil({ len: 150, fill: red }), 150, 100, 0.6, 62), lying(P.pencil({ len: 150, fill: pine }), 170, 132, 0.6, 80), lying(P.pencil({ len: 150, fill: gold }), 176, 164, 0.6, 98),
        elf({ x: 340, y: -6, s: 1.02, pose: 'sit', armL: [-74, -98], holdL: at(P.pencil({ len: 104, fill: night }), 0, 36) }),
      ]
    },
  },
  'flour-snowball-fight': {
    alt: 'Illustration of a high-rimmed tray of flour with a small elf peeking over a cotton-ball fort on one side, two stuffed bears on the other side and cotton-ball snowballs lying between them',
    draw: () => [
      at(P.tray({ w: 860, d: 140, rim: n3, fill: snow, wall: 26 }), 0, 70),
      peek({ x: -230, y: -34, s: 1 }),
      at(P.fluff({ w: 270, h: 110 }), -230, 76),
      mittens({ x: -230, y: -40, s: 1, gap: 66 }),
      at(P.teddy(), 190, 64, 0.8), at(P.teddy({ fill: g7, belly: g3 }), 330, 76, 0.72),
      at(P.cottonBall({ r: 17 }), -40, 86), at(P.cottonBall({ r: 17 }), 20, 112), at(P.cottonBall({ r: 15 }), 76, 80), at(P.cottonBall({ r: 15 }), -76, 118),
    ],
  },
  'bubble-bath-foam-mountain': {
    alt: 'Illustration of a small tub overflowing with a round mountain of white foam, a small elf sitting on top, a gold rubber duck resting on the side and a towel on the floor',
    draw: () => {
      const foam = [[-190, -30, 92], [190, -30, 92], [-100, -112, 98], [100, -112, 98], [0, -190, 104]]
      return [
        at(P.towelStripe({ w: 860, d: 140 }), 0, 174),
        ell(0, -20, 250, 16, n6),
        ...foam.map(([x, y, r]) => circ(x, y - 20, r, snow, outline(n3, 3))),
        elf({ x: 0, y: -292, s: 0.84, pose: 'sit' }),
        circ(-70, -276, 44, snow, outline(n3, 3)), circ(70, -276, 44, snow, outline(n3, 3)),
        at(P.basin({ w: 520, h: 150, backRim: false }), 0, 130),
        circ(-236, 6, 40, snow, outline(n3, 3)), circ(244, 14, 34, snow, outline(n3, 3)), circ(-200, 60, 26, snow, outline(n3, 3)),
        at(P.duck(), 250, -96, 0.95, 22),
      ]
    },
  },
  'wrapping-paper-mayhem': {
    alt: 'Illustration of a living room where a cushion, a book and a TV remote have been gift-wrapped with bows, and a small elf sits on the wrapped remote holding the end of a roll of wrapping paper',
    draw: () => [
      at(P.wrapped({ w: 240, h: 180, rx: 44 }), -320, 50),
      at(P.wrapped({ w: 220, h: 64, rx: 8, fill: red, dot: g3, ribbon: gold }), 340, 60),
      path('M-470,118 L360,118 L372,170 L-484,170 Z', pine), ...[-420, -330, -240, -150, -60, 30, 120, 210, 300].map((x, i) => circ(x, i % 2 ? 136 : 152, 6, g3)),
      ell(366, 144, 15, 27, p8), ell(366, 144, 6, 11, w4),
      path('M-104,120 L-44,120 L-22,-44 L-52,-48 Z', pine),
      at(P.wrapped({ w: 280, h: 74, rx: 26, fill: gold, dot: snow, ribbon: red, withBow: false }), 30, 70),
      elf({ x: 30, y: -2, s: 1, pose: 'sit', armL: [-62, -48] }),
    ],
  },
  'elf-in-the-fridge-surprise': {
    alt: 'Illustration of the inside of a fridge with a small elf sitting on a clean little plate wearing an extra paper scarf, between closed containers and bottles, with a blank card in front',
    draw: () => [
      rect(-1000, -520, 2000, 20, n3),
      at(P.container({ w: 190, h: 120, lid: pine }), -330, 40), at(P.container({ w: 150, h: 84, fill: g1, lid: red }), -330, -92),
      at(P.bottle({ h: 250 }), 290, 40), at(P.bottle({ h: 200, cap: red, band: n2 }), 390, 44),
      at(P.plate({ w: 320 }), 0, 100),
      elf({ x: 0, y: 44, s: 1.1, pose: 'sit' }),
      rect(-66, -84, 132, 36, snow, 18, outline(w4, 3)), line('M-30,-80 L-38,-52 M0,-82 L-4,-50 M30,-80 L26,-52', red, 6),
      at(rect(-17, 0, 34, 80, snow, 12, outline(w4, 3)) + line('M-12,24 L12,20 M-12,50 L12,46', red, 6), 44, -60, 1, -14),
      at(P.tentCard(), 220, 150, 0.85),
    ],
  },
  'fridge-magnet-message': {
    alt: 'Illustration of a fridge door with a row of colored magnet tiles and an empty space at the end, and a small elf below holding the missing tile, with a blank card beside it',
    draw: () => [
      rect(-420, -580, 30, 330, n3, 15),
      ...[[red, -230], [gold, -160], [pine, -90], [night, -20], [r3, 50]].map(([f, x]) => at(P.magnet({ s: 58, fill: f }), x, -400)),
      `<rect x="91" y="-458" width="58" height="58" rx="12" fill="none" stroke="${n3}" stroke-width="3" stroke-dasharray="8 8"/>`,
      elf({ x: 130, y: 20, s: 1.1, pose: 'stand', armR: [72, -176], holdR: at(P.magnet({ s: 50, fill: p4 }), 0, 24) }),
      at(P.tentCard(), -250, 80),
    ],
  },
  'closet-fashion-show-elf': {
    alt: 'Illustration of a small elf standing on a paper runway on the floor, with three tiny outfits hanging on a little clothesline behind it',
    draw: () => [
      line('M-400,-440 Q0,-400 400,-440', w4, 4), rect(-432, -456, 40, 22, g3, 3), rect(392, -456, 40, 22, g3, 3),
      at(P.outfit({ fill: gold }), -210, -428, 1.3), at(P.outfit({ fill: n3 }), 0, -420, 1.3), at(P.outfit({ fill: p4 }), 210, -428, 1.3),
      at(P.flat({ w: 460, d: 150, inset: 110 }), 0, 166),
      elf({ x: 0, y: 100, s: 1.1, pose: 'stand', armL: [-76, -110], armR: [76, -110] }),
    ],
  },
  'memory-jar-last-week-goodbye': {
    alt: 'Illustration of a nearly empty clear jar with two small cards inside, a fan of blank cards beside it and a small elf holding up one blank card',
    draw: () => [
      at(P.card({ w: 110, h: 76 }), -290, 44, 1, -16), at(P.card({ w: 110, h: 76 }), -220, 48, 1, 12),
      at(P.jar({ w: 290, h: 340 }), -260, 60),
      ...[-30, -10, 10, 30].map((r) => at(P.card({ w: 86, h: 130 }), 10, 150, 1, r)),
      elf({ x: 270, y: 14, s: 1.1, pose: 'sit', armR: [82, -112], holdR: at(P.card({ w: 100, h: 70 }), 0, 26) }),
    ],
  },
  'goodbye-breakfast-and-hug-coupon': {
    alt: 'Illustration of a breakfast place setting with a heart-shaped cookie on a little plate and a blank coupon propped against a mug, and a small elf holding a little letter',
    draw: () => [
      at(P.plate({ w: 290 }), -250, 124), lying(P.cookie({ r: 60, kind: 'heart' }), -250, 122, 0.6),
      at(P.mug({ w: 130, h: 130, fill: pine, shade: p8 }), 20, 70),
      at(P.card({ w: 160, h: 104 }), 50, 110, 1, 9),
      elf({ x: 320, y: 12, s: 1.05, pose: 'sit', armL: [-76, -102], holdL: at(P.envelope({ w: 90, h: 62 }), 0, 22) }),
    ],
  },
}

/** Site-wide sharing image: the mascot waving beside a tree and two presents. No text. */
export const SITE_SCENE = {
  room: 'living-room-tree',
  alt: 'Illustration of a small elf waving beside a Christmas tree with two presents',
  draw: () => [
    at(P.tree({ h: 600 }), -230, 6),
    at(P.present({ w: 110, h: 90 }), 230, 60), at(P.present({ w: 90, h: 70, fill: gold, ribbon: red }), 330, 90),
    elf({ x: 40, y: 20, s: 1.3, pose: 'stand', armR: [84, -150] }),
  ],
}

