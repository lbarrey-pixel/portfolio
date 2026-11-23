import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getContent } from '../../src/content';
import type { Locale } from '../../src/i18n/locales';

const locales: Locale[] = ['en', 'pt-br'];
const projectsDir = fileURLToPath(new URL('../../src/assets/projects/', import.meta.url));

// Stated tech (global constraints), plus the pt-BR forms the source page itself uses.
const ALLOWED_TECH = [
  'Python', 'FastAPI', 'Node.js', 'React', 'TypeScript', 'PWA', 'PostgreSQL', 'Supabase',
  'LLMs', 'agents', 'semantic search', 'n8n', 'GitHub Actions', 'ERP', 'Pix', 'SEFAZ',
  'carrier APIs', 'REST',
  'agentes', 'busca semântica', 'APIs de transportadora',
].map((t) => t.toLowerCase());

function stringLeaves(value: unknown, path = ''): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => stringLeaves(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => stringLeaves(v, path ? `${path}.${k}` : k));
  }
  return [];
}

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((k) => [k, shape((value as Record<string, unknown>)[k])]),
    );
  }
  return typeof value;
}

describe('content', () => {
  for (const locale of locales) {
    describe(locale, () => {
      const c = getContent(locale);

      it('has no empty strings', () => {
        const empty = stringLeaves(c).filter(([, v]) => v.trim() === '').map(([p]) => p);
        expect(empty).toEqual([]);
      });

      it('lists the four projects in order', () => {
        expect(c.work.projects.map((p) => p.id)).toEqual(['quoting', 'bakery', 'crm', 'warehouse']);
      });

      it('has 6 pains and 5 method steps', () => {
        expect(c.pains.items).toHaveLength(6);
        expect(c.method.steps).toHaveLength(5);
      });

      it('uses only stated tech on flow steps', () => {
        const bad = c.work.projects
          .flatMap((p) => p.steps.flatMap((s) => s.tech.split(' · ')))
          .filter((t) => !ALLOWED_TECH.includes(t.toLowerCase()));
        expect(bad).toEqual([]);
      });

      it('references existing project images', () => {
        const missing = c.work.projects
          .flatMap((p) => p.images.map((i) => i.file))
          .filter((f) => !existsSync(projectsDir + f));
        expect(missing).toEqual([]);
      });

      it('carries the source metrics', () => {
        const values = (id: string) =>
          c.work.projects.find((p) => p.id === id)!.metrics.map((m) => m.value);
        expect(values('quoting')).toEqual(expect.arrayContaining([224, 65, 5000]));
        expect(values('bakery')).toEqual(expect.arrayContaining([60]));
        expect(values('crm')).toEqual(expect.arrayContaining([347, 16]));
      });
    });
  }

  it('en and pt-br have identical structure', () => {
    expect(shape(getContent('en'))).toEqual(shape(getContent('pt-br')));
  });
});
