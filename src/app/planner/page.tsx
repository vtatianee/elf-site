/*
 * /planner/ — builds a December 1-24 calendar and ONE combined shopping list.
 */
import { Planner } from '@/components/Planner'
import { AMAZON_DISCLOSURE } from '@/config/site'
import { AMAZON_LINK_REL, amazonSearchUrl } from '@/lib/amazon'
import { getAllIdeas } from '@/lib/ideas'
import { planYear, type PlanIdea } from '@/lib/planner-rules'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'December Elf Planner',
  description:
    'Plan December 1 to 24 in one tap: one elf idea per night, quick ones on weekdays, projects on weekends, and one combined shopping list.',
  path: routes.planner,
})

export default function PlannerPage() {
  const ideas: PlanIdea[] = getAllIdeas().map((idea) => ({
    id: idea.id,
    title: idea.title,
    href: routes.idea(idea.slug),
    time: idea.time.tag,
    mess: idea.mess,
    typeTags: idea.typeTags,
    occasion: idea.occasion,
    // A card that says when it starts, e.g. idea 59: "In the last week (from the 18th on)".
    startDay: Number(idea.steps.join(' ').match(/from the (\d{1,2})(?:st|nd|rd|th) on/)?.[1] ?? 0) || null,
    materials: idea.materials,
    amazonItems: idea.amazonItems,
  }))
  const amazonUrls = Object.fromEntries(
    [...new Set(ideas.flatMap((idea) => idea.amazonItems))].map((term) => [term, amazonSearchUrl(term)]),
  )

  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Your December elf plan</h1>
        <p className="page-head__lead">
          One idea for every night from December 1 to 24, already planned: quick ideas on weekdays, bigger projects on
          weekends, something to play along with every few days, and just one messy night. Swap any day you like — the
          shopping list follows.
        </p>
        <p className="section__sub">Your plan is saved in this browser only. Nothing is sent anywhere.</p>
      </header>
      <div className="section">
        <Planner
          ideas={ideas}
          amazonUrls={amazonUrls}
          amazonRel={AMAZON_LINK_REL}
          disclosure={AMAZON_DISCLOSURE}
          initialYear={planYear(new Date())}
        />
      </div>
    </main>
  )
}
