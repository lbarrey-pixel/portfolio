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

export function otherLocale(l: Locale): Locale {
  return l === 'en' ? 'pt-br' : 'en';
}

export function localePath(l: Locale, hash?: string): string {
  const h = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
  return `/${l}/${h}`;
}
