GRIA V6 — HOME RESPONSIVE + ALKITAB REBUILD

UPLOAD / REPLACE DI ROOT REPOSITORY:
1. pwa.js              -> replace
2. alkitab.html        -> replace
3. service-worker.js   -> replace

TIDAK PERLU EDIT FILE LAIN.

PERBAIKAN HOME:
- Tulisan besar GRIA dipaksa satu baris pada semua ukuran HP.
- Ukuran otomatis menyesuaikan lebar layar.
- Tidak ada lagi huruf A turun ke baris bawah.

PERBAIKAN ALKITAB:
- Tombol Kembali ke Jemaat.
- Selector Kitab, Pasal, dan Ayat.
- Pilihan English KJV, Hebrew WLC (PL), Greek TR (PB).
- Ayat pilihan otomatis highlight + smooth scroll.
- Previous / Next chapter.
- Primary source Midvash Bible API.
- Automatic fallback ke Bolls Bible.
- Cache lokal chapter yang pernah berhasil dibuka.
- Loading dan error state baru.

COMMIT MESSAGE:
Fix responsive GRIA hero and rebuild Bible reader

SETELAH COMMIT:
1. Tunggu 1-3 menit.
2. Refresh website melalui Safari.
3. Tutup PWA dari app switcher.
4. Buka kembali agar service worker v6 aktif.
