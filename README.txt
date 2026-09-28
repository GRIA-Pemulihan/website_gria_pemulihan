GRIA V5 — ALKITAB + PERSEKUTUAN + WARTA

UPLOAD / REPLACE FILE DI ROOT REPOSITORY:
1. jemaat.html           -> replace
2. alkitab.html          -> file baru
3. persekutuan.html      -> replace
4. warta-mobile.js       -> replace
5. service-worker.js     -> replace

TIDAK PERLU EDIT:
- warta.html
- pwa.js
- index.html

HASIL:
JEMAAT
- Bible Reading Tracker dihapus dari fitur aktif.
- Fitur utama sekarang: Alkitab.
- Alkitab: English KJV, Hebrew WLC (PL), Greek Textus Receptus/TR (PB).
- Bible Reading Tracker 2027 = Coming Soon.
- Bank Ayat Tahunan by Member = Coming Soon.
- Alkitab hanya bisa dibuka jika kode jemaat sudah dimasukkan.

PERSEKUTUAN
- Pendalaman Alkitab -> alkitab.html
- Persekutuan Doa -> warta.html#informasi-umum

WARTA
- Ulang Tahun Bulan Ini disembunyikan sementara.
- Jadwal, Persembahan, Informasi Umum tetap swipe cards.
- Smooth scroll + scroll snap.
- Card yang berada di tengah sedikit membesar/fokus.
- Total Minggu + Total Periode tetap aktif.

COMMIT MESSAGE:
Add member Bible and refine fellowship and Warta UX

SETELAH COMMIT:
1. Tunggu GitHub Pages 1-3 menit.
2. Buka website di Safari dan refresh.
3. Tutup PWA GRIA dari app switcher.
4. Buka lagi agar service worker v5 aktif.
