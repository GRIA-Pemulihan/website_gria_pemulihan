GRIA V24 — HOME FOCUS + JEMAAT 2027 + AUTO SYNC PELAYAN FIRMAN

UPLOAD / REPLACE

Root repository:
- index.html                     (REPLACE)
- jemaat.html                    (REPLACE)
- service-worker.js              (REPLACE)
- gria-home-v24.js               (ADD)
- gria-home-v24.css              (ADD)
- update_home_from_warta.py      (ADD)

Folder .github/workflows:
- update-warta.yml               (REPLACE)

PERUBAHAN
1. Home:
   - Card Tema dihapus.
   - Hanya Lokasi + Pelayan Firman.
   - Event & RSVP serta Ruang Alkitab dihapus dari Home.
   - Tombol utility V18 “GRIA sudah terpasang / Cari di GRIA” di Home disembunyikan karena Cari sudah ada di quick menu.
   - Home lebih ringkas.

2. Sinkron Warta → Home:
   - Tanggal ibadah dan Pelayan Firman diambil dari sheet JadwalPelayanan yang sama dengan Warta.
   - Jadi Home tidak hardcode nama.
   - Jika jadwal tanggal tersebut di Warta berubah, Home ikut berubah pada workflow berikutnya.
   - Lokasi dan Alamat dapat ikut otomatis bila sheet InfoIbadah memiliki kolom “Lokasi” dan “Alamat”.
   - Zona waktu pemilihan minggu menggunakan UTC+8 / Palu.

3. Ruang Jemaat:
   - Desain dirapikan.
   - Active: Ruang Alkitab, Jadwal Saya, Pendalaman Alkitab & Doa.
   - Coming Soon 2027: Daftar Jemaat GRIA Pemulihan Palu.
   - Coming Soon 2027: Bible Reading Tracker.
   - Coming Soon PA: Bank Quotes PA — quotes/highlight pribadi per user dan dapat dilacak dari sesi ke sesi.

SETELAH UPLOAD
- Commit semua file.
- Tunggu GitHub Pages update.
- Jalankan Actions > Update Warta & Ulang Tahun dari Google Sheet > Run workflow sekali agar Home langsung mengambil Pelayan Firman terbaru.
- Tutup PWA GRIA dan buka lagi agar service worker V24 aktif.

Commit message:
Apply GRIA V24 focused home member roadmap and Warta sync
