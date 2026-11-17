import { describe, expect, it } from 'vitest';
import {
  LOCALES,
  STORAGE_KEY,
  detectLocale,
  localePath,
  otherLocale,
  readSavedLocale,
  resolveLocale,
} from '../../src/i18n/locales';

describe('locales', () => {
  it('exposes both locales and the storage key', () => {
    expect(LOCALES).toEqual(['en', 'pt-br']);
    expect(STORAGE_KEY).toBe('lb-locale');
  });

  it('detectLocale uses the first browser language', () => {
    expect(detectLocale(['pt-BR'])).toBe('pt-br');
    expect(detectLocale(['pt-PT', 'en'])).toBe('pt-br');
    expect(detectLocale(['en-US', 'pt-BR'])).toBe('en');
    expect(detectLocale([])).toBe('en');
  });

  it('readSavedLocale accepts only known locales', () => {
    expect(readSavedLocale({ getItem: () => 'pt-br' })).toBe('pt-br');
    expect(readSavedLocale({ getItem: () => 'fr' })).toBeNull();
    expect(readSavedLocale(null)).toBeNull();
    expect(readSavedLocale(undefined)).toBeNull();
  });

  it('readSavedLocale returns null when storage throws', () => {
    const storage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
    };
    expect(readSavedLocale(storage)).toBeNull();
  });

  it('resolveLocale prefers the saved choice', () => {
    expect(resolveLocale('en', ['pt-BR'])).toBe('en');
    expect(resolveLocale(null, ['pt-BR'])).toBe('pt-br');
  });

  it('localePath and otherLocale', () => {
    expect(localePath('en')).toBe('/en/');
    expect(localePath('pt-br', '#demo-crm')).toBe('/pt-br/#demo-crm');
    expect(otherLocale('en')).toBe('pt-br');
    expect(otherLocale('pt-br')).toBe('en');
  });
});
