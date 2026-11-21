import { describe, expect, it } from 'vitest';
import { onRequest } from '../../functions/index';
import { localeFromRequest, parseAcceptLanguage, readCookieLocale } from '../../src/i18n/locales';

describe('parseAcceptLanguage', () => {
  it('orders languages by their q value, highest first', () => {
    expect(parseAcceptLanguage('en-US,en;q=0.9,pt-BR;q=0.8')).toEqual(['en-US', 'en', 'pt-BR']);
    expect(parseAcceptLanguage('en;q=0.5, pt-BR')).toEqual(['pt-BR', 'en']);
    expect(parseAcceptLanguage('pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7')).toEqual(['pt-BR', 'pt', 'en-US', 'en']);
  });

  it('ignores wildcards, refused languages and junk', () => {
    expect(parseAcceptLanguage('*')).toEqual([]);
    expect(parseAcceptLanguage('pt;q=0, en')).toEqual(['en']);
    expect(parseAcceptLanguage(';;q=abc,, fr ;q=0.3')).toEqual(['fr']);
  });

  it('handles a missing header', () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage(undefined)).toEqual([]);
    expect(parseAcceptLanguage('')).toEqual([]);
  });
});

describe('readCookieLocale', () => {
  it('finds the remembered language among other cookies', () => {
    expect(readCookieLocale('a=1; lb-locale=pt-br; b=2')).toBe('pt-br');
    expect(readCookieLocale('lb-locale=en')).toBe('en');
  });

  it('ignores a missing or unknown value', () => {
    expect(readCookieLocale('lb-locale=fr')).toBeNull();
    expect(readCookieLocale('xlb-locale=en')).toBeNull();
    expect(readCookieLocale('')).toBeNull();
    expect(readCookieLocale(null)).toBeNull();
  });
});

describe('localeFromRequest', () => {
  it('uses the browser language when nothing was chosen', () => {
    expect(localeFromRequest(null, 'pt-BR,pt;q=0.9,en;q=0.8')).toBe('pt-br');
    expect(localeFromRequest(null, 'en-US,en;q=0.9,pt-BR;q=0.8')).toBe('en');
    expect(localeFromRequest(null, 'de-DE,de;q=0.9')).toBe('en');
    expect(localeFromRequest(null, null)).toBe('en');
  });

  it('lets the remembered choice win over the browser language', () => {
    expect(localeFromRequest('lb-locale=en', 'pt-BR')).toBe('en');
    expect(localeFromRequest('lb-locale=pt-br', 'en-US')).toBe('pt-br');
  });
});

describe('root redirect function', () => {
  const call = (headers: Record<string, string>, method = 'GET', path = '/') =>
    onRequest({
      request: new Request(`https://example.com${path}`, { method, headers }),
      next: async () => new Response('static page', { status: 200 }),
    });

  it('sends a Portuguese browser to /pt-br/', async () => {
    const res = await call({ 'Accept-Language': 'pt-BR,pt;q=0.9' });
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/pt-br/');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(res.headers.get('Vary')).toContain('Accept-Language');
  });

  it('sends everyone else to /en/', async () => {
    const res = await call({ 'Accept-Language': 'fr-FR,fr;q=0.9' });
    expect(res.headers.get('Location')).toBe('/en/');
    expect((await call({})).headers.get('Location')).toBe('/en/');
  });

  it('respects the language chosen with the EN/PT switch', async () => {
    const res = await call({ 'Accept-Language': 'pt-BR', Cookie: 'lb-locale=en' });
    expect(res.headers.get('Location')).toBe('/en/');
  });

  it('keeps the query string', async () => {
    const res = await call({ 'Accept-Language': 'pt-BR' }, 'GET', '/?utm_source=whatsapp');
    expect(res.headers.get('Location')).toBe('/pt-br/?utm_source=whatsapp');
  });

  it('leaves other methods and other paths to the static site', async () => {
    expect((await call({}, 'POST')).status).toBe(200);
    expect(await (await call({}, 'GET', '/en/')).text()).toBe('static page');
  });

  it('does not redirect /hire/', async () => {
    expect((await call({}, 'GET', '/hire/')).status).toBe(200);
    expect(await (await call({}, 'GET', '/hire/')).text()).toBe('static page');
    expect(await (await call({ 'Accept-Language': 'pt-BR', Cookie: 'lb-locale=pt-br' }, 'GET', '/hire')).text()).toBe(
      'static page',
    );
  });
});
