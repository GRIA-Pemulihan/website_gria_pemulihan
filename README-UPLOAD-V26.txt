GRIA V26 — DAILY CHRISTIAN / NATURE HERO

APA YANG BERUBAH
- Foto Hero Home berganti otomatis setiap hari.
- Sumber otomatis: Wikimedia Commons.
- Selasa & Minggu lebih diarahkan ke foto bertema salib/Kristen.
- Hari lain dominan landscape, gunung, sunset.
- Hanya foto landscape resolusi memadai yang dipilih.
- Filter lisensi: CC BY / CC BY-SA / CC0 / Public Domain.
- Credit foto + lisensi tetap ditampilkan kecil di Hero.
- Tidak perlu API key.
- Jika Wikimedia gagal, Home otomatis fallback ke foto-home/ atau foto GRIA lama.
- Folder foto-home/ tetap dapat dipakai kapan saja sebagai fallback manual.

SUMBER KATEGORI UTAMA
- Quality images of landscapes
- Quality images of mountains
- Quality images of sunsets
- Featured pictures of mountains
- Featured pictures of sunsets
- Christian crosses with flowers
- Draped Easter Crosses
- Christian crosses

JADWAL
- GitHub Action berjalan setiap hari pukul sekitar 00.20 WITA.
- GitHub Actions schedule dapat terlambat beberapa menit; itu normal.

UPLOAD V26

REPLACE di root:
- index.html
- service-worker.js

ADD di root:
- gria-home-v26.js
- gria-home-v26.css
- update_daily_hero.py
- daily-hero.json

ADD / REPLACE workflow:
- .github/workflows/update-daily-hero.yml
- .github/workflows/update-home-photos.yml
- .github/workflows/update-warta.yml

ADD:
- foto-home/.gitkeep
  (folder ini boleh tetap kosong sampai Anda punya foto GRIA sendiri)

SETELAH UPLOAD
1. Commit semua file.
2. Buka GitHub > Actions.
3. Pilih "Update Daily Hero Photo".
4. Klik "Run workflow" sekali.
5. Tunggu job selesai.
6. Buka daily-hero.json — harus sudah berisi satu foto.
7. Tutup PWA GRIA lalu buka lagi.

Commit:
Apply GRIA V26 automatic daily Christian nature hero

CATATAN PENTING
- daily-hero.json hanya menyimpan URL + metadata, bukan file foto besar.
  Repository tidak akan membengkak setiap hari.
- Jika foto tertentu dirasa kurang cocok, jalankan workflow manual lagi pada
  hari yang sama setelah mengubah seed/kategori, atau sementara hapus isi
  daily-hero.json agar fallback lokal aktif.
