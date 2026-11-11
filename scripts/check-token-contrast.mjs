#!/usr/bin/env node
/**
 * DESIGN TOKENS — WCAG contrast check.   Run:  node scripts/check-token-contrast.mjs
 *
 * Reads the --color-* values from src/styles/tokens.css and checks every
 * text/background pair the design system uses. Text pairs need 4.5:1 (AA),
 * UI/large-text pairs need 3:1. Exits with code 1 if any pair fails.
 * Dependency-free.
 */
import { readColorTokens } from './placeholder-kit/core.mjs'

const tokens = readColorTokens()

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [luminance(tokens[a]), luminance(tokens[b])].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// [foreground, background, minimum, where it is used]
const PAIRS = [
  ['night', 'cream', 4.5, 'body text on the page'],
  ['night', 'snow', 4.5, 'body text on cards'],
  ['night', 'wood-100', 4.5, 'text on the fact bar / preview note'],
  ['night', 'gold-100', 4.5, 'text on the elf note and email card'],
  ['night', 'red-100', 4.5, 'safety callout text'],
  ['red-700', 'red-100', 4.5, 'safety callout label'],
  ['night', 'pine-100', 4.5, 'text on selected chip / variation callout'],
  ['pine', 'pine-100', 4.5, 'selected chip label'],
  ['night-500', 'cream', 4.5, 'secondary text on the page'],
  ['night-500', 'snow', 4.5, 'secondary text on cards'],
  ['cream', 'night', 4.5, 'text on the Tonight Mode panel'],
  ['night-200', 'night', 4.5, 'secondary text on night'],
  ['gold', 'night', 4.5, 'gold text and icons on night'],
  ['cream', 'night-800', 4.5, 'footer text'],
  ['night-200', 'night-800', 4.5, 'footer small print'],
  ['gold', 'night-800', 4.5, 'footer headings'],
  ['snow', 'red', 4.5, 'primary button label'],
  ['snow', 'red-700', 4.5, 'primary button label, hover'],
  ['snow', 'pine', 4.5, 'secondary button label'],
  ['snow', 'pine-800', 4.5, 'secondary button label, hover'],
  ['night', 'gold', 4.5, 'gold button / pressed Tonight button label'],
  ['night', 'gold-300', 4.5, 'gold button label, hover'],
  ['red', 'cream', 4.5, 'eyebrow labels, red text'],
  ['red', 'snow', 4.5, 'red text on cards'],
  ['red', 'gold-100', 4.5, 'note label on the elf note'],
  ['pine', 'cream', 4.5, 'links on the page'],
  ['pine', 'snow', 4.5, 'links on cards'],
  ['pine', 'gold-100', 4.5, 'links on the note card'],
  ['red-700', 'cream', 4.5, 'link hover'],
  ['night', 'night-200', 4.5, 'pin title on a bathroom wall'],
  ['night', 'red-100', 4.5, 'pin title on a bedroom wall'],
  ['night', 'pine-100', 4.5, 'pin title on an entryway wall'],
  ['night', 'night-100', 4.5, 'pin title on a fridge wall'],
  ['night-500', 'cream', 3, 'input and chip borders'],
  ['night-300', 'night', 3, 'unpressed Tonight button border'],
  ['night', 'cream', 3, 'focus ring on light surfaces'],
  ['gold', 'night', 3, 'focus ring on night'],
  ['pine', 'pine-100', 3, 'selected chip border'],
  ['red', 'red-100', 3, 'safety callout border'],
]

let failed = 0
console.log('Token contrast check (WCAG 2.1)')
for (const [fg, bg, min, use] of PAIRS) {
  const r = ratio(fg, bg)
  const ok = r >= min
  if (!ok) failed++
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg} — ${use}`)
}
if (failed) {
  console.log(`\nFAIL — ${failed} pair(s) below the minimum.`)
  process.exit(1)
}
console.log(`\nPASS — ${PAIRS.length} pairs meet WCAG AA.`)
