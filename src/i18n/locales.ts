export type Locale = 'en' | 'pt-br';

export const LOCALES: readonly Locale[] = ['en', 'pt-br'];
export const STORAGE_KEY = 'lb-locale';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** pt* as the browser's first language → pt-br; anything else → en. */
export function detectLocale(languages: readonly string[]): Locale {
  const first = languages[0]?.toLowerCase() ?? '';
  return first === 'pt' || first.startsWith('pt-') ? 'pt-br' : 'en';
}

/** Reads the remembered choice; never throws (storage can be blocked). */
export function readSavedLocale(
  storage: Pick<Storage, 'getItem'> | null | undefined,
): Locale | null {
  try {
    const value = storage?.getItem(STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function resolveLocale(saved: Locale | null, languages: readonly string[]): Locale {
  return saved ?? detectLocale(languages);
}

/** Languages from an Accept-Language header, most wanted first ("en;q=0.5, pt-BR" → ['pt-BR', 'en']). */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  return (header ?? '')
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const weight = q === undefined ? 1 : Number(q.slice(2));
      return { tag: tag.trim(), weight: Number.isNaN(weight) ? 0 : weight, index };
    })
    .filter((l) => /^[a-z]{1,8}(-[a-z0-9]{1,8})*$/i.test(l.tag) && l.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index)
    .map((l) => l.tag);
}

/** The language remembered in the `lb-locale` cookie (set by the EN/PT switch), if any. */
export function readCookieLocale(cookieHeader: string | null | undefined): Locale | null {
  for (const pair of (cookieHeader ?? '').split(';')) {
    const [name, value] = pair.trim().split('=');
    if (name === STORAGE_KEY) return isLocale(value) ? value : null;
  }
  return null;
}

/** Which language a request to "/" should get: the remembered choice, else the browser's language. */
export function localeFromRequest(
  cookieHeader: string | null | undefined,
  acceptLanguage: string | null | undefined,
): Locale {
  return resolveLocale(readCookieLocale(cookieHeader), parseAcceptLanguage(acceptLanguage));
}

export function otherLocale(l: Locale): Locale {
  return l === 'en' ? 'pt-br' : 'en';
}

export function localePath(l: Locale, hash?: string): string {
  const h = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
  return `/${l}/${h}`;
}
