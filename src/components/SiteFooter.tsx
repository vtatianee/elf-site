import Link from 'next/link'
import { AMAZON_DISCLOSURE, ILLUSTRATION_DISCLOSURE, siteConfig } from '@/config/site'
import { HUB_INFO } from '@/lib/hubs'
import { routes } from '@/lib/routes'

/**
 * Site footer. Carries, on every page (compliance checklist, handoff 01 §7):
 * the Amazon disclosure, the illustration disclosure, the non-affiliation
 * notice and the operator's name. It also links every hub, so no hub is ever
 * more than one tap away.
 */
export function SiteFooter() {
  const groups: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: 'Find ideas',
      links: [
        { href: routes.ideas, label: 'All 60 ideas' },
        ...(['5-minute', 'easy', 'no-mess', 'funny'] as const).map((hub) => ({
          href: routes.hub(hub),
          label: HUB_INFO[hub].navLabel,
        })),
      ],
    },
    {
      title: 'By age and moment',
      links: (['toddlers', 'kids', 'arrival', 'goodbye'] as const).map((hub) => ({
        href: routes.hub(hub),
        label: HUB_INFO[hub].navLabel,
      })),
    },
    {
      title: 'Plan',
      links: [
        { href: routes.planner, label: 'December planner' },
        { href: routes.printables, label: 'Printables' },
        { href: routes.shop, label: 'Shop staples' },
      ],
    },
    {
      title: 'About',
      links: [
        { href: routes.about, label: 'About' },
        { href: routes.contact, label: 'Contact' },
        { href: routes.privacy, label: 'Privacy' },
      ],
    },
  ]

  return (
    <footer className="site-footer on-night">
      <div className="wrap">
        <nav className="footer-nav" aria-label="Footer">
          {groups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              <ul role="list">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footer-legal">
          <p>
            <strong>{AMAZON_DISCLOSURE}</strong>
          </p>
          <p>{ILLUSTRATION_DISCLOSURE}</p>
          <p>
            This site is independent. It is not affiliated with, endorsed by or sponsored by any elf brand or
            trademark owner.
          </p>
          <p>Site operator: {siteConfig.operator.name}.</p>
        </div>
      </div>
    </footer>
  )
}
