GRIA V4 — JEMAAT + WARTA SWIPE

UPLOAD / REPLACE DI ROOT REPOSITORY:
1. pwa.js                  -> replace
2. warta-mobile.js         -> replace
3. service-worker.js       -> replace
4. manifest.webmanifest    -> replace
5. jemaat.html             -> file baru
6. user.html               -> replace (redirect ke jemaat.html)
7. daftar.html             -> replace (redirect ke jemaat.html)
8. dashboard.html          -> replace (redirect ke jemaat.html)

TIDAK PERLU EDIT warta.html.

HASIL:
- Bottom nav: Home | Warta | Persekutuan | Jemaat
- Akses Jemaat memakai kode GRIA2026
- Keterangan: tanyakan kode di grup WhatsApp GRIA
- Tracker bacaan disimpan lokal di HP
- Jadwal Pelayanan = swipe cards
- Laporan Persembahan = swipe cards + Total Minggu + Total Periode
- Informasi Umum = swipe cards
- Font card Warta = Manrope

CATATAN KEAMANAN:
Kode GRIA2026 berada di JavaScript frontend, sehingga ini adalah gate sederhana,
bukan autentikasi aman untuk data sensitif.

COMMIT MESSAGE:
Switch to Jemaat access and improve Warta swipe cards

SETELAH COMMIT:
Tunggu 1-3 menit, refresh website dari Safari, lalu tutup PWA dari app switcher dan buka ulang.
