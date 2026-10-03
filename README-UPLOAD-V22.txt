GRIA V22 — Warta PDF Table + Stable Bottom Nav + Font Consistency + TB Home Verse

UPLOAD/REPLACE DI ROOT REPOSITORY:
1. Replace index.html
2. Replace service-worker.js
3. Add gria-home-v22.js
4. Add gria-share-pdf-v22.js
5. Add gria-share-pdf-v22.css
6. Add gria-fix-v22.css
7. Add gria-fix-v22.js

JANGAN HAPUS:
- gria-modern.js / gria-modern.css
- gria-home-v20.css
- christian-media.json
- pwa-v16.js
- warta-mobile.js
- file/foto GRIA lainnya

PERUBAHAN V22:
- PDF Warta sekarang disusun dalam tabel per bagian, bukan teks panjang.
- Bottom navigation dipaksa tetap di bawah layar pada semua halaman mobile.
- Font global diseragamkan ke Manrope dengan weight lebih calm.
- Ayat Hari Ini di Home memakai TB (Terjemahan Baru) untuk kutipan pendek terpilih.
- Share Story Ayat ikut memakai label TB dan identitas GRIA.
- Service Worker naik ke gria-pwa-v22 untuk cache bust.

Setelah upload:
- Tunggu GitHub Pages update.
- Tutup aplikasi/PWA GRIA lalu buka kembali.
- Jika masih melihat versi lama, refresh sekali atau tutup-buka aplikasi lagi.

Commit message:
Apply GRIA V22 Warta PDF tables nav fix typography and TB verse
