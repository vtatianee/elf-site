'use client'

/**
 * /planner/ — a December 1-24 calendar and ONE combined shopping list.
 *
 * The plan is built by the rules in src/lib/planner-rules.ts. Every day can
 * be swapped for any other idea; the shopping list follows. The plan is kept
 * in this browser only (localStorage), never sent anywhere.
 */
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import {
  PLAN_DAYS,
  amazonTerms,
  buildPlan,
  planYear,
  shoppingList,
  weekday,
  type PlanIdea,
} from '@/lib/planner-rules'

const STORAGE_KEY = 'elf-planner-v1'
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Saved = { year: number; plan: number[] }

function load(year: number, ideas: PlanIdea[]): number[] | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as Saved | null
    const ids = new Set(ideas.map((i) => i.id))
    if (saved && saved.year === year && Array.isArray(saved.plan) && saved.plan.length === PLAN_DAYS && saved.plan.every((id) => ids.has(id))) {
      return saved.plan
    }
  } catch {
    // Storage blocked: the planner works, it just forgets on reload.
  }
  return null
}

function save(year: number, plan: number[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ year, plan } satisfies Saved))
  } catch {
    // Ignore.
  }
}

type Props = {
  ideas: PlanIdea[]
  /** Amazon search address for each search term (built on the server with the affiliate tag). */
  amazonUrls: Record<string, string>
  amazonRel: string
  disclosure: string
  /** Year of the static HTML (build date); the browser recomputes it. */
  initialYear: number
}

export function Planner({ ideas, amazonUrls, amazonRel, disclosure, initialYear }: Props) {
  const [year, setYear] = useState(initialYear)
  const [plan, setPlan] = useState<number[]>(() => buildPlan(ideas, initialYear, 1))

  useEffect(() => {
    const y = planYear(new Date())
    /* eslint-disable react-hooks/set-state-in-effect -- the date and the saved plan only exist in the browser */
    setYear(y)
    setPlan(load(y, ideas) ?? buildPlan(ideas, y, 1))
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [ideas])

  const byId = useMemo(() => new Map(ideas.map((i) => [i.id, i])), [ideas])
  const list = useMemo(() => shoppingList(plan, ideas), [plan, ideas])
  const terms = useMemo(() => amazonTerms(plan, ideas), [plan, ideas])

  function update(next: number[]) {
    setPlan(next)
    save(year, next)
  }

  function newPlan() {
    // A fresh random seed each tap, so the first new plan after a reload is new too.
    update(buildPlan(ideas, year, 2 + Math.floor(Math.random() * 2 ** 30)))
  }

  function swap(dayIndex: number, id: number) {
    const next = [...plan]
    // Keep every scene unique: if the chosen idea is on another day, trade places.
    const other = next.indexOf(id)
    if (other !== -1) next[other] = next[dayIndex] as number
    next[dayIndex] = id
    update(next)
  }

  return (
    <div className="stack-4">
      <div className="planner-tools no-print">
        <button className="btn" type="button" onClick={newPlan}>
          <Icon name="shuffle" />
          Make a new plan
        </button>
        <button className="btn btn--ghost" type="button" onClick={() => window.print()}>
          <Icon name="print" />
          Print the plan
        </button>
      </div>

      <section aria-labelledby="calendar-title" className="stack-3">
        <h2 id="calendar-title">December {year}</h2>
        <ol className="calendar" role="list">
          {plan.map((id, index) => {
            const day = index + 1
            const wd = weekday(year, day)
            const idea = byId.get(id)
            return (
              <li key={day} className={wd === 0 || wd === 6 ? 'day day--weekend' : 'day'}>
                <p className="day__date">
                  <span className="day__num">{day}</span>
                  <span className="day__wd">
                    {WEEKDAYS[wd]}, Dec {day}
                  </span>
                </p>
                {idea && (
                  <p className="day__idea">
                    <Link href={idea.href}>{idea.title}</Link>
                  </p>
                )}
                <label className="visually-hidden" htmlFor={`day-${day}`}>
                  Change the idea for December {day}
                </label>
                <select id={`day-${day}`} value={id} onChange={(event) => swap(index, Number(event.target.value))}>
                  {ideas.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="shopping-title" className="section stack-3">
        <h2 id="shopping-title">Your shopping list</h2>
        <p className="section__sub">
          Everything the {PLAN_DAYS} ideas above need, in one list. Most of it is already in your home — tick off what you
          have. Ticks are not saved.
        </p>
        <ul className="shopping">
          {list.map((item) => (
            <li key={item.name}>
              <label className="check__label">
                <input type="checkbox" />
                <span>{item.name}</span>
              </label>
              <small>Dec {item.days.join(', ')}</small>
            </li>
          ))}
        </ul>
        {terms.length > 0 && (
          <div className="kit no-print">
            <h3>Find it on Amazon</h3>
            <ul className="buy-links" role="list">
              {terms.map((term) =>
                amazonUrls[term] ? (
                  <li key={term}>
                    <a href={amazonUrls[term]} rel={amazonRel} target="_blank">
                      Search Amazon for {term}
                      <Icon name="out" />
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
            <p className="disclosure">{disclosure}</p>
          </div>
        )}
      </section>
    </div>
  )
}
