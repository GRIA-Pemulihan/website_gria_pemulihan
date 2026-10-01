GRIA V18 — MODERN APP LAYER
Repository tujuan:
GRIA-Pemulihan/website_gria_pemulihan

UPLOAD / REPLACE file berikut di ROOT repository:
1. service-worker.js              (REPLACE)
2. manifest.webmanifest           (REPLACE)
3. gria-modern.js                 (NEW)
4. gria-modern.css                (NEW)
5. search.html                    (NEW)
6. jadwal-saya.html               (NEW)
7. events.html                    (NEW)

JANGAN hapus:
- pwa-v16.js
- pwa.js
- shared.css
- warta-mobile.js
- update_warta.py
- workflow GitHub Actions

Setelah upload:
1. Commit ke branch main.
2. Tunggu GitHub Pages deploy ±1–3 menit.
3. Buka https://gria-pemulihan.github.io/website_gria_pemulihan/
4. Refresh sekali. Jika PWA lama masih terbuka, tutup-buka lagi atau reload.
5. Cek Home > tombol “Pasang GRIA di HP” dan “Cari di GRIA”.
6. Cek Warta > status “Diperbarui” + tombol Bagikan.
7. Masuk Ruang Jemaat dengan kode yang sudah digunakan > cek Jadwal Saya, Event & RSVP, Notifikasi Warta.
8. Bottom navigation mobile menjadi 5 item: Home · Warta · Cari · Persekutuan · Jemaat.

FITUR V18:
- GRIA Search.
- Jadwal Saya berdasarkan nama pada tabel Warta terbaru.
- Event & RSVP sederhana dari Informasi Umum Warta.
  RSVP pada V18 disimpan di perangkat, belum dikirim ke database pusat.
- Install PWA guidance Android / iPhone.
- Warta last-updated + share.
- Notifikasi update Warta saat GRIA dibuka dan perubahan terdeteksi.
  Ini belum push notification background penuh.
- Online/offline indicator.
- Page progress transition.
- Skeleton loading pada halaman data.
- Semua fitur mengikuti dark/light theme yang sudah ada.
- Tidak mengubah blok auto-generated Google Sheet di warta.html/index.html.

CATATAN:
GitHub connector saat ini bisa membaca repo tetapi write API ditolak oleh integrasi (403),
jadi paket ini dibuat untuk upload manual tanpa merusak automation yang sudah berjalan.

Commit message yang disarankan:
Apply GRIA V18 modern app layer
