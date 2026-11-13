/*
 * HOME — search + quick filters, Tonight Mode, idea of the day,
 * "Editor’s picks" (editorial), hubs, email capture.
 * Layout follows design/preview/home.html (approved at Gate 2).
 */
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { IdeaCard } from '@/components/IdeaCard'
import { IdeaOfTheDay, type FeatureIdea } from '@/components/IdeaOfTheDay'
import { SignupComingSoon } from '@/components/SignupComingSoon'
import { TonightMode, type TonightIdea } from '@/components/TonightMode'
import { siteConfig } from '@/config/site'
import { EDITOR_PICKS } from '@/data/editorial'
import { ideaIllustration, shortMessLabel, toCardData } from '@/lib/cards'
import { pickForDay } from '@/lib/daily'
import { HUB_INFO } from '@/lib/hubs'
import { getAllIdeas, ideaLabels, type Hub } from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  description: siteConfig.description,
  path: routes.home,
})

const QUICK_FILTERS: { label: string; href: string }[] = [
  { label: '2 min', href: routes.ideasWith({ time: '2' }) },
  { label: 'Zero mess', href: routes.ideasWith({ mess: 'zero' }) },
  { label: 'Toddler (2-4)', href: routes.ideasWith({ age: 'toddler' }) },
  { label: 'Kitchen', href: routes.ideasWith({ room: 'kitchen' }) },
  { label: 'Only stuff you have', href: routes.ideasWith({ material: 'home' }) },
  { label: 'Funny', href: routes.ideasWith({ type: 'funny' }) },
]

/** Hub tiles in the order of the approved preview. */
const HOME_HUB_ORDER: readonly Hub[] = ['5-minute', 'no-mess', 'easy', 'toddlers', 'kids', 'funny', 'arrival', 'goodbye']

export default function HomePage() {
  const ideas = getAllIdeas()
  const cards = ideas.map(toCardData)

  const tonightIdeas: TonightIdea[] = cards.map(
    ({ id, slug, title, href, timeLabel, messLabel, ageLabel, img, time, mess, materialTags }) => ({
      id, slug, title, href, timeLabel, messLabel, ageLabel, img, time, mess, materialTags,
    }),
  )

  const featureIdeas: FeatureIdea[] = ideas.map((idea) => {
    const img = ideaIllustration(idea, 'horizontal')
    return {
      id: idea.id,
      title: idea.title,
      href: routes.idea(idea.slug),
      timeLabel: idea.time.label,
      messLabel: shortMessLabel(idea.mess),
      ageLabel: ideaLabels.age[idea.age],
      roomLabel: idea.roomLabel,
      img: img ? { src: img.src, alt: img.alt } : null,
      quote: idea.elfNote
        ? { label: idea.elfNote.kind === 'card' ? 'Elf note' : `On the ${idea.elfNote.kind}`, text: idea.elfNote.text }
        : null,
    }
  })
  const buildDayIdea = pickForDay(featureIdeas, new Date())

  const favorites = EDITOR_PICKS.map((id) => cards.find((card) => card.id === id)).filter(
    (card): card is (typeof cards)[number] => card !== undefined,
  )

  return (
    <main id="main" className="wrap">
      {/* 1. SEARCH + QUICK FILTERS */}
      <section className="finder" aria-label="Find an idea">
        <form className="search" role="search" action={routes.ideas} method="get">
          <label className="visually-hidden" htmlFor="home-q">
            Search the {ideas.length} ideas
          </label>
          <input
            className="field"
            id="home-q"
            name="q"
            type="search"
            placeholder={`Search ${ideas.length} ideas: “marshmallow”, “toddler”…`}
            autoComplete="off"
          />
          <button className="btn" type="submit">
            <Icon name="search" />
            <span className="visually-hidden">Search</span>
          </button>
        </form>
        <div className="finder__filters">
          <span className="finder__label" id="quick-filters">
            Quick filters
          </span>
          <ul className="chips chips--scroll" role="list" aria-labelledby="quick-filters">
            {QUICK_FILTERS.map((filter) => (
              <li key={filter.href}>
                <Link className="chip" href={filter.href}>
                  {filter.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="chip" href={routes.ideas}>
                <Icon name="sliders" />
                All filters
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. TONIGHT MODE */}
      <TonightMode ideas={tonightIdeas} />

      {/* 3. IDEA OF THE DAY */}
      <IdeaOfTheDay ideas={featureIdeas} initialId={buildDayIdea.id} />

      {/* 4. PARENT FAVORITES — editorial, no counts, no rankings */}
      <section className="section" aria-labelledby="fav-title">
        <div className="section__head">
          <h2 id="fav-title">Editor’s picks</h2>
          <p className="section__sub">Four easy ones to start with.</p>
        </div>
        <ul className="cards cards--4" role="list">
          {favorites.map((card) => (
            <li key={card.slug}>
              <IdeaCard card={card} />
            </li>
          ))}
        </ul>
      </section>

      {/* 5. BROWSE BY HUB */}
      <section className="section" aria-labelledby="hubs-title">
        <div className="section__head">
          <h2 id="hubs-title">Browse by what you need</h2>
          <Link href={routes.ideas}>See all {ideas.length} ideas</Link>
        </div>
        <ul className="hubs" role="list">
          {HOME_HUB_ORDER.map((hub) => (
            <li key={hub}>
              <Link className="hub" href={routes.hub(hub)}>
                {HUB_INFO[hub].tileLabel}
                <Icon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. EMAIL CAPTURE — "coming soon" */}
      <SignupComingSoon />
    </main>
  )
}
