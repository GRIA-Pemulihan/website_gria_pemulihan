GRIA V14 — MINIMAL HOME + GLOBAL DARK/LIGHT + CLEAN WARTA

UPLOAD / REPLACE:
1. index.html
2. pwa.js
3. warta-mobile.js
4. persekutuan.html
5. jemaat.html
6. service-worker.js

PERUBAHAN:

HOME
- Dipangkas menjadi satu fokus: Informasi Ibadah Minggu.
- Tidak ada lagi banner slider, search, quick menu, Ayat Hari Ini, atau Komunitas.
- Tanggal Minggu dihitung otomatis.
- Bottom nav tetap menjadi pintu utama ke fitur lain.

GLOBAL DARK / LIGHT
- Satu theme key untuk seluruh aplikasi: gria_theme_v1.
- Tombol theme otomatis muncul pada navbar subpage.
- Light mode mengubah background, heading, body text, card, form, navbar, footer, dan bottom nav.
- Bible Dark/Light disinkronkan dengan theme global.
- Service worker menyuntikkan pwa.js ke subpage lama yang belum memanggilnya.

WARTA
- Hero jauh lebih kecil.
- Section navigation lebih tipis.
- Jadwal Pelayanan / Persembahan / Informasi tetap lengkap dalam swipe card.
- Card lebih flat dan minimal.
- Total Minggu + Total Periode tetap ada.
- Ulang Tahun tetap disembunyikan.

PERSEKUTUAN
- "Kehidupan Bersama" dipindahkan ke sini.
- Ada satu visual card Komunitas GRIA.

JEMAAT
- Ayat Hari Ini dipindahkan ke bagian paling bawah.
- Fitur member lain tetap dipertahankan.

SERVICE WORKER
- Versi naik ke v14 untuk membersihkan cache lama.

COMMIT:
Simplify home and apply global dark light theme
