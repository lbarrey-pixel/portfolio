export function whatsappUrl(phoneE164: string, message: string): string {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}

/** null while there is no email address, so the button can stay hidden. */
export function emailHref(email: string | null): string | null {
  return email ? `mailto:${email}` : null;
}
