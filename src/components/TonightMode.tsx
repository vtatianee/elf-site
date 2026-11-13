'use client'

/**
 * TONIGHT MODE — the signature feature (home page).
 * Spec: docs/handoffs/02b-design-system.md §8, approved at Gate 2.
 *
 * - 3 toggle buttons; any tap redraws 3 ideas at once (no "search" button).
 * - Opens with all three criteria on and 3 ideas on screen.
 * - The draw goes through the whole group before repeating, and never shows
 *   last night's ideas again while 3 fresh ones remain. A "night" ends at
 *   4am local time.
 * - Never an empty result: if fewer than 3 ideas match, it lets go of
 *   "Only stuff I have", then "No mess", then "5 minutes" — and says so.
 * - Memory: one localStorage key, on this device only. If storage is
 *   blocked, the draw still works, just without memory.
 * - Counts are always computed from the data, never typed by hand.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/Icon'
import { IdeaCard } from '@/components/IdeaCard'
import type { CardData } from '@/lib/cards'

export type TonightIdea = Pick<
  CardData,
  'id' | 'slug' | 'title' | 'href' | 'timeLabel' | 'messLabel' | 'ageLabel' | 'img' | 'time' | 'mess' | 'materialTags'
>

type Crit = 'five' | 'nomess' | 'home'

const CRITS: { id: Crit; label: string; icon: IconName }[] = [
  { id: 'five', label: '5 minutes', icon: 'clock' },
  { id: 'nomess', label: 'No mess', icon: 'sparkle' },
  { id: 'home', label: 'Only stuff I have', icon: 'home' },
]
const LABEL: Record<Crit, string> = { five: '5 minutes', nomess: 'No mess', home: 'Only stuff I have' }
/** How a criterion that was kept reads in the fallback sentence ("here are 3 that still …"). */
const KEPT_PHRASE: Record<Crit, string> = {
  five: 'take 5 minutes or less',
  nomess: 'make no mess',
  home: 'use only stuff you have',
}

/** "a", "a and b", "a, b and c". */
function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}
const TEST: Record<Crit, (i: TonightIdea) => boolean> = {
  five: (i) => i.time === '2' || i.time === '5',
  nomess: (i) => i.mess === 'zero',
  home: (i) => i.materialTags.includes('home'),
}
/** What to let go of first when fewer than 3 ideas match. */
const DROP_ORDER: Crit[] = ['home', 'nomess', 'five']
/** /ideas/ filter for each criterion, for the "See all matches" link. */
const FILTER: Record<Crit, [string, string]> = {
  five: ['time', '2,5'],
  nomess: ['mess', 'zero'],
  home: ['material', 'home'],
}

const STORAGE_KEY = 'elf-tonight-v1'
type Memory = { night: string; seen: number[]; last: number[] }

/** A "night" runs until 4am local time: 10pm and 0:30am are the same night. */
function nightId(): string {
  const d = new Date(Date.now() - 4 * 3600 * 1000)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function loadMemory(): Memory {
  const fresh: Memory = { night: nightId(), seen: [], last: [] }
  let stored: Partial<Memory> | null = null
  try {
    stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<Memory> | null
  } catch {
    // Storage blocked: the draw still works, without memory.
  }
  if (!stored || typeof stored !== 'object' || !Array.isArray(stored.seen)) return fresh
  if (stored.night !== fresh.night) return { ...fresh, last: stored.seen }
  return { night: fresh.night, seen: stored.seen, last: Array.isArray(stored.last) ? stored.last : [] }
}

function saveMemory(memory: Memory): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {
    // Ignore: no memory on this device.
  }
}

type Pool = { found: TonightIdea[]; used: Crit[]; dropped: Crit[] }

function buildPool(ideas: TonightIdea[], crits: Crit[]): Pool {
  const matching = (cs: Crit[]) => ideas.filter((i) => cs.every((c) => TEST[c](i)))
  let used = [...crits]
  const dropped: Crit[] = []
  let found = matching(used)
  for (const c of DROP_ORDER) {
    if (found.length >= 3) break
    if (!used.includes(c)) continue
    used = used.filter((x) => x !== c)
    dropped.push(c)
    found = matching(used)
  }
  return { found, used, dropped }
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list]
  for (let k = copy.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1))
    ;[copy[k], copy[j]] = [copy[j] as T, copy[k] as T]
  }
  return copy
}

function pickThree(found: TonightIdea[], memory: Memory, onScreen: number[]): TonightIdea[] {
  const without = (banned: number[]) => found.filter((i) => !banned.includes(i.id))
  let candidates = without([...memory.last, ...memory.seen]) // 1. new tonight and not shown last night
  if (candidates.length < 3) candidates = without([...memory.last, ...onScreen]) // 2. group seen: start over
  if (candidates.length < 3) candidates = without(onScreen) // 3. small group: allow last night's
  if (candidates.length < 3) candidates = [...found] // 4. tiny group: never empty
  return shuffle(candidates).slice(0, 3)
}

/** Initial 3 for the static HTML: the first matches in card order (replaced on load). */
function initialThree(ideas: TonightIdea[]): TonightIdea[] {
  return buildPool(ideas, ['five', 'nomess', 'home']).found.slice(0, 3)
}

export function TonightMode({ ideas }: { ideas: TonightIdea[] }) {
  const [crits, setCrits] = useState<Crit[]>(['five', 'nomess', 'home'])
  const [three, setThree] = useState<TonightIdea[]>(() => initialThree(ideas))
  const [pool, setPool] = useState<Pool>(() => buildPool(ideas, ['five', 'nomess', 'home']))
  const [deal, setDeal] = useState(0)
  const onScreen = useRef<number[]>([])

  function draw(nextCrits: Crit[], animate: boolean) {
    const nextPool = buildPool(ideas, nextCrits)
    const memory = loadMemory()
    const picked = pickThree(nextPool.found, memory, onScreen.current)
    onScreen.current = picked.map((i) => i.id)
    let seen = [...new Set([...memory.seen, ...onScreen.current])]
    // Went through the whole group tonight: start a new cycle.
    if (nextPool.found.every((i) => seen.includes(i.id))) seen = [...onScreen.current]
    saveMemory({ ...memory, seen })
    setCrits(nextCrits)
    setPool(nextPool)
    setThree(picked)
    if (animate) setDeal((n) => n + 1)
  }

  // First draw on load, with this device's memory (no animation).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads localStorage, which only exists in the browser
    draw(['five', 'nomess', 'home'], false)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [])

  function toggle(c: Crit) {
    const next = crits.includes(c) ? crits.filter((x) => x !== c) : CRITS.map((x) => x.id).filter((id) => id === c || crits.includes(id))
    draw(next, true)
  }

  const n = pool.found.length
  const fallback = pool.dropped.length > 0

  let status: ReactNode
  if (fallback) {
    // Wording approved at Gate 4 (marketing/site-copy.json → tonightFallback): always names what was dropped.
    const dropped = joinAnd(pool.dropped.map((c) => `“${LABEL[c]}”`))
    const rest = pool.used.length ? `that still ${joinAnd(pool.used.map((c) => KEPT_PHRASE[c]))}` : 'from all 60 ideas'
    status = (
      <>
        <strong>No exact match tonight.</strong> We let go of {dropped} — here are 3 {rest}.
      </>
    )
  } else if (crits.length === 3) {
    status = (
      <>
        <strong>{n} ideas</strong> match all three. Here are 3 for tonight.
      </>
    )
  } else if (crits.length === 0) {
    status = (
      <>
        <strong>All {n} ideas</strong> are in the hat. Here are 3 for tonight.
      </>
    )
  } else {
    status = (
      <>
        <strong>{n} ideas</strong> match {crits.map((c) => `“${LABEL[c]}”`).join(' + ')}. Here are 3 for tonight.
      </>
    )
  }

  const filterQuery = new URLSearchParams(pool.used.map((c) => FILTER[c])).toString()
  const allHref = filterQuery ? `/ideas/?${filterQuery}` : '/ideas/'
  const allLabel = crits.length === 0 || fallback ? `See all ${n} ideas` : `See all ${n} matches`

  return (
    <section className="tonight on-night" aria-labelledby="tonight-title" id="tonight">
      <div className="tonight__stars" aria-hidden="true">
        {Array.from({ length: 9 }, (_, k) => (
          <i key={k} />
        ))}
      </div>
      <img className="tonight__elf" src="/mascot/elf-peek.svg" alt="" width={300} height={250} />

      <p className="eyebrow">Tonight Mode</p>
      <h1 id="tonight-title">What’s the elf doing tonight?</h1>
      <p className="tonight__lead">
        A new elf idea every night — in under 5 minutes, with stuff you already have. Tap what’s true right now.
      </p>

      <div className="criteria" role="group" aria-label="What’s true tonight">
        {CRITS.map((c) => (
          <button
            key={c.id}
            className="crit"
            type="button"
            aria-pressed={crits.includes(c.id)}
            onClick={() => toggle(c.id)}
          >
            <Icon name="check" className="crit__tick" />
            <Icon name={c.icon} />
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <p className={fallback ? 'tonight__status tonight__status--fallback' : 'tonight__status'} role="status" aria-live="polite">
        {status}
      </p>

      <ol className={deal > 0 ? 'tonight__results is-dealt' : 'tonight__results'} role="list" key={deal}>
        {three.map((idea) => (
          <li key={idea.id}>
            <IdeaCard card={idea} as="h2" row />
          </li>
        ))}
      </ol>

      <div className="tonight__actions">
        <button className="btn btn--gold" type="button" onClick={() => draw(crits, true)}>
          <Icon name="shuffle" />
          Show 3 different ideas
        </button>
        <a href={allHref}>{allLabel}</a>
      </div>
    </section>
  )
}
