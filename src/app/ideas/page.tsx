/*
 * /ideas/ — filterable grid of all 60 ideas (6 dimensions + search).
 * The canonical address is /ideas/ for every filtered view.
 */
import { IdeasExplorer, type FilterGroup } from '@/components/IdeasExplorer'
import { getAllCards } from '@/lib/cards'
import {
  AGE_GROUPS,
  MATERIAL_TAGS,
  MESS_LEVELS,
  ROOMS,
  TIME_TAGS,
  TYPE_TAGS,
  ideaLabels,
} from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'All 60 Elf Ideas',
  description:
    'All 60 elf ideas in one place. Filter by time, mess, age, room, materials and type to find the one for tonight.',
  path: routes.ideas,
})

export default function IdeasPage() {
  const cards = getAllCards()
  const count = (pick: (c: (typeof cards)[number]) => boolean) => cards.filter(pick).length

  const groups: FilterGroup[] = [
    {
      dimension: 'time',
      legend: 'Time',
      options: TIME_TAGS.map((v) => ({ value: v, label: ideaLabels.time[v], count: count((c) => c.time === v) })),
    },
    {
      dimension: 'mess',
      legend: 'Mess',
      options: MESS_LEVELS.map((v) => ({ value: v, label: ideaLabels.mess[v].split(' (')[0] ?? v, count: count((c) => c.mess === v) })),
    },
    {
      dimension: 'age',
      legend: 'Age',
      options: AGE_GROUPS.map((v) => ({ value: v, label: ideaLabels.age[v], count: count((c) => c.age === v || (c.age === 'all' && v !== 'all')) })),
    },
    {
      dimension: 'room',
      legend: 'Room',
      options: ROOMS.map((v) => ({ value: v, label: ideaLabels.room[v], count: count((c) => c.room === v) })),
    },
    {
      dimension: 'material',
      legend: 'Materials',
      options: MATERIAL_TAGS.map((v) => ({ value: v, label: ideaLabels.material[v], count: count((c) => c.materialTags.includes(v)) })),
    },
    {
      dimension: 'type',
      legend: 'Type',
      options: TYPE_TAGS.map((v) => ({ value: v, label: ideaLabels.type[v], count: count((c) => c.typeTags.includes(v)) })),
    },
  ]

  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>All {cards.length} elf ideas</h1>
        <p className="page-head__lead">
          Pick what fits tonight: how much time you have, how much mess you can take, your child’s age and the room.
        </p>
      </header>
      <IdeasExplorer cards={cards} groups={groups} />
    </main>
  )
}
