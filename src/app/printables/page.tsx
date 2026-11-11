/*
 * /printables/ — free printables for the ideas that need one.
 *
 * Gate 1 decisions:
 * - Free to print in the MVP (no email gate: there is no email provider).
 *   The email form sits next to it in its "coming soon" state.
 * - Build with the text the source document has. Missing texts (the other
 *   23 "would you rather" questions, the farewell letter, the full story of
 *   idea 49) are drafted by Marketing in Phase 4 — until then those sheets
 *   say so honestly instead of inventing words.
 * - The paid pack is a placeholder: no checkout, no price.
 *
 * Every sentence printed on a sheet comes from src/data/ideas.json.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { PrintButton } from '@/components/PrintButton'
import { SignupComingSoon } from '@/components/SignupComingSoon'
import { getIdeaBySlug, type Idea } from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Free Elf Printables',
  description:
    'Free printable cards, certificates and coupons for the elf ideas that need one. Print at home or save as PDF.',
  path: routes.printables,
})

function idea(slug: string): Idea {
  const found = getIdeaBySlug(slug)
  if (!found) throw new Error(`[printables] unknown idea slug "${slug}"`)
  return found
}

function Lines({ count, label }: { count: number; label?: string }) {
  return (
    <>
      {label && <p className="sheet__text">{label}</p>}
      {Array.from({ length: count }, (_, k) => (
        <div className="sheet__line" key={k} />
      ))}
    </>
  )
}

function Stars() {
  return (
    <span aria-label="5 stars to color in" role="img">
      ☆ ☆ ☆ ☆ ☆
    </span>
  )
}

type Sheet = {
  slug: string
  /** null = the text is not written yet (Marketing, Phase 4). */
  paper: ReactNode | null
  /** Shown when `paper` is null. */
  pending?: string
}

function sheets(): Sheet[] {
  const missions = idea('kindness-mission-card')
  const wyr = idea('would-you-rather-card')
  const clues = idea('arrival-hide-and-seek-clue-trail')
  const story = idea('elf-story-fill-in-the-blanks-card')
  const workout = idea('elf-workout-challenge-cards')
  const coupon = idea('goodbye-breakfast-and-hug-coupon')

  return [
    {
      slug: 'milk-and-cookies-taste-test',
      paper: (
        <>
          <h3>Milk and Cookies Taste Test</h3>
          {[1, 2, 3].map((n) => (
            <p className="sheet__text" key={n}>
              Cookie {n}: <Stars />
            </p>
          ))}
        </>
      ),
    },
    {
      slug: 'kindness-mission-card',
      paper: (
        <>
          <h3>TOP SECRET MISSION</h3>
          <p className="sheet__text">{missions.elfNote?.text}</p>
        </>
      ),
    },
    {
      slug: 'nice-list-certificate',
      paper: (
        <>
          <h3>Nice List</h3>
          <Lines count={1} label="Name" />
          <Lines count={2} label="This year you showed" />
        </>
      ),
    },
    {
      slug: 'would-you-rather-card',
      paper: (
        <>
          <h3>Would you rather?</h3>
          <p className="sheet__text">{wyr.elfNote?.text}</p>
        </>
      ),
      pending: 'This is the first card of a 24-question set; the other 23 are being written and will be added here.',
    },
    {
      slug: 'farewell-letter-and-photo',
      paper: null,
      pending: 'The farewell letter template is being written and will be added here.',
    },
    {
      slug: 'arrival-hide-and-seek-clue-trail',
      paper: (
        <>
          <h3>Clue 1</h3>
          <p className="sheet__text">{clues.elfNote?.text}</p>
          {[2, 3, 4].map((n) => (
            <div key={n}>
              <p className="sheet__text">Clue {n}</p>
              <div className="sheet__line" />
            </div>
          ))}
        </>
      ),
    },
    {
      slug: 'elf-story-fill-in-the-blanks-card',
      paper: (
        <>
          <h3>{story.title}</h3>
          <p className="sheet__text">Last night, the elf rode a ______ to the ______ …</p>
          {['A noun', 'A place', 'A food', 'An animal', 'A verb'].map((blank) => (
            <Lines key={blank} count={1} label={blank} />
          ))}
        </>
      ),
      pending: 'The full story is being written; for now this sheet has the opening line and the 5 blanks.',
    },
    {
      slug: 'elf-workout-challenge-cards',
      paper: (
        <>
          <h3>North Pole training</h3>
          {['Jump 10 times', 'Spin 3 times', 'Balance on one foot'].map((challenge) => (
            <p className="sheet__text" key={challenge}>
              {challenge}
            </p>
          ))}
          <p className="sheet__text">{workout.elfNote?.text}</p>
        </>
      ),
    },
    {
      slug: 'draw-my-outfit-contest',
      paper: null,
      pending: 'The elf outline coloring sheet will be added together with the final illustrations.',
    },
    {
      slug: 'goodbye-breakfast-and-hug-coupon',
      paper: (
        <>
          <h3>Hug coupon</h3>
          <p className="sheet__text">{coupon.elfNote?.text}</p>
        </>
      ),
    },
  ]
}

export default function PrintablesPage() {
  const list = sheets()

  return (
    <main id="main" className="wrap">
      <header className="page-head print-hide">
        <h1>Free elf printables</h1>
        <p className="page-head__lead">
          Cards, certificates and coupons for the ideas that need one. Free to print — tap “Print”, then print at home
          or choose “Save as PDF”.
        </p>
      </header>

      <section className="section" aria-label="Printables">
        <ul className="sheets" role="list">
          {list.map((sheet) => {
            const source = idea(sheet.slug)
            return (
              <li key={sheet.slug} id={sheet.slug} className="sheet">
                <div className="sheet__meta stack-3">
                  <h2>{source.printable ? source.printable[0]?.toUpperCase() + source.printable.slice(1) : source.title}</h2>
                  <p>
                    For the idea <Link href={routes.idea(source.slug)}>{source.title}</Link>.
                  </p>
                  {sheet.pending && (
                    <p className="signup__status">
                      <Icon name="info" />
                      <span>{sheet.pending}</span>
                    </p>
                  )}
                </div>
                {sheet.paper && (
                  <>
                    <div className="sheet__paper">{sheet.paper}</div>
                    <div>
                      <PrintButton label={`Print the ${source.printable ?? 'sheet'}`} />
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="section print-hide" aria-labelledby="pack-title">
        <div className="panel stack-3">
          <span className="badge">
            <Icon name="bell" />
            Later
          </span>
          <h2 id="pack-title">The full printable pack</h2>
          <p>
            A bigger pack with every card in the season is planned for later. It isn’t available yet — there is nothing
            to buy on this site today.
          </p>
        </div>
      </section>

      <div className="print-hide">
        <SignupComingSoon />
      </div>
    </main>
  )
}
