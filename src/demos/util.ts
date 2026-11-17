/** Small helpers shared by the demos. */

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text before it goes into an HTML string. */
export function esc(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

/** Fill `{name}` placeholders in a string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
