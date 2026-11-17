export type Confidence = 'high' | 'medium' | 'none';

export interface QuoteItem {
  /** what the client wrote (their words, kept in Portuguese) */
  asked: string;
  q: number;
  /** catalog product found, or null while there is none */
  match: string | null;
  code: string;
  confidence: Confidence;
  /** key of the reason shown under the confidence (translated in strings.ts) */
  why: string;
  /** index of the supplier name in strings.ts, or -1 */
  supplier: number;
  cost: number;
  /** true when the agent, not the catalog, found it */
  byAgent?: boolean;
}

// The client's request and the catalog are Brazilian data: they stay in Portuguese in both languages.
const SEED: QuoteItem[] = [
  { asked: 'Câmera IP bullet 2MP PoE lente 2.8', q: 10, match: 'Câmera IP Bullet 2MP PoE 2,8 mm', code: 'CAM-2MP-B28', confidence: 'high', why: 'sameModel', supplier: 0, cost: 312.0 },
  { asked: 'Switch 8 portas PoE gerenciável', q: 2, match: 'Switch 8p Gigabit PoE+ gerenciável', code: 'SW-8P-POE-G', confidence: 'high', why: 'quotedBefore', supplier: 1, cost: 689.9 },
  { asked: 'Nobreak 1500VA bivolt', q: 1, match: 'Nobreak 1500VA bivolt senoidal', code: 'NB-1500-BV', confidence: 'medium', why: 'samePower', supplier: 2, cost: 1249.0 },
  { asked: 'Cabo UTP cat6 caixa 305 m', q: 3, match: 'Cabo UTP Cat6 CMX caixa 305 m', code: 'UTP6-305', confidence: 'high', why: 'sameCategory', supplier: 0, cost: 798.5 },
  { asked: 'Rack 12U parede', q: 1, match: null, code: '', confidence: 'none', why: 'notInCatalog', supplier: -1, cost: 0 },
];

/** What the agent comes back with for the rack, a moment after the table shows. */
export const RACK_FOUND: Pick<QuoteItem, 'match' | 'code' | 'confidence' | 'why' | 'supplier' | 'cost' | 'byAgent'> = {
  match: 'Rack de parede 12U 570 mm',
  code: 'RACK-12U',
  confidence: 'medium',
  why: 'agentFound',
  supplier: 3,
  cost: 489.0,
  byAgent: true,
};

export const PROPOSAL_NO = 'R-2041';
export const DEFAULT_MARGIN = 30;

export const EMAIL = `De: compras@cliente-exemplo.com.br
Assunto: Cotação - reforma do galpão

Bom dia, favor cotar:
- 10 câmeras IP bullet 2MP PoE lente 2.8
- 2 switches 8 portas PoE gerenciável
- 1 nobreak 1500VA bivolt
- 3 caixas cabo UTP cat6 (305 m)
- 1 rack 12U parede

Prazo de entrega e condição de pagamento, por favor.`;

/** A fresh copy of the five items as the AI first finds them. */
export function seedItems(): QuoteItem[] {
  return SEED.map((item) => ({ ...item }));
}

/** Margin in percent from whatever was typed: empty or invalid is 0, and it stays within 0..200. */
export function clampMargin(v: unknown): number {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.min(200, Math.max(0, n));
}

export function priceWithMargin(cost: number, margin: number): number {
  return cost * (1 + margin / 100);
}

export function proposalTotals(
  items: Pick<QuoteItem, 'q' | 'cost'>[],
  margin: number,
): { cost: number; total: number; profit: number } {
  const cost = items.reduce((sum, i) => sum + i.cost * i.q, 0);
  const total = items.reduce((sum, i) => sum + priceWithMargin(i.cost, margin) * i.q, 0);
  return { cost, total, profit: total - cost };
}

/** The file the ERP imports. Its column names are the ERP's own (Portuguese). */
export function exportCsv(
  proposalNo: string,
  items: Pick<QuoteItem, 'q' | 'cost' | 'code' | 'match'>[],
  margin: number,
): string {
  return [
    'numero_proposta;codigo;descricao;qtd;valor_unit',
    ...items.map((i) => `${proposalNo};${i.code};${i.match ?? ''};${i.q};${priceWithMargin(i.cost, margin).toFixed(2)}`),
  ].join('\n');
}
