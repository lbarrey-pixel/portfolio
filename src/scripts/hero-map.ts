/**
 * Runs the hero's live system map: one step lights up every ~1.3 s, the rail dot travels
 * to it and the log prints that step's line. After the last step it holds one beat, then
 * starts over from the first step (so there is always at least one step on).
 *
 * Markup contract (HeroMap.astro): root `[data-hero-map]`, steps `[data-step]`,
 * log text `[data-log]`, optional clock `[data-log-time]`.
 */
const TICK_MS = 1300;
const FIRST_TICK_MS = 900; // let the headline reveal land first
const HOLD_TICKS = 1;

function clock(d: Date): string {
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
}

export function startHeroMap(root: HTMLElement, log: string[]): () => void {
  const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const logEl = root.querySelector<HTMLElement>('[data-log]');
  const timeEl = root.querySelector<HTMLElement>('[data-log-time]');
  const last = steps.length - 1;
  if (last < 0 || !logEl) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const typing = window.matchMedia('(min-width: 40rem)');

  function show(i: number, animate: boolean): void {
    steps.forEach((s, j) => {
      s.classList.toggle('is-on', j <= i);
      s.classList.toggle('is-current', j === i);
    });
    root.style.setProperty('--i', String(i));
    root.dataset.running = 'true';
    const line = log[i] ?? log[log.length - 1] ?? '';
    logEl!.textContent = line;
    if (timeEl) timeEl.textContent = clock(new Date());
    if (!animate) return;
    // Wide screens "type" the line; narrow ones (where it may wrap) fade it in.
    const frames = typing.matches
      ? [{ maxWidth: '0ch' }, { maxWidth: `${line.length + 1}ch` }]
      : [{ opacity: 0 }, { opacity: 1 }];
    logEl!.animate(frames, {
      duration: Math.min(700, line.length * 22),
      easing: typing.matches ? `steps(${line.length})` : 'ease-out',
    });
  }

  if (reduced) {
    show(last, false);
    return () => {};
  }

  let tick = 0; // counts through steps, then HOLD_TICKS extra beats on the last one
  let interval: number | undefined;
  const advance = () => {
    const cycle = steps.length + HOLD_TICKS;
    const i = tick % cycle;
    if (i <= last) show(i, true);
    tick++;
  };
  const first = window.setTimeout(() => {
    advance();
    interval = window.setInterval(advance, TICK_MS);
  }, FIRST_TICK_MS);

  return () => {
    window.clearTimeout(first);
    window.clearInterval(interval);
  };
}
