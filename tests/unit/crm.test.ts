import { describe, expect, it } from 'vitest';
import { advanceLead, columnOf, SEED_EMAILS, SEED_REPLIES, seedLeads, STEP_COUNT } from '../../src/demos/crm/logic';
import { strings } from '../../src/demos/crm/strings';
import { leaves, shape } from './helpers';

describe('crm logic', () => {
  it('has 5 steps in the funnel', () => {
    expect(STEP_COUNT).toBe(5);
  });

  it('the first follow-up is another email, with no reply yet', () => {
    const lead = { domain: 'a.com.br', owner: 'Bruno', stage: 0 };
    const next = advanceLead(lead);
    expect(next).toEqual({ lead: { domain: 'a.com.br', owner: 'Bruno', stage: 1 }, sentEmail: true, gotReply: false });
    expect(lead.stage).toBe(0); // the original is not changed
  });

  it('the next step is the reply arriving', () => {
    const next = advanceLead({ domain: 'a.com.br', owner: 'Bruno', stage: 1 });
    expect(next?.lead.stage).toBe(2);
    expect(next?.sentEmail).toBe(false);
    expect(next?.gotReply).toBe(true);
  });

  it('qualifying and proposing send no agent email and count no reply', () => {
    for (const stage of [2, 3]) {
      const next = advanceLead({ domain: 'a.com.br', owner: 'Ana', stage });
      expect(next?.lead.stage).toBe(stage + 1);
      expect(next?.sentEmail).toBe(false);
      expect(next?.gotReply).toBe(false);
    }
  });

  it('stops at the end of the funnel', () => {
    expect(advanceLead({ domain: 'a.com.br', owner: 'Ana', stage: 4 })).toBeNull();
    expect(advanceLead({ domain: 'a.com.br', owner: 'Ana', stage: 99 })).toBeNull();
  });

  it('puts each stage in its column', () => {
    expect([0, 1, 2, 3, 4].map(columnOf)).toEqual([0, 0, 1, 2, 3]);
    expect(columnOf(-3)).toBe(0);
    expect(columnOf(42)).toBe(3);
  });

  it('starts with the 7 leads and the counters of the original demo', () => {
    expect(seedLeads().map((l) => [l.domain, l.owner, l.stage])).toEqual([
      ['alfaindustria.com.br', 'Bruno', 0],
      ['betalogistica.com.br', 'Carlos', 1],
      ['serraenergia.com.br', 'Ana', 2],
      ['valemoveis.com.br', 'Bruno', 2],
      ['portoagro.com.br', 'Carlos', 3],
      ['novafarma.com.br', 'Ana', 4],
      ['solhotel.com.br', 'Bruno', 0],
    ]);
    expect(SEED_EMAILS).toBe(614);
    expect(SEED_REPLIES).toBe(59);
  });
});

describe('crm strings', () => {
  it('has the same shape in both languages, all filled in', () => {
    expect(shape(strings.en)).toEqual(shape(strings['pt-br']));
    for (const leaf of [...leaves(strings.en), ...leaves(strings['pt-br'])]) expect(leaf).not.toBe('');
  });

  it('describes 4 columns and every step of the funnel', () => {
    for (const locale of ['en', 'pt-br'] as const) {
      expect(strings[locale].columns).toHaveLength(4);
      expect(strings[locale].steps).toHaveLength(STEP_COUNT);
    }
  });
});
