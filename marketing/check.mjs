#!/usr/bin/env node
/**
 * Gate 4 checker for the marketing drafts. Read-only: it changes nothing.
 * Run from the repo root:   node marketing/check.mjs
 * Exit code 0 = all checks pass, 1 = at least one failure (listed).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const fails = []
const notes = []
const fail = (m) => fails.push(m)

function readJson(rel) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8')) } catch (e) { fail(`${rel}: invalid JSON (${e.message})`); return null }
}
const ideasData = readJson('src/data/ideas.json')
const pinsF = readJson('marketing/pins.json')
const videosF = readJson('marketing/videos.json')
const listsF = readJson('marketing/idea-lists.json')
const copyF = readJson('marketing/site-copy.json')
const emailMd = fs.readFileSync(path.join(ROOT, 'marketing/email.md'), 'utf8')
if (!ideasData || !pinsF || !videosF || !listsF || !copyF) { console.log(fails.join('\n')); process.exit(1) }

const ideas = ideasData.ideas
const bySlug = Object.fromEntries(ideas.map((i) => [i.slug, i]))
const idOrder = ideas.map((i) => i.slug)

// ---------- text rules applied to every public string ----------
const TRADEMARK = /elf\s*on\s*the\s*shelf|elfontheshelf|elf-on-the-shelf/i
const FORBIDDEN = [
  [/\$/, '"$"'],
  [/\bbest\s/i, '"best "'],
  [/#1\b/, '"#1"'],
  [/as seen on/i, '"as seen on"'],
  [/\bprice/i, '"price"'],
]
// "photo" is forbidden except inside an idea's own verbatim title or data terms
// (30 "Farewell Letter and Photo", 48 "Elf Photo Booth Props", "photo booth props kit")
// and the required disclosure "...original illustrations, not photos."
const PHOTO_ALLOWED = [...ideas.map((i) => i.title).filter((t) => /photo/i.test(t)), 'photo booth', 'not photos']
const PT_WORDS = ['não', 'você', 'ideia', 'ideias', 'bagunça', 'cozinha', 'sala', 'para', 'uma', 'também', 'quarto', 'natal', 'elfo', 'criança', 'ficha', 'fichas', 'passo', 'banheiro', 'geladeira', 'obrigado', 'aprovação']
const PT_RE = new RegExp(`(^|[^\\p{L}])(${PT_WORDS.join('|')})(?=[^\\p{L}]|$)`, 'iu')

function checkText(where, text) {
  if (typeof text !== 'string') return
  if (TRADEMARK.test(text)) fail(`${where}: trademark used`)
  for (const [re, label] of FORBIDDEN) if (re.test(text)) fail(`${where}: forbidden ${label} in “${text.slice(0, 80)}”`)
  let t = text
  for (const ok of PHOTO_ALLOWED) t = t.split(ok).join('').split(ok.toLowerCase()).join('')
  if (/photo/i.test(t)) fail(`${where}: "photo" outside an allowed title/term`)
  if (/[ãõçáéíóúâêô]/i.test(text.replace(/[“”‘’—–…·×→]/g, ''))) fail(`${where}: Portuguese-looking accent in “${text.slice(0, 60)}”`)
  if (PT_RE.test(text)) fail(`${where}: Portuguese word in “${text.slice(0, 60)}”`)
}
const INTERNAL = new Set(['flag', 'rule', 'source', 'slug', 'status', 'why', 'note', 'ideaId', 'joiners'])
function walk(where, v) {
  if (typeof v === 'string') checkText(where, v)
  else if (Array.isArray(v)) v.forEach((x, k) => walk(`${where}[${k}]`, x))
  // internal fields (reviewer notes, provenance, ids) are not public copy
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!k.startsWith('_') && !INTERNAL.has(k)) walk(`${where}.${k}`, x)
}

// ---------- pins.json ----------
const pins = pinsF.pins
const pinSlugs = Object.keys(pins)
if (pinSlugs.length !== 60) fail(`pins: ${pinSlugs.length} entries, expected 60`)
if (pinSlugs.join() !== idOrder.join()) fail('pins: keys are not the 60 slugs in id order')
const boardNames = new Set(pinsF._meta.boards.map((b) => b.name))
if (boardNames.size < 6 || boardNames.size > 10) fail(`pins: ${boardNames.size} boards, expected 6–10`)
for (const [slug, p] of Object.entries(pins)) {
  const i = bySlug[slug]
  if (!i) { fail(`pins.${slug}: slug not in ideas.json`); continue }
  if (p.slug !== slug || p.id !== i.id) fail(`pins.${slug}: id/slug mismatch`)
  if (p.textLayerTitle !== i.title) fail(`pins.${slug}: textLayerTitle ≠ idea title`)
  if (p.link !== `https://elf-site.pages.dev/ideas/${slug}/`) fail(`pins.${slug}: link is not the deep link`)
  if (p.kicker.length > 22) fail(`pins.${slug}: kicker ${p.kicker.length} > 22`)
  const MESS = { zero: 'Zero mess', low: 'Low mess', medium: 'Medium mess', high: 'High mess' }
  if (p.kicker !== `${i.time.label} · ${MESS[i.mess]}`) fail(`pins.${slug}: kicker is not time · mess from the data`)
  if (!['a', 'b', 'c'].includes(p.templateVariant)) fail(`pins.${slug}: bad variant`)
  if (p.pinTitle.length > 100) fail(`pins.${slug}: pinTitle ${p.pinTitle.length} > 100`)
  if (p.description.length > 500) fail(`pins.${slug}: description ${p.description.length} > 500`)
  if ((p.description + ' ' + p.hashtags.join(' ')).length > 500) fail(`pins.${slug}: description + hashtags > 500`)
  if (p.hashtags.length > 3) fail(`pins.${slug}: more than 3 hashtags`)
  if (/#/.test(p.description)) fail(`pins.${slug}: hashtag inside the description`)
  const sentences = p.description.split(/(?<=[.!?”])\s+(?=[A-Z“])/).length
  if (sentences < 2) fail(`pins.${slug}: description has fewer than 2 sentences`)
  const CTAS = ['Get the steps and the materials list on the idea page.', 'Tap through for the full setup, step by step.', 'See the materials and the 3 steps on our site.', 'Tap through for the steps and the note to leave with the elf.']
  if (!CTAS.some((c) => p.description.endsWith(' ' + c))) fail(`pins.${slug}: description does not end with a call to action to the site`)
  if (p.description.includes('note to leave with the elf') && !i.elfNote) fail(`pins.${slug}: CTA promises a note but the idea has none`)
  if (!p.altText || !p.altText.startsWith('Illustration of')) fail(`pins.${slug}: altText must start with "Illustration of"`)
  if (!boardNames.has(p.board)) fail(`pins.${slug}: unknown board ${p.board}`)
  for (const b of p.alsoSaveTo) if (!boardNames.has(b)) fail(`pins.${slug}: unknown secondary board ${b}`)
  if (!p.previewPath.includes(`slug=${slug}&variant=${p.templateVariant}`)) fail(`pins.${slug}: previewPath mismatch`)
  walk(`pins.${slug}`, { pinTitle: p.pinTitle, description: p.description, hashtags: p.hashtags, altText: p.altText, board: p.board, kicker: p.kicker })
}
for (const b of pinsF._meta.boards) checkText(`board name ${b.name}`, b.name)

// ---------- videos.json ----------
const videos = videosF.videos
if (Object.keys(videos).length !== 60) fail(`videos: ${Object.keys(videos).length} entries, expected 60`)
if (Object.keys(videos).join() !== idOrder.join()) fail('videos: keys are not the 60 slugs in id order')
for (const [slug, v] of Object.entries(videos)) {
  const i = bySlug[slug]
  if (!i) { fail(`videos.${slug}: slug not in ideas.json`); continue }
  if (v.title !== i.title) fail(`videos.${slug}: title ≠ idea title`)
  if (!Array.isArray(v.cuts) || v.cuts.length !== 3) fail(`videos.${slug}: needs exactly 3 cuts`)
  if (!Array.isArray(v.shots) || v.shots.length !== 3) fail(`videos.${slug}: needs exactly 3 shot notes`)
  for (const c of v.cuts) if (c.length > 60) fail(`videos.${slug}: cut longer than 60 chars`)
  if (!v.voiceover || v.voiceover.length > 120) fail(`videos.${slug}: voiceover missing or > 120 chars`)
  const want = i.safety.length ? i.safety.join(' ') : null
  if (v.safetyOnScreen !== want) fail(`videos.${slug}: safetyOnScreen must be the idea's exact safety text`)
  walk(`videos.${slug}`, { cuts: v.cuts, voiceover: v.voiceover, shots: v.shots })
}

// ---------- idea-lists.json ----------
const lists = listsF.ideas
if (Object.keys(lists).length !== 60) fail(`idea-lists: ${Object.keys(lists).length} entries, expected 60`)
if (Object.keys(lists).join() !== idOrder.join()) fail('idea-lists: keys are not the 60 slugs in id order')
for (const [slug, l] of Object.entries(lists)) {
  const i = bySlug[slug]
  if (!i) { fail(`idea-lists.${slug}: slug not in ideas.json`); continue }
  if (i.amazonItems.length === 0) {
    if (l.list !== null || !l.reason) fail(`idea-lists.${slug}: idea has no amazonItems → list must be null with a reason`)
    continue
  }
  if (!l.list) { fail(`idea-lists.${slug}: idea has amazonItems but no list`); continue }
  if (l.list.url !== '') fail(`idea-lists.${slug}: url must stay "" (placeholder)`)
  for (const it of l.list.items) if (!i.amazonItems.includes(it)) fail(`idea-lists.${slug}: item "${it}" is not in the idea's amazonItems`)
  const covered = [...l.list.items, ...l.list.heldBack.map((h) => h.item)]
  for (const it of i.amazonItems) if (!covered.includes(it)) fail(`idea-lists.${slug}: amazonItem "${it}" neither listed nor held back with a reason`)
  walk(`idea-lists.${slug}`, { name: l.list.name, description: l.list.description })
}
for (const s of listsF.staples) {
  if (s.url !== '') fail(`staple ${s.key}: url must stay ""`)
  const pool = new Set(s.usedBy.flatMap((u) => bySlug[u.slug]?.amazonItems ?? []))
  for (const u of s.usedBy) for (const it of u.items) if (!bySlug[u.slug]?.amazonItems.includes(it)) fail(`staple ${s.key}: "${it}" not in amazonItems of ${u.slug}`)
  for (const it of s.items) if (!pool.has(it)) fail(`staple ${s.key}: item "${it}" not from the listed ideas`)
  if (s.usedBy.length < 2) fail(`staple ${s.key}: a staple needs at least 2 ideas`)
  checkText(`staple ${s.key}`, s.name)
}
if (/\btag=/.test(JSON.stringify(listsF).replace('&tag=<associateTag>', ''))) fail('idea-lists: an affiliate tag value appears')

// ---------- site-copy.json ----------
const nullNotes = ideas.filter((i) => !i.elfNote).map((i) => String(i.id))
const draftNotes = Object.keys(copyF.elfNotes).filter((k) => !k.startsWith('_'))
if (draftNotes.join() !== nullNotes.join()) fail(`site-copy: elf notes for ${draftNotes} but ideas with null elfNote are ${nullNotes}`)
for (const k of draftNotes) {
  const n = copyF.elfNotes[k]
  if (n.status !== 'DRAFT') fail(`elfNotes.${k}: status must be DRAFT`)
  if (n.slug !== ideas.find((i) => String(i.id) === k).slug) fail(`elfNotes.${k}: slug mismatch`)
  if (n.text.length > 120) fail(`elfNotes.${k}: longer than 120 chars`)
}
const pr = copyF.printables
for (const [k, v] of Object.entries(pr)) if (v.status !== 'DRAFT') fail(`printables.${k}: status must be DRAFT`)
const wyr = pr.wouldYouRather.questions
if (wyr.length !== 24) fail(`would-you-rather: ${wyr.length} questions, expected 24`)
if (wyr[0].text !== bySlug['would-you-rather-card'].elfNote.text) fail('would-you-rather: question 1 must be the verbatim card text')
if (new Set(wyr.map((q) => q.text)).size !== 24) fail('would-you-rather: duplicate question')
for (const q of wyr) if (!/^Would you rather .+ or .+\?$/.test(q.text)) fail(`would-you-rather ${q.n}: not a "Would you rather … or …?" question`)
const ms = pr.kindnessMissions.missions
if (ms.length !== 12) fail(`kindness missions: ${ms.length}, expected 12`)
if (ms[0].text !== bySlug['kindness-mission-card'].elfNote.text) fail('kindness missions: mission 1 must be the verbatim card text')
const story = pr.storyCard
if (story.blanks.join() !== 'A noun,A place,A food,An animal,A verb') fail('story: blanks must be the 5 source blanks in order')
const blankCount = (story.text.match(/\[\d\./g) || []).length
if (blankCount !== 5) fail(`story: ${blankCount} blanks in the text, expected 5`)
if (!story.text.startsWith('Last night, the elf rode a [1. a noun] to the [2. a place] ...')) fail('story: must keep the source opening line')
const clues = pr.clueTrail.clues
if (clues.length !== 4 || clues[0].text !== bySlug['arrival-hide-and-seek-clue-trail'].elfNote.text) fail('clue trail: 4 clues, clue 1 = verbatim starting card')
for (const c of clues.slice(1)) if (!/_{4,}/.test(c.text)) fail(`clue ${c.n}: needs a blank for the next place`)
const letter = pr.farewellLetter.text.join(' ')
if (!/only Santa can touch me/i.test(letter)) fail('farewell letter: must explain that only Santa can touch the elf at the farewell')
if ((letter.match(/_{6,}/g) || []).length < 3) fail('farewell letter: needs the name + 2 moment blanks')
const hookKeys = Object.keys(copyF.hooks).filter((k) => !k.startsWith('_'))
if (hookKeys.length !== 60 || hookKeys.join() !== idOrder.join()) fail(`hooks: ${hookKeys.length} entries / not in id order`)
for (const k of hookKeys) {
  const h = copyF.hooks[k]
  if (h.text.length > 90) fail(`hooks.${k}: ${h.text.length} > 90`)
  if (h.status !== 'DRAFT') fail(`hooks.${k}: status must be DRAFT`)
  if (h.id !== bySlug[k].id) fail(`hooks.${k}: id mismatch`)
}
if (copyF.tonightFallback.status !== 'DRAFT') fail('tonightFallback: status must be DRAFT')
for (const ex of copyF.tonightFallback.examples) if (!/We let go of “/.test(ex)) fail('tonightFallback: example must name the dropped criterion')
walk('site-copy', { elfNotes: copyF.elfNotes, printables: copyF.printables, hooks: copyF.hooks, tonightFallback: { proposed: copyF.tonightFallback.proposed, examples: copyF.tonightFallback.examples, keptPhrases: copyF.tonightFallback.keptPhrases } })

// ---------- email.md (public copy only: tables, quotes and list items) ----------
const publicLines = emailMd.split('\n').filter((l) => /^\s*(>|\||- \*\*Subject|- \*\*Preheader)/.test(l))
publicLines.forEach((l, k) => checkText(`email.md public line ${k + 1}`, l.replace(/\{[^}]+\}/g, '')))
if (/mailchimp|convertkit|kit\.com|beehiiv|substack|klaviyo|sendgrid|flodesk|mailerlite|brevo/i.test(emailMd)) fail('email.md: names an email provider')
if (/amazon\.com\/|amzn/i.test(emailMd)) fail('email.md: Amazon link inside email copy')

// ---------- review.html sanity ----------
const review = fs.readFileSync(path.join(ROOT, 'marketing/review.html'), 'utf8')
for (const f of ['pins.json', 'videos.json', 'idea-lists.json', 'site-copy.json', 'email.md', 'copy-review.md', '../src/data/ideas.json']) if (!review.includes(`'${f}'`)) fail(`review.html: does not load ${f}`)
if (!review.includes('python3 -m http.server')) fail('review.html: missing the "how to open" note')
for (const p of Object.values(pins)) if (!fs.existsSync(path.join(ROOT, 'public/illustrations', p.slug, 'vertical.svg'))) fail(`preview image missing for ${p.slug}`)
if (!fs.existsSync(path.join(ROOT, 'design/pin-template/pin.html'))) fail('pin template missing')

// ---------- report ----------
const boardsCount = {}
for (const p of Object.values(pins)) boardsCount[p.board] = (boardsCount[p.board] || 0) + 1
notes.push(`pins ${pinSlugs.length} · videos ${Object.keys(videos).length} · idea lists ${Object.values(lists).filter((l) => l.list).length} (+${Object.values(lists).filter((l) => !l.list).length} null) · staples ${listsF.staples.length}`)
notes.push(`hooks ${hookKeys.length} · new elf notes ${draftNotes.length} (${draftNotes.join(', ')}) · WYR ${wyr.length} · missions ${ms.length} · clues ${clues.length}`)
notes.push(`max lengths — kicker ${Math.max(...Object.values(pins).map((p) => p.kicker.length))}/22 · pinTitle ${Math.max(...Object.values(pins).map((p) => p.pinTitle.length))}/100 · description ${Math.max(...Object.values(pins).map((p) => p.description.length))}/500 · hook ${Math.max(...hookKeys.map((k) => copyF.hooks[k].text.length))}/90`)
notes.push('boards: ' + Object.entries(boardsCount).map(([b, n]) => `${b} ${n}`).join(' · '))
console.log(notes.join('\n'))
if (fails.length) { console.log(`\nFAIL — ${fails.length} problem(s):\n- ` + fails.join('\n- ')); process.exit(1) }
console.log('\nPASS — all marketing checks passed.')
