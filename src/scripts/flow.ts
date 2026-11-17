import { FLOW_VIEW, flowYAt, stepForProgress } from '../lib/flow';

/**
 * Work section: project tabs, and the flow that follows the scroll.
 * Progress 0..1 is how far the visitor has scrolled through the stage; it lights the steps
 * (stepForProgress) and moves the marker along the line.
 */
export function initFlow(section: HTMLElement): void {
  const scroller = section.querySelector<HTMLElement>('[data-flow-scroller]');
  const stage = section.querySelector<HTMLElement>('[data-flow-stage]');
  const tabs = [...section.querySelectorAll<HTMLElement>('[data-project-tab]')];
  const panels = [...section.querySelectorAll<HTMLElement>('[data-project-panel]')];
  const details = [...section.querySelectorAll<HTMLElement>('[data-project-detail]')];
  if (!scroller || !stage || tabs.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.dataset.projectTab ?? '';
  let shown = reduced ? 1 : 0; // eased progress actually on screen
  let frame = 0;

  const activePanel = () => panels.find((p) => p.dataset.projectPanel === active);

  function target(): number {
    if (reduced) return 1;
    if (getComputedStyle(stage!).position === 'sticky') {
      const r = scroller!.getBoundingClientRect();
      const span = r.height - stage!.offsetHeight;
      const top = parseFloat(getComputedStyle(stage!).top) || 0;
      return span > 0 ? clamp((top - r.top) / span) : 1;
    }
    // Not pinned (phones, short windows): follow the flow itself through the viewport.
    const flow = activePanel()?.querySelector<HTMLElement>('[data-flow]');
    if (!flow) return 0;
    const r = flow.getBoundingClientRect();
    return r.height > 0 ? clamp((window.innerHeight * 0.72 - r.top) / r.height) : 0;
  }

  function paint(progress: number): void {
    const panel = activePanel();
    const flow = panel?.querySelector<HTMLElement>('[data-flow]');
    if (!panel || !flow) return;
    const nodes = panel.querySelectorAll<HTMLElement>('[data-flow-node]');
    const step = stepForProgress(progress, nodes.length);
    nodes.forEach((node, i) => {
      node.classList.toggle('is-on', i <= step);
      node.classList.toggle('is-current', i === step);
    });
    // The marker reaches step i exactly when it lights: step 0 sits at 10% of the line.
    const f = Math.min(1, 0.1 + progress);
    flow.style.setProperty('--f', f.toFixed(4));
    flow.style.setProperty('--my', ((flowYAt(f * FLOW_VIEW.w) / FLOW_VIEW.h) * 100).toFixed(2));
  }

  function tick(): void {
    frame = 0;
    const goal = target();
    shown = reduced || Math.abs(goal - shown) < 0.002 ? goal : shown + (goal - shown) * 0.14;
    paint(shown);
    if (shown !== goal) frame = requestAnimationFrame(tick);
  }

  function schedule(): void {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function select(id: string, focus = false): void {
    active = id;
    for (const tab of tabs) {
      const on = tab.dataset.projectTab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
      if (on) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    for (const panel of panels) panel.hidden = panel.dataset.projectPanel !== id;
    for (const detail of details) detail.hidden = detail.dataset.projectDetail !== id;
    paint(shown);
    schedule();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset.projectTab ?? ''));
    tab.addEventListener('keydown', (e) => {
      const move = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      const to = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : move ? (i + move + tabs.length) % tabs.length : -1;
      if (to < 0) return;
      e.preventDefault();
      select(tabs[to].dataset.projectTab ?? '', true);
    });
  });

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  paint(shown);
  schedule();
}

function clamp(v: number): number {
  return Number.isNaN(v) ? 0 : Math.min(1, Math.max(0, v));
}
