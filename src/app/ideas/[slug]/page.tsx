/*
 * IDEA PAGE — the fixed template, one static page per idea (60).
 *
 * Template (main prompt + handoff 01 §2.4 + C6, approved at Gates 1 and 2):
 *   title + fact bar (first on phones), vertical illustration + Pin button +
 *   illustration disclosure, materials checklist, Amazon links + kit button +
 *   disclosure, 3-5 steps, safety (always shown when the card has it),
 *   elf note (card text, or the note approved at Gate 4), quick variation (ideas 6 and 26),
 *   3 related ideas, 2 hub links (+ a room link), email capture, HowTo schema.
 *
 * Never rendered: editorNotes / illustrationBrief (not part of `Idea`).
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { IdeaCard } from '@/components/IdeaCard'
import { IllustrationImage } from '@/components/IllustrationImage'
import { SignupComingSoon } from '@/components/SignupComingSoon'
import { AMAZON_DISCLOSURE, ILLUSTRATION_DISCLOSURE } from '@/config/site'
import { AMAZON_LINK_REL, amazonKitUrl, amazonSearchUrl } from '@/lib/amazon'
import { ideaIllustration, sceneAlt, toCardData } from '@/lib/cards'
import { ideaDescription } from '@/lib/descriptions'
import { HUB_INFO } from '@/lib/hubs'
import { getAllSlugs, getHubLinks, getIdeaBySlug, ideaLabels, type Room } from '@/lib/ideas'
import { getSocialImage } from '@/lib/illustrations'
import { getRelatedIdeas } from '@/lib/related'
import { routes } from '@/lib/routes'
import { howToJsonLd, jsonLdString } from '@/lib/schema'
import { buildMetadata, pinterestPinUrl } from '@/lib/seo'

type PageProps = { params: Promise<{ slug: string }> }

/** One static page per idea — 60 in total. */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

/** Any other slug is a 404; nothing is rendered on demand. */
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)
  if (!idea) return {}
  return buildMetadata({
    title: idea.title,
    description: ideaDescription(idea),
    path: routes.idea(idea.slug),
    image: getSocialImage(idea, 'horizontal', sceneAlt(idea.slug)),
    type: 'article',
  })
}

/** "More ___ ideas" wording for the room link. */
const ROOM_PHRASE: Record<Room, string> = {
  kitchen: 'kitchen',
  bathroom: 'bathroom',
  'living-room-tree': 'living room and tree',
  bedroom: 'bedroom',
  fridge: 'fridge',
  entryway: 'entryway',
  table: 'table',
  'whole-house': 'whole-house',
}

/** Rooms whose link reads better as "More ideas for the ___" (Gate 4 copy review). */
const ROOM_FOR: Partial<Record<Room, string>> = {
  table: 'the table',
  'whole-house': 'the whole house',
}

function elfNoteLabel(kind: string, when: string | undefined): string {
  const base = kind === 'card' ? 'Elf note' : `Elf note — on the ${kind}`
  return when ? `${base} (${when})` : base
}

/** Elf-note kinds that are a small paper item the parent writes by hand. */
const PAPER_KINDS = new Set(['card', 'sign', 'tag', 'coupon', 'mission card', 'question card'])

export default async function IdeaPage({ params }: PageProps) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)
  if (!idea) notFound()

  const illustration = ideaIllustration(idea, 'vertical')
  const pinImage = getSocialImage(idea, 'vertical', sceneAlt(idea.slug))
  const shareImage = getSocialImage(idea, 'horizontal', sceneAlt(idea.slug))
  const kitUrl = amazonKitUrl(idea.slug)
  const hasAmazonLinks = kitUrl !== null || idea.amazonItems.length > 0
  const related = getRelatedIdeas(idea).map(toCardData)
  const hubLinks = getHubLinks(idea)
  const description = ideaDescription(idea)

  return (
    <main id="main" className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(howToJsonLd(idea, description, shareImage)) }} />

      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={routes.ideas}>
          <Icon name="back" />
          All ideas
        </Link>
      </nav>

      <article className="idea">
        {/* TITLE + FACT BAR — first on phones (Gate 2): time and mess before the tall picture */}
        <header className="idea__head">
          {idea.occasion && <p className="eyebrow">{idea.occasion}</p>}
          <h1>{idea.title}</h1>
          <p className="idea__hook">{idea.hook}</p>
          <dl className="facts">
            <div className="fact">
              <Icon name="clock" />
              <div>
                <dt>Time</dt>
                <dd>{idea.time.label}</dd>
              </div>
            </div>
            <div className="fact">
              <Icon name="sparkle" />
              <div>
                <dt>Mess</dt>
                <dd>{ideaLabels.mess[idea.mess]}</dd>
              </div>
            </div>
            <div className="fact">
              <Icon name="child" />
              <div>
                <dt>Age</dt>
                <dd>{ideaLabels.age[idea.age]}</dd>
              </div>
            </div>
            <div className="fact">
              <Icon name="door" />
              <div>
                <dt>Room</dt>
                <dd>{idea.roomLabel}</dd>
              </div>
            </div>
          </dl>
        </header>

        {/* MAIN ILLUSTRATION (vertical) + PIN BUTTON + ILLUSTRATION DISCLOSURE */}
        {illustration && (
          <figure className="art idea__art">
            <div className="art__frame">
              <IllustrationImage illustration={illustration} priority />
              {pinImage && (
                <a
                  className="pin-btn"
                  href={pinterestPinUrl(routes.idea(idea.slug), pinImage, idea.title)}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Pin “${idea.title}” on Pinterest (opens in a new tab)`}
                >
                  <Icon name="pin" />
                  Pin
                </a>
              )}
            </div>
            <figcaption className="art__note">{ILLUSTRATION_DISCLOSURE}</figcaption>
          </figure>
        )}

        <div className="idea__main">
          {/* MATERIALS CHECKLIST + AMAZON LINKS + DISCLOSURE NEAR THE LINKS */}
          <section aria-labelledby="need-title" className="stack-4">
            <h2 id="need-title">What you need</h2>
            <ul className="checklist" role="list">
              {idea.materials.map((material, index) => (
                <li className="check" key={material}>
                  <label className="check__label">
                    <input type="checkbox" name={`material-${index + 1}`} />
                    <span>{material}</span>
                  </label>
                </li>
              ))}
            </ul>
            {idea.printable && (
              <div className="callout callout--info">
                <Icon name="print" />
                <div>
                  <h3 className="callout__label">Printable</h3>
                  <p>
                    This idea has a free printable: {idea.printable}.{' '}
                    <Link href={`${routes.printables}#${idea.slug}`}>Print it from the Printables page</Link>.
                  </p>
                </div>
              </div>
            )}
            {hasAmazonLinks && (
              <div className="kit">
                <h3>Find it on Amazon</h3>
                {kitUrl && (
                  <a className="btn btn--secondary" href={kitUrl} rel={AMAZON_LINK_REL} target="_blank">
                    <Icon name="bag" />
                    Get everything for this idea
                  </a>
                )}
                {idea.amazonItems.length > 0 && (
                  <ul className="buy-links" role="list">
                    {idea.amazonItems.map((item) => (
                      <li key={item}>
                        <a href={amazonSearchUrl(item)} rel={AMAZON_LINK_REL} target="_blank">
                          Search Amazon for {item}
                          <Icon name="out" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="disclosure">{AMAZON_DISCLOSURE}</p>
              </div>
            )}
          </section>

          {/* STEPS */}
          <section aria-labelledby="steps-title" className="stack-4">
            <h2 id="steps-title">How to set it up</h2>
            <ol className="steps" role="list">
              {idea.steps.map((step, index) => (
                <li key={step} id={`step-${index + 1}`}>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* SAFETY — exact text from the card, always visible */}
          {idea.safety.length > 0 && (
            <section aria-labelledby="safety-title">
              <div className="callout callout--safety" role="note">
                <Icon name="alert" />
                <div>
                  <h2 className="callout__label" id="safety-title">
                    Safety
                  </h2>
                  {idea.safety.map((warning) => (
                    <p key={warning}>{warning}</p>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ELF NOTE — only when the card has text */}
          {idea.elfNote && (
            <section aria-labelledby="note-title">
              <div className="note">
                <img className="note__elf" src="/mascot/elf-peek.svg" alt="" width={300} height={250} />
                <h2 className="note__label" id="note-title">
                  {elfNoteLabel(idea.elfNote.kind, idea.elfNote.when)}
                </h2>
                <blockquote>{idea.elfNote.text}</blockquote>
                {PAPER_KINDS.has(idea.elfNote.kind) && (
                  <p className="note__hint">Write it on a small {idea.elfNote.kind} and leave it with the elf.</p>
                )}
              </div>
            </section>
          )}

          {/* QUICK VARIATION — ideas 6 and 26 only */}
          {idea.variation && (
            <section aria-labelledby="var-title">
              <div className="callout callout--variation">
                <Icon name="swap" />
                <div>
                  <h2 className="callout__label" id="var-title">
                    Quick variation
                  </h2>
                  <p>{idea.variation}</p>
                </div>
              </div>
            </section>
          )}

          {/* 3 RELATED IDEAS */}
          <section aria-labelledby="related-title" className="stack-4">
            <h2 id="related-title">Try one of these next</h2>
            <ul className="cards cards--rows" role="list">
              {related.map((card) => (
                <li key={card.slug}>
                  <IdeaCard card={card} row showAge={false} />
                </li>
              ))}
            </ul>
          </section>

          {/* 2 HUB LINKS + the room link */}
          <nav aria-labelledby="more-title" className="stack-3">
            <h2 id="more-title">Keep looking</h2>
            <ul className="hub-links" role="list">
              {hubLinks.map(({ hub, isMember }) => (
                <li key={hub}>
                  <Link className="hub" href={routes.hub(hub)}>
                    {isMember ? HUB_INFO[hub].memberLink : HUB_INFO[hub].invitationLink}
                    <Icon name="arrow" />
                  </Link>
                </li>
              ))}
              <li>
                <Link className="hub" href={routes.ideasWith({ room: idea.room })}>
                  {ROOM_FOR[idea.room] ? `More ideas for ${ROOM_FOR[idea.room]}` : `More ${ROOM_PHRASE[idea.room]} ideas`}
                  <Icon name="arrow" />
                </Link>
              </li>
            </ul>
          </nav>

          <SignupComingSoon />
        </div>
      </article>
    </main>
  )
}
