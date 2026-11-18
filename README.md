# Leonardo Barrey · portfolio

A one-page portfolio in English and Brazilian Portuguese: what Leonardo builds (AI systems and
automations), how he builds it, and four working demos of real projects running on fictitious data.

It is a static site built with [Astro](https://astro.build). There is no backend: nothing in the
demos sends data anywhere.

## Run it

Needs Node.js 22 or newer.

```sh
npm install
npm run dev        # local site at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve the production build
```

## Tests

```sh
npm test           # unit tests (Vitest): locale detection, formatting, flow maths, demo rules
npm run e2e        # browser tests (Playwright): builds the site and drives it in Chromium
```

The first `npm run e2e` on a new machine needs the browser: `npx playwright install chromium`.
The browser tests use port 4321, so stop `npm run dev` / `npm run preview` before running them.

## Where things are

| Path | What it holds |
| --- | --- |
| `src/config.ts` | Name, city, WhatsApp number, and the two values that are still empty: `email` and `domain` |
| `src/content/en.ts`, `src/content/pt-br.ts` | Every word on the page, per language. Both files must keep the same structure (a test checks it) |
| `src/components/` | One file per page section (`Hero`, `Pains`, `Work`, `TryIt`, `Method`, `About`, `Contact`, ...) |
| `src/demos/<name>/` | One folder per demo: `logic.ts` (rules), `strings.ts` (its texts in both languages), `mount.ts` (the screen), `demo.css` (its own look) |
| `src/scripts/` | Page behavior: scroll-driven flow, motion, lightbox, demo tabs, language switch |
| `src/styles/tokens.css` | Colors, fonts, spacing. Change the look here |
| `src/assets/` | Photo and project screenshots (optimized at build time) |
| `reference/` | The original single-file portfolio this site was rebuilt from (source of every fact and demo) |
| `docs/` | Design spec, implementation plan, and the English copy for review |

Languages: `/en/` and `/pt-br/`. The root `/` sends visitors to their browser's language, and the
EN/PT switch in the menu remembers the choice. On Cloudflare that redirect happens on the server
(`functions/index.ts`, limited to `/` by `public/_routes.json`); in `npm run dev` / `preview` the
static `src/pages/index.astro` does it in the browser.

## When the domain exists

Two values in `src/config.ts` turn things on:

- `domain` is the address used in the canonical, language-alternate and social-image links.
  It is `leonardobarrey.pages.dev` for now (the free Cloudflare address); change it to the real
  domain, e.g. `'example.com'`, after adding that domain to the Cloudflare Pages project.
- `email: 'name@example.com'` shows the "Send an email" button in the Contact section. While it is
  `null` there is no email anywhere on the site.

## Social image

`public/og.png` (1200×630) is a screenshot of the hero. To regenerate it after a design change:

```sh
npm run build && npm run preview     # leave it running
node scripts/og.mjs                  # in another terminal
```

## Deploy

Live at https://leonardobarrey.pages.dev. Cloudflare Pages (project `leonardobarrey`) rebuilds and
publishes the site on every push to `main` of `lbarrey-pixel/portfolio`:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Node version: taken from the `.node-version` file (24)

Cloudflare serves `dist/404.html` for unknown addresses. The fonts are downloaded at build time,
so the build needs network access.
