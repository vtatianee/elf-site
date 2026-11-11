/*
 * /shop/ — staple materials that repeat across ideas, with Amazon search
 * links. Rules: exact disclosure near the links, no prices, no product
 * photos, no shortened links (all built by src/lib/amazon.ts).
 *
 * A staple is listed only when at least 2 ideas use it; the ideas are found
 * by matching their own materials lists, so the counts are always true.
 * Each search term is one the source document already names for an idea.
 */
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { AMAZON_DISCLOSURE } from '@/config/site'
import { AMAZON_LINK_REL, amazonSearchUrl } from '@/lib/amazon'
import { getAllIdeas } from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Elf Idea Staples',
  description:
    'The few supplies that show up in idea after idea — marshmallows, candy canes, paper, tape — and the elf ideas that use each one.',
  path: routes.shop,
})

const STAPLES: { name: string; term: string; match: RegExp }[] = [
  { name: 'Mini marshmallows', term: 'mini marshmallows', match: /marshmallow/i },
  { name: 'Candy canes', term: 'candy canes (large pack)', match: /candy cane/i },
  { name: 'Card stock', term: 'card stock', match: /\bcards?\b|card stock/i },
  { name: 'Colored paper', term: 'colored paper', match: /colou?red paper|white paper|drawing paper|sheets? of paper/i },
  { name: 'Tape', term: 'tape', match: /\btape\b/i },
  { name: 'Thread or string', term: 'cotton thread', match: /\bstring\b(?! of)|thread/i },
  { name: 'Pencils', term: 'colored pencil set', match: /pencil/i },
  { name: 'Jingle bells', term: 'jingle bells', match: /\bbells?\b/i },
  { name: 'Clear jars', term: 'clear jars with lids', match: /\bjars?\b/i },
  { name: 'Shallow tray', term: 'shallow tray', match: /\btray\b/i },
  { name: 'Christmas sprinkles', term: 'Christmas sprinkles', match: /sprinkle/i },
  { name: 'Battery-powered LED lights', term: 'battery-powered LED string lights', match: /\bLED\b|battery-powered/i },
]

export default function ShopPage() {
  const ideas = getAllIdeas()
  const staples = STAPLES.map((staple) => ({
    ...staple,
    url: amazonSearchUrl(staple.term),
    ideas: ideas.filter((idea) => idea.materials.some((m) => staple.match.test(m))),
  }))
    .filter((staple) => staple.ideas.length >= 2)
    .sort((a, b) => b.ideas.length - a.ideas.length)

  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Stock up once, use it all month</h1>
        <p className="page-head__lead">
          The same few supplies show up in idea after idea. Here they are, with the elf ideas that use each one.
        </p>
        <p className="disclosure">{AMAZON_DISCLOSURE}</p>
      </header>

      <section className="section" aria-label="Staples">
        <ul className="staples" role="list">
          {staples.map((staple) => (
            <li className="staple" key={staple.name}>
              <h2 className="card__title">{staple.name}</h2>
              <p className="count">Used in {staple.ideas.length} ideas</p>
              <ul role="list">
                {staple.ideas.map((idea) => (
                  <li key={idea.slug}>
                    <Link href={routes.idea(idea.slug)}>{idea.title}</Link>
                  </li>
                ))}
              </ul>
              <p className="buy-links">
                <a href={staple.url} rel={AMAZON_LINK_REL} target="_blank">
                  Search Amazon for {staple.term}
                  <Icon name="out" />
                </a>
              </p>
            </li>
          ))}
        </ul>
        <p className="disclosure section">{AMAZON_DISCLOSURE}</p>
      </section>
    </main>
  )
}
