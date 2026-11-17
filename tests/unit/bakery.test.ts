import { describe, expect, it } from 'vitest';
import {
  cartCount,
  cartSubtotal,
  deliveryFee,
  EXAMPLE_KM,
  isCompleteCep,
  normalizeCep,
} from '../../src/demos/bakery/logic';
import { strings } from '../../src/demos/bakery/strings';

describe('bakery logic', () => {
  it('charges delivery by distance band', () => {
    expect(deliveryFee(2)).toBe(10);
    expect(deliveryFee(3)).toBe(10);
    expect(deliveryFee(4.2)).toBe(14);
    expect(deliveryFee(5)).toBe(14);
    expect(deliveryFee(5.1)).toBe(18);
  });

  it('the example address is 4.2 km away, which costs R$ 14', () => {
    expect(EXAMPLE_KM).toBe(4.2);
    expect(deliveryFee(EXAMPLE_KM)).toBe(14);
  });

  it('keeps only the digits of a CEP, at most 8', () => {
    expect(normalizeCep('88010-000')).toBe('88010000');
    expect(normalizeCep('88010-000123')).toBe('88010000');
    expect(normalizeCep('ab 8801')).toBe('8801');
  });

  it('knows when a CEP is complete', () => {
    expect(isCompleteCep('8801')).toBe(false);
    expect(isCompleteCep('')).toBe(false);
    expect(isCompleteCep('88010-000')).toBe(true);
  });

  it('counts and prices the cart', () => {
    const menu = strings.en.menu;
    expect(cartCount({})).toBe(0);
    expect(cartCount({ ch: 2, fa: 1 })).toBe(3);
    expect(cartSubtotal({}, menu)).toBe(0);
    expect(cartSubtotal({ ch: 2, fa: 1 }, menu)).toBeCloseTo(129.7, 2);
    expect(cartSubtotal({ unknown: 3 }, menu)).toBe(0);
  });
});

describe('bakery strings', () => {
  it('has the same keys in both languages, all filled in', () => {
    const { menu: enMenu, ...en } = strings.en;
    const { menu: ptMenu, ...pt } = strings['pt-br'];
    expect(Object.keys(en).sort()).toEqual(Object.keys(pt).sort());
    for (const value of [...Object.values(en), ...Object.values(pt)]) {
      expect(typeof value).toBe('string');
      expect(value).not.toBe('');
    }
    expect(enMenu).toHaveLength(ptMenu.length);
  });

  it('has the same menu ids and prices in both languages', () => {
    for (const locale of ['en', 'pt-br'] as const) {
      expect(strings[locale].menu.map((i) => [i.id, i.price])).toEqual([
        ['ch', 19.9],
        ['dl', 19.9],
        ['lc', 17.9],
        ['pn', 21.9],
        ['fa', 89.9],
      ]);
      for (const item of strings[locale].menu) {
        expect(item.name).not.toBe('');
        expect(item.detail).not.toBe('');
      }
    }
  });

  it('keeps the example CEP from the original demo', () => {
    expect(strings.en.exampleCep).toBe('88010-000');
    expect(strings['pt-br'].exampleCep).toBe('88010-000');
  });
});
