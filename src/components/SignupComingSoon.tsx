import { useId } from 'react'
import { Icon } from '@/components/Icon'

/**
 * Email capture "1 idea a day in December".
 *
 * No provider is configured (`siteConfig.email.provider === null`), so this
 * renders the honest "coming soon" state: field and button disabled, nothing
 * collected, nothing sent, never a success message. Connecting a provider is
 * out of the MVP; when it happens, this is the one component to change.
 * Until then the form stays disabled even if a provider is typed into the
 * config, so the site never shows a form that pretends to work.
 */
export function SignupComingSoon() {
  const id = useId()
  const fieldId = `${id}-email`
  const titleId = `${id}-title`
  const statusId = `${id}-status`

  return (
    <section className="section" aria-labelledby={titleId}>
      <div className="signup">
        <img className="signup__elf" src="/mascot/elf-peek.svg" alt="" width={300} height={250} />
        <span className="badge">
          <Icon name="bell" />
          Coming soon
        </span>
        <h2 id={titleId}>1 idea a day in December</h2>
        <p className="signup__lead">One elf idea in your inbox every day, December 1 to 24 — in time for tonight.</p>
        <form className="signup__form" aria-describedby={statusId} noValidate>
          <label htmlFor={fieldId}>Email address</label>
          <input
            className="field"
            id={fieldId}
            type="email"
            placeholder="you@example.com"
            disabled
          />
          <button className="btn" type="submit" disabled>
            Not open yet
          </button>
        </form>
        <p className="signup__status" id={statusId}>
          <Icon name="info" />
          <span>Sign-ups open soon. This form is switched off for now: nothing you type is saved or sent.</span>
        </p>
      </div>
    </section>
  )
}
