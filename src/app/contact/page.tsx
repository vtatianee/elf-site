/*
 * /contact/ — trust page. The email address comes from the config
 * (placeholder until the owner confirms it before Gate 5).
 */
import { Icon } from '@/components/Icon'
import { siteConfig } from '@/config/site'
import { routes } from '@/lib/routes'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Contact',
  description: `How to reach ${siteConfig.name}.`,
  path: routes.contact,
})

export default function ContactPage() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Contact</h1>
        <p className="page-head__lead">
          Found a mistake in an idea, have a question, or just want to say hello? Send us an email.
        </p>
      </header>
      <div className="prose section">
        <p>
          <a className="btn" href={`mailto:${siteConfig.contactEmail}`}>
            <Icon name="mail" />
            {siteConfig.contactEmail}
          </a>
        </p>
        <p>
          {siteConfig.name} is run by {siteConfig.operator.name}. There is no contact form on this site, so nothing is
          collected here — your email goes straight from your own mail app.
        </p>
      </div>
    </main>
  )
}
