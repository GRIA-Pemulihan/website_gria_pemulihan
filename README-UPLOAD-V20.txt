GRIA V20 — CHRISTIAN HERO + CALM TYPOGRAPHY

Tujuan:
- Home lebih smooth/calm, tidak bold berlebihan.
- Hero Ayat Hari Ini memakai referensi visual Kristen yang jelas.
- Daftar gambar berasal dari Wikimedia Commons dan disimpan di christian-media.json.
- Jika gambar Wikimedia tidak tersedia, hero otomatis memakai foto GRIA lokal sebagai fallback.
- Ayat harian AYT, marker Google Sheet, V18 Search/Jadwal Saya/Event tetap dipertahankan.

UPLOAD KE ROOT REPOSITORY:
REPLACE:
1. index.html
2. service-worker.js

ADD:
3. gria-home-v20.css
4. gria-home-v20.js
5. christian-media.json
6. IMAGE-SOURCES.md

JANGAN HAPUS:
- pwa-v16.js
- gria-modern.js
- gria-modern.css
- search.html
- jadwal-saya.html
- events.html
- ayt-data.min.json
- foto-komunitas-hero.png
- foto-kebersamaan-gria.png
- foto-hut-gria.png

Suggested commit:
Apply GRIA V20 Christian hero and calm typography

Setelah commit, tunggu GitHub Pages deploy. Service worker v20 akan membersihkan cache v19.
