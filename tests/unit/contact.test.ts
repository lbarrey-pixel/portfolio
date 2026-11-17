import { describe, expect, it } from 'vitest';
import { emailHref, whatsappUrl } from '../../src/lib/contact';

describe('contact', () => {
  it('whatsappUrl encodes the message', () => {
    expect(whatsappUrl('5548999406747', 'Oi Leonardo, vi seu portfólio')).toBe(
      'https://wa.me/5548999406747?text=Oi%20Leonardo%2C%20vi%20seu%20portf%C3%B3lio',
    );
  });

  it('emailHref', () => {
    expect(emailHref(null)).toBeNull();
    expect(emailHref('a@b.co')).toBe('mailto:a@b.co');
  });
});
