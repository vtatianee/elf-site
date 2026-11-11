/*
 * /about/ — trust page (required for Amazon Associates).
 * Must state that the scenes are original illustrations, not photos, and
 * name the operator (handoff 01 §7).
 * COPY STATUS: Developer draft; Marketing / PM review in Phase 4.
 */
import Link from 'next/link'
import { AMAZON_DISCLOSURE, ILLUSTRATION_DISCLOSURE, siteConfig } from '@/config/site'
import { getAllIdeas } from '@/lib/ideas'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'About',
  description: `What ${siteConfig.name} is, who runs it, and why every scene is an original illustration.`,
  path: routes.about,
})

export default function AboutPage() {
  const count = getAllIdeas().length
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>About {siteConfig.name}</h1>
        <p className="page-head__lead">{siteConfig.description}</p>
      </header>
      <div className="prose section">
        <p>
          {siteConfig.name} is a tonight planner for families who keep a Christmas elf. It’s 10pm, the kids are asleep,
          and the elf needs to be somewhere new by morning. Instead of scrolling a long list, pick what’s true tonight —
          how much time you have, how much mess you can take, your child’s age and what’s in the house — and get an idea
          you can set up right now.
        </p>
        <p>
          There are {count} ideas, each with a materials list, simple steps, and the time and mess it really takes. Start
          with <Link href={routes.home}>Tonight Mode</Link>, browse <Link href={routes.ideas}>all ideas</Link>, or{' '}
          <Link href={routes.planner}>plan the whole of December</Link> in one go.
        </p>

        <h2>Original illustrations, not photos</h2>
        <p>
          <strong>{ILLUSTRATION_DISCLOSURE}</strong> Every scene on this site was drawn for it, in one consistent style.
          We never use photos — not ours, not anyone else’s, and never product photos. Because an illustration can’t prove
          a setup works the way a photo can, we keep every scene physically possible and the steps, times and cleanup
          honest.
        </p>

        <h2>Safety first</h2>
        <p>
          Ideas are written for grown-ups to set up. When an idea needs care — batteries, water, scissors, small parts —
          the safety note sits right on the idea page. Please read it, and keep small parts away from young children.
        </p>

        <h2>Who runs this site</h2>
        <p>
          {siteConfig.name} is run by {siteConfig.operator.name}. Questions or ideas? See the{' '}
          <Link href={routes.contact}>contact page</Link>.
        </p>

        <h2>How the site is paid for</h2>
        <p>
          There are no ads on this site. Some idea pages link to supplies on Amazon. {AMAZON_DISCLOSURE} That never
          changes what an idea needs: most use things you already have at home. We never show prices.
        </p>

        <h2>Independent</h2>
        <p>
          This site is independent. It is not affiliated with, endorsed by or sponsored by any elf brand or trademark
          owner. Any mention of the elf tradition is only to describe it.
        </p>
      </div>
    </main>
  )
}
