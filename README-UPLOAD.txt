GRIA PWA v2 — LANGKAH UPLOAD DARI HP

TUJUAN
- Welcome gate: Jemaat GRIA / Tamu
- Bottom nav mobile: Home | Warta | Persekutuan | User
- Alkitab Saya berada di User
- Pendalaman Alkitab & Persekutuan Doa berada di Persekutuan
- Sistem login Supabase lama tetap dipakai

UPLOAD / REPLACE FILE BERIKUT KE ROOT REPOSITORY:
1. pwa.js                  (REPLACE file lama)
2. service-worker.js       (REPLACE file lama)
3. manifest.webmanifest    (REPLACE file lama)
4. persekutuan.html        (FILE BARU)
5. user.html               (FILE BARU)
6. dashboard.html          (REPLACE file lama; sekarang redirect ke User)

SETELAH ITU EDIT warta.html:
Tambahkan sebelum </body>:
<script src="pwa.js" defer></script>

index.html TIDAK PERLU diubah karena saat ini sudah memanggil pwa.js.

COMMIT MESSAGE:
GRIA mobile app shell v2

SETELAH COMMIT:
- Tunggu GitHub Pages deploy.
- Tutup paksa PWA GRIA di iPhone lalu buka lagi.
- Jika tampilan lama masih muncul, buka Safari ke URL GRIA, refresh, lalu buka PWA lagi.
- Saat pertama kali masuk Home, pilih Jemaat GRIA atau Lanjut sebagai tamu.
