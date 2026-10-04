GRIA V26.1 — COMPLETE FIX

PERBAIKAN:
- Daily Christian/Nature Hero tetap aktif.
- Workflow yang sebelumnya 'hilang' disediakan lagi.
- Ada salinan workflow yang terlihat di iPhone: WORKFLOWS-UPLOAD-IPHONE/
- Folder asli tetap tersedia di .github/workflows/
- Ayat Home sekarang lebih kecil, ringan, smooth, dan tidak terlalu bold.
- Cache PWA dinaikkan ke gria-pwa-v26-1 agar perubahan cepat terbaca.
- foto-home/ sekarang berisi panduan sehingga tidak tampak kosong.

UPLOAD ROOT / REPLACE:
- index.html
- service-worker.js
- gria-home-v26.js
- gria-home-v26.css
- update_daily_hero.py
- daily-hero.json

WORKFLOW — upload ke .github/workflows/:
- update-daily-hero.yml
- update-home-photos.yml
- update-warta.yml

FOLDER:
- foto-home/README-FOTO.txt

SETELAH UPLOAD:
1. Commit ke main.
2. GitHub > Actions.
3. Harus muncul "Update Daily Hero Photo".
4. Buka workflow itu > Run workflow.
5. Setelah sukses, cek daily-hero.json sudah berisi data foto.
6. Tutup PWA GRIA sepenuhnya, lalu buka lagi.

Commit:
Apply GRIA V26.1 complete workflows and smooth Home verse
