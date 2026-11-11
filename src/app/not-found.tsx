/*
 * 404 page. Exported as out/404.html, which Cloudflare Pages serves for any
 * address that does not exist.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <main id="main" className="wrap">
      <div className="empty section">
        <img src="/mascot/elf-sleep.svg" alt="" width={420} height={180} />
        <h1>Page not found</h1>
        <p>This page has gone back to the North Pole.</p>
        <div className="actions">
          <Link className="btn" href={routes.home}>
            Go to the home page
          </Link>
          <Link className="btn btn--ghost" href={routes.ideas}>
            See all ideas
          </Link>
        </div>
      </div>
    </main>
  )
}
