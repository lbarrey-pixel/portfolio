import en from './en';
import type { Project } from './types';

/**
 * English-only page for recruiters (/hire/).
 * Numbers and system facts come from src/content/en.ts and the public READMEs.
 * The page does not link to the sales pages.
 */

export const HIRE_LINKS = {
  github: 'https://github.com/lbarrey-pixel',
  linkedin: 'https://www.linkedin.com/in/leonardobarrey',
  email: 'leonardobarrey@gmail.com',
} as const;

const REPOS = {
  quoting: 'https://github.com/lbarrey-pixel/cotador',
  bakery: 'https://github.com/lbarrey-pixel/doce-pedidos',
  crm: 'https://github.com/lbarrey-pixel/prospect-flow',
  warehouse: 'https://github.com/lbarrey-pixel/cross-dock',
  painel: 'https://github.com/lbarrey-pixel/painel-mei',
} as const;

function project(
  id: Project['id'],
  over: Pick<Project, 'title' | 'summary' | 'bullets' | 'tags'> & { repoLabel: string },
): Project & { repo: { href: string; label: string } } {
  const base = en.work.projects.find((p) => p.id === id);
  if (!base) throw new Error(`missing project ${id}`);
  return {
    ...base,
    title: over.title,
    summary: over.summary,
    bullets: over.bullets,
    tags: over.tags,
    tryLabel: base.tryLabel,
    repo: { href: REPOS[id], label: over.repoLabel },
  };
}

const quoting = en.work.projects[0];

const hire = {
  meta: {
    title: 'Leonardo Barrey · AI-native full-stack engineer',
    description:
      'Full-stack engineer in Florianópolis, Brazil (UTC−3), open to remote mid-level roles in the US, Canada and Europe. Selected case studies and working demos.',
  },

  links: HIRE_LINKS,

  hero: {
    tag: 'Florianópolis, Brazil · UTC−3 · Remote',
    headline: 'Leonardo Barrey',
    accent: 'AI-Native Full-Stack Engineer',
    lead: 'I build operational systems in Python, FastAPI, React, TypeScript and PostgreSQL, and I use AI coding tools with the test suite as the gate. Open to remote mid-level AI Engineer and Full-Stack roles at startups and consultancies in the US, Canada and Europe.',
    ctas: [
      { label: 'GitHub', href: HIRE_LINKS.github },
      { label: 'LinkedIn', href: HIRE_LINKS.linkedin },
      { label: 'Email', href: `mailto:${HIRE_LINKS.email}` },
    ],
    mapCaption: quoting.tab,
    mapSteps: quoting.steps,
    mapLog: en.hero.mapLog,
  },

  stackLabel: 'Stack',
  stack: [...en.stack],

  work: {
    eyebrow: 'Selected recent work',
    title: 'Some of the systems I\'ve built recently',
    lead: 'A sample, not a full list. The public repositories are portfolio versions: fictional brands and data, and the production code is private. The counts below are from these running systems. Screenshots and demos use fictional data.',
    progressHint: en.work.progressHint,
    projects: [
      project('quoting', {
        title: 'From a quote email to an ERP import file',
        summary:
          'The request comes in as email, a spreadsheet, a PDF or a screenshot. The desk extracts the lines, matches the catalog and writes the CSV the ERP imports. The operator confirms every line.',
        bullets: [
          {
            label: 'Problem',
            text: 'B2B quote requests arrive in a different shape every time. Looking each item up by hand is slow, and a silent mismatch (a 24-port switch where the request said 48) is the expensive error.',
          },
          {
            label: 'Built',
            text: 'Ingestion, extraction, catalog match and an ERP-ready CSV. A confirmation is stored as memory for the next quote. The system suggests and records; it does not decide on its own.',
          },
          {
            label: 'Stack',
            text: 'Python, FastAPI, pydantic and PostgreSQL. Matching is three layers: confirmed-pair memory, then pg_trgm candidates (top 40), then an LLM that only chooses among those candidates. Critical attributes such as ports, cable category, voltage and gauge drop a candidate before the model sees it. GitHub Actions runs the tests against Postgres. Decisions are in ADR 0001 and ADR 0003.',
          },
        ],
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'pg_trgm', 'React'],
        repoLabel: 'cotador',
      }),
      project('bakery', {
        title: 'Phone ordering, a distance-based fee, and Pix',
        summary:
          'Customers order on the phone, see a delivery fee from the street distance and pay by Pix. The owner runs orders, production and two stock locations from one dashboard, and asks for changes by ticket.',
        bullets: [
          {
            label: 'Problem',
            text: 'The bakery sold by message, tracked stock from memory, guessed the delivery fee and gave a cut of each app order to the marketplace.',
          },
          {
            label: 'Built',
            text: 'An installable PWA. Money is integer cents. Stock is an append-only movement ledger. The server re-checks a payment with the gateway before it counts, and falls back to a Pix copy-and-paste code. The owner opens a ticket; an agent fixes, tests and ships the change, and keeps the previous version.',
          },
          {
            label: 'Stack',
            text: 'Python, FastAPI, PostgreSQL and React. Domain rules sit behind ports for the router, Pix and the checkout gateway. Database grants are limited to the API role. pytest, Vitest and GitHub Actions. ADRs 0001–0007.',
          },
        ],
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'PWA', 'Pix'],
        repoLabel: 'doce-pedidos',
      }),
      project('crm', {
        title: 'The agent drafts. The API decides what may be sent.',
        summary:
          'The agent writes the outreach and may refuse a task, always with a reason. A send happens only when it passes the rules in the API. n8n runs the clock, the inbox and SMTP, and does not decide.',
        bullets: [
          {
            label: 'Problem',
            text: 'The company list existed, and nobody had time to write, read the replies and set the next step. An agent sending mail with no cap would also be a problem.',
          },
          {
            label: 'Built',
            text: 'Daily cap, spacing, round limit and a sending window live in the API, with no I/O. The operator approves guideline changes and can veto. When a reply arrives, a model classifies the interest as real or generic, and a provider failure does not drop the message.',
          },
          {
            label: 'Stack',
            text: 'Python, FastAPI, plain SQL on PostgreSQL, n8n workflows generated from code, and a React board. API keys are stored only as hashes. Sends are idempotent with SKIP LOCKED and dedup keys. pytest runs against Postgres. ADRs 0001–0004.',
          },
        ],
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'n8n', 'React'],
        repoLabel: 'prospect-flow',
      }),
      project('warehouse', {
        title: 'Receive, pick and ship, with the invoice and the freight checked',
        summary:
          'The warehouse scans the DANFE, the official NF-e XML comes from SEFAZ, and each item is suggested against the sales order. The operator confirms. Shipping stays blocked until the outgoing invoice matches the measured volume and weight.',
        bullets: [
          {
            label: 'Problem',
            text: 'Supplier invoices arrived on paper, the item text rarely matched the sales order, and the freight on the bill showed up weeks later with nobody comparing it to the quote.',
          },
          {
            label: 'Built',
            text: 'Scan the DANFE, fetch the XML from SEFAZ, confirm the match, consolidate, measure the packages, check the ERP invoice against that measurement, scan the DACTE, then compare the quoted freight with the CT-e. Two roles: the seller and the warehouse. The warehouse sees an order only after consolidation is opened.',
          },
          {
            label: 'Stack',
            text: 'PostgreSQL on Supabase. Row Level Security separates the roles, and the business rules live in security-definer functions. Deno edge functions, a Node mTLS gateway for the SEFAZ certificate, and the carrier API for quotes and tracking. Matching is explainable scoring first; the LLM is an optional tie-breaker. ADR 0003 and ADR 0004.',
          },
        ],
        tags: ['PostgreSQL', 'Supabase', 'TypeScript', 'SEFAZ', 'Deno'],
        repoLabel: 'cross-dock',
      }),
    ],
  },

  tryIt: {
    ...en.tryIt,
    eyebrow: 'Demos',
    title: 'A few of them, running in the browser',
    lead: 'Short samples of the systems above, on fictional data. Nothing on this page is sent anywhere. The counts in the case studies are separate from these screens.',
  },

  method: {
    eyebrow: 'How I work',
    title: 'A scenario is approved before it is built',
    lead: 'The same sequence each time: a written behavior, a test that locks it, a record of the decision, and CI. AI coding tools are in that sequence. They are not a way around it.',
    steps: [
      {
        title: 'Written scenarios',
        text: 'Each behavior is written as an acceptance scenario, using the operation\'s own data, and approved before implementation.',
      },
      {
        title: 'Tests from the scenarios',
        text: 'Every approved scenario becomes an automated test. Nothing ships until that suite passes.',
      },
      {
        title: 'ADRs',
        text: 'Decisions that are expensive to reverse are written down in the repository: matching before the model, stock as a ledger, n8n as a task list, access rules in the database.',
      },
      {
        title: 'GitHub Actions',
        text: 'Lint and tests run on GitHub Actions. On the Python services, pytest runs against PostgreSQL.',
      },
      {
        title: 'AI tools, behind the gate',
        text: 'I use AI coding tools from the spec through the change, including the agent that turns an owner\'s ticket into a tested deploy. A change is done when the tests pass, and when access rules, hashed credentials and payment checks have been reviewed against the tests that lock them.',
      },
    ],
    scenarioTitle: en.method.scenarioTitle,
    scenarioLead: en.method.scenarioLead,
    scenario: en.method.scenario.map((line) => ({ ...line })),
  },

  experience: {
    eyebrow: 'Experience',
    title: 'Kist Soluções',
    photoAlt: en.about.photoAlt,
    text: 'Co-founder since 2013, and lead software engineer since 2023. Before 2023 the work was IT products and small Python automations on Arduino and Raspberry Pi for local ISPs. From 2008 to 2013, support and PHP roles.',
    roles: [
      { label: 'Co-founder', detail: 'Kist Soluções · 2013 – Present' },
      { label: 'Lead software engineer', detail: 'Kist Soluções · 2023 – Present' },
      { label: 'Before 2023', detail: 'IT products and small Python automations on Arduino and Raspberry Pi for local ISPs' },
      { label: '2008 – 2013', detail: 'Support and PHP roles' },
    ],
    also: {
      label: 'Also public',
      text: 'Painel MEI is a Next.js 16 admin panel on Supabase. There is no custom API: access is Row Level Security in a versioned migration, and GitHub Actions applies that migration to a clean Postgres and runs the RLS test. CNPJ check digits are validated in the client and again by a database constraint.',
      repoLabel: 'painel-mei',
      href: REPOS.painel,
    },
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Email, LinkedIn or GitHub',
    text: 'For a role, write to leonardobarrey@gmail.com. The repositories linked on this page are portfolio versions, with fictional data.',
    marquee: ['Remote roles', 'US · Canada · Europe', 'UTC−3'],
    actions: [
      { label: 'Email', href: `mailto:${HIRE_LINKS.email}`, primary: true },
      { label: 'LinkedIn', href: HIRE_LINKS.linkedin, primary: false },
      { label: 'GitHub', href: HIRE_LINKS.github, primary: false },
    ],
  },
};

export default hire;

export type HireContent = typeof hire;
