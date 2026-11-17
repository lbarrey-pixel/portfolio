import { describe, expect, it } from 'vitest';
import { absoluteUrl } from '../../src/lib/site';

describe('absoluteUrl', () => {
  it('stays a root-relative path while there is no domain', () => {
    expect(absoluteUrl('/en/', null)).toBe('/en/');
    expect(absoluteUrl('/og.png', null)).toBe('/og.png');
  });

  it('uses https on the domain once it is set', () => {
    expect(absoluteUrl('/en/', 'example.com')).toBe('https://example.com/en/');
    expect(absoluteUrl('/', 'example.com')).toBe('https://example.com/');
  });

  it('accepts a domain written with a scheme or a trailing slash', () => {
    expect(absoluteUrl('/pt-br/', 'https://example.com/')).toBe('https://example.com/pt-br/');
    expect(absoluteUrl('og.png', 'example.com')).toBe('https://example.com/og.png');
  });
});
