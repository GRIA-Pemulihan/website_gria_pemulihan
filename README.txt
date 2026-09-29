GRIA V15 — HEADER CLEANUP

UPLOAD / REPLACE:
1. pwa.js
2. service-worker.js

CHANGES:
- Removed from the visible UI:
  * Home explanatory sentence below Shalom.
  * Home bottom navigation instruction.
  * Warta long explanatory paragraph.
  * Warta "Diperbarui mingguan" helper text.
  * Jemaat explanatory subtitle.
  * Bible source explanatory subtitle.
  * TB copyright/repository explanatory paragraph inside the TB panel.
- Tightened GRIA wordmark globally so the A sits optically closer to GRI.
- Wordmark is forced to one line.
- Header typography across Warta, Persekutuan, Jemaat, Alkitab, About, and Yayasan
  uses tighter Syne kerning, stronger hierarchy, and more precise line-height.
- Dynamic cleanup also handles TB content rendered after the page loads.
- Service worker version bumped to v15.

COMMIT:
Polish GRIA headers and remove redundant copy
