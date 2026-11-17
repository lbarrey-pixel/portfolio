import { describe, expect, it } from 'vitest';
import { FLOW_NODES, FLOW_VIEW, flowPathD, flowYAt, stepForProgress } from '../../src/lib/flow';

describe('stepForProgress', () => {
  it('maps scroll progress to a step index', () => {
    expect(stepForProgress(0, 5)).toBe(0);
    expect(stepForProgress(0.19, 5)).toBe(0);
    expect(stepForProgress(0.2, 5)).toBe(1);
    expect(stepForProgress(0.99, 5)).toBe(4);
    expect(stepForProgress(1, 5)).toBe(4);
  });

  it('clamps progress outside 0..1', () => {
    expect(stepForProgress(-1, 5)).toBe(0);
    expect(stepForProgress(2, 5)).toBe(4);
  });

  it('treats NaN as the start', () => {
    expect(stepForProgress(NaN, 5)).toBe(0);
  });
});

describe('flow path', () => {
  it('has 5 nodes, evenly spaced, alternating above and below the middle', () => {
    expect(FLOW_NODES.map((n) => n.x)).toEqual([100, 300, 500, 700, 900]);
    const mid = FLOW_VIEW.h / 2;
    expect(FLOW_NODES.map((n) => n.y < mid)).toEqual([true, false, true, false, true]);
  });

  it('passes through every node', () => {
    for (const n of FLOW_NODES) expect(flowYAt(n.x)).toBeCloseTo(n.y, 3);
  });

  it('starts and ends on the middle line and clamps outside the view', () => {
    expect(flowYAt(0)).toBeCloseTo(FLOW_VIEW.h / 2, 3);
    expect(flowYAt(FLOW_VIEW.w)).toBeCloseTo(FLOW_VIEW.h / 2, 3);
    expect(flowYAt(-50)).toBeCloseTo(FLOW_VIEW.h / 2, 3);
    expect(flowYAt(NaN)).toBeCloseTo(FLOW_VIEW.h / 2, 3);
  });

  it('is halfway between two nodes at the midpoint between them', () => {
    expect(flowYAt(200)).toBeCloseTo((FLOW_NODES[0].y + FLOW_NODES[1].y) / 2, 3);
  });

  it('builds an SVG path that starts at the left edge', () => {
    expect(flowPathD().startsWith(`M 0 ${FLOW_VIEW.h / 2} C`)).toBe(true);
    expect(flowPathD().match(/C/g)).toHaveLength(6);
  });
});
