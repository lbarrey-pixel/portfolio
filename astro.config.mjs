// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';

// Windows: when the shell's working directory has a lowercase drive letter ("c:\..."), Astro
// builds pages without their stylesheet links. Pin the root with an uppercase drive letter.
const root = fileURLToPath(new URL('.', import.meta.url)).replace(/^[a-z]:/, (d) => d.toUpperCase());
if (process.platform === 'win32') process.chdir(root);

// https://astro.build/config
export default defineConfig({
  root,
  output: 'static',
  // Locales are authored by hand (src/pages/en, src/pages/pt-br, and the root
  // redirect). `manual` keeps Astro from requiring a locale prefix on every URL,
  // so the English-only /hire/ page is served as itself. /en/ and /pt-br/ are unchanged.
  i18n: {
    locales: ['en', 'pt-br'],
    defaultLocale: 'en',
    routing: 'manual',
  },
  // Downloaded at build time and served from this site (no third-party font requests).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-schibsted',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      weights: [400, 500],
      styles: ['italic', 'normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Spline Sans Mono',
      cssVariable: '--font-spline-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'Menlo', 'monospace'],
    },
  ],
});
