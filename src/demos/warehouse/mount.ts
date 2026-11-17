import type { Locale } from '../../i18n/locales';
import { formatBRL, formatNumber } from '../../lib/format';
import type { DemoMount } from '../types';
import { esc, fill, wait } from '../util';
import { AI_MATCH, cubage, DEFAULT_VOLUME, FREIGHT_QUOTE, ITEMS, parseDecimal, UNITS } from './logic';
import { strings } from './strings';

type Step = 'receive' | 'check' | 'match' | 'pick' | 'ship' | 'done';

interface State {
  step: Step;
  checked: number[];
  picked: number[];
  /** the package measures exactly as typed */
  vol: { c: string; l: string; a: string; p: string };
  /** last pipeline stage that is done (-1: none) */
  stage: number;
  log: [time: string, text: string][];
}

/**
 * The distribution center: the operator's phone app on one side, the manager's dashboard on
 * the other. The dashboard lives outside the phone, in the panel's [data-demo-aside] element.
 */
export const mount: DemoMount = (root, locale: Locale) => {
  const t = strings[locale];
  const aside = root.closest('[data-demo-panel]')?.querySelector<HTMLElement>('[data-demo-aside="warehouse"]') ?? null;
  const fresh = (): State => ({
    step: 'receive',
    checked: [],
    picked: [],
    vol: { ...DEFAULT_VOLUME },
    stage: -1,
    log: [['08:12', t.logWaiting]],
  });
  let s = fresh();
  let run = 0; // bumps on reset, so a scan that finishes after it is dropped

  const $ = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-wh="${name}"]`);
  const on = (name: string, handler: (el: HTMLElement) => void) => {
    const el = $(name);
    el?.addEventListener('click', () => handler(el));
  };

  function log(text: string): void {
    const d = new Date();
    s.log.unshift([`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`, text]);
  }

  const itemButton = (kind: 'check' | 'pick', i: number, done: boolean, sub: string) => `
    <button type="button" class="wh-it${done ? ' on' : ''}" data-wh="${kind}" data-i="${i}" aria-pressed="${done}">
      <span class="wh-ck" aria-hidden="true">✓</span>
      <span class="wh-t" lang="pt-BR">${esc(ITEMS[i].name)}<small lang="${locale === 'pt-br' ? 'pt-BR' : 'en'}">${esc(sub)}</small></span>
      <span class="wh-q">${esc(ITEMS[i].qty)}</span>
    </button>`;

  function body(): string {
    switch (s.step) {
      case 'receive':
        return `<div class="wh-card"><h4>${esc(t.recTitle)}</h4><p>${esc(t.recText)}</p>
          <button type="button" class="wh-btn" data-wh="read-danfe">${esc(t.readDanfe)}</button></div>`;
      case 'check':
        return `<div class="wh-card"><h4>${esc(t.nfTitle)}</h4><p class="wh-mute">${esc(t.nfText)}</p></div>
          ${ITEMS.map((it, i) => itemButton('check', i, s.checked.includes(i), fill(t.code, { code: it.code }))).join('')}
          <button type="button" class="wh-btn wh-btn--ok" data-wh="receive-done" ${s.checked.length < ITEMS.length ? 'disabled' : ''}>${esc(t.receiveDone)}</button>`;
      case 'match':
        return `<div class="wh-card"><h4>${esc(t.matchTitle)}</h4>
          <div class="wh-ai"><b>${esc(t.aiTitle)}</b><br>${esc(t.arrived)} <b lang="pt-BR">${esc(AI_MATCH.arrived)}</b><br>${esc(t.ordered)} <b lang="pt-BR">${esc(AI_MATCH.ordered)}</b><br><span class="wh-mute">${esc(t.aiWhy)}</span></div>
          <button type="button" class="wh-btn wh-btn--ok" data-wh="ai-validate">${esc(t.validate)}</button></div>`;
      case 'pick':
        return `<div class="wh-card"><h4>${esc(t.pickTitle)}</h4><p class="wh-mute">${esc(t.pickText)}</p></div>
          ${ITEMS.map((it, i) => itemButton('pick', i, s.picked.includes(i), fill(t.loc, { loc: it.loc }))).join('')}
          <div class="wh-card"><b>${esc(t.volume)}</b><div class="wh-vol">
            <label>${esc(t.length)}<input data-wh="vol-c" inputmode="decimal" autocomplete="off"></label>
            <label>${esc(t.width)}<input data-wh="vol-l" inputmode="decimal" autocomplete="off"></label>
            <label>${esc(t.height)}<input data-wh="vol-a" inputmode="decimal" autocomplete="off"></label>
            <label>${esc(t.weight)}<input data-wh="vol-p" inputmode="decimal" autocomplete="off"></label>
          </div></div>
          <button type="button" class="wh-btn wh-btn--ok" data-wh="pick-done" ${s.picked.length < ITEMS.length ? 'disabled' : ''}>${esc(t.pickDone)}</button>`;
      case 'ship':
        return `<div class="wh-card"><h4>${esc(t.shipTitle)}</h4><p>${esc(t.shipText)}</p>
          <button type="button" class="wh-btn" data-wh="read-dacte">${esc(t.readDacte)}</button></div>`;
      case 'done':
        return `<div class="wh-card wh-card--center" data-wh="done"><h4>${esc(t.doneTitle)}</h4><p>${esc(t.doneText)}</p>
          <button type="button" class="wh-btn" data-wh="again">${esc(t.again)}</button></div>`;
    }
  }

  function render(focus?: string): void {
    const tab = s.step === 'receive' || s.step === 'check' || s.step === 'match' ? 0 : s.step === 'pick' ? 1 : 2;
    root.innerHTML = `
      <div class="wh-head"><div><b>${esc(t.app)}</b><small>${esc(t.appSub)}</small></div><small>${esc(t.exit)}</small></div>
      <div class="wh-body">${body()}</div>
      <div class="wh-nav" aria-hidden="true">${t.nav.map((label, i) => `<span${i === tab ? ' class="on"' : ''}>${esc(label)}</span>`).join('')}</div>`;

    on('read-danfe', async (btn) => {
      const mine = run;
      (btn as HTMLButtonElement).disabled = true;
      btn.innerHTML = `<span class="wh-spin" aria-hidden="true"></span>&nbsp; ${esc(t.sefaz)}`;
      await wait(1000);
      if (mine !== run) return;
      s.step = 'check';
      log(t.logRead);
      render();
    });

    root.querySelectorAll<HTMLElement>('[data-wh="check"], [data-wh="pick"]').forEach((b) =>
      b.addEventListener('click', () => {
        const list = b.dataset.wh === 'check' ? s.checked : s.picked;
        const i = Number(b.dataset.i);
        if (!list.includes(i)) list.push(i);
        render(`[data-wh="${b.dataset.wh}"][data-i="${i}"]`);
      }),
    );

    on('receive-done', () => {
      s.step = 'match';
      s.stage = 0;
      log(t.logReceived);
      render();
    });

    on('ai-validate', () => {
      s.step = 'pick';
      s.stage = 1;
      log(t.logMatched);
      render();
    });

    for (const k of ['c', 'l', 'a', 'p'] as const) {
      const input = $<HTMLInputElement>(`vol-${k}`);
      if (!input) continue;
      input.value = s.vol[k];
      input.addEventListener('input', () => {
        s.vol[k] = input.value;
        renderManager(); // the phone is left alone so the field keeps the cursor
      });
    }

    on('pick-done', () => {
      const side = (v: string) => formatNumber(parseDecimal(v), locale);
      s.step = 'ship';
      s.stage = 3;
      log(fill(t.logConsolidated, { c: side(s.vol.c), l: side(s.vol.l), a: side(s.vol.a), p: side(s.vol.p) }));
      log(t.logInvoiced);
      render();
    });

    on('read-dacte', async (btn) => {
      const mine = run;
      (btn as HTMLButtonElement).disabled = true;
      btn.innerHTML = `<span class="wh-spin" aria-hidden="true"></span>&nbsp; ${esc(t.linking)}`;
      await wait(900);
      if (mine !== run) return;
      s.step = 'done';
      s.stage = 4;
      log(t.logShipped);
      render();
    });

    on('again', reset);

    if (focus) root.querySelector<HTMLElement>(focus)?.focus();
    renderManager();
  }

  function renderManager(): void {
    if (!aside) return;
    // The volume shows while the package is being measured, and from then on.
    const measured = s.step === 'pick' || s.stage >= 3;
    aside.innerHTML = `
      <h4>${esc(t.panelTitle)}</h4>
      <ol class="wh-pipe">
        ${t.stages
          .map((name, i) => `<li data-wh="stage" class="${i <= s.stage ? 'done' : i === s.stage + 1 ? 'now' : ''}"><i></i>${esc(name)}</li>`)
          .join('')}
      </ol>
      <dl class="wh-kpi">
        <div><dt data-wh="kpi-units">${s.stage >= 0 ? UNITS : 0}/${UNITS}</dt><dd>${esc(t.kpiUnits)}</dd></div>
        <div><dt data-wh="kpi-cubage">${measured ? formatNumber(cubage(s.vol), locale, 3) : '–'}</dt><dd>${esc(t.kpiCubage)}</dd></div>
        <div><dt data-wh="kpi-freight">${s.stage >= 3 ? formatBRL(FREIGHT_QUOTE, locale) : '–'}</dt><dd>${esc(t.kpiFreight)}</dd></div>
      </dl>
      <ul class="wh-log" data-wh="log" tabindex="0" aria-label="${esc(t.logLabel)}">
        ${s.log.map(([time, text]) => `<li><b>${esc(time)}</b> ${esc(text)}</li>`).join('')}
      </ul>`;
  }

  function reset(): void {
    run++;
    s = fresh();
    render();
  }

  root.classList.add('demo-warehouse');
  aside?.classList.add('wh-manager');
  render();
  return { reset };
};
