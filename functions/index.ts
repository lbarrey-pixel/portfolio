// Cloudflare Pages Function for the root address "/".
// It answers with a redirect to /pt-br/ or /en/ before any page is sent, so a visitor never
// sees a language-picker page: first the language they chose with the EN/PT switch (a cookie),
// otherwise the browser's language (Accept-Language).
// public/_routes.json limits this function to "/" — every other address, including
// the English-only /hire/ page, is served as a static file and is never redirected.
// Outside Cloudflare (npm run dev / preview) the static src/pages/index.astro does the same job in the browser.
import { localeFromRequest, localePath } from '../src/i18n/locales';

interface Context {
  request: Request;
  next: () => Promise<Response>;
}

export async function onRequest({ request, next }: Context): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname !== '/' || (request.method !== 'GET' && request.method !== 'HEAD')) return next();

  const locale = localeFromRequest(request.headers.get('Cookie'), request.headers.get('Accept-Language'));
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${localePath(locale)}${url.search}`,
      // The answer depends on who asks: never store it.
      'Cache-Control': 'no-store',
      Vary: 'Accept-Language, Cookie',
    },
  });
}
