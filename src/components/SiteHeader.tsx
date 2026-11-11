import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { NavLinks } from '@/components/NavLinks'
import { routes } from '@/lib/routes'

const NAV = [
  { href: routes.ideas, label: 'All ideas' },
  { href: routes.planner, label: 'Planner' },
  { href: routes.printables, label: 'Printables' },
  { href: routes.shop, label: 'Shop' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link className="brand" href={routes.home} aria-label={`${siteConfig.name} — home`}>
          <img className="brand__mark" src="/mascot/elf-head.svg" alt="" width={300} height={260} />
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <NavLinks items={NAV} />
        </nav>
      </div>
    </header>
  )
}
