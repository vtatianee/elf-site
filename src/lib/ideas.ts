/**
 * Typed, read-only access to the 60 ideas in `src/data/ideas.json`.
 *
 * This is the ONLY module allowed to import the JSON file (enforced by
 * ESLint). Everything else goes through the getters below.
 *
 * Two things this module guarantees:
 *
 * 1. INTERNAL FIELDS NEVER LEAVE. `editorNotes` and `illustrationBrief` are
 *    internal. The getters return `Idea` objects that do not contain them, so
 *    they cannot end up in HTML, in the page payload or in a client bundle.
 *    The build check (`scripts/check-export.ts`) fails if they ever do.
 *
 * 2. THE DATA IS VALID. The file is validated when this module loads (at
 *    build time). A wrong tag, a duplicate slug or a count other than 60
 *    stops the build with a readable message.
 *
 * SERVER ONLY: import this from Server Components, `generateStaticParams`,
 * `sitemap.ts` and similar build-time code. Client Components receive the
 * ideas they need as props — use `toIdeaSummary()` to keep that payload small.
 */
import rawData from '@/data/ideas.json'

// ---------------------------------------------------------------------------
// Types — mirror src/data/ideas.json exactly
// ---------------------------------------------------------------------------

export const TIME_TAGS = ['2', '5', '10', '15+'] as const
export const MESS_LEVELS = ['zero', 'low', 'medium', 'high'] as const
export const AGE_GROUPS = ['toddler', 'kids', 'all'] as const
export const ROOMS = [
  'kitchen',
  'bathroom',
  'living-room-tree',
  'bedroom',
  'fridge',
  'entryway',
  'table',
  'whole-house',
] as const
/** The 8 SEO hubs. Each one is a top-level page: /easy/, /5-minute/, ... */
export const HUBS = [
  'easy',
  '5-minute',
  'no-mess',
  'toddlers',
  'kids',
  'funny',
  'arrival',
  'goodbye',
] as const
export const TYPE_TAGS = ['funny', 'cute', 'interactive', 'arrival', 'goodbye', 'project'] as const
export const MATERIAL_TAGS = ['home', 'food', 'stationery', 'buy'] as const

export type TimeTag = (typeof TIME_TAGS)[number]
export type MessLevel = (typeof MESS_LEVELS)[number]
export type AgeGroup = (typeof AGE_GROUPS)[number]
export type Room = (typeof ROOMS)[number]
export type Hub = (typeof HUBS)[number]
export type TypeTag = (typeof TYPE_TAGS)[number]
export type MaterialTag = (typeof MATERIAL_TAGS)[number]

/**
 * Hubs whose membership is still waiting for the owner's approval. Empty since
 * Gate 2 (2026-11-11), when the `funny` classification was approved. A hub
 * listed here is never linked from idea pages.
 */
export const HUBS_PENDING_APPROVAL: readonly Hub[] = []

export type IdeaTime = {
  /** Filter value. */
  tag: TimeTag
  /** Exact minutes from the card, or null when the card gives no number. */
  minutes: number | null
  /** Text to display, e.g. "20 min". */
  label: string
}

export type ElfNote = {
  /** What carries the text in the scene: "card", "sign", "coupon", ... */
  kind: string
  /** Verbatim English text from the source document. Never edit. */
  text: string
}

/** One idea exactly as stored in the JSON file, internal fields included. */
type RawIdea = {
  id: number
  slug: string
  title: string
  lot: 1 | 2
  time: IdeaTime
  mess: MessLevel
  age: AgeGroup
  room: Room
  /** Room wording of the original card, e.g. "Bedroom door". */
  roomLabel: string
  /** Fixed date of the idea, when it has one (e.g. "Night of December 24"). */
  occasion: string | null
  materials: string[]
  steps: string[]
  /** Exact safety warnings. Always rendered, never softened or paraphrased. */
  safety: string[]
  /** null = the source has no ready text: do not render the block. */
  elfNote: ElfNote | null
  /** Only ideas 6 and 26 have one. */
  variation: string | null
  /** Name of the site printable this idea depends on, if any. */
  printable: string | null
  /** Amazon search terms. Empty = no Amazon item at all for this idea. */
  amazonItems: string[]
  /**
   * Type of idea. Approved by the owner at Gate 2 (2026-11-11): arrival,
   * goodbye, project and interactive come from the PDF; funny and cute were
   * classified by the PM.
   */
  typeTags: TypeTag[]
  /**
   * What the materials need. Approved at Gate 2 (2026-11-11). `home` = only
   * stuff most homes already have — the "Only stuff I have" criterion.
   */
  materialTags: MaterialTag[]
  hubs: Hub[]
  /** INTERNAL — never rendered. */
  illustrationBrief: string
  /** INTERNAL — never rendered. */
  editorNotes: string[]
}

/** An idea as the site may use it: everything except the internal fields. */
export type Idea = Omit<RawIdea, 'illustrationBrief' | 'editorNotes'>

/**
 * The small subset needed to draw a card or run a filter in the browser.
 * Pass arrays of this (not full ideas) to Client Components.
 */
export type IdeaSummary = Pick<
  Idea,
  'id' | 'slug' | 'title' | 'time' | 'mess' | 'age' | 'room' | 'hubs' | 'typeTags' | 'materialTags'
>

export type IdeaLabels = {
  time: Record<TimeTag, string>
  mess: Record<MessLevel, string>
  age: Record<AgeGroup, string>
  room: Record<Room, string>
  material: Record<MaterialTag, string>
  type: Record<TypeTag, string>
}

type IdeasFile = {
  meta: {
    source: string
    extracted: string
    language: string
    rule: string
    approval: Record<string, string>
    labels: IdeaLabels
    fields: Record<string, string>
    counts: {
      ideas: number
      hubs: Record<Hub, number>
      typeTags: Record<TypeTag, number>
      materialTags: Record<MaterialTag, number>
      noElfNote: number[]
      tonightMode: {
        fiveMinutes: number
        fiveMinutesNoMess: number
        allThree: number
        allThreeIds: number[]
      }
    }
  }
  ideas: RawIdea[]
}

// ---------------------------------------------------------------------------
// Load + validate (runs once per build worker)
// ---------------------------------------------------------------------------

export const EXPECTED_IDEA_COUNT = 60

function fail(message: string): never {
  throw new Error(`[ideas.json] ${message}`)
}

function assertOneOf(value: unknown, allowed: readonly string[], where: string): void {
  if (typeof value !== 'string' || !allowed.includes(value)) {
    fail(`${where}: "${String(value)}" is not one of ${allowed.join(', ')}`)
  }
}

function validate(file: IdeasFile): IdeasFile {
  const { ideas } = file
  if (!Array.isArray(ideas) || ideas.length !== EXPECTED_IDEA_COUNT) {
    fail(`expected ${EXPECTED_IDEA_COUNT} ideas, found ${ideas?.length ?? 0}`)
  }
  const slugs = new Set<string>()
  const ids = new Set<number>()
  for (const idea of ideas) {
    const where = `idea #${idea.id} (${idea.slug})`
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(idea.slug)) fail(`${where}: invalid slug`)
    if (slugs.has(idea.slug)) fail(`${where}: duplicate slug`)
    if (ids.has(idea.id)) fail(`${where}: duplicate id`)
    slugs.add(idea.slug)
    ids.add(idea.id)
    if (!idea.title) fail(`${where}: missing title`)
    assertOneOf(idea.time?.tag, TIME_TAGS, `${where} time.tag`)
    assertOneOf(idea.mess, MESS_LEVELS, `${where} mess`)
    assertOneOf(idea.age, AGE_GROUPS, `${where} age`)
    assertOneOf(idea.room, ROOMS, `${where} room`)
    for (const hub of idea.hubs) assertOneOf(hub, HUBS, `${where} hubs`)
    for (const tag of idea.typeTags) assertOneOf(tag, TYPE_TAGS, `${where} typeTags`)
    for (const tag of idea.materialTags) assertOneOf(tag, MATERIAL_TAGS, `${where} materialTags`)
    if (idea.materials.length === 0) fail(`${where}: no materials`)
    if (idea.steps.length < 3 || idea.steps.length > 5) fail(`${where}: needs 3 to 5 steps`)
    if (idea.hubs.length === 0) fail(`${where}: belongs to no hub (orphan)`)
  }
  return file
}

const file = validate(rawData as unknown as IdeasFile)

function toPublic(raw: RawIdea): Idea {
  // Drop the internal fields here, once, so no caller can leak them.
  const { illustrationBrief: _brief, editorNotes: _notes, ...idea } = raw
  return idea
}

const ideas: readonly Idea[] = file.ideas.map(toPublic).sort((a, b) => a.id - b.id)
const bySlug = new Map(ideas.map((idea) => [idea.slug, idea]))

// ---------------------------------------------------------------------------
// Getters
// ---------------------------------------------------------------------------

/** All 60 ideas, ordered by card number. */
export function getAllIdeas(): readonly Idea[] {
  return ideas
}

/** All 60 slugs — for `generateStaticParams` and the sitemap. */
export function getAllSlugs(): string[] {
  return ideas.map((idea) => idea.slug)
}

export function getIdeaBySlug(slug: string): Idea | undefined {
  return bySlug.get(slug)
}

/** The ideas that belong to one hub, ordered by card number. */
export function getIdeasByHub(hub: Hub): readonly Idea[] {
  return ideas.filter((idea) => idea.hubs.includes(hub))
}

export function isHub(value: string): value is Hub {
  return (HUBS as readonly string[]).includes(value)
}

/** Display labels for every filter value (from `meta.labels` in the JSON). */
export const ideaLabels: IdeaLabels = file.meta.labels

/** Reduces an idea to the fields a card or a browser-side filter needs. */
export function toIdeaSummary(idea: Idea): IdeaSummary {
  const { id, slug, title, time, mess, age, room, hubs, typeTags, materialTags } = idea
  return { id, slug, title, time, mess, age, room, hubs, typeTags, materialTags }
}

// ---------------------------------------------------------------------------
// The "2 hub links" rule of the idea page
// ---------------------------------------------------------------------------

export type HubLink = {
  hub: Hub
  /**
   * true  = the idea belongs to this hub ("More no-mess ideas").
   * false = the idea does NOT belong to it; the link is an invitation
   *         ("Short on time? See 5-minute ideas") and its text must not
   *         claim that this idea is part of the hub.
   */
  isMember: boolean
}

/** Most specific hub first. */
const HUB_LINK_PRIORITY: readonly Hub[] = [
  'arrival',
  'goodbye',
  '5-minute',
  'no-mess',
  'easy',
  'toddlers',
  'kids',
  'funny',
]

/** Hubs offered as an invitation when an idea belongs to fewer than 2 hubs. */
const HUB_LINK_INVITATIONS: readonly Hub[] = ['5-minute', 'no-mess', 'easy']

/**
 * The 2 hub links every idea page must show — always exactly 2, always the
 * same 2 for the same idea.
 *
 * - Links go to hubs the idea belongs to, most specific first. An idea
 *   written for one age group links to that age hub first.
 * - 7 ideas (7, 9, 40, 43, 44, 45, 47) belong to a single hub: their second
 *   link is an invitation to another hub (`isMember: false`).
 * - Hubs still pending approval are never linked.
 */
export function getHubLinks(idea: Idea): [HubLink, HubLink] {
  const ageHub: Hub | null = idea.age === 'toddler' ? 'toddlers' : idea.age === 'kids' ? 'kids' : null
  const isSpecial = (hub: Hub) => hub === 'arrival' || hub === 'goodbye'
  const priority = [
    ...HUB_LINK_PRIORITY.filter(isSpecial),
    ...(ageHub ? [ageHub] : []),
    ...HUB_LINK_PRIORITY.filter((hub) => !isSpecial(hub) && hub !== ageHub),
  ]
  const allowed = (hub: Hub) => !HUBS_PENDING_APPROVAL.includes(hub)

  const links: HubLink[] = priority
    .filter((hub) => idea.hubs.includes(hub) && allowed(hub))
    .slice(0, 2)
    .map((hub) => ({ hub, isMember: true }))

  for (const hub of HUB_LINK_INVITATIONS) {
    if (links.length >= 2) break
    if (!links.some((link) => link.hub === hub)) links.push({ hub, isMember: false })
  }
  const [first, second] = links
  if (!first || !second) fail(`idea #${idea.id}: could not build 2 hub links`)
  return [first, second]
}
