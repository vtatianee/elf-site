/*
 * /printables/ — free printables for the ideas that need one.
 *
 * Gate 1 decisions:
 * - Free to print in the MVP (no email gate: there is no email provider).
 *   The email form sits next to it in its "coming soon" state.
 * - The paid pack is a placeholder: no checkout, no price.
 *
 * Every sentence printed on a sheet comes from src/data/ideas.json (the
 * source card) or from the Marketing texts approved at Gate 4
 * (src/data/approved-copy.json, via @/lib/approved-copy). The only sheet still
 * pending is the coloring outline of idea 52 (needs the final elf art).
 */
import Link from 'next/link'
import { Fragment, type ReactNode } from 'react'
import { Icon } from '@/components/Icon'
import { PrintButton } from '@/components/PrintButton'
import { printableTexts as texts } from '@/lib/approved-copy'
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

/** A row of small cards to cut apart (missions, questions, clues). */
function Cards({ items }: { items: ReactNode[] }) {
  return (
    <ul className="sheet__cards" role="list">
      {items.map((item, k) => (
        <li className="sheet__card" key={k}>
          {item}
        </li>
      ))}
    </ul>
  )
}

/** Renders "[1. a noun]" blanks as a line with the hint under it. */
function StoryText({ text }: { text: string }) {
  const parts = text.split(/\[(\d+)\. ([^\]]+)\]/)
  const out: ReactNode[] = []
  for (let k = 0; k < parts.length; k += 3) {
    out.push(parts[k])
    if (parts[k + 1]) {
      out.push(
        <span className="sheet__blank" key={k}>
          <span className="sheet__blank-line" />
          <span className="sheet__blank-hint">
            {parts[k + 1]}. {parts[k + 2]}
          </span>
        </span>,
      )
    }
  }
  return <p className="sheet__story">{out}</p>
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

  // The first mission, question and clue are the card's own words: stop the build if they drift apart.
  const verbatim: [string | undefined, string | undefined][] = [
    [missions.elfNote?.text, texts.kindnessMissions.missions[0]],
    [wyr.elfNote?.text, texts.wouldYouRather[0]],
    [clues.elfNote?.text, texts.clueTrail[0]?.text],
  ]
  for (const [card, sheet] of verbatim) {
    if (card !== sheet) throw new Error(`[printables] "${sheet}" should match the card text "${card}"`)
  }

  return [
    {
      slug: 'milk-and-cookies-taste-test',
      paper: (
        <>
          <h3>Milk and Cookies Taste Test</h3>
          <p className="sheet__hint">{texts.tasteTestInstruction}</p>
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
          <h3>{texts.kindnessMissions.envelopeLabel}</h3>
          <Cards items={texts.kindnessMissions.missions.map((m) => (
            <p className="sheet__text" key={m}>
              {m}
            </p>
          ))} />
        </>
      ),
    },
    {
      slug: 'nice-list-certificate',
      paper: (
        <>
          <h3>Nice List</h3>
          <p className="sheet__text">{texts.niceListTopLine}</p>
          <Lines count={1} label="This certifies that" />
          <Lines count={2} label="This year you showed:" />
        </>
      ),
    },
    {
      slug: 'would-you-rather-card',
      paper: (
        <>
          <h3>Would you rather?</h3>
          <Cards
            items={texts.wouldYouRather.map((q, k) => (
              <p className="sheet__text" key={q}>
                <span className="sheet__num">Dec {k + 1}</span> {q}
              </p>
            ))}
          />
        </>
      ),
    },
    {
      slug: 'farewell-letter-and-photo',
      paper: (
        <div className="sheet__letter">
          {texts.farewellLetter.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ),
    },
    {
      slug: 'arrival-hide-and-seek-clue-trail',
      paper: (
        <>
          <h3>The clue trail</h3>
          <Cards
            items={texts.clueTrail.map((clue, k) => (
              <Fragment key={clue.text}>
                <p className="sheet__num">Clue {k + 1}</p>
                <p className="sheet__text">{clue.text}</p>
                {clue.addLine && <p className="sheet__text">{clue.addLine}</p>}
              </Fragment>
            ))}
          />
        </>
      ),
    },
    {
      slug: 'elf-story-fill-in-the-blanks-card',
      paper: (
        <>
          <h3>{story.title}</h3>
          <StoryText text={texts.storyCard.text} />
          <p className="sheet__text">{texts.storyCard.signOff}</p>
        </>
      ),
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
          <div className="sheet__letter sheet__letter--short">
            <h3>{texts.seeYouSoonLetter.title}</h3>
            {texts.seeYouSoonLetter.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{texts.seeYouSoonLetter.signoff}</p>
          </div>
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
