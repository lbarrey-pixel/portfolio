import type { DemoHandle, DemoId, DemoMount } from '../demos/types';
import type { Locale } from '../i18n/locales';

/**
 * The "Try it" section: tabs, one panel per demo, a reset button each.
 * A demo is built the first time its panel opens. A link to #demo-<id> (from anywhere on the
 * page, or in the address bar) opens that panel and scrolls to it.
 */
export function initTryIt(section: HTMLElement, mounts: Partial<Record<DemoId, DemoMount>>): void {
  const locale = (section.dataset.locale ?? 'en') as Locale;
  const tabs = [...section.querySelectorAll<HTMLElement>('[data-demo-tab]')];
  const panels = [...section.querySelectorAll<HTMLElement>('[data-demo-panel]')];
  const handles: Partial<Record<DemoId, DemoHandle>> = {};

  const idFromHash = (hash: string): DemoId | null => {
    const id = hash.replace(/^#demo-/, '') as DemoId;
    return hash.startsWith('#demo-') && panels.some((p) => p.dataset.demoPanel === id) ? id : null;
  };

  function open(id: DemoId, focus = false): void {
    for (const tab of tabs) {
      const on = tab.dataset.demoTab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
      if (on) revealTab(tab);
    }
    for (const panel of panels) panel.hidden = panel.dataset.demoPanel !== id;
    if (!handles[id]) {
      const root = section.querySelector<HTMLElement>(`[data-demo-root="${id}"]`);
      const mount = mounts[id];
      if (root && mount) handles[id] = mount(root, locale);
    }
  }

  function openFromHash(): void {
    const id = idFromHash(location.hash);
    if (!id) return;
    open(id);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section
      .querySelector<HTMLElement>(`[data-demo-panel="${id}"]`)
      ?.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => open(tab.dataset.demoTab as DemoId));
    tab.addEventListener('keydown', (e) => {
      const move = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      const to = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : move ? (i + move + tabs.length) % tabs.length : -1;
      if (to < 0) return;
      e.preventDefault();
      open(tabs[to].dataset.demoTab as DemoId, true);
    });
  });

  section.querySelectorAll<HTMLElement>('[data-demo-reset]').forEach((btn) =>
    btn.addEventListener('click', () => handles[btn.dataset.demoReset as DemoId]?.reset()),
  );

  window.addEventListener('hashchange', openFromHash);
  // Clicking a link to the demo that is already in the address bar fires no hashchange.
  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#demo-"]');
    if (link && link.getAttribute('href') === location.hash) {
      e.preventDefault();
      openFromHash();
    }
  });

  const first = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0];
  if (idFromHash(location.hash)) openFromHash();
  else if (first) open(first.dataset.demoTab as DemoId);
}

/** Bring a tab into view inside its own (sideways-scrolling) tab list, without moving the page. */
export function revealTab(tab: HTMLElement): void {
  const list = tab.parentElement;
  if (!list) return;
  const left = tab.offsetLeft - list.offsetLeft;
  if (left < list.scrollLeft) list.scrollLeft = left;
  else if (left + tab.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = left + tab.offsetWidth - list.clientWidth;
}
