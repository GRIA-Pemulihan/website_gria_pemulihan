GRIA V16 — HARD CACHE BUST FIX

WHY V15 LOOKED UNCHANGED
- V15 is already present in GitHub.
- But the visible cleanup depended on pwa.js.
- iOS/PWA can keep serving the previous pwa.js from cache.
- The original HTML still contained the old explanatory text.

UPLOAD / REPLACE:
1. index.html
2. service-worker.js

UPLOAD AS NEW FILE:
3. pwa-v16.js

DO NOT DELETE pwa.js YET.
Older open tabs may still reference it temporarily.

WHAT V16 DOES
- Home unwanted copy is physically removed from index.html.
- Home GRIA wordmark is tightened directly in HTML CSS.
- New script filename pwa-v16.js bypasses the stale pwa.js cache.
- pwa-v16 registers service-worker.js?v=16.
- v16 service worker rewrites old <script src="pwa.js"> references on subpages
  to pwa-v16.js automatically.
- Warta/Jemaat/Alkitab cleanup from V15 therefore runs from a guaranteed-new script.
- New service worker cache name: gria-pwa-v16.

COMMIT:
Force V16 cache refresh and header cleanup

AFTER COMMIT:
1. Wait 1–3 minutes.
2. Open the GRIA website in Safari first.
3. Refresh once.
4. Close the installed GRIA PWA completely from the app switcher.
5. Open GRIA again.
6. If the PWA was kept open during deployment, open Safari once more before testing.
