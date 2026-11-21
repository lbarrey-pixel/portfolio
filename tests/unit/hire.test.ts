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
  href === 'mailto:leonardobarrey@gmail.com';

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
      ]),
    );
  });

  it('keeps the production counts from the English sales page', () => {
    const values = (id: string) => hire.work.projects.find((p) => p.id === id)!.metrics.map((m) => m.value);
    expect(values('quoting')).toEqual(en.work.projects.find((p) => p.id === 'quoting')!.metrics.map((m) => m.value));
    expect(values('bakery')).toEqual(en.work.projects.find((p) => p.id === 'bakery')!.metrics.map((m) => m.value));
    expect(values('crm')).toEqual(en.work.projects.find((p) => p.id === 'crm')!.metrics.map((m) => m.value));
    expect(values('warehouse')).toEqual(en.work.projects.find((p) => p.id === 'warehouse')!.metrics.map((m) => m.value));
    expect(values('quoting')).toEqual([224, 65, 4680]);
    expect(values('crm')).toEqual([347, 16]);
  });

  it('reuses the approved scenario and the five-step flows', () => {
    expect(hire.method.scenario).toEqual(en.method.scenario);
    expect(hire.method.steps).toHaveLength(5);
    for (const project of hire.work.projects) {
      const source = en.work.projects.find((p) => p.id === project.id)!;
      expect(project.steps).toEqual(source.steps);
      expect(project.images).toEqual(source.images);
    }
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
