# Character bible — the elf

Status: proposed for Gate 2. Owner: Visual/UX Designer.
Master file: `design/elf-master.svg` (generated — do not edit by hand; see "Where it comes from").

This page is the single reference for the mascot. Every illustration — placeholder or final, Canva or AI — starts from the master and must pass the checklist at the end.

## 1. Who the elf is

A **generic child elf**. Friendly, a little clumsy, proud of small pranks. It never speaks in the illustration: its words live on the page, in the "Elf note".

It is **not** the trademarked doll of any brand. It must never copy that doll's face, collar or outfit, and it never appears next to a brand's box or product.

## 2. Fixed features (same in all 60 scenes)

| Part | Definition |
|---|---|
| Proportions | Big head, small body. From boots to the top of the head, the head is about half of the figure; the hat adds roughly another quarter. Children's-book proportions, never realistic. |
| Face | Round. Two round black eyes set wide apart, looking straight ahead, one small highlight each. Rosy round cheeks. One simple curved smile. No nose, no eyebrows, no eyelashes, no teeth. |
| Hair | Short, brown, a soft scalloped fringe under the hat band. |
| Ears | Small and pointy, one each side, same colour as the skin. |
| Hands | Simple mittens (circles). Never drawn fingers. |
| Body | Small, soft, toy-like. Bell-shaped tunic, short legs. |

## 3. Outfit — always the same, nothing else

1. **Hat:** red, droopy, tipped to **one side** (the viewer's right in the front view), with a **green band** and **one gold bell** at the tip.
2. **Tunic:** red, plain.
3. **Scarf:** green, tied at the neck, two short tails on the viewer's left.
4. **Trousers:** green.
5. **Boots:** red, round toes.

Never add: emblem, logo, letter, belt, buckle, buttons, collar (especially a white pointed collar), white hat brim or fur trim, pom-pom, stripes, gloves, glasses. If a scene idea needs a "costume" (shower cap, hard hat, huge hat), it is drawn as a **separate prop beside or on top of** the fixed outfit — or left out. In the placeholders it is left out.

## 4. Colours

Only the six base colours and the approved tints/shades in `src/styles/tokens.css`.

| Part | Token | Hex |
|---|---|---|
| Hat, tunic, boots | `--color-red` | `#B42318` |
| Hat fold, boot soles | `--color-red-700` | `#902625` |
| Hat band, scarf, trousers | `--color-pine` | `#14532D` |
| Bell | `--color-gold` (detail `--color-gold-700`) | `#D9A441` / `#A37B31` |
| Hair | `--color-wood` | `#8A5A3B` |
| Skin | `--color-wood-200` (26% wood brown + 74% cream) | `#DFCDB7` |
| Soft contour of face and hands | `--color-wood-400` | `#C4A88F` |
| Cheeks | `--color-red-300` (35% red + 65% cream) | `#E3AC9C` |
| Eyes, smile | `--color-night-900` (45% night blue + 55% black) | `#0F1621` |
| Eye highlight | `--color-snow` | `#FEFCF7` |

The skin tone is a tint of wood brown because the palette rule allows no new hue. It is the tone most worth a second look at Gate 2.

## 5. Poses on the master sheet

`design/elf-master.svg`, left to right:

1. **Front view, standing** — the master pose. Arms relaxed.
2. **Sitting** — legs forward, boot soles toward the viewer. The most used pose: the elf sits on counters, floors, sofas and windowsills.
3. **Peeking** — head and two mittens over an edge. Used for "inside" and "behind" scenes (jar rim, box, mug, stocking, envelope, sleeping bag).
4. **Waving** — shows that arms move freely; proportions do not.
5. **Lying down, asleep** (in front, bottom) — eyes are two small arcs. Also used for "toppled over".

The six swatches at the top left are the base palette, in this order: red, pine green, cream, gold, night blue, wood brown.

Arms may point anywhere a short arm could reach. The elf may hold one prop per hand. The head never tilts more than about 10 degrees, except when lying down.

Not on the sheet yet: **profile** and **back** views. The source plan asks for front, profile and back. The placeholders never need them (every scene is staged from the front), so they are left for the final-art batch — see the open points in the handoff.

## 6. Style rules for every illustration

- Flat children's-book shapes: simple, filled, a soft contour only where a light shape sits on a light background. Shadow in one tone. No gradients, no 3D, no photo look.
- Light paper grain (in the placeholders: sparse short flecks one step darker or lighter than the area).
- The room is **suggested** by 2–3 flat colour areas, not drawn in full:

| Room | Wall | Surface | Edge strip |
|---|---|---|---|
| Kitchen | cream | wood brown counter | wood-400 |
| Living room / tree | night blue + gold light dots | night-800 floor | night-600 |
| Bathroom | night-200 ("light blue") | night-100 counter | snow |
| Bedroom | red-100 ("rosy cream") | red-200 | red-300 |
| Table | gold-100 | wood brown table | wood-800 |
| Entryway | pine-100 | wood brown floor | snow skirting board |
| Fridge | night-100 | snow shelf | night-300 |
| Whole house | cream | pine-400 rug | wood-400 |

- 3 to 6 simple props, large, at the elf's scale, all taken from the idea's materials list.
- Only physically possible scenes. Nothing floats; anything on a wall is hung or taped.
- **No text, letters or numbers inside the image.** Cards, signs, tags, banners, certificates and mirror messages stay blank; the words are added on the page or pin as a text layer.
- No scissors, ever. No real child's face (idea 30 shows a plain silhouette).
- Vertical format: the top third stays clean for the pin title.

## 7. Checklist before any illustration is published

- [ ] Same elf as the master: face, proportions, hat side, one bell?
- [ ] Outfit complete and nothing added?
- [ ] Only palette tokens?
- [ ] Action readable at 10% size?
- [ ] Props match the idea's materials? No extra, no missing key prop?
- [ ] Nothing floating, no extra hand, plausible scale?
- [ ] No text, letter or number anywhere in the image?
- [ ] Top third clean in the vertical file?
- [ ] Files named `vertical`, `horizontal`, `square` in `public/illustrations/<slug>/`?
- [ ] Alt text starts with "Illustration of"?

## 8. Where it comes from

The elf is defined once, in `scripts/placeholder-kit/elf.mjs`. The master sheet, the UI mascots in `design/mascot/` and all 180 placeholders are drawn by that one definition, so they cannot drift apart. To change the character, change that file and run:

```
node scripts/generate-placeholders.mjs
node scripts/check-placeholders.mjs
```

For Canva or AI production, export `design/elf-master.svg` as the reference image that accompanies every new scene.
