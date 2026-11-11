/*
 * STUB — PLACEHOLDER HOME PAGE.
 * DEVELOPER: replace this whole file in Phase 3 (search + filters, Tonight
 * Mode, idea of the day, "Parent favorites", email capture).
 * It exists only to prove that the skeleton builds and exports.
 */
import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { getAllIdeas } from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import styles from './stub.module.css'

export const metadata = buildMetadata({
  description: siteConfig.description,
  path: routes.home,
})

export default function HomePage() {
  const ideas = getAllIdeas()
  return (
    <main className={styles.page}>
      <p className={styles.banner}>
        Skeleton placeholder — this is not the real home page. The site is under construction.
      </p>
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.description}</p>
      <h2>All {ideas.length} ideas</h2>
      <ol>
        {ideas.map((idea) => (
          <li key={idea.slug}>
            <Link href={routes.idea(idea.slug)}>{idea.title}</Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
