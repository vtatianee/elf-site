'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Item = { href: string; label: string }

/**
 * Main navigation links. A Client Component only to mark the current section
 * with aria-current (the static layout does not know the page it is on).
 */
export function NavLinks({ items }: { items: Item[] }) {
  const pathname = usePathname() ?? '/'
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`
  return (
    <ul role="list">
      {items.map((item) => {
        const current = normalized === item.href || normalized.startsWith(item.href)
        return (
          <li key={item.href}>
            <Link href={item.href} aria-current={current ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
