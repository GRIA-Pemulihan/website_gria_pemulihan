/* ============================================================
   GRIA — Clean Mobile Home
   Keeps desktop layout intact; simplifies only mobile/PWA view.
   ============================================================ */
(function () {
  'use strict';

  if (window.__griaHomeCleanLoaded) return;
  window.__griaHomeCleanLoaded = true;

  const mobile = window.matchMedia('(max-width: 768px)');

  const style = document.createElement('style');
  style.id = 'gria-home-clean-styles';
  style.textContent = `
    .gria-swipe-hint,
    .gria-home-actions { display:none; }

    @media (max-width: 768px) {
      /* ===== GLOBAL HOME RHYTHM ===== */
      body.gria-home-clean section {
        padding-top: 42px;
        padding-bottom: 42px;
      }

      body.gria-home-clean .section-head {
        margin-bottom: 24px;
      }

      body.gria-home-clean .section-title {
        font-size: clamp(28px, 9vw, 38px);
        line-height: 1.02;
      }

      body.gria-home-clean .section-lead {
        margin-top: 10px;
        font-size: 13px;
        line-height: 1.6;
        color: #93949a;
      }

      /* ===== HERO ===== */
      body.gria-home-clean .hero {
        min-height: 72svh;
        padding:
          calc(92px + env(safe-area-inset-top, 0px))
          20px
          48px;
        justify-content: center;
      }

      body.gria-home-clean .hero-title {
        font-size: clamp(76px, 28vw, 126px);
        line-height: .86;
      }

      body.gria-home-clean .hero-subtitle {
        margin-top: 14px;
        font-size: 12px;
        letter-spacing: .08em;
      }

      body.gria-home-clean .hero-tagline {
        max-width: 31ch;
        margin-top: 14px;
        font-size: 13.5px;
        line-height: 1.65;
        color: rgba(255,255,255,.70);
      }

      body.gria-home-clean .hero-actions {
        margin-top: 22px;
        gap: 9px;
      }

      body.gria-home-clean .hero-actions .btn-primary,
      body.gria-home-clean .hero-actions .btn-ghost {
        min-height: 46px;
        padding: 12px 17px;
        font-size: 12px;
      }

      body.gria-home-clean .scroll-cue {
        display:none !important;
      }

      /* Stats are nice on desktop but add noise on the app home. */
      body.gria-home-clean .stats-strip {
        display:none !important;
      }

      /* ===== DAILY VERSE ===== */
      body.gria-home-clean .daily-verse-section {
        padding-top: 18px;
        padding-bottom: 36px;
      }

      body.gria-home-clean .daily-verse-card {
        padding: 24px 20px;
        border-radius: 22px;
      }

      body.gria-home-clean .daily-verse-text {
        font-size: clamp(18px, 5.3vw, 23px);
        line-height: 1.5;
      }

      /* ===== ABOUT: MINIMAL ===== */
      body.gria-home-clean .about {
        padding-top: 26px;
      }

      body.gria-home-clean .about > .container > .section-head:first-child {
        margin-bottom: 12px;
      }

      body.gria-home-clean .about-story,
      body.gria-home-clean .bento-grid,
      body.gria-home-clean .pastor-grid,
      body.gria-home-clean .values-grid-3,
      body.gria-home-clean .section-head.center {
        display:none !important;
      }

      /* ===== FIVE PILLARS = SWIPE CARDS ===== */
      body.gria-home-clean .about .gria-pillar-grid {
        display:flex !important;
        grid-template-columns:none !important;
        gap:12px !important;
        width:auto;
        margin:
          0
          calc(-1 * var(--pad))
          20px !important;
        padding:
          2px
          var(--pad)
          10px;
        overflow-x:auto;
        overflow-y:hidden;
        scroll-snap-type:x mandatory;
        scrollbar-width:none;
        -webkit-overflow-scrolling:touch;
      }

      body.gria-home-clean .about .gria-pillar-grid::-webkit-scrollbar {
        display:none;
      }

      body.gria-home-clean .about .gria-pillar-grid .value-card {
        flex:0 0 min(78vw, 290px);
        min-height:190px;
        scroll-snap-align:start;
        padding:24px 21px;
        border-radius:22px;
        background:
          radial-gradient(circle at 100% 0%, rgba(204,255,0,.08), transparent 36%),
          linear-gradient(155deg,#141417,#0d0d0f);
      }

      body.gria-home-clean .about .gria-pillar-grid .value-card .num {
        font-size:11px;
      }

      body.gria-home-clean .about .gria-pillar-grid .value-card h3 {
        margin-top:20px;
        font-size:20px !important;
      }

      body.gria-home-clean .about .gria-pillar-grid .value-card p {
        margin-top:9px;
        color:#909197;
        font-size:12.5px;
        line-height:1.6;
      }

      .gria-swipe-hint {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        margin:-12px 0 14px;
        color:#707178;
        font-size:10.5px;
        font-weight:600;
      }

      .gria-swipe-hint span:last-child {
        color:var(--neon);
        letter-spacing:.04em;
      }

      /* Existing CTA after pillars */
      body.gria-home-clean .about .reveal[style*="text-align:center"] {
        margin-bottom: 0 !important;
        text-align:left !important;
      }

      body.gria-home-clean .about .reveal[style*="text-align:center"] .btn-primary {
        min-height:44px;
        padding:11px 17px;
        font-size:12px;
      }

      /* ===== REMOVE MARQUEE NOISE ===== */
      body.gria-home-clean .marquee {
        display:none !important;
      }

      /* ===== WORSHIP = COMPACT CARD ===== */
      body.gria-home-clean .worship {
        padding-top:38px;
        padding-bottom:38px;
      }

      body.gria-home-clean .worship .section-head {
        margin-bottom:18px;
      }

      body.gria-home-clean .worship-top {
        display:block;
      }

      body.gria-home-clean .worship-info-card {
        padding:22px 19px;
        border-radius:23px;
      }

      body.gria-home-clean .worship-date {
        font-size:24px;
      }

      body.gria-home-clean .worship-time {
        margin-top:3px;
        font-size:13px;
      }

      body.gria-home-clean .worship-meta {
        margin-top:18px;
      }

      body.gria-home-clean .verse-illustration,
      body.gria-home-clean .verse-box,
      body.gria-home-clean #accordion {
        display:none !important;
      }

      body.gria-home-clean .worship-meta-row {
        padding:12px 0;
      }

      .gria-home-actions {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
        margin-top:13px;
      }

      .gria-home-actions a {
        min-height:45px;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:10px 12px;
        border-radius:14px;
        font-size:11.5px;
        font-weight:700;
      }

      .gria-home-actions a:first-child {
        color:#070707;
        background:var(--neon);
      }

      .gria-home-actions a:last-child {
        color:#ddd;
        background:rgba(255,255,255,.045);
        border:1px solid rgba(255,255,255,.08);
      }

      /* ===== COMMUNITY = VISUAL, NOT TEXT HEAVY ===== */
      body.gria-home-clean #komunitas .moments-intro {
        display:none !important;
      }

      body.gria-home-clean #komunitas .photo-grid-3 {
        display:flex !important;
        grid-template-columns:none !important;
        gap:11px;
        margin:
          0
          calc(-1 * var(--pad))
          18px;
        padding:
          0
          var(--pad)
          8px;
        overflow-x:auto;
        scroll-snap-type:x mandatory;
        scrollbar-width:none;
      }

      body.gria-home-clean #komunitas .photo-grid-3::-webkit-scrollbar {
        display:none;
      }

      body.gria-home-clean #komunitas .photo-frame {
        flex:0 0 min(78vw, 300px);
        height:210px;
        scroll-snap-align:start;
        border-radius:20px;
      }

      body.gria-home-clean #komunitas .reveal[style*="text-align:center"] {
        text-align:left !important;
      }

      body.gria-home-clean #komunitas .btn-primary {
        min-height:44px;
        padding:11px 17px;
        font-size:12px;
      }

      body.gria-home-clean .testimonial {
        display:none !important;
      }

      body.gria-home-clean .sticky-cta {
        display:none !important;
      }

      body.gria-home-clean footer {
        padding-top:46px;
      }
    }
  `;
  document.head.appendChild(style);

  function init() {
    if (!document.querySelector('.hero#home')) return;

    document.body.classList.add('gria-home-clean');

    /* Shorter, calmer hero copy on mobile */
    if (mobile.matches) {
      const tagline = document.querySelector('.hero-tagline');
      if (tagline) {
        tagline.textContent =
          'Dipulihkan. Dikuatkan. Diperlengkapi untuk hidup dalam kasih Kristus.';
      }

      const aboutHead = document.querySelector('.about > .container > .section-head:first-child');
      if (aboutHead) {
        const eyebrow = aboutHead.querySelector('.eyebrow');
        const title = aboutHead.querySelector('.section-title');
        const lead = aboutHead.querySelector('.section-lead');
        if (eyebrow) eyebrow.textContent = 'Tentang GRIA';
        if (title) title.innerHTML = 'Tumbuh dalam <span class="accent">Pemulihan</span>';
        if (lead) lead.textContent =
          'Sejak 2015, GRIA hadir sebagai keluarga yang bertumbuh bersama dalam iman, kasih, dan pemulihan.';
      }

      const worshipHead = document.querySelector('.worship .section-head');
      if (worshipHead) {
        const eyebrow = worshipHead.querySelector('.eyebrow');
        const title = worshipHead.querySelector('.section-title');
        const lead = worshipHead.querySelector('.section-lead');
        if (eyebrow) eyebrow.textContent = 'Minggu Ini';
        if (title) title.innerHTML = 'Ibadah <span class="accent">GRIA</span>';
        if (lead) lead.textContent = 'Datang dan beribadah bersama keluarga GRIA.';
      }

      const communityHead = document.querySelector('#komunitas .section-head');
      if (communityHead) {
        const title = communityHead.querySelector('.section-title');
        const lead = communityHead.querySelector('.section-lead');
        if (title) title.innerHTML = 'Kehidupan <span class="accent">Bersama</span>';
        if (lead) lead.textContent = '';
      }
    }

    /* Identify the five-pillar grid, without touching leadership grid */
    const pillarGrid = Array.from(document.querySelectorAll('.about .values-grid'))
      .find(el => !el.classList.contains('values-grid-3'));

    if (pillarGrid) {
      pillarGrid.classList.add('gria-pillar-grid');

      const pillarHead = pillarGrid.previousElementSibling;
      if (pillarHead && !pillarHead.nextElementSibling?.classList.contains('gria-swipe-hint')) {
        const hint = document.createElement('div');
        hint.className = 'gria-swipe-hint';
        hint.innerHTML = '<span>5 pilar pemulihan</span><span>GESER →</span>';
        pillarHead.insertAdjacentElement('afterend', hint);
      }
    }

    /* Remove "Tema Ibadah / Test Tema Ibadah" from Home.
       The source marker remains in HTML so future automation is not broken. */
    document.querySelectorAll('.worship-meta-row').forEach(function (row) {
      const label = row.querySelector('.meta-label');
      if (label && label.textContent.trim().toLowerCase() === 'tema ibadah') {
        row.style.display = 'none';
        row.setAttribute('aria-hidden', 'true');
      }
    });

    /* Simple actions under Sunday info */
    const worshipCard = document.querySelector('.worship-info-card');
    if (worshipCard && !worshipCard.querySelector('.gria-home-actions')) {
      const actions = document.createElement('div');
      actions.className = 'gria-home-actions';
      actions.innerHTML =
        '<a href="warta.html">Lihat Warta</a>' +
        '<a href="persekutuan.html">Persekutuan</a>';
      worshipCard.appendChild(actions);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
