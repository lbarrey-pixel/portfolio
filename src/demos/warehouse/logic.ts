/** A number as an operator types it: "6,2" and "6.2" both work; anything else is 0. */
export function parseDecimal(input: unknown): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;
  if (typeof input !== 'string') return 0;
  const text = input.trim().replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(text)) return 0;
  const n = Number(text);
  return Number.isFinite(n) ? n : 0;
}

/** Package volume in m³ from its sides in cm. A missing, invalid or negative side gives 0. */
export function cubage(vol: { c: unknown; l: unknown; a: unknown }): number {
  const sides = [vol.c, vol.l, vol.a].map(parseDecimal);
  if (sides.some((s) => s <= 0)) return 0;
  return (sides[0] * sides[1] * sides[2]) / 1e6;
}

export interface WarehouseItem {
  name: string;
  code: string;
  qty: string;
  loc: string;
}

// Demo data from the original: product names, codes and locations stay as they are in both languages.
export const ITEMS: WarehouseItem[] = [
  { name: 'Fita crepe verde 48mm x 40m', code: 'F590-48', qty: '24 UN', loc: 'G-02' },
  { name: 'Jogo de chaves combinadas 8 peças', code: '4380000', qty: '2 UN', loc: 'F-04' },
  { name: 'Câmera IP bullet 2MP PoE', code: 'DS2CD1023', qty: '3 UN', loc: 'F-05' },
];

/** The pair the AI suggests matching: what the invoice says vs. what the order says. */
export const AI_MATCH = {
  arrived: 'FITA CREPE VERDE 48MMX40M',
  ordered: 'Fita crepe alta performance verde 48x40',
};

export const DEFAULT_VOLUME = { c: '40', l: '30', a: '25', p: '6,2' };
export const UNITS = 29;
export const FREIGHT_QUOTE = 187.42;
