import type { Locale } from '../i18n/locales';

export type DemoId = 'quoting' | 'bakery' | 'crm' | 'warehouse';

export interface DemoHandle {
  /** Put the demo back to its first screen. */
  reset(): void;
}

/** Builds a demo inside `root`. Nothing a demo does leaves the page. */
export type DemoMount = (root: HTMLElement, locale: Locale) => DemoHandle;
