import type { Locale } from '../i18n/locales';

const INTL_LOCALE: Record<Locale, string> = { en: 'en-US', 'pt-br': 'pt-BR' };

/** Prices stay in BRL in both languages; only the formatting changes. */
export function formatBRL(value: number, locale: Locale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], { style: 'currency', currency: 'BRL' }).format(
    value,
  );
}

export function formatNumber(value: number, locale: Locale, fractionDigits?: number): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
