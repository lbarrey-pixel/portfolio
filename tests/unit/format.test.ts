import { describe, expect, it } from 'vitest';
import { formatBRL, formatNumber } from '../../src/lib/format';

const norm = (s: string) => s.replace(/[  ]/g, ' ');

describe('format', () => {
  it('formatBRL per locale', () => {
    expect(norm(formatBRL(19.9, 'pt-br'))).toBe('R$ 19,90');
    expect(norm(formatBRL(19.9, 'en'))).toBe('R$19.90');
  });

  it('formatNumber per locale', () => {
    expect(formatNumber(4680, 'en')).toBe('4,680');
    expect(formatNumber(4680, 'pt-br')).toBe('4.680');
    expect(formatNumber(0.03, 'pt-br', 3)).toBe('0,030');
  });
});
