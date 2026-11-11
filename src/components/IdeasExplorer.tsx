'use client'

/**
 * /ideas/ — filterable grid of all 60 ideas.
 *
 * Filters in the 6 dimensions of the source: time, mess, age, room, material,
 * type; plus the search box. Within a dimension, choices are OR ("2 min" or
 * "5 min"); across dimensions they are AND. An all-ages idea also counts as
 * a toddler idea and a kids idea, like on the /toddlers/ and /kids/ hubs.
 *
 * The filter state lives in the address (/ideas/?room=kitchen&mess=zero), so
 * a filtered view can be linked to and survives the back button. Values in a
 * dimension are comma-separated: ?time=2,5. The static HTML lists all 60
 * ideas; the browser applies the address's filters on load.
 */
import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/Icon'
import { IdeaCard } from '@/components/IdeaCard'
import type { CardData } from '@/lib/cards'

export const DIMENSIONS = ['time', 'mess', 'age', 'room', 'material', 'type'] as const
export type Dimension = (typeof DIMENSIONS)[number]

export type FilterGroup = {
  dimension: Dimension
  legend: string
  options: { value: string; label: string; count: number }[]
}

type Selection = Record<Dimension, string[]>

const EMPTY: Selection = { time: [], mess: [], age: [], room: [], material: [], type: [] }

/** Value(s) of one card in one dimension. */
function valuesOf(card: CardData, dimension: Dimension): string[] {
  switch (dimension) {
    case 'time':
      return [card.time]
    case 'mess':
      return [card.mess]
    case 'age':
      // An all-ages idea suits toddlers and kids too (same rule as the /toddlers/ and /kids/ hubs).
      return card.age === 'all' ? ['toddler', 'kids', 'all'] : [card.age]
    case 'room':
      return [card.room]
    case 'material':
      return card.materialTags
    case 'type':
      return card.typeTags
  }
}

function matches(card: CardData, selection: Selection, query: string): boolean {
  for (const dimension of DIMENSIONS) {
    const wanted = selection[dimension]
    if (wanted.length > 0 && !valuesOf(card, dimension).some((v) => wanted.includes(v))) return false
  }
  if (query !== '') {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.every((word) => card.search.includes(word))) return false
  }
  return true
}

function readAddress(groups: FilterGroup[]): { selection: Selection; query: string } {
  const params = new URLSearchParams(window.location.search)
  const selection: Selection = { ...EMPTY }
  for (const group of groups) {
    const allowed = group.options.map((o) => o.value)
    const raw = params.get(group.dimension)
    selection[group.dimension] = raw ? raw.split(',').filter((v) => allowed.includes(v)) : []
  }
  return { selection, query: (params.get('q') ?? '').trim().slice(0, 80) }
}

function writeAddress(selection: Selection, query: string): void {
  const params = new URLSearchParams()
  if (query !== '') params.set('q', query)
  for (const dimension of DIMENSIONS) {
    if (selection[dimension].length > 0) params.set(dimension, selection[dimension].join(','))
  }
  const search = params.toString().replace(/%2C/g, ',')
  window.history.replaceState(window.history.state, '', search ? `?${search}` : window.location.pathname)
}

export function IdeasExplorer({ cards, groups }: { cards: CardData[]; groups: FilterGroup[] }) {
  const [selection, setSelection] = useState<Selection>(EMPTY)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // Apply the filters in the address once, on load.
  useEffect(() => {
    const fromAddress = readAddress(groups)
    /* eslint-disable react-hooks/set-state-in-effect -- the address only exists in the browser */
    setSelection(fromAddress.selection)
    setQuery(fromAddress.query)
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [groups])

  // Keep the address in sync after that.
  useEffect(() => {
    if (ready) writeAddress(selection, query.trim())
  }, [selection, query, ready])

  const visible = useMemo(() => cards.filter((card) => matches(card, selection, query.trim())), [cards, selection, query])
  const activeCount = DIMENSIONS.reduce((n, d) => n + selection[d].length, 0) + (query.trim() ? 1 : 0)

  function toggle(dimension: Dimension, value: string) {
    setSelection((current) => {
      const list = current[dimension]
      return { ...current, [dimension]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] }
    })
  }

  function clearAll() {
    setSelection(EMPTY)
    setQuery('')
  }

  return (
    <div className="explorer">
      <div className="filters" data-open={open ? 'true' : 'false'}>
        <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="visually-hidden" htmlFor="ideas-q">
            Search the ideas
          </label>
          <input
            className="field"
            id="ideas-q"
            type="search"
            placeholder="Search: “marshmallow”, “tree”…"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <div className="filters__bar">
          <button
            className="chip filters__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="filter-groups"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="sliders" />
            {open ? 'Hide filters' : 'Show filters'}
            {activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
          {activeCount > 0 && (
            <button className="chip" type="button" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
        <div className="filters__body" id="filter-groups">
          {groups.map((group) => (
            <fieldset key={group.dimension}>
              <legend>{group.legend}</legend>
              <div className="chips">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    className="chip"
                    type="button"
                    aria-pressed={selection[group.dimension].includes(option.value)}
                    onClick={() => toggle(group.dimension, option.value)}
                  >
                    {option.label}
                    <span className="visually-hidden"> ({option.count} ideas)</span>
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="stack-4">
        <p className="count" role="status" aria-live="polite">
          {visible.length === cards.length
            ? `Showing all ${cards.length} ideas`
            : `Showing ${visible.length} of ${cards.length} ideas`}
        </p>
        {visible.length > 0 ? (
          <ul className="cards" role="list">
            {visible.map((card) => (
              <li key={card.slug}>
                <IdeaCard card={card} as="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <img src="/mascot/elf-sleep.svg" alt="" width={420} height={180} />
            <p>No idea matches all of these filters.</p>
            <button className="btn" type="button" onClick={clearAll}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
