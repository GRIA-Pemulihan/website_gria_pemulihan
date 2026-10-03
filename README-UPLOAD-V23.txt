GRIA V23 — PERFORMANCE / SMOOTHNESS

Upload ke ROOT repository:

REPLACE
1. index.html
2. service-worker.js

ADD
3. gria-home-v23.js
4. gria-performance-v23.js
5. gria-performance-v23.css

Jangan hapus file V22.

Apa yang dioptimalkan:
- Service Worker tidak lagi pre-cache foto besar ±5 MB saat instalasi.
- Home & halaman lain memakai cache-first / stale-while-revalidate agar terbuka cepat.
- Warta tetap mencoba versi terbaru, tetapi fallback ke cache setelah ±1,2 detik.
- Hero Kristen memakai thumbnail Wikimedia ±960 px, bukan original resolution.
- Gambar hero dimuat setelah konten utama tampil, lalu fade-in.
- Google Fonts tidak diperlukan pada halaman yang dikontrol SW; memakai system font agar render lebih cepat dan konsisten.
- Blur berat pada bottom navigation dikurangi untuk menghilangkan jank saat scroll iPhone/Android.
- Konten di bawah layar memakai content-visibility.
- Gambar non-prioritas dibuat lazy + async decode.

Sesudah upload:
1. Commit.
2. Tunggu GitHub Pages update.
3. Tutup PWA/browser GRIA sepenuhnya.
4. Buka lagi. Jika masih membawa cache lama, reload sekali lagi.

Commit message:
Apply GRIA V23 performance and smooth loading
