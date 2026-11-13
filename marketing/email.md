# Email capture — “1 idea a day in December”

**Status: DRAFT — awaiting André’s approval (Gate 4).** Nothing here is sent, scheduled or connected. No email provider is chosen (`siteConfig.email.provider = null`), so the site keeps the “coming soon” state until a provider is wired in a separate task. No provider, API key or list ID is named here.

Placeholders in `{curly braces}` are filled from `src/data/ideas.json` or the site config. `{siteName}` is “Daily Elf Magic” today (provisional name).

---

## 1. Sign-up form (site)

| Part | Copy |
|---|---|
| Badge (while switched off) | Coming soon |
| Headline | 1 idea a day in December |
| Sub-line | One elf idea in your inbox every day, December 1 to 24 — in time for tonight. |
| Sub-line on idea pages (variant) | Get tomorrow’s idea in your inbox, December 1 to 24. |
| Field label | Email address |
| Placeholder | you@example.com |
| Button (when live) | Send me the ideas |
| Button (while switched off) | Not open yet |
| Consent line under the button (when live) | One email a day from December 1 to 24, plus a welcome note. Unsubscribe anytime with one click. |

**Why “in time for tonight” and not “every morning”:** the elf is set up at night, so the idea is most useful when it arrives in the afternoon (proposal: about 3 p.m. in the reader’s time zone, or 3 p.m. Eastern if the provider can’t localize). The current site sub-line says “every morning” — see `copy-review.md`.

## 2. “Coming soon” state (now — no provider)

> **Coming soon.** Sign-ups open soon. This form is switched off for now: nothing you type is saved or sent.

(Same facts as the current component, a little warmer. It never shows a success message.)

## 3. States for later (only once a provider is connected)

| State | Copy |
|---|---|
| Sending | Sending… |
| Success (double opt-in) | **Check your inbox!** Tap the link in our email to confirm, and your first idea arrives on December 1. |
| Confirmed page | **You’re in!** The elf will see you on December 1. Until then, try tonight’s idea in Tonight Mode. |
| Already subscribed | You’re already on the list — see you on December 1. |
| Invalid address | That doesn’t look like an email address. Check it and try again. |
| Generic error | That didn’t go through. Please try again in a minute. |
| Signed up after December 1 | **You’re in!** Your first idea arrives tomorrow afternoon. |

## 4. Confirmation email (double opt-in)

- **Subject:** Confirm your elf ideas for December
- **Preheader:** One tap and you’re on the list.
- **Body:**

> Hi there,
>
> Tap the button below to confirm, and we’ll send you one elf idea a day from December 1 to 24 — each one with the time it takes, how messy it gets, what you need and the note to leave with the elf.
>
> **[Yes, send me the ideas]**
>
> Didn’t sign up? Just ignore this email and you won’t hear from us.

## 5. Welcome email (sent right after confirming)

- **Subject:** You’re in! Your elf ideas start December 1
- **Preheader:** One idea a day, in time for tonight. Here’s what to expect.
- **Body:**

> Hi there,
>
> Welcome! From December 1 to 24, you’ll get one elf idea every afternoon — early enough to grab what you need before bedtime.
>
> Every email has:
>
> - **The facts first:** time, mess, age and room, so you know in one glance if it works tonight.
> - **What you need:** a short list — often things you already have at home.
> - **3 simple steps**, written for a tired grown-up at 10 p.m.
> - **The elf’s note**, ready to copy onto a little card.
>
> Can’t wait until December? Tonight Mode picks 3 ideas for you in one tap: **[Open Tonight Mode]**
>
> Want the whole month planned? The December planner builds your 24 nights and one shopping list: **[Plan December]**
>
> And the free printables — mission cards, the Nice List certificate, story cards and more — are here: **[Free printables]**
>
> See you on December 1,
> The {siteName} elf

## 6. Daily December email — template

**Subject line formula (pick one, use it all month):**

- A (recommended): `Tonight: {title} ({time.label}, {messShort})` → “Tonight: Trapped in a Jar (2 min, zero mess)”
- B: `Day {n} of 24: {title}` → “Day 5 of 24: Trapped in a Jar”

`{messShort}` = zero mess · low mess · medium mess · high mess.

**Preheader:** `{hook}` (the C6b line from `site-copy.json`).

**Body:**

> **Day {n} of 24**
>
> # {title}
>
> {hook}
>
> **{time.label} · {mess label} · {age label} · {roomLabel}**
>
> **What you need**
> - {materials[0]}
> - {materials[1]} …
>
> **How to set it up**
> 1. {steps[0]}
> 2. {steps[1]}
> 3. {steps[2]}
>
> *(only if the idea has safety lines)* **Safety:** {safety, exact text}
>
> **The elf’s note** *(only if the idea has one)*
> “{elfNote.text}”
>
> **[See the full idea]** → `{siteUrl}/ideas/{slug}/`
>
> **Tomorrow:** {next title} — {next time.label}, {next messShort}. *(so the reader can plan ahead)*

**Rules for the daily email**

- Facts, materials, steps, safety and the note come **only** from `ideas.json`. Nothing is invented or shortened in a way that changes meaning.
- **No Amazon links inside emails.** Link to the idea page, where the Amazon links and the disclosure live (see the note in `idea-lists.json`; Vanessa confirms the rule in her Associates account).
- No prices. The scenes are always called illustrations. No emoji in the subject line.
- The order of the 24 days follows the planner rules (arrival first, projects on weekends, one high-mess night at most, goodbye ideas at the end). The final order is a separate decision before December.

**Example — Day 5, idea 8**

- **Subject:** Tonight: Trapped in a Jar (2 min, zero mess)
- **Preheader:** Kids find the elf stuck in a jar — and beg to rescue it before breakfast.

> **Day 5 of 24**
>
> # Trapped in a Jar
>
> Kids find the elf stuck in a jar — and beg to rescue it before breakfast.
>
> **2 min · Zero mess · All ages · Kitchen**
>
> **What you need**
> - large clear glass or plastic jar, with the lid left open
>
> **How to set it up**
> 1. Sit the elf inside the open jar, on the counter.
> 2. Rest its little hands against the glass.
> 3. Card on the outside: “I climbed in for a cookie. I regret nothing. Please let me out.”
>
> **The elf’s note**
> “I climbed in for a cookie. I regret nothing. Please let me out.”
>
> **[See the full idea]** → https://elf-site.pages.dev/ideas/trapped-in-a-jar/
>
> **Tomorrow:** Marshmallow Bubble Bath — 5 min, low mess.

## 7. Footer for every email

> You’re getting this because you signed up for “1 idea a day in December” at {siteName}. **[Unsubscribe]** with one click.
>
> {siteName} is run by Vanessa Tatiane Evangelista Assink · {MAILING ADDRESS — TODO-OWNER}
>
> Illustrated guide — scenes are original illustrations, not photos. This site is independent and not affiliated with any elf brand or trademark owner.

**Needs a decision before any email is sent:** US (CAN-SPAM) and Canadian (CASL) rules call for a working unsubscribe, the sender’s identity and a postal mailing address in every email; CASL also asks for clear, opt-in consent (no pre-checked box). The address line above is a placeholder. This is not legal advice — Vanessa and André confirm before the provider is switched on.
