import type { Locale } from '../i18n/locales';
import en from './en';
import ptBr from './pt-br';
import type { SiteContent } from './types';

const CONTENT: Record<Locale, SiteContent> = { en, 'pt-br': ptBr };

export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale];
}

export type * from './types';
