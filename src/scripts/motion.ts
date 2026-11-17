/**
 * The page's motion layer. Everything here is an enhancement: with reduced motion (or without
 * JavaScript) nothing runs and the CSS shows every element in its final state.
 *
 *   [data-reveal]        fades up when it scrolls into view (adds .is-in)
 *   [data-reveal-lines]  a headline whose lines rise one after another (adds .is-in)
 *   [data-count]         a number that counts up to its value the first time it is seen
 *   [data-magnetic]      a button that leans toward a fine pointer
 *   [data-tilt]          a card that tilts toward the pointer; --gx/--gy carry its position
 */
export function initMotion(root: Document): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  reveal(root);
  countUp(root);

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(magnetic);
    root.querySelectorAll<HTMLElement>('[data-tilt]').forEach(tilt);
  }
}

function reveal(root: Document): void {
  const lines = [...root.querySelectorAll<HTMLElement>('[data-reveal-lines]')];
  lines.forEach(splitLines);

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el));
  lines.forEach((el) => io.observe(el));
}

/** Wrap each word so it can rise from behind its own line; --l is the word's line number. */
function splitLines(el: HTMLElement): void {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  const inners: HTMLElement[] = [];
  words.forEach((word, i) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    const inner = document.createElement('span');
    inner.textContent = word;
    outer.append(inner);
    el.append(outer, i < words.length - 1 ? ' ' : '');
    inners.push(inner);
  });
  let line = -1;
  let top = Number.NaN;
  for (const inner of inners) {
    const t = inner.parentElement!.offsetTop;
    if (t !== top) {
      top = t;
      line++;
    }
    inner.style.setProperty('--l', String(line));
  }
}

function countUp(root: Document): void {
  const format = new Intl.NumberFormat(root.documentElement.lang || 'en');
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        run(entry.target as HTMLElement);
      }
    },
    { threshold: 0.4 },
  );

  function run(el: HTMLElement): void {
    const value = Number(el.dataset.count);
    if (!Number.isFinite(value)) return;
    const text = (n: number) => `${el.dataset.prefix ?? ''}${format.format(n)}${el.dataset.suffix ?? ''}`;
    const duration = 1100;
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = text(t < 1 ? Math.round(value * eased) : value);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => io.observe(el));
}

function magnetic(el: HTMLElement): void {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.translate = '';
  });
}

function tilt(el: HTMLElement): void {
  const MAX = 2.6; // degrees: enough to feel the paper move, not enough to disturb reading
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 2 * MAX).toFixed(2)}deg) rotateY(${((px - 0.5) * 2 * MAX).toFixed(2)}deg)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = '';
  });
}
