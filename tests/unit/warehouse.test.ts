import { describe, expect, it } from 'vitest';
import { cubage, ITEMS, parseDecimal } from '../../src/demos/warehouse/logic';
import { strings } from '../../src/demos/warehouse/strings';
import { leaves, shape } from './helpers';

describe('warehouse logic', () => {
  it('reads decimals written with a comma or a point', () => {
    expect(parseDecimal('6,2')).toBe(6.2);
    expect(parseDecimal('6.2')).toBe(6.2);
    expect(parseDecimal(40)).toBe(40);
    expect(parseDecimal(' 30 ')).toBe(30);
  });

  it('reads anything that is not a number as 0', () => {
    expect(parseDecimal('abc')).toBe(0);
    expect(parseDecimal('')).toBe(0);
    expect(parseDecimal(undefined)).toBe(0);
    expect(parseDecimal(null)).toBe(0);
    expect(parseDecimal('12abc')).toBe(0);
    expect(parseDecimal(NaN)).toBe(0);
    expect(parseDecimal(Infinity)).toBe(0);
  });

  it('works out the volume in cubic metres from centimetres', () => {
    expect(cubage({ c: 40, l: 30, a: 25 })).toBeCloseTo(0.03, 6);
    expect(cubage({ c: '40', l: '30', a: '25' })).toBeCloseTo(0.03, 6);
    expect(cubage({ c: '12,5', l: 10, a: 10 })).toBeCloseTo(0.00125, 6);
  });

  it('gives 0 for a missing, non-numeric or negative measure', () => {
    expect(cubage({ c: 'abc', l: 30, a: 25 })).toBe(0);
    expect(cubage({ c: -1, l: 30, a: 25 })).toBe(0);
    expect(cubage({ c: '', l: 30, a: 25 })).toBe(0);
    expect(cubage({ c: 40, l: undefined, a: 25 })).toBe(0);
  });

  it('has the 3 items of the original demo', () => {
    expect(ITEMS.map((i) => [i.code, i.qty, i.loc])).toEqual([
      ['F590-48', '24 UN', 'G-02'],
      ['4380000', '2 UN', 'F-04'],
      ['DS2CD1023', '3 UN', 'F-05'],
    ]);
  });
});

describe('warehouse strings', () => {
  it('has the same shape in both languages, all filled in', () => {
    expect(shape(strings.en)).toEqual(shape(strings['pt-br']));
    for (const leaf of [...leaves(strings.en), ...leaves(strings['pt-br'])]) expect(leaf).not.toBe('');
  });

  it('tracks 6 stages and keeps the document numbers of the original demo', () => {
    for (const locale of ['en', 'pt-br'] as const) {
      const t = strings[locale];
      expect(t.stages).toHaveLength(6);
      const all = leaves(t).join(' ');
      expect(all).toContain('48213');
      expect(all).toContain('51877');
      expect(all).toContain('#1871');
    }
  });
});
