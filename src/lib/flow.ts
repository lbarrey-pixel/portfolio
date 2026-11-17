/** Which step is active for a scroll progress in 0..1 (anything else is clamped; NaN is the start). */
export function stepForProgress(progress: number, count: number): number {
  const p = Number.isNaN(progress) ? 0 : Math.min(1, Math.max(0, progress));
  return Math.min(count - 1, Math.floor(p * count));
}

/** The flow line is drawn in this coordinate space, then stretched to its box. */
export const FLOW_VIEW = { w: 1000, h: 300 } as const;

const MID = FLOW_VIEW.h / 2;
const TOP = 110;
const BOTTOM = 190;

/** Where each of the 5 steps sits on the line. */
export const FLOW_NODES: readonly { x: number; y: number }[] = [
  { x: 100, y: TOP },
  { x: 300, y: BOTTOM },
  { x: 500, y: TOP },
  { x: 700, y: BOTTOM },
  { x: 900, y: TOP },
];

// The line enters and leaves on the middle line.
const KNOTS = [{ x: 0, y: MID }, ...FLOW_NODES, { x: FLOW_VIEW.w, y: MID }];

/** SVG path: one cubic per segment, flat at every knot so the line eases through each step. */
export function flowPathD(): string {
  let d = `M ${KNOTS[0].x} ${KNOTS[0].y}`;
  for (let i = 1; i < KNOTS.length; i++) {
    const a = KNOTS[i - 1];
    const b = KNOTS[i];
    const mx = (a.x + b.x) / 2;
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
  }
  return d;
}

/** Height of the line at a given x (so a marker can ride exactly on it). */
export function flowYAt(x: number): number {
  const cx = Number.isNaN(x) ? 0 : Math.min(FLOW_VIEW.w, Math.max(0, x));
  let i = 1;
  while (i < KNOTS.length - 1 && cx > KNOTS[i].x) i++;
  const a = KNOTS[i - 1];
  const b = KNOTS[i];
  const target = (cx - a.x) / (b.x - a.x);
  // With both control points at the horizontal midpoint, x(t) = 1.5t(1-t) + t^3 (rising), so bisect.
  let lo = 0;
  let hi = 1;
  for (let n = 0; n < 40; n++) {
    const t = (lo + hi) / 2;
    if (1.5 * t * (1 - t) + t * t * t < target) lo = t;
    else hi = t;
  }
  const t = (lo + hi) / 2;
  return a.y + (b.y - a.y) * (3 * t * t - 2 * t * t * t);
}
