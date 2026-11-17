# Portfolio rebuild — design

Date: 2026-11-17
Owner: Leonardo Barrey (freelance developer, Florianópolis, BR)

## 1. Intent

Leonardo has a portfolio published as a Claude artifact (Portuguese only, one HTML file). It works, but it looks like a "standard AI layout": rounded cards, pill buttons, safe colors, generic grid. He wants to rebuild it as a real website on his own domain, in **English and Portuguese (pt-BR)**, that looks **designed by a creative agency with real people and a point of view**: personal, crafted, sophisticated.

**Who visits:** recruiters and clients (business owners who need systems built).

**What success looks like:** after seeing the site, visitors **contact him** (WhatsApp now; email once the domain exists).

**What the site is:** a portfolio, not a CV page. It shows **what he builds, how he builds it, and for whom**. Recruiters and clients see the same page and the same story.

## 2. Goals, non-goals, anti-goals

**Goals**
- Show real systems working, with the tech stack visible *inside* the work (not as a detached list).
- Keep all content from the current portfolio, including the four interactive demos.
- Two complete language versions: English and pt-BR, including the demos.
- Smooth, dynamic but calm motion that makes the systems feel alive.
- Clear, frictionless contact: WhatsApp button (email button added later).
- Fast, mobile-friendly, accessible.

**Non-goals**
- No CV/résumé section, no downloadable CV.
- No contact form (buttons only).
- No CMS, blog, or backend. Static site.
- Buying the domain and setting up email are Leonardo's to do; the site must work without them.

**Anti-goals (failure even if it technically works)**
- Looking like a generic SaaS landing page or an "AI-generated template": default sans, tech-blue accent, rounded card grid, pill buttons everywhere.
- A visual copy of Telemyr (or any other referenced site). It's inspiration for qualities, not a template.
- Flashy motion that hides the work or feels like a gimmick. Motion must explain the systems.
- The English version feeling like a machine translation.

## 3. References

Leonardo picked these from Awwwards; **Telemyr is the main reference**.

| Site | What he liked |
|---|---|
| [Telemyr](http://telemyr.com) ([Awwwards](https://www.awwwards.com/sites/telemyr)) | **Main reference.** Layout, cards, motion. Minimal, smooth, sophisticated. Interactive data-flow ("point at a system to follow its data"), numbered service cards, anchored single page, short confident copy. Same business space (Ops + AI studio). |
| [Lionel Quellery](https://www.asklionel.tech/) ([Awwwards](https://www.awwwards.com/sites/lionel-quellery)) | Layout and motion. Cinematic storytelling of data pipelines, diagrams that "boot" on hover. |
| [Significant Other](https://significantother.ca) ([Awwwards](https://www.awwwards.com/sites/significant-other)) | The layout (frames/panels), **not** its heavy horizontal movement. Built with Astro. |

## 4. Design direction (decided)

Three directions were mocked up; see `reference/mockups/hero-directions-v2.html` (open in a browser, switch A/B/C, scroll inside the frame). **Leonardo chose C, "System map"**: light, precise, the work is the hero.

He also confirmed he wants **more motion than the first mockups**. The v2 mockup level of dynamism (line-by-line headline reveals, scroll-driven flow drawing, magnetic buttons, tilt/glow cards, marquees, count-up numbers) is the floor, not the ceiling — but always smooth and calm, never flashy.

**Signature (to avoid the generic look):** C's structure and motion, warmed with elements of direction A:
- A distinctive type pairing, with a serif (italic) used for accent words/headlines, not a default sans everywhere.
- An accent color that is **not tech blue** (direction A's deep green `#2B4D3F` on warm paper is the starting point).
- A recurring "live log" motif (e.g. `→ 12 items extracted`, `✓ proposal #1043 exported to ERP`) used across the site.
- Real numbers and specific copy in Leonardo's voice.

The final palette, fonts and exact motion design are the builder's call within this direction (use the `frontend-design:frontend-design` skill). Leonardo reviews a visual before the full build.

## 5. Page structure (decided)

One page, anchored sections, sticky nav with section links and an **EN / PT switch**.

1. **Hero — live system map.** Headline + short lead + CTA (WhatsApp) + "See the work". Below, one of his systems runs live as a 5-step flow (AI quoting: client email → AI extracts items → match among 4,680 products → agent finds cost → proposal in ERP), each step with its tech label, with a progress rail and live log line.
2. **Problems I solve.** The 6 "pains" from the current site as cards with motion (tilt/glow, stack chips on hover). Each links to the project/demo that solves it (the last two have no demo).
3. **Work.** Scroll-driven "Every system is a flow" section: as the visitor scrolls, the path draws, a marker travels, each step lights up with its tech label; tabs switch between the 4 projects; side panel with description and count-up metrics. Each project also shows its screenshots (gallery/lightbox) and "In use" status.
4. **Try it.** All 4 interactive demos from the current site, fully working. Each keeps its own visual theme inside its phone/browser frame (they represent real client apps); the surrounding section uses the new design. Keep the "fictitious data, nothing is sent" notes and reset buttons.
5. **Method.** The 5 steps (text interview → approved scenarios → build with tests → documented delivery → evolution via tickets) plus the Gherkin scenario example.
6. **About (short).** Leonardo said a short About or none is fine, and gave no extra background. *Claude's call:* keep a **short** About: his photo (small, not in the hero) + one or two sentences built only from what the current site states (who he is, what he builds, Florianópolis, the "I write the scenarios with you before coding" approach). No invented background. It can be merged into the Contact section if that reads better (builder's call).
7. **Contact.** Large moving text ("Let's build it / Vamos construir" style), short invitation, **WhatsApp button**. Email button **hidden until the domain exists** (make it a single config value to turn on).
8. **Footer.** Name, city, note that images and demos use fictitious data.

A stack marquee (Python, FastAPI, React, TypeScript, PostgreSQL, Supabase, LLMs & agents, n8n, Pix, ERP integrations) may sit between sections.

## 6. Content

**Source of truth:** `reference/current-artifact/index.html` (the published artifact, pt-BR) and its images in `reference/current-artifact/img/`. All copy, project facts, metrics, demos and contact details come from there. Keep the meaning; rewrite and tighten the copy for the new design. Don't invent new facts or metrics.

**Projects (from the current site):**
- **App de pedidos (confeitaria/bakery):** own ordering channel, Pix, delivery fee by real distance, owner panel, agent-driven maintenance. 60+ versions in 3 days. Images: `pudim-2..5.jpg`.
- **Cabine de compras (B2B distributor):** email/spreadsheet → AI item extraction → semantic match among 4,680 products → agent pricing (65% accepted without correction) → ERP export. 224 proposals last month. Image: `cabine-2.jpg`.
- **CRM de prospecção:** agent runs cadence, reads replies, n8n routines. 347 companies last month, 16% reply rate. Image: `crm-2.jpg`.
- **Centro de distribuição:** operator app (DANFE in, AI matching, picking with measures/photo, DACTE out), freight vs CT-e. Images: `tlp-2..5.jpg`.

**Tech labels on flow steps:** use only tech the current site states (Python, FastAPI, Node.js, React, TypeScript, PWA, PostgreSQL, Supabase, LLMs, agents, semantic search, n8n, GitHub Actions, ERP, Pix, SEFAZ, carrier APIs, REST). Labels in the mockup like "pgvector", "Maps API", "Gmail API" were placeholders; replace with stated tech (e.g. "semantic search") unless Leonardo confirms.

**Photo:** `reference/photo/leonardo.jpg` (outdoors, natural smile, busy lake/trees background). Crop tight to head and shoulders and apply a subtle treatment so it fits the palette (softer colors or gentle tint). Show it in the visual review.

**Contact:** WhatsApp `+55 48 99940-6747`, link `https://wa.me/5548999406747` with a prefilled message in the page's language (current pt text: "Oi Leonardo, vi seu portfólio"; write an English equivalent).

## 7. Languages

- Two complete versions: **pt-BR** (source) and **English**. Everything translated, including demos (UI strings, product names where sensible, messages, hints, currency/number formatting per locale; prices can stay in BRL).
- English should read as natural, native-quality copy, not literal translation.
- URLs: `/pt-br/` and `/en/`.
- Root `/`: send the visitor to their browser language (pt → `/pt-br/`, else `/en/`), with a manual EN/PT switch in the nav that remembers the choice.
- Proper `lang` attributes, `hreflang` alternates, per-language titles and meta descriptions.

## 8. Tech and hosting (builder's calls, stated to Leonardo)

- **Astro + TypeScript**, static output, Astro's built-in i18n routing.
- Demos as client-side islands (vanilla TS or a light framework); port the existing demo logic rather than rewriting behavior.
- Motion: CSS + small JS (IntersectionObserver, scroll progress); a library such as GSAP/Lenis is acceptable if it earns its place.
- **Hosting: Cloudflare Pages** (free), deployed automatically from a GitHub repo on push. Domain connected later.
- **Setup is done by the builder, not Leonardo (his decision).** The builder creates the GitHub repo and the Cloudflare Pages project under **Leonardo's own accounts**, using CLIs he logs into (e.g. GitHub CLI, Wrangler) or **his Chrome browser** where a CLI isn't practical. Leonardo only handles logins/2FA when asked. Current machine state: Node.js and GitHub Desktop installed; `gh` and `wrangler` not installed. Repo visibility: public is fine for a portfolio unless Leonardo says otherwise (ask once at setup).
- Respect `prefers-reduced-motion` (all scroll/loop animation degrades to static, content still fully readable).
- Mobile-first quality: the flow section and demos must work well on phones.
- Fast: optimized images, self-hosted or properly loaded fonts, good Lighthouse scores.
- Light theme is the design target. Dark mode is optional (builder's call).

## 9. Constraints

- No backend; nothing in the demos sends data anywhere.
- No email shown until the domain exists.
- Keep client anonymity as in the current site (fictitious names/values in images and demos).
- Work in `C:\Users\VevecoPC\Documents\GitHub\portfolio` (currently not a git repo; initialize one).

## 10. Left to the builder

- Final palette, type pairing, spacing, exact motion choreography (within section 4).
- Copywriting and translation, faithful to the source facts.
- Component structure, file layout, tooling, image pipeline.
- Whether to add dark mode.
- 404 page and small delights, if they fit the direction.

## 11. Calls Claude made (not explicitly decided by Leonardo)

- Astro + TypeScript, Cloudflare Pages, GitHub (he handed tool choice to Claude).
- Language behavior: auto-detect at `/`, EN/PT switch that remembers the choice, `/en/` and `/pt-br/` URLs.
- Signature elements from direction A (serif accent, deep green instead of tech blue, live-log motif).
- Photo crop and color treatment.
- Short About built only from existing facts.
- Demos keep their own client-app themes inside device frames.
- Section order in section 5 (Leonardo approved the playback).

## 12. Review points with Leonardo

1. Visual of the hero + one section in the final palette/type (including the photo treatment) before building everything.
2. The English copy.
3. Full site on a preview URL before connecting the domain.
