import type { Locale } from '../../i18n/locales';
import { formatBRL } from '../../lib/format';
import type { DemoMount } from '../types';
import { esc, fill, wait } from '../util';
import {
  clampMargin,
  DEFAULT_MARGIN,
  EMAIL,
  exportCsv,
  priceWithMargin,
  PROPOSAL_NO,
  proposalTotals,
  RACK_FOUND,
  seedItems,
  type QuoteItem,
} from './logic';
import { strings } from './strings';

interface State {
  step: 1 | 2;
  margin: number;
  items: (QuoteItem & { fresh?: boolean })[];
  exported: boolean;
}

const fresh = (): State => ({ step: 1, margin: DEFAULT_MARGIN, items: [], exported: false });

/** The quoting desk: email in → AI matches the items → an agent prices the missing one → file for the ERP. */
export const mount: DemoMount = (root, locale: Locale) => {
  const t = strings[locale];
  const brl = (v: number) => formatBRL(v, locale);
  let s = fresh();
  let run = 0; // bumps on reset, so answers that arrive after it are dropped

  const $ = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-qt="${name}"]`);
  const priced = () => s.items.every((i) => i.match !== null);

  const side = () => `
    <div class="qt-side">
      <b>${esc(t.app)}</b>
      ${t.nav.map((label, i) => `<span${i === 0 ? ' class="on"' : ''}>${esc(label)}</span>`).join('')}
    </div>`;

  function render(): void {
    // Rebuilding the screen replaces the margin field: keep the cursor in it if it was there.
    const editing = document.activeElement === $('margin');
    if (s.step === 1) renderEmail();
    else renderReview();
    if (editing) $('margin')?.focus();
  }

  function renderEmail(): void {
    root.innerHTML = `${side()}
      <div class="qt-main">
        <p class="qt-step">${esc(t.step1)}</p>
        <h4>${esc(t.title)}</h4>
        <p class="qt-intro">${esc(t.intro)}</p>
        <label for="qt-email" class="qt-step">${esc(t.emailLabel)}</label>
        <textarea id="qt-email" data-qt="email" lang="pt-BR" spellcheck="false"></textarea>
        <div><button type="button" class="qt-btn" data-qt="process">${esc(t.process)}</button></div>
      </div>`;
    $<HTMLTextAreaElement>('email')!.value = EMAIL;
    const go = $<HTMLButtonElement>('process')!;
    go.addEventListener('click', async () => {
      const mine = run;
      go.disabled = true;
      go.innerHTML = `<span class="qt-spin" aria-hidden="true"></span>&nbsp; ${esc(t.processing)}`;
      await wait(1400);
      if (mine !== run) return;
      s.items = seedItems();
      s.step = 2;
      render();
      // The rack is not in the catalog: an agent goes and finds a price.
      await wait(1600);
      if (mine !== run) return;
      Object.assign(s.items[4], RACK_FOUND, { fresh: true });
      render();
    });
  }

  function renderReview(): void {
    const totals = proposalTotals(s.items, s.margin);
    const cols = t.columns;
    root.innerHTML = `${side()}
      <div class="qt-main">
        <p class="qt-step">${esc(t.step2)}</p>
        <h4>${esc(fill(t.proposal, { no: PROPOSAL_NO }))} · ${esc(t.client)}</h4>
        <div class="qt-tablewrap" tabindex="0" role="group" aria-label="${esc(fill(t.proposal, { no: PROPOSAL_NO }))}">
          <table>
            <thead><tr>
              <th>${esc(cols.asked)}</th><th>${esc(cols.found)}</th><th>${esc(cols.confidence)}</th><th>${esc(cols.supplier)}</th>
              <th class="n">${esc(cols.qty)}</th><th class="n">${esc(cols.cost)}</th><th class="n">${esc(cols.price)}</th>
            </tr></thead>
            <tbody>
              ${s.items
                .map(
                  (i) => `
                <tr data-qt="row" class="${i.fresh ? 'qt-new' : ''}">
                  <td lang="pt-BR" data-label="${esc(cols.asked)}">${esc(i.asked)}</td>
                  <td data-label="${esc(cols.found)}">${
                    i.match !== null
                      ? `<b lang="pt-BR">${esc(i.match)}</b><div class="qt-sub">${esc(i.byAgent ? t.byAgent : i.code)}</div>`
                      : `<span class="qt-sub" data-qt="searching"><span class="qt-spin" aria-hidden="true"></span>&nbsp; ${esc(t.searching)}</span>`
                  }</td>
                  <td data-label="${esc(cols.confidence)}"><span class="qt-conf qt-conf--${i.confidence}">${esc(t.confidence[i.confidence])}</span><div class="qt-sub">${esc(t.why[i.why] ?? '')}</div></td>
                  <td data-label="${esc(cols.supplier)}">${i.supplier >= 0 ? esc(t.suppliers[i.supplier] ?? '–') : '–'}</td>
                  <td class="n" data-label="${esc(cols.qty)}">${i.q}</td>
                  <td class="n" data-label="${esc(cols.cost)}">${i.cost ? brl(i.cost) : '–'}</td>
                  <td class="n" data-qt="price" data-label="${esc(cols.price)}">${i.cost ? brl(priceWithMargin(i.cost, s.margin)) : '–'}</td>
                </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
        <div class="qt-tot">
          <label>${esc(t.margin)} <input data-qt="margin" type="number" inputmode="decimal" min="0" max="200" value="${s.margin}"> %</label>
          <span>${esc(t.cost)} <b data-qt="cost">${brl(totals.cost)}</b></span>
          <span>${esc(t.total)} <b data-qt="total">${brl(totals.total)}</b></span>
          <span>${esc(t.profit)} <b data-qt="profit">${brl(totals.profit)}</b></span>
        </div>
        <div class="qt-actions">
          <button type="button" class="qt-btn" data-qt="export" ${priced() ? '' : 'disabled'}>${esc(t.export)}</button>
          <button type="button" class="qt-btn qt-btn--alt" data-qt="back">${esc(t.back)}</button>
        </div>
        ${
          s.exported
            ? `<div class="qt-toast" data-qt="toast" role="status">${esc(t.toast)}</div>
               <pre data-qt="csv" tabindex="0" aria-label="${esc(t.csvLabel)}" lang="pt-BR">${esc(exportCsv(PROPOSAL_NO, s.items, s.margin))}</pre>`
            : ''
        }
      </div>`;
    s.items.forEach((i) => (i.fresh = false));

    // Typing updates the numbers in place. Nothing is rebuilt, so the field keeps the cursor
    // and a click on Export right after typing still lands on the button.
    const margin = $<HTMLInputElement>('margin')!;
    margin.addEventListener('input', () => {
      s.margin = Math.round(clampMargin(margin.value) * 100) / 100;
      const now = proposalTotals(s.items, s.margin);
      $('cost')!.textContent = brl(now.cost);
      $('total')!.textContent = brl(now.total);
      $('profit')!.textContent = brl(now.profit);
      root.querySelectorAll<HTMLElement>('[data-qt="price"]').forEach((cell, i) => {
        const cost = s.items[i].cost;
        cell.textContent = cost ? brl(priceWithMargin(cost, s.margin)) : '–';
      });
      const csv = $('csv');
      if (csv) csv.textContent = exportCsv(PROPOSAL_NO, s.items, s.margin);
    });
    // Leaving the field shows the margin actually in use (empty → 0, 999 → 200).
    margin.addEventListener('change', () => {
      margin.value = String(s.margin);
    });
    $('export')!.addEventListener('click', () => {
      if (!priced()) return;
      s.exported = true;
      render();
    });
    $('back')!.addEventListener('click', reset);
  }

  function reset(): void {
    run++;
    s = fresh();
    render();
  }

  root.classList.add('demo-quoting');
  render();
  return { reset };
};
