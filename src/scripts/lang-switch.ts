import { LOCALES, STORAGE_KEY, localePath, type Locale } from '../i18n/locales';

/** Remembers the chosen language and keeps the current #section when switching. */
export function initLangSwitch(root: ParentNode = document): void {
  root.querySelectorAll<HTMLAnchorElement>('a[data-lang-switch]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.dataset.locale as Locale;
      if (!LOCALES.includes(target)) return;
      try {
        localStorage.setItem(STORAGE_KEY, target);
      } catch {
        // Storage blocked (private mode, policy): the link still works.
      }
      try {
        // The same choice as a cookie, so the server can redirect "/" without showing a page first.
        document.cookie = `${STORAGE_KEY}=${target}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // Cookies blocked: the browser-side redirect on "/" still reads localStorage.
      }
      if (location.hash) {
        event.preventDefault();
        location.assign(localePath(target, location.hash));
      }
    });
  });
}
