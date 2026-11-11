/*
 * 404 page. Exported as out/404.html, which Cloudflare Pages serves for any
 * address that does not exist.
 * DEVELOPER: restyle in Phase 3; keep it light and keep the link home.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import styles from './stub.module.css'

export const metadata: Metadata = {
  title: 'Page not found',
}

export default function NotFound() {
  return (
    <main className={styles.page}>
      <h1>Page not found</h1>
      <p>This page has gone back to the North Pole.</p>
      <p>
        <Link href={routes.home}>Go to the home page</Link>
      </p>
    </main>
  )
}
