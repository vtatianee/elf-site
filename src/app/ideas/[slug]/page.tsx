/*
 * STUB — BARE IDEA PAGE.
 * DEVELOPER: replace the page body in Phase 3 with the fixed template
 * (handoff 01, section 2.4). Keep `generateStaticParams`, `dynamicParams`
 * and the `buildMetadata()` call — they are the contract.
 *
 * It exists to prove that the 60 idea pages export as static HTML, and to
 * show how the helpers are meant to be used (illustration resolver, Amazon
 * links, disclosures). It deliberately renders NO `typeTags` / `materialTags`
 * (pending approval) and can never render `editorNotes` /
 * `illustrationBrief` (they are not part of the `Idea` type).
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IllustrationImage } from '@/components/IllustrationImage'
import { AMAZON_DISCLOSURE, ILLUSTRATION_DISCLOSURE } from '@/config/site'
import { AMAZON_LINK_REL, amazonKitUrl, amazonSearchUrl } from '@/lib/amazon'
import { getAllSlugs, getIdeaBySlug, ideaLabels } from '@/lib/ideas'
import { getIllustration, getSocialImage } from '@/lib/illustrations'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'
import styles from '../../stub.module.css'

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
    // STUB description built from the facts — Marketing writes the real one.
    description: `${idea.title}: an elf idea that takes ${idea.time.label}. ${ideaLabels.mess[idea.mess]}, ${ideaLabels.age[idea.age].toLowerCase()}.`,
    path: routes.idea(idea.slug),
    image: getSocialImage(idea, 'horizontal'),
    type: 'article',
  })
}

export default async function IdeaPage({ params }: PageProps) {
  const { slug } = await params
  const idea = getIdeaBySlug(slug)
  if (!idea) notFound()

  const illustration = getIllustration(idea, 'vertical')
  const kitUrl = amazonKitUrl(idea.slug)
  const hasAmazonLinks = kitUrl !== null || idea.amazonItems.length > 0

  return (
    <main className={styles.page}>
      <p className={styles.banner}>
        Skeleton placeholder — this is not the real idea page. The site is under construction.
      </p>

      {illustration && (
        <figure>
          <IllustrationImage illustration={illustration} priority className={styles.illustration} />
          <figcaption className={styles.small}>{ILLUSTRATION_DISCLOSURE}</figcaption>
        </figure>
      )}

      <h1>{idea.title}</h1>

      <ul className={styles.facts}>
        <li>{idea.time.label}</li>
        <li>{ideaLabels.mess[idea.mess]}</li>
        <li>{ideaLabels.age[idea.age]}</li>
        <li>{idea.roomLabel}</li>
      </ul>

      <section>
        <h2>Materials</h2>
        <ul>
          {idea.materials.map((material) => (
            <li key={material}>{material}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Steps</h2>
        <ol>
          {idea.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      {idea.safety.length > 0 && (
        <section>
          <h2>Safety</h2>
          <ul>
            {idea.safety.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      )}

      {hasAmazonLinks && (
        <section>
          <h2>Find it on Amazon</h2>
          {/* Kit button: rendered only when the idea has an Idea List in the config. */}
          {kitUrl && (
            <p>
              <a href={kitUrl} rel={AMAZON_LINK_REL} target="_blank">
                Buy the kit
              </a>
            </p>
          )}
          <ul>
            {idea.amazonItems.map((item) => (
              <li key={item}>
                <a href={amazonSearchUrl(item)} rel={AMAZON_LINK_REL} target="_blank">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          {/* The disclosure sits next to the links, on every page that has one. */}
          <p className={styles.small}>{AMAZON_DISCLOSURE}</p>
        </section>
      )}

      <p>
        <Link href={routes.home}>Back to all ideas</Link>
      </p>
    </main>
  )
}
