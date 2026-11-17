import type { Locale } from '../../i18n/locales';
import { formatBRL, formatNumber } from '../../lib/format';
import type { DemoMount } from '../types';
import { esc, fill, wait } from '../util';
import { cartCount, cartSubtotal, deliveryFee, EXAMPLE_KM, isCompleteCep } from './logic';
import { strings } from './strings';

interface State {
  view: 'menu' | 'cart' | 'pix';
  cart: Record<string, number>;
  cep: string;
  /** distance of the found address, or null while there is none */
  km: number | null;
  num: string;
  fee: number | null;
  paid: boolean;
}

const fresh = (): State => ({ view: 'menu', cart: {}, cep: '', km: null, num: '', fee: null, paid: false });

/** The bakery's store: menu → order (CEP, delivery fee) → Pix → the order on the owner's panel. */
export const mount: DemoMount = (root, locale: Locale) => {
  const t = strings[locale];
  const brl = (v: number) => formatBRL(v, locale);
  let s = fresh();
  let run = 0; // bumps on reset, so a pending "payment" from before the reset is ignored

  const $ = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-bk="${name}"]`);
  const inCart = () => t.menu.filter((i) => s.cart[i.id]);

  function render(): void {
    const n = cartCount(s.cart);
    const items = cartSubtotal(s.cart, t.menu);
    if (s.view === 'menu') renderMenu(n, items);
    else if (s.view === 'cart') renderCart(items);
    else renderPix(items + (s.fee ?? 0));
  }

  function renderMenu(n: number, items: number): void {
    root.innerHTML = `
      <div class="bk-head"><b>${esc(t.shop)}</b><small>${esc(t.open)}</small></div>
      <div class="bk-body">
        <b class="bk-section">${esc(t.section)}</b>
        ${t.menu
          .map(
            (i) => `
          <div class="bk-item">
            <span class="bk-dot ${i.tone}"></span>
            <div class="bk-item__text"><b>${esc(i.name)}</b><small>${esc(i.detail)}</small><div class="bk-price">${brl(i.price)}</div></div>
            ${s.cart[i.id] ? `<span class="bk-qty">${s.cart[i.id]}×</span>` : ''}
            <button type="button" class="bk-add" data-add="${i.id}" aria-label="${esc(fill(t.add, { name: i.name }))}">+</button>
          </div>`,
          )
          .join('')}
      </div>
      <button type="button" class="bk-cart" data-bk="go" ${n ? '' : 'disabled'}>
        <span>${esc(fill(n === 1 ? t.viewOrderOne : t.viewOrderMany, { n }))}</span><span>${brl(items)}</span>
      </button>`;

    root.querySelectorAll<HTMLElement>('[data-add]').forEach((b) =>
      b.addEventListener('click', () => {
        const id = b.dataset.add!;
        s.cart[id] = (s.cart[id] ?? 0) + 1;
        render();
        root.querySelector<HTMLElement>(`[data-add="${id}"]`)?.focus();
      }),
    );
    $('go')!.addEventListener('click', () => {
      if (!cartCount(s.cart)) return;
      s.view = 'cart';
      render();
    });
  }

  function renderCart(items: number): void {
    const total = items + (s.fee ?? 0);
    root.innerHTML = `
      <div class="bk-head"><button type="button" class="bk-back" data-bk="back">${esc(t.back)}</button><b>${esc(t.yourOrder)}</b></div>
      <div class="bk-body">
        ${inCart()
          .map((i) => `<div class="bk-row"><span>${s.cart[i.id]}× ${esc(i.name)}</span><span>${brl(s.cart[i.id] * i.price)}</span></div>`)
          .join('')}
        <div class="bk-field">
          <label for="bk-cep">${esc(t.cepLabel)}</label>
          <input id="bk-cep" data-bk="cep" inputmode="numeric" autocomplete="off" placeholder="${esc(t.cepPlaceholder)}">
          <button type="button" class="bk-link" data-bk="example">${esc(t.useExample)}</button>
        </div>
        ${
          s.km !== null
            ? `<div class="bk-note" data-bk="address"><b>${esc(t.street)}</b><br>${esc(t.district)} · ${esc(fill(t.distance, { km: formatNumber(s.km, locale) }))}</div>
               <div class="bk-field"><label for="bk-num">${esc(t.numberLabel)}</label><input id="bk-num" data-bk="num" inputmode="numeric" autocomplete="off" placeholder="${esc(t.numberPlaceholder)}"></div>`
            : ''
        }
        ${s.km !== null && s.fee === null ? `<button type="button" class="bk-cart bk-cart--inline" data-bk="calc">${esc(t.calc)}</button>` : ''}
        <div class="bk-sum">
          <div class="bk-row"><span>${esc(t.items)}</span><span>${brl(items)}</span></div>
          <div class="bk-row"><span>${esc(t.delivery)}</span><span data-bk="fee">${s.fee === null ? esc(t.calcAbove) : brl(s.fee)}</span></div>
          <div class="bk-row bk-row--total"><span>${esc(t.total)}</span><span><span data-bk="total">${brl(total)}</span>${s.fee === null ? esc(t.plusDelivery) : ''}</span></div>
        </div>
        <p class="bk-msg" data-bk="msg" role="status"></p>
      </div>
      <button type="button" class="bk-cart" data-bk="pay" ${s.fee === null ? 'disabled' : ''}>
        <span>${esc(t.pay)}</span><span>${brl(total)}</span>
      </button>`;

    const cep = $<HTMLInputElement>('cep')!;
    cep.value = s.cep;
    const found = () => {
      s.km = EXAMPLE_KM;
      s.fee = null;
      render();
    };
    const lookup = () => {
      s.cep = cep.value;
      if (isCompleteCep(cep.value)) found();
      else if (cep.value.trim() !== '') $('msg')!.textContent = t.cepMessage;
    };
    cep.addEventListener('change', lookup);
    cep.addEventListener('input', () => {
      s.cep = cep.value;
      if (isCompleteCep(cep.value) && s.km === null) found();
    });
    $('example')!.addEventListener('click', () => {
      s.cep = t.exampleCep;
      found();
    });
    $('back')!.addEventListener('click', () => {
      s.view = 'menu';
      render();
    });
    const num = $<HTMLInputElement>('num');
    if (num) {
      num.value = s.num;
      num.addEventListener('input', () => (s.num = num.value));
    }
    $('calc')?.addEventListener('click', () => {
      if (s.km === null) return;
      s.fee = deliveryFee(s.km);
      render();
    });
    $('pay')!.addEventListener('click', () => {
      if (s.fee === null) return;
      s.view = 'pix';
      render();
    });
  }

  function renderPix(total: number): void {
    const head = `<div class="bk-head"><b>${esc(t.pixTitle)}</b><small>${esc(t.orderNo)} · ${brl(total)}</small></div>`;
    if (s.paid) {
      root.innerHTML = `${head}
        <div class="bk-body"><div class="bk-pix">
          <div class="bk-ok" data-bk="confirmed"><b>${esc(t.paidTitle)}</b><br>${esc(t.paidText)}</div>
          <p class="bk-small">${esc(t.ownerIntro)}</p>
          <div class="bk-order" data-bk="owner-order">
            <b>${esc(t.orderNo)}</b> <span class="bk-pill">${esc(t.paidPill)}</span><br>
            ${esc(t.customer)}<br>
            ${inCart()
              .map((i) => `${s.cart[i.id]}× ${esc(i.name)}`)
              .join('<br>')}<br>
            ${esc(t.street)}, ${esc(s.num.trim() || t.noNumber)}, ${esc(t.district)}<br>
            <b>${esc(t.total)} ${brl(total)}</b>
          </div>
          <button type="button" class="bk-link" data-bk="new">${esc(t.newOrder)}</button>
        </div></div>`;
      $('new')!.addEventListener('click', reset);
      return;
    }

    root.innerHTML = `${head}
      <div class="bk-body"><div class="bk-pix">
        <canvas data-bk="qr" width="170" height="170" role="img" aria-label="${esc(t.qrLabel)}"></canvas>
        <div class="bk-code">00020126580014BR.GOV.BCB.PIX0136exemplo-nao-e-real-0000-0000520400005303986540${total.toFixed(2)}5802BR5920CONFEITARIA EXEMPLO6009SUA CIDADE</div>
        <p class="bk-help">${esc(t.pixHelp)}</p>
        <button type="button" class="bk-cart bk-cart--inline bk-cart--wide" data-bk="simulate">${esc(t.simulate)}</button>
      </div></div>`;
    drawQR($<HTMLCanvasElement>('qr')!, total);
    const sim = $<HTMLButtonElement>('simulate')!;
    sim.addEventListener('click', async () => {
      const mine = run;
      sim.disabled = true;
      sim.innerHTML = `<span class="bk-spin" aria-hidden="true"></span>&nbsp; ${esc(t.waiting)}`;
      await wait(1200);
      if (mine !== run) return;
      s.paid = true;
      render();
    });
  }

  function reset(): void {
    run++;
    s = fresh();
    render();
  }

  root.classList.add('demo-bakery');
  render();
  return { reset };
};

/** A picture that looks like a QR code. It is random dots seeded by the total: it pays nothing. */
function drawQR(canvas: HTMLCanvasElement, seed: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const n = 25;
  const size = 170 / n;
  const dark = '#2B140A';
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 170, 170);
  let r = Math.floor(seed * 100) || 7;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  ctx.fillStyle = dark;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rnd() > 0.52) ctx.fillRect(i * size, j * size, size, size);
  for (const [a, b] of [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ]) {
    ctx.fillStyle = dark;
    ctx.fillRect(a * size, b * size, 7 * size, 7 * size);
    ctx.fillStyle = '#fff';
    ctx.fillRect((a + 1) * size, (b + 1) * size, 5 * size, 5 * size);
    ctx.fillStyle = dark;
    ctx.fillRect((a + 2) * size, (b + 2) * size, 3 * size, 3 * size);
  }
}
