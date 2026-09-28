/* ============================================================
   GRIA — Warta Jemaat Mobile UX
   Safe enhancement layer: keeps desktop tables and automation intact.
   ============================================================ */
(function () {
  'use strict';

  if (window.__griaWartaMobileLoaded) return;
  window.__griaWartaMobileLoaded = true;

  const style = document.createElement('style');
  style.id = 'gria-warta-mobile-styles';
  style.textContent = `
    /* ---------- Shared polish ---------- */
    .warta-mobile-jump,
    .warta-mobile-cards { display:none; }

    .warta-hero {
      isolation: isolate;
    }

    .warta-hero::after {
      content:'';
      position:absolute;
      inset:auto -15% -55% 25%;
      height:220px;
      background:radial-gradient(circle,rgba(204,255,0,.12),transparent 68%);
      filter:blur(28px);
      pointer-events:none;
      z-index:-1;
    }

    .warta-hero .warta-freshness {
      display:inline-flex;
      align-items:center;
      gap:7px;
      margin-top:20px;
      color:#d9d9dc;
      font-size:12px;
      font-weight:650;
    }

    .warta-hero .warta-freshness::before {
      content:'';
      width:7px;
      height:7px;
      border-radius:50%;
      background:var(--neon);
      box-shadow:0 0 10px rgba(204,255,0,.55);
    }

    @media (max-width: 768px) {
      .warta-wrap {
        padding:
          calc(78px + env(safe-area-inset-top, 0px))
          16px
          calc(118px + env(safe-area-inset-bottom, 0px));
        max-width: 680px;
      }

      .back-link {
        display:none !important;
      }

      .warta-hero {
        margin: 0 0 16px;
        padding: 24px 20px 22px;
        border-radius: 24px;
        background:
          radial-gradient(circle at 88% 12%, rgba(204,255,0,.11), transparent 32%),
          linear-gradient(155deg,#151518,#0d0d0f);
        box-shadow: 0 18px 48px rgba(0,0,0,.24);
      }

      .warta-hero::before {
        width: 90%;
        height: 85%;
        right: -35%;
        top: -40%;
        opacity:.7;
      }

      .warta-hero .eyebrow {
        margin-bottom: 13px;
        padding: 5px 10px 5px 8px;
        font-size: 10px;
        letter-spacing:.11em;
      }

      .warta-hero h1 {
        margin-top: 0;
        font-size: clamp(31px, 10vw, 44px);
        line-height:1;
      }

      .warta-hero p {
        margin-top: 12px;
        font-size: 13.5px;
        line-height:1.65;
        max-width:34ch;
      }

      .warta-hero .warta-freshness {
        margin-top: 17px;
        font-size: 11px;
      }

      /* ---------- Horizontal quick nav ---------- */
      .warta-mobile-jump {
        position: sticky;
        top: calc(64px + env(safe-area-inset-top, 0px));
        z-index: 40;
        display:flex;
        gap:8px;
        margin: 0 -16px 26px;
        padding:10px 16px;
        overflow-x:auto;
        scrollbar-width:none;
        background:linear-gradient(
          to bottom,
          rgba(10,10,12,.96) 72%,
          rgba(10,10,12,0)
        );
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }

      .warta-mobile-jump::-webkit-scrollbar { display:none; }

      .warta-mobile-jump a {
        flex:0 0 auto;
        min-height:38px;
        display:inline-flex;
        align-items:center;
        gap:7px;
        padding:8px 12px;
        border-radius:999px;
        color:#b6b6bb;
        background:#121215;
        border:1px solid rgba(255,255,255,.08);
        font-size:11px;
        font-weight:650;
        -webkit-tap-highlight-color:transparent;
      }

      .warta-mobile-jump a:active {
        transform:scale(.97);
      }

      .warta-mobile-jump a .jump-num {
        width:20px;height:20px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        color:#0a0a0a;
        background:var(--neon);
        font-size:9px;
        font-weight:800;
      }

      /* ---------- Sections ---------- */
      .warta-block {
        margin-bottom: 34px;
        scroll-margin-top: 126px;
      }

      .warta-block h2 {
        gap:10px;
        margin-bottom: 7px;
        font-size: 20px;
        line-height:1.15;
      }

      .warta-block h2 .badge-num {
        width:31px;
        height:31px;
        border-radius:10px;
        font-size:11px;
      }

      .warta-block .block-lead {
        margin:0 0 15px;
        font-size:12.5px;
        line-height:1.6;
        color:#8f9096;
      }

      /* Hide wide desktop tables, replace with generated cards */
      .warta-block .warta-scroll {
        display:none !important;
      }

      .warta-mobile-cards {
        display:grid;
        grid-template-columns:1fr;
        gap:10px;
      }

      .warta-mobile-card {
        background:linear-gradient(155deg,#131316,#0d0d0f);
        border:1px solid rgba(255,255,255,.08);
        border-radius:20px;
        overflow:hidden;
        box-shadow:0 10px 30px rgba(0,0,0,.12);
      }

      .warta-mobile-card-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:12px;
        padding:16px 16px 13px;
        border-bottom:1px solid rgba(255,255,255,.07);
        background:
          linear-gradient(135deg,rgba(204,255,0,.06),transparent 56%);
      }

      .warta-mobile-card-title {
        color:#fff;
        font-family:var(--font-display);
        font-size:14px;
        font-weight:750;
        line-height:1.35;
      }

      .warta-mobile-card-tag {
        flex:0 0 auto;
        padding:5px 8px;
        border-radius:999px;
        color:var(--neon);
        background:rgba(204,255,0,.08);
        border:1px solid rgba(204,255,0,.16);
        font-size:9px;
        font-weight:750;
        text-transform:uppercase;
        letter-spacing:.06em;
      }

      .warta-mobile-card-body {
        padding:5px 16px 8px;
      }

      .warta-mobile-row {
        display:grid;
        grid-template-columns:minmax(92px, .8fr) 1.2fr;
        gap:12px;
        align-items:start;
        padding:11px 0;
        border-bottom:1px solid rgba(255,255,255,.055);
      }

      .warta-mobile-row:last-child {
        border-bottom:0;
      }

      .warta-mobile-label {
        color:#85868c;
        font-size:10.5px;
        line-height:1.45;
      }

      .warta-mobile-value {
        color:#f2f2f3;
        font-size:12.5px;
        font-weight:600;
        line-height:1.45;
        text-align:right;
        overflow-wrap:anywhere;
      }

      .warta-mobile-value.is-empty {
        color:#616268;
        font-weight:500;
      }

      /* ---------- Birthday ---------- */
      #ulang-tahun .bday-section {
        margin-left:-16px;
        margin-right:-16px;
        padding-left:16px;
        padding-right:16px;
      }

      /* ---------- Offering card ---------- */
      .agape-card {
        border-radius:22px;
        box-shadow:0 14px 36px rgba(0,0,0,.18);
      }

      .agape-card-header {
        padding:18px 17px 15px;
      }

      .agape-bank-icon {
        width:43px;
        height:43px;
        border-radius:13px;
      }

      .agape-bank-name {
        font-size:18px;
      }

      .agape-card-body {
        padding:16px 17px 17px;
        gap:15px;
      }

      .agape-field-row {
        align-items:stretch;
      }

      .agape-field-value {
        font-size:16px;
        overflow-wrap:anywhere;
      }

      .agape-copy-btn {
        width:auto;
        min-height:40px;
        padding:8px 12px;
      }

      .agape-card-footer {
        padding:14px 17px 18px;
      }

      .agape-wa-btn {
        min-height:48px;
        padding:12px 18px;
        font-size:13px;
      }

      /* Avoid footer feeling cramped above app bottom nav */
      footer {
        padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
      }
    }
  `;
  document.head.appendChild(style);

  const main = document.querySelector('.warta-wrap');
  if (!main) return;

  /* Add freshness hint to hero */
  const hero = main.querySelector('.warta-hero');
  if (hero && !hero.querySelector('.warta-freshness')) {
    const freshness = document.createElement('div');
    freshness.className = 'warta-freshness';
    freshness.textContent = 'Warta aktif • diperbarui mingguan';
    hero.appendChild(freshness);
  }

  /* Section IDs remain stable even when weekly content is regenerated */
  const blocks = Array.from(main.querySelectorAll('.warta-block'));
  const ids = ['jadwal-pelayanan','laporan-persembahan','informasi-umum','ulang-tahun','kasih-agape'];
  const labels = ['Jadwal','Persembahan','Info','Ulang Tahun','Kasih Agape'];

  blocks.forEach(function (block, index) {
    if (!block.id && ids[index]) block.id = ids[index];
  });

  /* Quick jump bar */
  if (!main.querySelector('.warta-mobile-jump')) {
    const jump = document.createElement('nav');
    jump.className = 'warta-mobile-jump';
    jump.setAttribute('aria-label', 'Navigasi bagian Warta');
    jump.innerHTML = blocks.slice(0,5).map(function (block, index) {
      const id = block.id || ids[index];
      return '<a href="#' + id + '"><span class="jump-num">' +
        String(index + 1).padStart(2,'0') +
        '</span><span>' + labels[index] + '</span></a>';
    }).join('');
    if (hero) hero.insertAdjacentElement('afterend', jump);
    else main.prepend(jump);
  }

  /* Transform every table into date cards for mobile.
     Desktop table remains untouched and automation can keep replacing its contents. */
  main.querySelectorAll('.warta-table').forEach(function (table, tableIndex) {
    const holder = table.closest('.warta-scroll');
    if (!holder || holder.nextElementSibling?.classList.contains('warta-mobile-cards')) return;

    const rows = Array.from(table.rows);
    if (!rows.length) return;

    const headerCells = Array.from(rows[0].cells).map(function (cell) {
      return cell.textContent.trim();
    });
    if (headerCells.length < 2) return;

    const dataRows = rows.slice(1).map(function (row) {
      return Array.from(row.cells).map(function (cell) {
        return cell.textContent.trim();
      });
    });

    const cardList = document.createElement('div');
    cardList.className = 'warta-mobile-cards';

    for (let col = 1; col < headerCells.length; col++) {
      const card = document.createElement('article');
      card.className = 'warta-mobile-card';

      const title = headerCells[col] || 'Informasi';
      const rowsHtml = dataRows.map(function (cells) {
        const label = cells[0] || '—';
        const value = cells[col] || '—';
        const emptyClass = !cells[col] || cells[col] === '-' ? ' is-empty' : '';
        return '<div class="warta-mobile-row">' +
          '<div class="warta-mobile-label">' + escapeHtml(label) + '</div>' +
          '<div class="warta-mobile-value' + emptyClass + '">' + escapeHtml(value) + '</div>' +
          '</div>';
      }).join('');

      const typeName = tableIndex === 0 ? 'Pelayanan' :
                       tableIndex === 1 ? 'Laporan' : 'PA & Doa';

      card.innerHTML =
        '<div class="warta-mobile-card-head">' +
          '<div class="warta-mobile-card-title">' + escapeHtml(title) + '</div>' +
          '<span class="warta-mobile-card-tag">' + typeName + '</span>' +
        '</div>' +
        '<div class="warta-mobile-card-body">' + rowsHtml + '</div>';

      cardList.appendChild(card);
    }

    holder.insertAdjacentElement('afterend', cardList);
  });

  /* Fix WhatsApp confirmation URL if older markup missed ?text= */
  const agapeLink = document.querySelector('.agape-wa-btn');
  if (agapeLink) {
    const href = agapeLink.getAttribute('href') || '';
    if (/wa\.me\/\d+text=/.test(href) && !/wa\.me\/\d+\?text=/.test(href)) {
      agapeLink.setAttribute('href', href.replace(/(wa\.me\/\d+)text=/, '$1?text='));
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
})();
