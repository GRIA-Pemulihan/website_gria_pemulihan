/* GRIA PWA + Mobile App Shell v2 */
(function () {
  'use strict';

  const scriptEl = document.currentScript;
  const APP_ROOT = scriptEl ? new URL('./', scriptEl.src) : new URL('./', window.location.href);
  const appUrl = (path) => new URL(path, APP_ROOT).href;

  /* ---------- Service worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(appUrl('service-worker.js'), { scope: APP_ROOT.pathname })
        .then(function (registration) {
          registration.update().catch(function () {});
        })
        .catch(function (error) {
          console.warn('[GRIA PWA] Service worker registration failed:', error);
        });
    });
  }

  /* ---------- Shared app UI styles ---------- */
  const style = document.createElement('style');
  style.id = 'gria-app-shell-styles';
  style.textContent = `
    .gria-bottom-nav { display:none; }
    .gria-entry-gate { display:none; }

    @media (max-width: 768px) {
      body {
        padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px));
      }

      .navbar .nav-links,
      .navbar .nav-cta,
      .navbar .nav-toggle {
        display: none !important;
      }

      .navbar .navbar-inner {
        min-height: 62px;
      }

      .navbar .logo {
        margin-right: auto;
      }

      .sticky-cta {
        bottom: calc(88px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .gria-bottom-nav {
        position: fixed;
        left: 12px;
        right: 12px;
        bottom: max(8px, env(safe-area-inset-bottom, 0px));
        height: 72px;
        z-index: 9998;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        padding: 7px 8px;
        background: rgba(16,16,19,.92);
        border: 1px solid rgba(255,255,255,.11);
        border-radius: 24px;
        box-shadow: 0 18px 45px rgba(0,0,0,.5);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
      }

      .gria-bottom-nav a {
        position: relative;
        min-width: 0;
        height: 58px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: #7f8087;
        text-decoration: none;
        border-radius: 18px;
        font-family: Inter, sans-serif;
        font-size: 10px;
        font-weight: 650;
        letter-spacing: -.01em;
        -webkit-tap-highlight-color: transparent;
        transition: color .18s ease, background .18s ease, transform .18s ease;
      }

      .gria-bottom-nav a:active {
        transform: scale(.96);
      }

      .gria-bottom-nav a svg {
        width: 22px;
        height: 22px;
        stroke: currentColor;
      }

      .gria-bottom-nav a.is-active {
        color: #ccff00;
        background: rgba(204,255,0,.08);
      }

      .gria-bottom-nav a.is-active::before {
        content: '';
        position: absolute;
        top: 3px;
        width: 18px;
        height: 2px;
        border-radius: 20px;
        background: #ccff00;
        box-shadow: 0 0 10px rgba(204,255,0,.45);
      }

      .gria-entry-gate {
        position: fixed;
        inset: 0;
        z-index: 10050;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 20px 16px calc(20px + env(safe-area-inset-bottom, 0px));
        background:
          radial-gradient(circle at 50% 15%, rgba(204,255,0,.10), transparent 34%),
          rgba(5,5,6,.97);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }

      .gria-entry-card {
        width: min(100%, 480px);
        padding: 28px 22px 22px;
        border-radius: 30px;
        background: linear-gradient(155deg, #151518, #0d0d0f);
        border: 1px solid rgba(255,255,255,.1);
        box-shadow: 0 24px 70px rgba(0,0,0,.58);
      }

      .gria-entry-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 28px;
      }

      .gria-entry-brand img {
        width: 48px;
        height: 48px;
        border-radius: 14px;
      }

      .gria-entry-wordmark {
        font-family: Syne, Inter, sans-serif;
        font-weight: 800;
        font-size: 25px;
        letter-spacing: -.04em;
        color: #fff;
      }

      .gria-entry-wordmark span { color: #ccff00; }

      .gria-entry-card h1 {
        font-size: 29px;
        line-height: 1.08;
        margin: 0 0 12px;
        letter-spacing: -.035em;
      }

      .gria-entry-card > p {
        color: #a8a8ad;
        font-size: 14px;
        line-height: 1.7;
        margin: 0 0 24px;
      }

      .gria-entry-primary,
      .gria-entry-secondary {
        width: 100%;
        min-height: 52px;
        border: 0;
        border-radius: 16px;
        font: 700 14px Inter, sans-serif;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .gria-entry-primary {
        color: #080808;
        background: #ccff00;
        margin-bottom: 10px;
      }

      .gria-entry-secondary {
        color: #ededed;
        background: rgba(255,255,255,.055);
        border: 1px solid rgba(255,255,255,.10);
      }

      .gria-entry-note {
        display: block;
        margin-top: 15px;
        color: #6f7077;
        font: 500 11px/1.55 Inter, sans-serif;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);

  function currentFile() {
    const last = window.location.pathname.split('/').pop();
    return last || 'index.html';
  }

  function hasLikelySupabaseSession() {
    try {
      return Object.keys(localStorage).some(function (key) {
        if (!/^sb-.*-auth-token$/.test(key)) return false;
        const value = localStorage.getItem(key);
        return !!value && value !== 'null' && value !== 'undefined';
      });
    } catch (_) {
      return false;
    }
  }

  function setupWelcomeGate() {
    if (currentFile() !== 'index.html') return;
    if (document.getElementById('griaEntryGate')) return;

    if (hasLikelySupabaseSession()) {
      try { localStorage.setItem('gria_entry_mode', 'member'); } catch (_) {}
      return;
    }

    let entryMode = null;
    try { entryMode = localStorage.getItem('gria_entry_mode'); } catch (_) {}
    if (entryMode === 'guest' || entryMode === 'member') return;

    const gate = document.createElement('div');
    gate.className = 'gria-entry-gate';
    gate.id = 'griaEntryGate';
    gate.innerHTML = `
      <section class="gria-entry-card" role="dialog" aria-modal="true" aria-labelledby="griaEntryTitle">
        <div class="gria-entry-brand">
          <img src="${appUrl('icon-192.png')}" alt="">
          <div class="gria-entry-wordmark">GRI<span>A</span></div>
        </div>
        <h1 id="griaEntryTitle">Selamat datang di GRIA</h1>
        <p>Akses warta, persekutuan, dan perjalanan iman dalam satu tempat. Jemaat GRIA dapat masuk untuk membuka fitur pribadi.</p>
        <button class="gria-entry-primary" id="griaMemberEntry" type="button">Saya Jemaat GRIA</button>
        <button class="gria-entry-secondary" id="griaGuestEntry" type="button">Lanjut sebagai tamu</button>
        <small class="gria-entry-note">Pengunjung tetap dapat melihat informasi publik tanpa membuat akun.</small>
      </section>
    `;
    document.body.appendChild(gate);

    document.getElementById('griaMemberEntry').addEventListener('click', function () {
      window.location.href = appUrl('daftar.html');
    });

    document.getElementById('griaGuestEntry').addEventListener('click', function () {
      try { localStorage.setItem('gria_entry_mode', 'guest'); } catch (_) {}
      gate.remove();
    });
  }

  function setupBottomNav() {
    const file = currentFile();
    const supported = ['index.html', 'warta.html', 'persekutuan.html', 'user.html'];
    if (!supported.includes(file)) return;
    if (document.getElementById('griaBottomNav')) return;

    const items = [
      {
        file: 'index.html',
        label: 'Home',
        icon: '<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"/>'
      },
      {
        file: 'warta.html',
        label: 'Warta',
        icon: '<path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 7h10M7 11h10M7 15h6"/>'
      },
      {
        file: 'persekutuan.html',
        label: 'Persekutuan',
        icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'
      },
      {
        file: 'user.html',
        label: 'User',
        icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
      }
    ];

    const nav = document.createElement('nav');
    nav.className = 'gria-bottom-nav';
    nav.id = 'griaBottomNav';
    nav.setAttribute('aria-label', 'Navigasi utama');

    nav.innerHTML = items.map(function (item) {
      const active = item.file === file ? ' is-active' : '';
      const current = item.file === file ? ' aria-current="page"' : '';
      return `
        <a class="${active.trim()}" href="${appUrl(item.file)}"${current}>
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.icon}</svg>
          <span>${item.label}</span>
        </a>
      `;
    }).join('');

    document.body.appendChild(nav);
  }

  function init() {
    setupWelcomeGate();
    setupBottomNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
