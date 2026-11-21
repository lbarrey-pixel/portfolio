import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import en from '../../src/content/en';
import hire from '../../src/content/hire';
import { getContent } from '../../src/content';

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

const ALLOWED = (href: string) =>
  href.startsWith('#') ||
  href.startsWith('https://github.com/lbarrey-pixel') ||
  href === 'https://www.linkedin.com/in/leonardobarrey' ||
  href === 'mailto:leonardobarrey@gmail.com' ||
  href === '/Leonardo_Barrey_CV.pdf';

describe('hire content', () => {
  const text = strings(hire);

  it('has no empty strings', () => {
    expect(text.filter((v) => v.trim() === '')).toEqual([]);
  });

  it('does not mention WhatsApp or the sales pages', () => {
    const blob = text.join('\n');
    expect(blob.toLowerCase()).not.toContain('whatsapp');
    expect(blob).not.toContain('/en/');
    expect(blob).not.toContain('/pt-br/');
    expect(blob).not.toContain('wa.me');
  });

  it('only links to GitHub, LinkedIn and email', () => {
    const hrefs = text.filter((v) => /^(https?:|mailto:|\/)/.test(v));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => !ALLOWED(href))).toEqual([]);
    expect(hrefs).toEqual(
      expect.arrayContaining([
        'https://github.com/lbarrey-pixel',
        'https://github.com/lbarrey-pixel/cotador',
        'https://github.com/lbarrey-pixel/doce-pedidos',
        'https://github.com/lbarrey-pixel/prospect-flow',
        'https://github.com/lbarrey-pixel/cross-dock',
        'https://github.com/lbarrey-pixel/painel-mei',
        'https://www.linkedin.com/in/leonardobarrey',
        'mailto:leonardobarrey@gmail.com',
        '/Leonardo_Barrey_CV.pdf',
      ]),
    );
  });

  it('keeps the production counts from the English sales page', () => {
    const values = (id: string) => hire.work.projects.find((p) => p.id === id)!.metrics.map((m) => m.value);
    expect(values('quoting')).toEqual(en.work.projects.find((p) => p.id === 'quoting')!.metrics.map((m) => m.value));
    expect(values('bakery')).toEqual([2]);
    expect(values('crm')).toEqual(en.work.projects.find((p) => p.id === 'crm')!.metrics.map((m) => m.value));
    expect(values('warehouse')).toEqual(en.work.projects.find((p) => p.id === 'warehouse')!.metrics.map((m) => m.value));
    expect(values('quoting')).toEqual([224, 65, 4680]);
    expect(values('crm')).toEqual([347, 16]);
  });

  it('keeps the five-step flows and a recruiter-facing build section', () => {
    expect(hire.method.title).toBe('How I build');
    expect(hire.method.steps).toHaveLength(4);
    expect(hire.method).not.toHaveProperty('scenario');
    const methodText = [hire.method.eyebrow, hire.method.title, hire.method.lead, ...hire.method.steps.flatMap((s) => [s.title, s.text])].join('\n');
    expect(methodText).toMatch(/acceptance criteria/i);
    expect(methodText).toMatch(/scenarios/i);
    expect(methodText).toMatch(/AI-assisted development/);
    expect(methodText).toMatch(/documentation/i);
    expect(methodText).toMatch(/from requirements to production/i);
    expect(methodText).not.toMatch(/your business|we deliver|pricing|discovery|whatsapp|owner/i);
    expect(methodText).not.toMatch(/\d|GitHub Actions|pytest|FastAPI|n8n|PostgreSQL/);
    for (const project of hire.work.projects) {
      const source = en.work.projects.find((p) => p.id === project.id)!;
      expect(project.steps).toEqual(source.steps);
      expect(project.images).toEqual(source.images);
    }
  });

  it('states the soft skills from the track record, without studies', () => {
    const traitsText = [hire.traits.eyebrow, hire.traits.title, hire.traits.lead, ...hire.traits.items.flatMap((item) => [item.title, item.text])].join('\n');
    expect(traitsText).toMatch(/real business problem|actually there/i);
    expect(traitsText).toMatch(/spec and acceptance criteria/i);
    expect(traitsText).toMatch(/not engineers/i);
    expect(traitsText).toMatch(/co-founded a B2B/i);
    expect(traitsText).toMatch(/2013/);
    expect(traitsText).toMatch(/board member/i);
    expect(traitsText).toMatch(/not involved in day-to-day operations/i);
    expect(traitsText).not.toMatch(/automated now|does not need me|no longer need/i);
    expect(traitsText).toMatch(/async/i);
    expect(traitsText).toMatch(/UTC−3/);
    expect(traitsText).toMatch(/new tools/i);
    expect(traitsText).not.toMatch(/steady/i);
    expect(traitsText).not.toMatch(/from requirements to production/i);
    expect(traitsText).not.toMatch(/ADS|college|universit|studying|Systems Analysis/i);
    expect(traitsText).not.toMatch(/your business|we deliver|pricing|discovery|whatsapp/i);
  });

  it('names the case studies in the sales-page order', () => {
    expect(hire.work.projects.map((p) => p.id)).toEqual(['quoting', 'bakery', 'crm', 'warehouse']);
  });

  it('frames the work as a sample and does not count the projects', () => {
    const shown = [
      hire.meta.description,
      hire.hero.lead,
      hire.work.eyebrow,
      hire.work.title,
      hire.work.lead,
      hire.tryIt.eyebrow,
      hire.tryIt.title,
      hire.tryIt.lead,
      hire.contact.text,
    ].join('\n');
    expect(shown).toMatch(/sample|selected/i);
    expect(shown).not.toMatch(/\bfour\b/i);
    expect(shown).not.toMatch(/\b4\s+(systems|projects|case)/i);
    expect(shown).not.toMatch(/\b(01|02|03|04)\b/);
    // Flow-step codes stay. They number the steps of one system, not the list of systems.
    expect(hire.work.projects[0].steps.map((s) => s.code)).toEqual(en.work.projects[0].steps.map((s) => s.code));
  });

  it('does not narrow the role by seniority, company type, or region', () => {
    const blob = text.join('\n');
    expect(blob).toMatch(/Open to remote roles/);
    expect(blob).toMatch(/Florianópolis, Brazil/);
    expect(blob).toContain('UTC−3');
    expect(blob).not.toMatch(/mid-level|startup|consultanc/i);
    expect(blob).not.toMatch(/\b(US|Canada|Europe)\b/);
  });

  it('keeps the fictional-data note in the work intro only', () => {
    const fict = text.filter((v) => /fictitious|fictional/i.test(v));
    expect(fict).toEqual([hire.work.lead]);
  });

  it('lists the roles before Kist and keeps one bakery metric', () => {
    expect(hire.hero.lead).toMatch(/15\+ years in IT/);
    expect(hire.experience.roles.map((r) => r.label)).toContain('Before Kist');
    expect(hire.experience.roles.find((r) => r.label === 'Before Kist')!.detail).toMatch(/AT&IT/);
    expect(hire.experience.roles.find((r) => r.label === 'Before Kist')!.detail).toMatch(/Poliedro/);
    expect(hire.work.projects.find((p) => p.id === 'bakery')!.bullets.map((b) => b.text).join(' ')).not.toMatch(/marketplace/i);
  });
});

describe('sales pages do not point at /hire/', () => {
  it('keeps /hire/ out of both languages', () => {
    expect(JSON.stringify(getContent('en'))).not.toContain('/hire');
    expect(JSON.stringify(getContent('pt-br'))).not.toContain('/hire');
  });
});

/** Cloudflare rejects a splat that also covers a more specific rule ("/hire/*" and "/hire/"). */
function hasOverlappingRules(routes: string[]): boolean {
  const splats = routes.filter((route) => route.endsWith('/*'));
  return splats.some((splat) => {
    const prefix = splat.slice(0, -1);
    return routes.some((route) => route !== splat && route.startsWith(prefix));
  });
}

describe('Cloudflare routes', () => {
  const routes = JSON.parse(readFileSync(new URL('../../public/_routes.json', import.meta.url), 'utf8'));

  it('runs the redirect function only on /, and keeps /hire/ a static file', () => {
    expect(routes.version).toBe(1);
    expect(routes.include).toEqual(['/']);
    expect(routes.include.some((rule: string) => rule === '/*' || rule.startsWith('/hire'))).toBe(false);
    expect(hasOverlappingRules(routes.include)).toBe(false);
    expect(hasOverlappingRules(routes.exclude)).toBe(false);
    expect(routes.include.length + routes.exclude.length).toBeLessThanOrEqual(100);
    for (const rule of [...routes.include, ...routes.exclude]) {
      expect(rule.startsWith('/')).toBe(true);
      expect(rule.length).toBeLessThanOrEqual(100);
    }
  });
});
