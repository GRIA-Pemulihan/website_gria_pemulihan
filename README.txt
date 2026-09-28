GRIA V7 — ALKITAB AYT LOKAL

Repository sumber: AYT (Alkitab Yang Terbuka) yang Anda upload.

UPLOAD / REPLACE DI ROOT REPOSITORY website-gria:
1. alkitab.html          -> replace
2. jemaat.html           -> replace
3. service-worker.js     -> replace
4. ayt-data.min.json     -> file baru (~4.9 MB)
5. AYT-LICENSE.html      -> file baru

Tidak perlu edit pwa.js, persekutuan.html, atau warta.html.

HASIL:
- Tidak memakai API Alkitab eksternal.
- 66 kitab / 31.102 ayat AYT ada di repo GRIA sendiri.
- Pilih kitab -> semua pasal kitab terbuka berurutan.
- Scroll ke bawah untuk pindah pasal secara natural.
- Dropdown Kitab / Pasal / Ayat untuk lompat cepat.
- Ayat yang dipilih mendapat highlight.
- Posisi terakhir tersimpan di perangkat.
- Tombol Kembali ke Jemaat tersedia.
- Setelah data pertama kali termuat, service worker v7 menyimpannya di cache.
- Lisensi/atribusi AYT ikut disertakan.

COMMIT:
Integrate local AYT Bible reader

Setelah commit: tunggu deploy, refresh Safari, tutup PWA, lalu buka lagi.
