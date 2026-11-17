export interface Metric { value: number; prefix?: string; suffix?: string; label: string }

/** One step of a project's data flow. `code` e.g. '01 · IN'; `tech` may hold several labels joined by ' · '. */
export interface FlowStep { code: string; title: string; tech: string }

export type ProjectId = 'quoting' | 'bakery' | 'crm' | 'warehouse';

export interface Project {
  id: ProjectId;
  tab: string;
  kind: string;
  title: string;
  bullets: { label: string; text: string }[];
  tags: string[];
  status: string;
  summary: string;
  steps: [FlowStep, FlowStep, FlowStep, FlowStep, FlowStep];
  metrics: Metric[];
  /** `file` is a bare filename in src/assets/projects/. */
  images: { file: string; caption: string; alt: string }[];
  tryLabel: string;
}

export interface Pain {
  title: string;
  problem: string;
  answerLabel: string;
  answer: string;
  demo?: Project['id'];
  linkLabel?: string;
}

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
