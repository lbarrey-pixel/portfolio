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

  it('names the four case studies in the sales-page order', () => {
    expect(hire.work.projects.map((p) => p.id)).toEqual(['quoting', 'bakery', 'crm', 'warehouse']);
  });
});

describe('sales pages do not point at /hire/', () => {
  it('keeps /hire/ out of both languages', () => {
    expect(JSON.stringify(getContent('en'))).not.toContain('/hire');
    expect(JSON.stringify(getContent('pt-br'))).not.toContain('/hire');
  });
});

describe('Cloudflare routes', () => {
  const routes = JSON.parse(readFileSync(new URL('../../public/_routes.json', import.meta.url), 'utf8'));

  it('runs the redirect function only on /, and keeps /hire/ static', () => {
    expect(routes.include).toEqual(['/']);
    expect(routes.exclude).toEqual(expect.arrayContaining(['/hire', '/hire/', '/hire/*']));
  });
});
