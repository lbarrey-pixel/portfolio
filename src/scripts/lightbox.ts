/**
 * Screenshot lightbox. Any button with [data-gallery="<id>"] opens the dialog on its picture;
 * the buttons sharing that id form the set that the arrows walk through.
 * A native <dialog> gives the focus trap, Escape, and focus back on the trigger when it closes.
 */
export function initLightbox(root: HTMLElement): void {
  const dialog = root.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!dialog) return;
  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lightbox-count]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')!;
  const ofWord = dialog.dataset.of ?? 'of';

  let set: HTMLElement[] = [];
  let index = 0;

  function show(i: number): void {
    index = (i + set.length) % set.length;
    const d = set[index].dataset;
    img.src = d.full ?? '';
    img.alt = d.alt ?? '';
    img.width = Number(d.width) || 0;
    img.height = Number(d.height) || 0;
    caption.textContent = d.caption ?? '';
    count.textContent = `${index + 1} / ${set.length}`;
    count.setAttribute('aria-label', `${index + 1} ${ofWord} ${set.length}`);
    const single = set.length < 2;
    prev.hidden = single;
    next.hidden = single;
  }

  root.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-gallery]');
    if (!trigger) return;
    set = [...root.querySelectorAll<HTMLElement>(`[data-gallery="${trigger.dataset.gallery}"]`)];
    show(set.indexOf(trigger));
    dialog.showModal();
  });

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (e) => {
    if (set.length < 2) return;
    if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'ArrowLeft') show(index - 1);
  });

  // A click on the backdrop (the dialog element itself, outside its content) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}
