# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Leonardo Barrey's Claude-artifact portfolio as a bilingual (EN / pt-BR) static Astro site with direction-C "system map" design, all four interactive demos, deployed to Cloudflare Pages from GitHub.

**Architecture:** Astro static site with built-in i18n routing (`/en/`, `/pt-br/`). All copy lives in typed per-locale content objects; one `Home` page component renders either locale. Pure logic (locale detection, flow progress, demo business rules, formatting) lives in small TS modules with Vitest unit tests; behavior in the browser is covered by Playwright against `astro preview`. Each demo is a self-contained folder (`logic.ts`, `strings.ts`, `mount.ts`, `demo.css`) mounted as a client script.

**Tech Stack:** Astro (latest stable) + TypeScript strict, Vitest, @playwright/test, astro:assets (sharp) for images, plain CSS with custom properties, vanilla TS for motion (GSAP/Lenis only if a task's motion can't be done cleanly without it). Node v26 / npm 11 are installed.

**Spec:** `docs/superpowers/specs/2026-11-17-portfolio-rebuild-design.md` (read it before any task; section numbers below refer to it).

## Global Constraints

- Two complete locales: `en` and `pt-br`; URLs `/en/` and `/pt-br/`; root `/` redirects by browser language (pt* → `/pt-br/`, else `/en/`); EN/PT switch in nav remembers the choice (localStorage key `lb-locale`).
- Source of truth for every fact, metric and demo: `reference/current-artifact/index.html` and `reference/current-artifact/img/`. Never invent facts, metrics or background.
- Flow-step tech labels use only stated tech: Python, FastAPI, Node.js, React, TypeScript, PWA, PostgreSQL, Supabase, LLMs, agents, semantic search, n8n, GitHub Actions, ERP, Pix, SEFAZ, carrier APIs, REST. No "pgvector", "Maps API", "Gmail API".
- WhatsApp `+55 48 99940-6747`, link `https://wa.me/5548999406747?text=<message>`; pt message `Oi Leonardo, vi seu portfólio`; en message `Hi Leonardo, I saw your portfolio`.
- Email button hidden while `SITE.email` is `null` (it is `null` at launch).
- Direction C ("system map") with signature from direction A: serif italic accent words, accent starting point `#2B4D3F` on warm paper (not tech blue), recurring live-log motif. Reference mockup: `reference/mockups/hero-directions-v2.html` (motion level there is the floor).
- Not a visual copy of Telemyr or any reference site.
- `prefers-reduced-motion: reduce` → no scroll/loop animation, all content visible.
- No backend, no form, nothing in demos sends data. Keep fictitious names/values exactly as in the source demos.
- Light theme is the target; dark mode optional.
- Use the `frontend-design:frontend-design` skill for Tasks 3–6.
- Never commit secrets; `.superpowers/` and `node_modules/` are git-ignored.

## Review Focus

1. **Phone width (360×740):** no horizontal page scroll in either locale, flow nodes don't overlap, demos usable — pinned in Task 10 (`no horizontal overflow at 360px`).
2. **Reduced motion:** every revealed element ends visible with motion disabled — pinned in Task 6 (`reduced motion shows all content`).
3. **Language switch on a deep link** (`/en/#demo-crm` → PT) keeps the hash and lands on `/pt-br/#demo-crm` — pinned in Task 2 (`switch keeps hash`).
4. **Storage unavailable** (private mode / blocked storage throws): redirect and switch still work — pinned in Task 2 (`readSavedLocale returns null when storage throws`).
5. **Bad demo input** (partial CEP, empty/negative/huge margin, non-numeric volume) never shows `NaN` and never breaks the flow — pinned in Tasks 7, 8, 9.

---

## File Structure

```
astro.config.mjs            i18n config, site URL placeholder
package.json                scripts: dev, build, preview, test (vitest), e2e (playwright)
playwright.config.ts        webServer = build + preview on :4321
src/config.ts               SITE constants (phone, email:null, domain:null)
src/i18n/locales.ts         Locale type, LOCALES, detectLocale, resolveLocale, readSavedLocale, otherLocale, localePath
src/lib/format.ts           formatBRL, formatNumber
src/lib/contact.ts          whatsappUrl, emailHref
src/lib/flow.ts             stepForProgress
src/content/types.ts        SiteContent and nested types
src/content/en.ts           SiteContent for en
src/content/pt-br.ts        SiteContent for pt-br
src/content/index.ts        getContent(locale)
src/layouts/Base.astro      <html lang>, meta, hreflang, fonts, global css
src/pages/index.astro       root redirect
src/pages/en/index.astro    <Home locale="en">
src/pages/pt-br/index.astro <Home locale="pt-br">
src/pages/404.astro         bilingual 404 ("Signal lost" style, builder's call)
src/components/Home.astro   assembles sections
src/components/Nav.astro, LangSwitch.astro, Hero.astro, HeroMap.astro, Pains.astro,
  Work.astro, Lightbox.astro, TryIt.astro, DeviceFrame.astro, Method.astro, About.astro,
  Contact.astro, Footer.astro, Marquee.astro
src/scripts/lang-switch.ts, motion.ts, flow.ts, hero-map.ts, lightbox.ts, tryit.ts
src/styles/tokens.css, global.css
src/assets/photo/leonardo.jpg, src/assets/projects/*.jpg   (copied from reference/)
src/demos/types.ts          DemoHandle, DemoMount
src/demos/bakery/   logic.ts strings.ts mount.ts demo.css
src/demos/quoting/  logic.ts strings.ts mount.ts demo.css
src/demos/crm/      logic.ts strings.ts mount.ts demo.css
src/demos/warehouse/logic.ts strings.ts mount.ts demo.css
tests/unit/*.test.ts        Vitest
tests/e2e/*.spec.ts         Playwright
```

Demo id mapping to the source: `bakery` = pudim/confeitaria, `quoting` = cabine, `crm` = crm, `warehouse` = cd. Hash anchors: `#demo-bakery`, `#demo-quoting`, `#demo-crm`, `#demo-warehouse`.

---

### Task 1: Scaffold, tooling, repo

**Files:**
- Create: Astro project in repo root, `.gitignore`, `vitest.config.ts`, `playwright.config.ts`, `src/config.ts`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`
- Copy: `reference/photo/leonardo.jpg` → `src/assets/photo/leonardo.jpg`; `reference/current-artifact/img/*.jpg` → `src/assets/projects/`

**Interfaces:**
- Produces: `SITE` in `src/config.ts`:
  ```ts
  export const SITE = { name: 'Leonardo Barrey', city: 'Florianópolis, SC', phoneE164: '5548999406747', phoneDisplay: '+55 48 99940-6747', email: null as string | null, domain: null as string | null };
  ```
  npm scripts `build`, `preview`, `test` (vitest run), `e2e` (playwright test).

- [ ] **Step 1:** `git init` in the repo root; create `.gitignore` with `node_modules/`, `dist/`, `.astro/`, `.superpowers/`, `test-results/`, `playwright-report/`.
- [ ] **Step 2:** Scaffold Astro (minimal template, TypeScript strict) into the existing folder without deleting `docs/` or `reference/`; add `vitest` and `@playwright/test`; `npx playwright install chromium`.
- [ ] **Step 3:** Configure `astro.config.mjs` with `i18n: { locales: ['en','pt-br'], defaultLocale: 'en', routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false } }` and `output: 'static'`.
- [ ] **Step 4:** Write `tests/unit/smoke.test.ts` asserting `SITE.email === null` and `SITE.phoneE164 === '5548999406747'`; write `tests/e2e/smoke.spec.ts` asserting `GET /en/` returns 200 (placeholder page is fine for now). `playwright.config.ts`: `webServer: { command: 'npm run build && npm run preview -- --port 4321', port: 4321 }`, projects `chromium` desktop.
- [ ] **Step 5:** Run `npm test` and `npm run e2e`. Expected: both PASS.
- [ ] **Step 6:** Commit everything including `docs/` and `reference/`: `git commit -m "chore: scaffold Astro site with tests"`.

---

### Task 2: i18n core, content model, all copy, routing

**Files:**
- Create: `src/i18n/locales.ts`, `src/lib/format.ts`, `src/lib/contact.ts`, `src/content/{types,en,pt-br,index}.ts`, `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/{en,pt-br}/index.astro`, `src/components/Home.astro` (renders section headings from content only, styled later), `src/components/LangSwitch.astro`, `src/scripts/lang-switch.ts`
- Test: `tests/unit/locales.test.ts`, `tests/unit/format.test.ts`, `tests/unit/contact.test.ts`, `tests/unit/content.test.ts`, `tests/e2e/i18n.spec.ts`

**Interfaces:**
- Produces (`src/i18n/locales.ts`):
  ```ts
  export type Locale = 'en' | 'pt-br';
  export const LOCALES: readonly Locale[];
  export const STORAGE_KEY = 'lb-locale';
  export function detectLocale(languages: readonly string[]): Locale;
  export function readSavedLocale(storage: Pick<Storage,'getItem'> | null | undefined): Locale | null;
  export function resolveLocale(saved: Locale | null, languages: readonly string[]): Locale;
  export function otherLocale(l: Locale): Locale;
  export function localePath(l: Locale, hash?: string): string; // '/en/' or '/pt-br/#x'
  ```
- Produces (`src/lib/format.ts`): `formatBRL(value: number, locale: Locale): string`, `formatNumber(value: number, locale: Locale, fractionDigits?: number): string` (Intl, `en-US` / `pt-BR`, currency BRL in both).
- Produces (`src/lib/contact.ts`): `whatsappUrl(phoneE164: string, message: string): string`, `emailHref(email: string | null): string | null`.
- Produces (`src/content/types.ts`) — the shape every section reads:
  ```ts
  export interface Metric { value: number; prefix?: string; suffix?: string; label: string }
  export interface FlowStep { code: string; title: string; tech: string }   // code e.g. '01 · IN'
  export interface Project { id: 'quoting'|'bakery'|'crm'|'warehouse'; tab: string; kind: string; title: string;
    bullets: { label: string; text: string }[]; tags: string[]; status: string; summary: string;
    steps: [FlowStep,FlowStep,FlowStep,FlowStep,FlowStep]; metrics: Metric[]; images: { file: string; caption: string; alt: string }[]; tryLabel: string }
  export interface Pain { title: string; problem: string; answerLabel: string; answer: string; demo?: Project['id']; linkLabel?: string }
  export interface SiteContent {
    meta: { title: string; description: string };
    nav: { work: string; pains: string; method: string; tryIt: string; contact: string; switchLabel: string };
    hero: { tag: string; headline: string[]; accent: string; lead: string; ctaPrimary: string; ctaSecondary: string; mapLog: string[] };
    stack: string[];
    pains: { eyebrow: string; title: string; lead: string; items: Pain[] };
    work: { eyebrow: string; title: string; lead: string; progressHint: string; projects: Project[] };
    tryIt: { eyebrow: string; title: string; lead: string; fakeNote: Record<Project['id'], string>; hints: Record<Project['id'], string[]>; reset: string };
    method: { eyebrow: string; title: string; lead: string; steps: { title: string; text: string }[]; scenarioTitle: string; scenarioLead: string; scenario: { kw: string; text: string }[] };
    about: { eyebrow: string; text: string; photoAlt: string };
    contact: { eyebrow: string; title: string; text: string; marquee: string[]; whatsapp: string; whatsappMessage: string; email: string; copy: string; copied: string };
    footer: { note: string };
    lightbox: { close: string; prev: string; next: string; of: string };
  }
  export function getContent(locale: Locale): SiteContent; // in index.ts
  ```

- [ ] **Step 1: Write failing unit tests**
  - `locales.test.ts`: `detectLocale(['pt-BR'])==='pt-br'`, `detectLocale(['pt-PT','en'])==='pt-br'`, `detectLocale(['en-US','pt-BR'])==='en'`, `detectLocale([])==='en'`; `readSavedLocale({getItem:()=>'pt-br'})==='pt-br'`; `readSavedLocale({getItem:()=>'fr'})===null`; **`readSavedLocale returns null when storage throws`** (`getItem` throws) → `null`; `readSavedLocale(null)===null`; `resolveLocale('en',['pt-BR'])==='en'`; `resolveLocale(null,['pt-BR'])==='pt-br'`; `localePath('pt-br','#demo-crm')==='/pt-br/#demo-crm'`; `otherLocale('en')==='pt-br'`.
  - `format.test.ts` (normalize ` ` to space before comparing): `formatBRL(19.9,'pt-br')==='R$ 19,90'`; `formatBRL(19.9,'en')==='R$19.90'`; `formatNumber(4680,'en')==='4,680'`; `formatNumber(4680,'pt-br')==='4.680'`; `formatNumber(0.03,'pt-br',3)==='0,030'`.
  - `contact.test.ts`: `whatsappUrl('5548999406747','Oi Leonardo, vi seu portfólio')==='https://wa.me/5548999406747?text=Oi%20Leonardo%2C%20vi%20seu%20portf%C3%B3lio'`; `emailHref(null)===null`; `emailHref('a@b.co')==='mailto:a@b.co'`.
  - `content.test.ts`: for both locales, every string leaf is non-empty; `en` and `pt-br` have identical structure (same keys, same array lengths recursively); `work.projects` ids are `['quoting','bakery','crm','warehouse']` in that order; `pains.items.length===6`; `method.steps.length===5`; every `steps[].tech` is in the allowed list from Global Constraints (split on ` · `); every `images[].file` exists in `src/assets/projects/`; the metric values include 224, 65, 4680 (quoting), 60 (bakery), 347, 16 (crm).
- [ ] **Step 2:** Run `npm test`. Expected: FAIL (modules missing).
- [ ] **Step 3: Implement** `locales.ts`, `format.ts`, `contact.ts`.
- [ ] **Step 4: Write `pt-br.ts`** by adapting all copy from the source page (hero, 6 pains, 4 projects with bullets/tags/status, method 5 steps + Gherkin scenario `Dado/E/Quando/Então/E` lines verbatim, try-it hints and fictitious-data notes, contact, footer). Tighten for the new design but keep every fact. Add flow steps and metrics per project:
  - quoting steps: Client email (`Email`) → AI extracts items (`LLMs`) → Match among 4,680 products (`Semantic search`) → Agent finds cost (`Agents`) → Proposal in ERP (`ERP`). Metrics: 224 proposals last month; 65% suggestions accepted without correction; 4,680 catalog products.
  - bakery: Customer orders on phone (`PWA`) → Fee by real distance (`Python`) → Pays by Pix (`Pix`) → Owner panel (`React · PostgreSQL`) → Agent ships fixes (`Agents`). Metrics: 60+ versions in 3 days; 0% marketplace commission; 2 stock locations.
  - crm: Lead list (`PostgreSQL`) → Agent sends cadence (`Agents`) → Reads replies (`LLMs`) → Schedules next step (`n8n`) → Warm lead to seller (`React`). Metrics: 347 companies reached last month; 16% reply rate.
  - warehouse: Scan the DANFE (`SEFAZ`) → AI matches items (`LLMs`) → Pick with measures & photo (`TypeScript`) → Scan the DACTE (`ERP`) → Freight vs CT-e (`Carrier APIs`). Metrics: 6 pipeline stages tracked; 3 fiscal documents checked (DANFE, NF-e, DACTE).
  - hero.mapLog (quoting run): `→ email received from buyer@client`, `→ 12 items extracted`, `→ 12/12 matched in catalog`, `→ supplier cost found for 11 items`, `✓ proposal #1043 exported to ERP` (and pt equivalents).
  - about.text: one or two sentences from stated facts only (spec §5.6).
- [ ] **Step 5: Write `en.ts`** as natural native-quality English (not literal), same structure.
- [ ] **Step 6: Routing and layout.** `Base.astro` sets `<html lang="en">` or `lang="pt-BR"`, per-locale `<title>`/description, `<link rel="alternate" hreflang="en" href="/en/">`, `hreflang="pt-BR"` → `/pt-br/`, `hreflang="x-default"` → `/`. `src/pages/index.astro`: inline script `location.replace(localePath(resolveLocale(readSavedLocale(safeLocalStorage), navigator.languages)))` plus `<noscript>` links to both. `LangSwitch` renders a link to `localePath(otherLocale(l))`; `lang-switch.ts` on click appends `location.hash` and writes `STORAGE_KEY` in try/catch.
- [ ] **Step 7: Write `tests/e2e/i18n.spec.ts`:** `/en/` has `html[lang=en]` and the en hero headline; `/pt-br/` has `html[lang=pt-BR]`; with `locale: 'pt-BR'` context, `/` ends at `/pt-br/`; with `en-US`, ends at `/en/`; clicking the switch on `/en/` goes to `/pt-br/` and a fresh visit to `/` then lands on `/pt-br/` even with `en-US`; **`switch keeps hash`**: from `/en/#demo-crm` the switch lands on `/pt-br/#demo-crm`.
- [ ] **Step 8:** Run `npm test && npm run e2e`. Expected: PASS.
- [ ] **Step 9: Copy review (spec §12.2).** Export the English copy to `docs/copy-review-en.md` (one section per page section) and give Leonardo the path; apply his changes when they come (don't block Task 3 on it).
- [ ] **Step 10:** Commit `feat: i18n routing, content model and bilingual copy`.

---

### Task 3: Design system, nav, hero with live map, photo — VISUAL REVIEW GATE

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/components/{Nav,Hero,HeroMap,Marquee}.astro`, `src/scripts/hero-map.ts`
- Modify: `src/components/Home.astro`, `src/layouts/Base.astro` (fonts)
- Test: `tests/e2e/hero.spec.ts`

**Interfaces:**
- Consumes: `SiteContent.hero`, `.nav`, `.stack`, `work.projects[0].steps`; `LangSwitch`.
- Produces: CSS custom properties used by all later sections: `--bg --ink --mute --line --acc --acc-soft --card --font-display --font-body --font-mono --radius --ease-out` (`--ease-out: cubic-bezier(.16,1,.3,1)`). `HeroMap` root has `data-hero-map`, steps `[data-step]`, log `[data-log]`; `hero-map.ts` exports `startHeroMap(root: HTMLElement, log: string[]): () => void` (returns stop).

- [ ] **Step 1:** Invoke `frontend-design:frontend-design`. Decide final palette (start `#2B4D3F` on warm paper), type pairing (serif italic for accent words + a characterful sans + mono for labels/logs), spacing scale. Write tokens.
- [ ] **Step 2: Write `hero.spec.ts`:** both locales show the headline, the 5 hero-map steps with tech labels from content, nav links to `#pains #work #try #method #contact`, the WhatsApp CTA `href` equals `whatsappUrl(SITE.phoneE164, content.contact.whatsappMessage)`; after 3 s the map has at least one `[data-step].is-on` and `[data-log]` text is one of `hero.mapLog`.
- [ ] **Step 3:** Run `npm run e2e -- hero`. Expected: FAIL.
- [ ] **Step 4:** Build Nav (sticky, blurred, underline hover, EN/PT switch), Hero (line-by-line headline reveal, accent word in serif italic, lead, magnetic CTAs, scroll cue), HeroMap (5 steps, rail + travelling dot, live log loop every ~1.3 s), stack Marquee.
- [ ] **Step 5:** Process the photo with `astro:assets` `<Image>` (crop to head and shoulders, ~480px, webp/avif) and a subtle CSS/filter treatment matching the palette. Place it in a temporary preview block on the page for review (final home is the About section, Task 4).
- [ ] **Step 6:** Run `npm run e2e -- hero`. Expected: PASS.
- [ ] **Step 7:** Commit `feat: design tokens, nav, hero with live system map`.
- [ ] **Step 8: STOP — visual review with Leonardo (spec §12.1).** Run `npm run dev`, take desktop and 390px-wide screenshots of the hero + photo block, show them (and the local URL). Do not start Task 4 until he approves; apply requested changes and re-commit.

---

### Task 4: Pains, Method, About, Contact, Footer

**Files:**
- Create: `src/components/{Pains,Method,About,Contact,Footer}.astro`
- Modify: `src/components/Home.astro`
- Test: `tests/e2e/sections.spec.ts`

**Interfaces:**
- Consumes: `SiteContent.pains/.method/.about/.contact/.footer`, `SITE`, `whatsappUrl`, `emailHref`.
- Produces: section ids `pains`, `method`, `about`, `contact`; pain cards with `demo` set render a link `href="#demo-<id>"`.

- [ ] **Step 1: Write `sections.spec.ts`:** 6 pain cards per locale; exactly 4 of them have a `#demo-*` link (bakery, quoting, crm, warehouse); method shows 5 steps and the scenario with 5 lines; About shows the photo with `alt` from content; Contact shows the WhatsApp button with the locale message link; **no `mailto:` link exists anywhere** (email is null); footer text present.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Build the sections in the approved style: pains as cards (tilt + cursor glow + stack chips on hover, wired in Task 6), method steps + styled Gherkin block, short About with photo, Contact with large moving bilingual marquee text + WhatsApp button; email button rendered only when `emailHref(SITE.email)` is non-null.
- [ ] **Step 4:** Add a unit test in `tests/unit/contact.test.ts` that the Contact email visibility helper follows `emailHref` (if you extract one), then run `npm test && npm run e2e -- sections`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: pains, method, about, contact sections`.

---

### Task 5: Work — scroll-driven flow, project tabs, screenshots, lightbox

**Files:**
- Create: `src/lib/flow.ts`, `src/components/{Work,Lightbox}.astro`, `src/scripts/{flow,lightbox}.ts`
- Test: `tests/unit/flow.test.ts`, `tests/e2e/work.spec.ts`

**Interfaces:**
- Consumes: `work.projects`, `lightbox` strings, `formatNumber`.
- Produces: `stepForProgress(progress: number, count: number): number`; section id `work`; tabs `[data-project-tab="<id>"]`; nodes `[data-flow-node]` with `.is-on` / `.is-current`; gallery buttons `[data-gallery="<id>"]`; `initFlow(section: HTMLElement): void`, `initLightbox(root: HTMLElement): void`.

- [ ] **Step 1: Write `flow.test.ts`:** `stepForProgress(0,5)===0`, `(0.19,5)===0`, `(0.2,5)===1`, `(0.99,5)===4`, `(1,5)===4`, `(-1,5)===0`, `(2,5)===4`, `(NaN,5)===0`.
- [ ] **Step 2:** Run `npm test -- flow`. Expected: FAIL. Implement (clamp to [0,1], NaN→0, `Math.min(count-1, Math.floor(p*count))`). Run. Expected: PASS.
- [ ] **Step 3: Write `work.spec.ts`:** default tab is quoting with its 5 steps and 224/65/4,680 metrics (en formatting `4,680`, pt `4.680`); clicking each tab swaps steps and summary; scrolling through the section turns all 5 nodes `.is-on`; clicking a screenshot opens the lightbox with caption and `1 / 4` style counter for bakery, ArrowRight advances, Escape closes and focus returns to the trigger.
- [ ] **Step 4:** Build Work: sticky stage, SVG path drawn by scroll progress with a travelling marker, nodes lighting per `stepForProgress`, side panel with summary + count-up metrics, project tabs with cross-fade, "In use" status, screenshot gallery per project (images from `src/assets/projects/` via `<Image>`), Lightbox (dialog semantics, focus trap, keyboard).
- [ ] **Step 5:** Run `npm run e2e -- work`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: scroll-driven work flow with project tabs and lightbox`.

---

### Task 6: Motion layer and reduced motion

**Files:**
- Create: `src/scripts/motion.ts`
- Modify: section components to add `data-reveal`, `data-magnetic`, `data-tilt`
- Test: `tests/e2e/motion.spec.ts`

**Interfaces:**
- Produces: `initMotion(root: Document): void` handling `[data-reveal]` (IntersectionObserver adds `.is-in`), `[data-reveal-lines]`, `[data-magnetic]`, `[data-tilt]` (sets `--gx/--gy` and rotate), count-up `[data-count]`; everything is a no-op under `matchMedia('(prefers-reduced-motion: reduce)')`, and CSS shows `[data-reveal]` fully when reduced or when JS is off (`html:not(.js)`).

- [ ] **Step 1: Write `motion.spec.ts`:** **`reduced motion shows all content`**: with `reducedMotion: 'reduce'`, after load every `[data-reveal]` has computed `opacity` `1` and `transform` `none`, and metric `[data-count]` shows its final value; with JS disabled, the same reveal elements are visible; with normal motion, after scrolling to the bottom every `[data-reveal]` has `.is-in`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement `motion.ts`, add a `js` class on `<html>` from an inline head script, wire attributes across sections. Motion stays smooth and calm (no bounce, no flashing), at least at the level of the reference mockup.
- [ ] **Step 4:** Run `npm run e2e`. Expected: all PASS.
- [ ] **Step 5:** Commit `feat: motion layer with reduced-motion support`.

---

### Task 7: Try-it section shell + Bakery demo

**Files:**
- Create: `src/demos/types.ts`, `src/demos/bakery/{logic,strings,mount}.ts`, `src/demos/bakery/demo.css`, `src/components/{TryIt,DeviceFrame}.astro`, `src/scripts/tryit.ts`
- Test: `tests/unit/bakery.test.ts`, `tests/e2e/demo-bakery.spec.ts`

**Interfaces:**
- Produces (`src/demos/types.ts`):
  ```ts
  export interface DemoHandle { reset(): void }
  export type DemoMount = (root: HTMLElement, locale: Locale) => DemoHandle;
  ```
- Produces (`bakery/logic.ts`): `deliveryFee(km: number): number`, `normalizeCep(input: string): string` (digits, max 8), `isCompleteCep(input: string): boolean`, `cartCount(cart: Record<string, number>): number`, `cartSubtotal(cart: Record<string, number>, menu: { id: string; price: number }[]): number`.
- Produces: `strings: Record<Locale, BakeryStrings>` (menu items with ids `ch dl lc pn fa` and prices 19.90 / 19.90 / 17.90 / 21.90 / 89.90, all UI text, example CEP `88010-000`, example address, Pix copy, owner-panel copy); `mount: DemoMount`.
- Produces: TryIt section id `try`, tabs `[data-demo-tab="<id>"]`, panels `#demo-<id>`, reset buttons `[data-demo-reset="<id>"]`; `tryit.ts` opens the panel matching `location.hash` (`#demo-<id>`) and scrolls to it, and registers mounts from a `Record<DemoId, DemoMount>`.

- [ ] **Step 1: Write `bakery.test.ts`:** `deliveryFee(2)===10`, `(3)===10`, `(4.2)===14`, `(5)===14`, `(5.1)===18`; `normalizeCep('88010-000')==='88010000'`; `isCompleteCep('8801')===false`; `isCompleteCep('88010-000')===true`; `cartSubtotal({ch:2,fa:1},menu)` ≈ 129.70; `cartCount({})===0`; strings for both locales have identical keys and the same menu ids and prices.
- [ ] **Step 2:** Run. Expected: FAIL. Implement logic + strings (pt from source verbatim where possible; en natural). Run. Expected: PASS.
- [ ] **Step 3: Write `demo-bakery.spec.ts`** (both locales): add 2 items → cart shows `2`; open order; type partial CEP `8801` and blur → helper message, no address, pay disabled; use example CEP → address shows `4,2 km` (pt) / `4.2 km` (en); calculate → delivery `R$ 14,00` / `R$14.00`; pay → QR canvas visible; simulate → confirmation and owner-panel card with the items; "new order" resets; reset button resets; no text node contains `NaN`. Visiting `/en/#demo-bakery` opens this panel.
- [ ] **Step 4:** Implement `mount.ts` by porting the source `pdRender` behavior (menu → cart → pix views, QR drawing, 1.2 s simulated payment) with strings from `strings[locale]` and `formatBRL`. Keep the demo's own bakery theme in `demo.css`, scoped under the demo root. Build `TryIt` (eyebrow/title/lead, tabs, panels with try-hints, fictitious-data note, reset) and `DeviceFrame` (`variant: 'phone' | 'browser'`, `label` for the browser bar).
- [ ] **Step 5:** Run `npm test && npm run e2e -- demo-bakery`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: try-it section and bakery demo`.

---

### Task 8: Quoting demo (cabine)

**Files:**
- Create: `src/demos/quoting/{logic,strings,mount}.ts`, `src/demos/quoting/demo.css`
- Modify: `src/components/TryIt.astro` (add panel), `src/scripts/tryit.ts` (register)
- Test: `tests/unit/quoting.test.ts`, `tests/e2e/demo-quoting.spec.ts`

**Interfaces:**
- Produces (`logic.ts`):
  ```ts
  export interface QuoteItem { q: number; cost: number; code: string; match: string | null }
  export function clampMargin(v: unknown): number;                 // NaN/empty→0, clamp 0..200
  export function priceWithMargin(cost: number, margin: number): number;
  export function proposalTotals(items: QuoteItem[], margin: number): { cost: number; total: number; profit: number };
  export function exportCsv(proposalNo: string, items: QuoteItem[], margin: number): string; // header 'numero_proposta;codigo;descricao;qtd;valor_unit'
  ```
- Consumes: `DemoMount`, `formatBRL`.

- [ ] **Step 1: Write `quoting.test.ts`:** `clampMargin('')===0`, `clampMargin(-5)===0`, `clampMargin(999)===200`, `clampMargin('30')===30`; with the five source items (costs 312.00×10, 689.90×2, 1249.00×1, 798.50×3, and the rack after the agent finds it 489.00×1) at margin 30: `cost` ≈ 8633.30, `total` ≈ 11223.29, `profit` ≈ 2589.99; CSV has 6 lines, first is the header, second starts `R-2041;CAM-2MP-B28;`; strings parity across locales.
- [ ] **Step 2:** Run. Expected: FAIL. Implement. Run. Expected: PASS.
- [ ] **Step 3: Write `demo-quoting.spec.ts`** (both locales): process the example email → table with 5 rows, the rack row shows the "agent searching" state then fills within 3 s; export is blocked until the rack is priced; set margin to `''`, `-5`, `999` → totals show margin 0 / 0 / 200 and never `NaN`; export → toast and CSV block visible; "back to email" resets.
- [ ] **Step 4:** Implement `mount.ts` by porting source `cbRender` (3 steps, 1.4 s processing, 1.6 s agent fill-in, margin input, ERP export) inside a `browser` DeviceFrame labelled per locale. The client email text, item names and the CSV column header stay in Portuguese in both locales (they represent the Brazilian client's data and ERP format); UI chrome is translated.
- [ ] **Step 5:** Run `npm test && npm run e2e -- demo-quoting`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: quoting demo`.

---

### Task 9: CRM demo and Warehouse demo

**Files:**
- Create: `src/demos/crm/{logic,strings,mount}.ts`, `src/demos/crm/demo.css`, `src/demos/warehouse/{logic,strings,mount}.ts`, `src/demos/warehouse/demo.css`
- Modify: `TryIt.astro`, `tryit.ts`
- Test: `tests/unit/crm.test.ts`, `tests/unit/warehouse.test.ts`, `tests/e2e/demo-crm.spec.ts`, `tests/e2e/demo-warehouse.spec.ts`

**Interfaces:**
- Produces (`crm/logic.ts`):
  ```ts
  export const STEP_COUNT = 5; // cold, cold(follow-up), replied, qualified, proposal
  export interface Lead { domain: string; owner: string; stage: number }
  export function advanceLead(lead: Lead): { lead: Lead; sentEmail: boolean; gotReply: boolean } | null; // null at last stage
  export function columnOf(stage: number): 0 | 1 | 2 | 3; // stages 0,1→0; 2→1; 3→2; 4→3
  ```
- Produces (`warehouse/logic.ts`): `cubage(vol: { c: unknown; l: unknown; a: unknown }): number` (m³, non-numeric or negative → 0); `parseDecimal(input: unknown): number` (accepts `6,2` and `6.2`, invalid → 0).

- [ ] **Step 1: Write unit tests:** `advanceLead({stage:4,...})===null`; from stage 0 → stage 1 with `sentEmail:true, gotReply:false`; from 1 → 2 with `gotReply:true`; `columnOf(1)===0`, `columnOf(4)===3`; `cubage({c:40,l:30,a:25})` ≈ 0.03; `cubage({c:'abc',l:30,a:25})===0`; `cubage({c:-1,l:30,a:25})===0`; `parseDecimal('6,2')===6.2`; strings parity for both demos (crm: 7 seed leads with the source domains/owners/stages; warehouse: 3 items, 6 stages, NF 48213 / 51877, order #1871).
- [ ] **Step 2:** Run. Expected: FAIL. Implement. Run. Expected: PASS.
- [ ] **Step 3: Write e2e specs** (both locales):
  - CRM: 4 columns with counts summing to 7; clicking a lead shows its timeline; "agent's next step" on `alfaindustria.com.br` moves it and increments the emails counter from 614 to 615; a lead at the last stage shows the disabled end-of-funnel button.
  - Warehouse: read DANFE → 3 items; complete button disabled until all 3 checked; validate the AI match; pick all 3; type `abc` in a volume field → manager panel cubage shows `0` formatting, never `NaN`; restore `40/30/25` → `0.030` (en) / `0,030` (pt); read DACTE → done screen; manager pipeline shows 5 of 6 stages done and the log has the dispatch line.
- [ ] **Step 4:** Implement both `mount.ts` by porting source `crRender` (browser frame) and `cdRender` (phone frame + manager panel side by side; stacked on narrow screens). Company domains, NF numbers and product names stay as in the source; UI is translated.
- [ ] **Step 5:** Run `npm test && npm run e2e`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: crm and warehouse demos`.

---

### Task 10: Mobile, 404, SEO, performance pass

**Files:**
- Create: `src/pages/404.astro`, `public/robots.txt`, OG image `public/og.png` (generated from the hero, 1200×630), `tests/e2e/mobile.spec.ts`, `tests/e2e/seo.spec.ts`
- Modify: components as needed for mobile fixes

- [ ] **Step 1: Write `mobile.spec.ts`** at viewport 360×740 for `/en/` and `/pt-br/`: **`no horizontal overflow at 360px`** (`document.documentElement.scrollWidth <= innerWidth`) at top, after scrolling through Work, and with each demo tab open; flow nodes' bounding boxes don't overlap; nav switch reachable; each demo's primary button is visible and clickable.
- [ ] **Step 2: Write `seo.spec.ts`:** each locale page has its own `<title>`, meta description, `og:title`, `og:image`, canonical, and the three `hreflang` alternates; `/404` renders in both languages and links to `/en/` and `/pt-br/`.
- [ ] **Step 3:** Run. Expected: FAIL where not yet done. Fix layouts/metadata; add 404 (builder's call on the "signal lost" idea).
- [ ] **Step 4:** Run `npm run build && npx lighthouse http://localhost:4321/en/ --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless"` (with preview running). Expected: each category ≥ 90; fix anything below.
- [ ] **Step 5:** Run full `npm test && npm run e2e`. Expected: all PASS.
- [ ] **Step 6:** Commit `feat: mobile polish, 404, SEO metadata`.

---

### Task 11: GitHub + Cloudflare Pages deploy — PREVIEW REVIEW GATE

**Files:**
- Create: `README.md` (what the site is, `npm` scripts, how to set `SITE.email`/`SITE.domain` later, deploy notes)

Leonardo decided the builder does the setup under **his** accounts (spec §8), using CLIs or his Chrome; he only does logins/2FA.

- [ ] **Step 1:** Install CLIs: `winget install --id GitHub.cli -e`; Wrangler via `npx wrangler` (no global install needed). Verify `gh --version`.
- [ ] **Step 2:** Run `gh auth login --web` and ask Leonardo to complete the browser login. Verify `gh auth status` shows logged in.
- [ ] **Step 3:** Ask Leonardo once: public or private repo (default public). Then `gh repo create portfolio --<visibility> --source . --push`. Verify the repo URL opens and `main` has all commits.
- [ ] **Step 4:** Create the Cloudflare Pages project connected to the GitHub repo. Use Leonardo's Chrome (Claude in Chrome) on the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → select repo; framework preset Astro, build command `npm run build`, output `dist`, env `NODE_VERSION=22` or newer. Ask Leonardo to log in / approve GitHub app access when prompted.
- [ ] **Step 5:** Wait for the first deploy. Verify `curl -s -o /dev/null -w "%{http_code}" https://<project>.pages.dev/en/` → `200`, same for `/pt-br/`; open `/` in Chrome and confirm the redirect.
- [ ] **Step 6:** Push a trivial README change and confirm a new deploy starts automatically.
- [ ] **Step 7:** Commit `docs: README with deploy notes` (if not already pushed).
- [ ] **Step 8: STOP — preview review with Leonardo (spec §12.3).** Send him the `*.pages.dev` URL and the list of things to try (switch language, each demo, phone). Apply feedback in follow-up commits.

Later (not part of this plan, when Leonardo buys the domain): add the custom domain in Cloudflare Pages, set `SITE.domain` and `SITE.email`, enable Cloudflare Email Routing to his inbox.
