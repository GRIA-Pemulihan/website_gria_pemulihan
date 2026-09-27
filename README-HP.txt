GRIA PWA — cara manual dari HP

File yang perlu di-upload ke ROOT repository website-gria:
- manifest.webmanifest
- service-worker.js
- offline.html
- pwa.js
- icon-192.png
- icon-512.png
- apple-touch-icon.png

Lalu edit index.html:
1) Tempel isi INDEX_HEAD_SNIPPET.txt di dalam <head>, paling mudah tepat sebelum <link rel="preconnect" ...>.
2) Tempel isi INDEX_BODY_SNIPPET.txt tepat sebelum </body>.
3) Commit perubahan.

Catatan:
- Jangan hapus meta theme-color yang sudah ada.
- Tidak perlu mengubah Supabase/login.
- GitHub Pages sudah HTTPS, sehingga service worker dapat berjalan.
- Setelah deploy, buka https://moneybonde-bit.github.io/website-gria/ lalu Add to Home Screen di iPhone.
