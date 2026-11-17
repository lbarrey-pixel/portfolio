/**
 * Address of a page or file for metadata (canonical, hreflang, social image).
 * While the site has no domain (SITE.domain is null) it stays a root-relative path;
 * once the domain is set, every address becomes https://<domain>/...
 */
export function absoluteUrl(path: string, domain: string | null): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!domain) return p;
  const host = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return `https://${host}${p}`;
}
