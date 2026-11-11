/*
 * The 8 SEO hubs: /easy/ /5-minute/ /no-mess/ /toddlers/ /kids/ /funny/
 * /arrival/ /goodbye/. Each lists only the ideas tagged for it (the same idea
 * may appear in several hubs) and links back to every one of them.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { IdeaCard } from '@/components/IdeaCard'
import { toCardData } from '@/lib/cards'
import { HUB_INFO, fillCount, getHubIdeas } from '@/lib/hubs'
import { HUBS, isHub } from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

type PageProps = { params: Promise<{ hub: string }> }

export function generateStaticParams() {
  return HUBS.map((hub) => ({ hub }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { hub } = await params
  if (!isHub(hub)) return {}
  const info = HUB_INFO[hub]
  return buildMetadata({
    title: info.title,
    description: fillCount(info.description, getHubIdeas(hub).length),
    path: routes.hub(hub),
  })
}

export default async function HubPage({ params }: PageProps) {
  const { hub } = await params
  if (!isHub(hub)) notFound()
  const info = HUB_INFO[hub]
  const cards = getHubIdeas(hub).map(toCardData)
  const otherHubs = HUBS.filter((h) => h !== hub)

  return (
    <main id="main" className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={routes.ideas}>
          <Icon name="back" />
          All ideas
        </Link>
      </nav>
      <header className="page-head">
        <h1>{info.title}</h1>
        <p className="page-head__lead">{fillCount(info.intro, cards.length)}</p>
      </header>

      <section className="section" aria-label={info.title}>
        <ul className="cards" role="list">
          {cards.map((card) => (
            <li key={card.slug}>
              <IdeaCard card={card} as="h2" />
            </li>
          ))}
        </ul>
      </section>

      <nav className="section" aria-labelledby="more-hubs-title">
        <div className="section__head">
          <h2 id="more-hubs-title">More ways to browse</h2>
          <Link href={routes.ideas}>All 60 ideas with filters</Link>
        </div>
        <ul className="hubs" role="list">
          {otherHubs.map((other) => (
            <li key={other}>
              <Link className="hub" href={routes.hub(other)}>
                {HUB_INFO[other].tileLabel}
                <Icon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}
