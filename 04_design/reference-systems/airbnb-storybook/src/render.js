import { init } from './init.js';

/** Wrap a section's HTML in a story container and run its behaviour once it is in the DOM. */
export function section(id, html) {
  const el = document.createElement('section');
  el.className = 'story';
  el.id = 's-' + id;
  el.innerHTML = html;
  setTimeout(() => {
    try { init[id]?.(el); } catch (e) { console.error(`[story ${id}]`, e); }
  }, 0);
  return el;
}
