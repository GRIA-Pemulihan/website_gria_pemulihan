GRIA V25 — FOLDER FOTO HOME OTOMATIS

Tujuan:
Mulai versi ini, foto Hero di Home tidak lagi mengambil foto acak dari Wikimedia.
Home akan memprioritaskan foto yang Anda upload sendiri ke folder:

foto-home/

CARA INSTALL PATCH V25
Upload ke root repository:

REPLACE:
- service-worker.js

ADD:
- gria-home-v25.js
- foto-home.json
- build_home_photos.py

ADD FOLDER:
- foto-home/.gitkeep

ADD WORKFLOW:
- .github/workflows/update-home-photos.yml

Setelah commit, tutup aplikasi GRIA dan buka lagi.

==================================================
CARA MENAMBAH FOTO SETELAH V25 TERPASANG
==================================================

1. Buka repository GitHub.
2. Buka folder: foto-home
3. Klik Add file > Upload files.
4. Pilih foto.
5. Commit changes.

GitHub Action "Update Foto Home GRIA" akan otomatis:
- membaca semua gambar di folder foto-home
- memperbarui foto-home.json
- Home GRIA otomatis memakai koleksi foto tersebut

Foto akan BERGANTI OTOMATIS SETIAP HARI berdasarkan urutan nama file.

==================================================
FORMAT FOTO YANG DIREKOMENDASIKAN
==================================================

FORMAT:
- JPG / JPEG = direkomendasikan
- WEBP = paling ringan
- PNG = boleh
- JANGAN HEIC

UKURAN:
- Ideal: 1600 x 1200 px (4:3 landscape)
- Minimal: 1200 x 900 px
- File ideal: 200–600 KB
- Usahakan maksimal ±1 MB per foto

NAMA FILE:
home-001.jpg
home-002.jpg
home-003.jpg
home-004.jpg

Aturan nama:
- huruf kecil
- tanpa spasi
- gunakan tanda - jika perlu
- jangan gunakan karakter aneh

KOMPOSISI:
- landscape / horizontal
- subjek utama sebaiknya di tengah
- hindari wajah terlalu dekat tepi
- sisakan area yang cukup untuk teks ayat
- pilih foto kegiatan GRIA / gereja / salib / ibadah / persekutuan yang pantas untuk Home

CATATAN:
Jika folder foto-home masih kosong, Home otomatis memakai foto GRIA lama sebagai fallback.

Commit message untuk patch:
Apply GRIA V25 local Home photo folder
