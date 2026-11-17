import { describe, expect, it } from 'vitest';
import {
  clampMargin,
  exportCsv,
  priceWithMargin,
  proposalTotals,
  RACK_FOUND,
  seedItems,
  type QuoteItem,
} from '../../src/demos/quoting/logic';
import { strings } from '../../src/demos/quoting/strings';
import { leaves, shape } from './helpers';

/** The five items once the agent has priced the rack. */
function pricedItems(): QuoteItem[] {
  const items = seedItems();
  Object.assign(items[4], RACK_FOUND);
  return items;
}

describe('clampMargin', () => {
  it('reads empty or invalid input as 0', () => {
    expect(clampMargin('')).toBe(0);
    expect(clampMargin('abc')).toBe(0);
    expect(clampMargin(NaN)).toBe(0);
    expect(clampMargin(undefined)).toBe(0);
    expect(clampMargin(null)).toBe(0);
  });

  it('keeps the margin between 0 and 200', () => {
    expect(clampMargin(-5)).toBe(0);
    expect(clampMargin(999)).toBe(200);
    expect(clampMargin(Infinity)).toBe(200);
    expect(clampMargin('30')).toBe(30);
    expect(clampMargin(12.5)).toBe(12.5);
  });
});

describe('proposal maths', () => {
  it('adds the margin on top of the cost', () => {
    expect(priceWithMargin(312, 30)).toBeCloseTo(405.6, 2);
    expect(priceWithMargin(312, 0)).toBe(312);
  });

  it('starts with the four catalog items priced and the rack unknown', () => {
    const items = seedItems();
    expect(items.map((i) => [i.q, i.cost])).toEqual([
      [10, 312],
      [2, 689.9],
      [1, 1249],
      [3, 798.5],
      [1, 0],
    ]);
    expect(items[4].match).toBeNull();
    expect(proposalTotals(items, 30).cost).toBeCloseTo(8144.3, 2);
  });

  it('gives a fresh copy each time', () => {
    const a = seedItems();
    a[0].cost = 1;
    expect(seedItems()[0].cost).toBe(312);
  });

  it('totals the proposal at a 30% margin', () => {
    const totals = proposalTotals(pricedItems(), 30);
    expect(totals.cost).toBeCloseTo(8633.3, 2);
    expect(totals.total).toBeCloseTo(11223.29, 2);
    expect(totals.profit).toBeCloseTo(2589.99, 2);
  });

  it('makes no profit at a 0% margin', () => {
    const totals = proposalTotals(pricedItems(), 0);
    expect(totals.total).toBeCloseTo(totals.cost, 2);
    expect(totals.profit).toBeCloseTo(0, 2);
  });
});

describe('exportCsv', () => {
  it("writes the ERP's format: a header and one line per item", () => {
    const lines = exportCsv('R-2041', pricedItems(), 30).split('\n');
    expect(lines).toHaveLength(6);
    expect(lines[0]).toBe('numero_proposta;codigo;descricao;qtd;valor_unit');
    expect(lines[1]).toBe('R-2041;CAM-2MP-B28;Câmera IP Bullet 2MP PoE 2,8 mm;10;405.60');
    expect(lines[5]).toBe('R-2041;RACK-12U;Rack de parede 12U 570 mm;1;635.70');
  });
});

describe('quoting strings', () => {
  it('has the same shape in both languages, all filled in', () => {
    expect(shape(strings.en)).toEqual(shape(strings['pt-br']));
    for (const leaf of [...leaves(strings.en), ...leaves(strings['pt-br'])]) expect(leaf).not.toBe('');
  });

  it('has a reason and a supplier for every item', () => {
    for (const locale of ['en', 'pt-br'] as const) {
      const keys = [...seedItems().map((i) => i.why), RACK_FOUND.why];
      for (const key of keys) expect(strings[locale].why[key]).toBeTruthy();
    }
  });
});
