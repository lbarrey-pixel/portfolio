import { defineMiddleware } from 'astro:middleware';

// Astro requires a middleware file when i18n.routing is "manual".
// This one does not rewrite addresses: /en/ and /pt-br/ are real pages, the root
// redirect is the page at / plus the Cloudflare function, and /hire/ must stay
// an unprefixed English page.
export const onRequest = defineMiddleware((_context, next) => next());
