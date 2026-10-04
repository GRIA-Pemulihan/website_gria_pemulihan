# GRIA V27 — Renungan Harian

Integrates the supplied 28 original GRIA devotionals for 4–31 October 2026,
with the October and weekly themes preserved. Key verses use the existing
local AYT dataset (YLSA 2011–2024; see AYT-LICENSE.html).

The page and homepage use Asia/Makassar dates and release each devotional at
06:00 WITA. Archive options contain only released dates from 4 October 2026;
unreleased/invalid direct links show an unavailable state. The open page
refreshes availability when resumed and every 30 seconds. This static site's
release gate uses the device clock; the public source JSON is not a secure
content embargo.

The calendar download starts 4 October at 06:00 WITA (22:00 UTC on 3 October),
recurs daily, and includes a display reminder and the GRIA URL. Users must
import it and allow calendar notifications. The website records only that the
file was opened; it cannot verify calendar activation or create Clock alarms.

## Supabase deployment

**Manually execute `supabase/migration-003-renungan.sql` in the Supabase SQL
Editor.** This has not been run against the live project. It adds aggregate
read and idempotent reaction RPCs, RLS, and restricted grants. It can be rerun.
Only the existing public publishable key is used in the browser. The migration
replaces the bundle's publicly readable/deletable reaction rows with RPCs so
random device identifiers are not exposed. Duplicate prevention is per browser,
not per person or across devices. Clearing browser storage creates a new identity.

If the API/SDK is unavailable, reactions stay local and the UI labels their
counts as device-only. Local fallback reactions are not queued for background
upload. Bookmark storage is local to the browser.

V27 replaces the home Search quick link with Renungan, keeps Search in the
header, retains the V26 daily verse/photo and Bible functions, and keeps Warta,
Persekutuan, Jemaat and Jadwal accessible. The service worker removes prior GRIA
cache versions, precaches devotional content/media, and supports offline dated
links and calendar downloads.

## Validation

`npm ci`, `npx playwright install chromium`, then `npm test`.
The test starts its own local HTTP server and makes no live Supabase writes.
It covers content/JSON/JS and local links, WITA release boundaries, locked URLs,
archive browsing, bookmarks, native/clipboard/manual sharing, calendar state,
reaction failure/totals/races, both themes at 375/390/430/768/1280px, navigation,
and V26 cache cleanup plus offline loading. SQL was also exercised in a local
PostgreSQL-compatible PGlite instance, including anonymous grants and duplicate
handling; live Supabase still requires the manual migration above.
