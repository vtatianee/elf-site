# Daily Elf Magic (placeholder name)

A static website with 60 Christmas elf night ideas for parents: pick what to do
tonight with what you have at home.

- **Static site.** Next.js builds plain HTML/CSS/JS into `out/`. No server, no
  database, no login, no WordPress.
- **Hosting.** Cloudflare Pages. Every push to GitHub builds and deploys by itself.
- **Operator.** Vanessa Tatiane Evangelista Assink (site operator and Amazon
  Associates account holder).
- **Money.** Amazon Associates links only. No ads of any kind.
- **Pictures.** Original illustrations only — never photos.

The site name and the domain are placeholders until the owner chooses the final ones.

---

## For the owner: how to change things

You never need to program. Almost everything is in **one file**:
[`src/config/site.ts`](src/config/site.ts). Open it on GitHub, click the pencil,
change the text between the quotes, and press **Commit changes**. The site
rebuilds by itself in about two minutes.

Everything you still have to fill in is marked `TODO-OWNER` in that file.

### Change the domain

1. Cloudflare dashboard → **Workers & Pages** → the site's project → **Settings**
   → **Variables and Secrets**.
2. Set `NEXT_PUBLIC_SITE_URL` to the full address, for example
   `https://dailyelfmagic.com` (with `https://`, no slash at the end).
3. **Deployments** → **Retry deployment** (or push any change).

The domain is not written anywhere else. Sitemap, canonical addresses and link
previews all follow this one value.

### Set the Amazon affiliate tag

In `src/config/site.ts`, find `associateTag: ''` and put the tracking ID between
the quotes, for example `associateTag: 'yourname-20'`.

While it is empty, every Amazon link is a plain search link with no tag, and the
build log shows `WARNING  affiliate tag not set`.

### Add a "Buy the kit" button to an idea

In `src/config/site.ts`, add one line to `ideaListUrls`: the idea's slug (the last
part of its page address) and the full Amazon Idea List address.

```ts
ideaListUrls: {
  'marshmallow-bubble-bath': 'https://www.amazon.com/shop/...',
},
```

Ideas without a line simply have no kit button. Always paste the full
`amazon.com` address — shortened links (`amzn.to`) are refused by the build.

### Change the contact email

In `src/config/site.ts`, change `contactEmail`.

### Email sign-up ("1 idea a day in December")

No email provider is connected. While `email.provider` is `null`, the form shows
a "coming soon" message and collects nothing. Leave it as it is; connecting a
provider is a task for a developer.

### Turn on visitor statistics (optional)

Off by default. To turn on Cloudflare Web Analytics (no cookies), paste its token
into `cloudflareWebAnalyticsToken` in `src/config/site.ts`. No other tracking
tool may be added.

### Swap an illustration

Each idea has its own folder: `public/illustrations/<slug>/`, for example
`public/illustrations/marshmallow-bubble-bath/`.

Drop the new files into that folder with exactly these names:

| File name | Size | Used for |
| --- | --- | --- |
| `vertical.webp` | 1000 × 1500 | idea page, Pinterest |
| `horizontal.webp` | 1200 × 628 | Google and link previews |
| `square.webp` | 1080 × 1080 | grid, Instagram (optional) |

`.webp`, `.png` and `.jpg` all work. That is all: a real image automatically
replaces the placeholder (`vertical.svg`), so you do not have to delete anything
or edit any code. Keep each file under about 200 kB, and never put text inside
the image.

On GitHub: open the folder → **Add file** → **Upload files** → **Commit changes**.

---

## How deploy works

1. A change is pushed to GitHub.
2. GitHub Actions checks it (lint, typecheck, build) — green tick or red cross
   next to the commit.
3. Cloudflare Pages builds the same commit and publishes it:
   - branch `main` → the live site;
   - any other branch or pull request → a separate **preview address**
     (`<branch>.<project>.pages.dev`) to review before it goes live. It is not
     linked from anywhere, but anyone who has the link can open it.

If a build fails, the live site stays on the last good version. Nothing breaks.

Cloudflare Pages settings (set once):

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `out` |
| Production branch | `main` |
| Environment variable | `NEXT_PUBLIC_SITE_URL` = the site address |
| Node version | read from `.nvmrc` (24) |

Step-by-step instructions (in Portuguese) are in
[`docs/handoffs/02a-solutions-architecture.md`](docs/handoffs/02a-solutions-architecture.md).

---

## For developers

Requires Node 24 (`.nvmrc`).

```bash
npm install
npm run dev        # local site at http://localhost:3000
npm run lint
npm run typecheck
npm run build      # config check -> static export to out/ -> export check
```

`npm run build` does three things, and fails if any of them fails:

1. `scripts/prebuild.ts` — checks `src/config/site.ts`, prints what is still a
   placeholder, and writes JPEG copies of the illustrations to `public/social/`
   (link previews and Pinterest cannot use SVG).
2. `next build` — static export to `out/`.
3. `scripts/check-export.ts` — proves the export is right: 60 idea pages,
   sitemap matches the pages, canonical addresses, no `noindex`, no ad or
   tracker code, no internal data in the output, performance budget.

Where things are:

| Path | What |
| --- | --- |
| `src/config/site.ts` | The one config file |
| `src/data/ideas.json` | The 60 ideas (single source of truth) |
| `src/lib/ideas.ts` | Typed access to the ideas |
| `src/lib/illustrations.ts` | Picks the illustration file for an idea |
| `src/lib/amazon.ts` | Builds every Amazon link |
| `src/lib/seo.ts`, `src/lib/routes.ts` | Metadata, canonical, internal addresses |
| `src/app/` | Pages (App Router) |
| `src/styles/` | Design tokens and global reset (plain CSS + CSS Modules) |
| `public/_headers` | Cache and security headers for Cloudflare Pages |

Rules that are not negotiable: no ads or ad slots, no prices, no photos, no
shortened Amazon links, no tracking beyond the optional analytics slot, all
visible copy in English (en-US), and the trademarked doll brand is never used as
the site's name or branding.
