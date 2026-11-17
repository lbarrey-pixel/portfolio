import { describe, expect, it } from 'vitest';
import { SITE } from '../../src/config';

describe('SITE config', () => {
  it('has no email at launch', () => {
    expect(SITE.email).toBeNull();
  });
  it('has the WhatsApp number in E.164', () => {
    expect(SITE.phoneE164).toBe('5548999406747');
  });
});
