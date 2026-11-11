/**
 * December planner rules (source document, handoff 01 §2.5):
 *   - 15+ minute projects on weekends; 2-5 minute ideas on weekdays
 *   - an interactive idea every 2-3 days
 *   - high mess at most once in the season, always on a Friday or Saturday
 *   - no scene repeated
 * Plus the obvious calendar anchors from the cards: an arrival idea on
 * December 1, goodbye ideas in the last days, and the farewell letter idea
 * (its card says "Night of December 24") on the 24th.
 *
 * Pure functions, no server-only imports: used by the browser planner.
 */

export type PlanIdea = {
  id: number
  title: string
  href: string
  time: '2' | '5' | '10' | '15+'
  mess: 'zero' | 'low' | 'medium' | 'high'
  typeTags: string[]
  occasion: string | null
  materials: string[]
  amazonItems: string[]
}

export const PLAN_DAYS = 24

/** The December to plan: this year's, or next year's once Dec 24 has passed. */
export function planYear(today: Date): number {
  const y = today.getFullYear()
  return today.getMonth() === 11 && today.getDate() > 24 ? y + 1 : y
}

/** 0 = Sunday … 6 = Saturday */
export function weekday(year: number, day: number): number {
  return new Date(year, 11, day).getDay()
}

/** Small seeded random generator, so "Make a new plan" can be repeated. */
function random(seed: number): () => number {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

function shuffled<T>(list: T[], rand: () => number): T[] {
  const copy = [...list]
  for (let k = copy.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1))
    ;[copy[k], copy[j]] = [copy[j] as T, copy[k] as T]
  }
  return copy
}

/**
 * Builds a 24-day plan (index 0 = December 1). Returns idea ids.
 * Every id is different. Deterministic for a given year + seed.
 */
export function buildPlan(ideas: PlanIdea[], year: number, seed: number): number[] {
  const rand = random(seed)
  const plan: (number | null)[] = Array.from({ length: PLAN_DAYS }, () => null)
  const used = new Set<number>()
  const has = (idea: PlanIdea, tag: string) => idea.typeTags.includes(tag)
  const place = (dayIndex: number, idea: PlanIdea | undefined) => {
    if (!idea || plan[dayIndex] !== null || used.has(idea.id)) return false
    plan[dayIndex] = idea.id
    used.add(idea.id)
    return true
  }
  const free = (idea: PlanIdea) => !used.has(idea.id)
  const isWeekend = (i: number) => [0, 6].includes(weekday(year, i + 1))

  // 1. Anchors: arrival on Dec 1; the Dec-24 card on the 24th; other goodbyes just before.
  place(0, shuffled(ideas.filter((i) => has(i, 'arrival')), rand)[0])
  const dec24 = ideas.find((i) => i.occasion?.includes('December 24'))
  place(PLAN_DAYS - 1, dec24)
  // Highest card number closest to the 24th: idea 60 is set the night before the 24th's morning.
  const goodbyes = ideas.filter((i) => has(i, 'goodbye') && free(i)).sort((a, b) => b.id - a.id)
  goodbyes.forEach((idea, k) => place(PLAN_DAYS - 2 - k, idea))

  // 2. High mess: once, on a Friday or Saturday in the middle of the month.
  const highMess = shuffled(ideas.filter((i) => i.mess === 'high' && !has(i, 'project')), rand)[0]
  const friSat = Array.from({ length: PLAN_DAYS }, (_, i) => i).filter(
    (i) => [5, 6].includes(weekday(year, i + 1)) && i > 3 && i < PLAN_DAYS - 4 && plan[i] === null,
  )
  if (highMess && friSat.length > 0) place(friSat[Math.floor(friSat.length / 2)] as number, highMess)

  // 3. Weekends: the 15+ minute projects (never a high-mess one: that slot is used).
  const projects = shuffled(ideas.filter((i) => i.time === '15+' && i.mess !== 'high' && free(i)), rand)
  for (let i = 0; i < PLAN_DAYS; i++) {
    if (isWeekend(i) && plan[i] === null) place(i, projects.find(free))
  }

  // 4. Interactive every 3rd day (weekday slots), quick ones first.
  const interactive = shuffled(
    ideas.filter((i) => has(i, 'interactive') && !has(i, 'arrival') && !has(i, 'goodbye') && i.time !== '15+' && i.mess !== 'high'),
    rand,
  )
  for (let i = 2; i < PLAN_DAYS; i += 3) {
    if (plan[i] === null) place(i, interactive.find(free))
  }

  // 5. Everything else: weekdays get 2-5 minute ideas; weekends 10-minute ones.
  const everyday = (i: PlanIdea) => !has(i, 'arrival') && !has(i, 'goodbye') && i.mess !== 'high' && i.time !== '15+' && i.occasion === null
  const quick = shuffled(ideas.filter((i) => everyday(i) && (i.time === '2' || i.time === '5')), rand)
  const tenMinutes = shuffled(ideas.filter((i) => everyday(i) && i.time === '10'), rand)
  for (let i = 0; i < PLAN_DAYS; i++) {
    if (plan[i] !== null) continue
    const first = isWeekend(i) ? tenMinutes : quick
    const second = isWeekend(i) ? quick : tenMinutes
    if (!place(i, first.find(free))) place(i, second.find(free))
  }

  // 6. Safety net: any day still empty gets any unused idea (never happens with 60 ideas).
  for (let i = 0; i < PLAN_DAYS; i++) {
    if (plan[i] === null) place(i, ideas.find(free))
  }
  return plan.map((id) => id ?? 0)
}

export type ShoppingItem = { name: string; days: number[] }

/** One combined list: each material once, with the days that need it. */
export function shoppingList(plan: number[], ideas: PlanIdea[]): ShoppingItem[] {
  const byId = new Map(ideas.map((i) => [i.id, i]))
  const items = new Map<string, ShoppingItem>()
  plan.forEach((id, index) => {
    for (const material of byId.get(id)?.materials ?? []) {
      const key = material.trim().toLowerCase()
      const item = items.get(key) ?? { name: material.trim(), days: [] }
      if (!item.days.includes(index + 1)) item.days.push(index + 1)
      items.set(key, item)
    }
  })
  return [...items.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

/** Amazon search terms of the planned ideas, each once. */
export function amazonTerms(plan: number[], ideas: PlanIdea[]): string[] {
  const byId = new Map(ideas.map((i) => [i.id, i]))
  const terms = new Set<string>()
  for (const id of plan) for (const term of byId.get(id)?.amazonItems ?? []) terms.add(term)
  return [...terms].sort((a, b) => a.localeCompare(b, 'en'))
}
