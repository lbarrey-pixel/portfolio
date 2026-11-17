import type { Locale } from '../../i18n/locales';
import { formatNumber } from '../../lib/format';
import type { DemoMount } from '../types';
import { esc, fill, wait } from '../util';
import { advanceLead, columnOf, SEED_EMAILS, SEED_REPLIES, seedLeads, type Lead } from './logic';
import { strings } from './strings';

interface State {
  sel: number;
  leads: (Lead & { fresh?: boolean })[];
  emails: number;
  replies: number;
}

const fresh = (): State => ({ sel: 0, leads: seedLeads(), emails: SEED_EMAILS, replies: SEED_REPLIES });

/** The prospecting board: an agent works each lead down the funnel; the seller only steps in at the end. */
export const mount: DemoMount = (root, locale: Locale) => {
  const t = strings[locale];
  const num = (n: number) => formatNumber(n, locale);
  let s = fresh();
  let run = 0; // bumps on reset, so a step that finishes after it is dropped

  const $ = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-cr="${name}"]`);

  function render(focus?: 'next' | 'card'): void {
    const sel = s.leads[s.sel];
    const done = advanceLead(sel) === null;
    const kpi = (name: string, value: number, label: string) =>
      `<div><b data-cr="kpi-${name}">${num(value)}</b><span>${esc(label)}</span></div>`;

    root.innerHTML = `
      <div class="cr-hero">
        ${kpi('emails', s.emails, t.kpi.emails)}
        ${kpi('replies', s.replies, t.kpi.replies)}
        ${kpi('qualified', s.leads.filter((l) => l.stage >= 3).length, t.kpi.qualified)}
        ${kpi('proposals', s.leads.filter((l) => l.stage >= 4).length, t.kpi.proposals)}
      </div>
      <div class="cr-board" tabindex="0" role="group" aria-label="${esc(t.boardLabel)}">
        ${t.columns
          .map((name, col) => {
            const inCol = s.leads.map((lead, i) => ({ lead, i })).filter(({ lead }) => columnOf(lead.stage) === col);
            return `
            <div class="cr-col" data-cr="col">
              <h5><span>${esc(name)}</span><span data-cr="col-count">${inCol.length}</span></h5>
              ${inCol
                .map(
                  ({ lead, i }) => `
                <button type="button" class="cr-card${i === s.sel ? ' sel' : ''}" data-cr="card" data-lead="${i}" data-domain="${esc(lead.domain)}" aria-pressed="${i === s.sel}">
                  <b>${esc(lead.domain)}</b>
                  <small>${esc(lead.owner)} · ${esc(t.steps[lead.stage].event.toLowerCase())}</small><br>
                  <span class="cr-chip">${esc(lead.stage >= 2 ? t.chipReplied : t.chipAgent)}</span>
                </button>`,
                )
                .join('')}
            </div>`;
          })
          .join('')}
      </div>
      <div class="cr-detail" data-cr="detail">
        <h5>${esc(sel.domain)} <small>· ${esc(fill(t.portfolio, { who: sel.owner }))}</small></h5>
        <ul class="cr-tl">
          ${t.steps
            .slice(0, sel.stage + 1)
            .map(
              (step, k) => `
            <li data-cr="event" class="${k === sel.stage && sel.fresh ? 'cr-new' : ''}"><i></i><div><b>${esc(step.event)}</b><small>${esc(step.detail)}</small></div></li>`,
            )
            .join('')}
        </ul>
        <div><button type="button" class="cr-btn" data-cr="next" ${done ? 'disabled' : ''}>${esc(done ? t.end : t.next)}</button></div>
      </div>`;
    s.leads.forEach((l) => (l.fresh = false));

    root.querySelectorAll<HTMLElement>('[data-cr="card"]').forEach((b) =>
      b.addEventListener('click', () => {
        s.sel = Number(b.dataset.lead);
        render('card');
      }),
    );

    const next = $<HTMLButtonElement>('next')!;
    next.addEventListener('click', async () => {
      const mine = run;
      const index = s.sel;
      const step = advanceLead(s.leads[index]);
      if (!step) return;
      next.disabled = true;
      next.innerHTML = `<span class="cr-spin" aria-hidden="true"></span>&nbsp; ${esc(t.working)}`;
      await wait(900);
      if (mine !== run) return;
      s.leads[index] = { ...step.lead, fresh: true };
      if (step.sentEmail) s.emails++;
      if (step.gotReply) s.replies++;
      render(s.sel === index ? 'next' : undefined);
    });

    // Re-rendering replaces the buttons: put the keyboard focus back where the person was.
    if (focus === 'next') $('next')?.focus();
    else if (focus === 'card') root.querySelector<HTMLElement>(`[data-lead="${s.sel}"]`)?.focus();
  }

  function reset(): void {
    run++;
    s = fresh();
    render();
  }

  root.classList.add('demo-crm');
  render();
  return { reset };
};
