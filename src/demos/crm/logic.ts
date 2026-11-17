/** Funnel steps: cold (email 1), cold (follow-up), replied, qualified, proposal. */
export const STEP_COUNT = 5;

export interface Lead {
  domain: string;
  owner: string;
  /** index of the funnel step the lead is at, 0..STEP_COUNT-1 */
  stage: number;
}

// Fictitious companies, as in the original demo.
const SEED: Lead[] = [
  { domain: 'alfaindustria.com.br', owner: 'Bruno', stage: 0 },
  { domain: 'betalogistica.com.br', owner: 'Carlos', stage: 1 },
  { domain: 'serraenergia.com.br', owner: 'Ana', stage: 2 },
  { domain: 'valemoveis.com.br', owner: 'Bruno', stage: 2 },
  { domain: 'portoagro.com.br', owner: 'Carlos', stage: 3 },
  { domain: 'novafarma.com.br', owner: 'Ana', stage: 4 },
  { domain: 'solhotel.com.br', owner: 'Bruno', stage: 0 },
];

/** Counters shown at the top of the board when it opens. */
export const SEED_EMAILS = 614;
export const SEED_REPLIES = 59;

export function seedLeads(): Lead[] {
  return SEED.map((lead) => ({ ...lead }));
}

/** Board column of a stage: both cold steps share the first column. */
export function columnOf(stage: number): 0 | 1 | 2 | 3 {
  if (stage <= 1) return 0;
  if (stage === 2) return 1;
  if (stage === 3) return 2;
  return 3;
}

/**
 * The agent's next step for a lead, or null at the end of the funnel.
 * `sentEmail`: the step was another email from the agent (the lead is still cold).
 * `gotReply`: the step was the company answering.
 */
export function advanceLead(lead: Lead): { lead: Lead; sentEmail: boolean; gotReply: boolean } | null {
  if (lead.stage >= STEP_COUNT - 1) return null;
  const stage = lead.stage + 1;
  return { lead: { ...lead, stage }, sentEmail: columnOf(stage) === 0, gotReply: stage === 2 };
}
