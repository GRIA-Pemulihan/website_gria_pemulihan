# GRIA App — Repositioning Blueprint 2026–2027

## Positioning
**GRIA is not a generic church app.**
It should become a **Restoration Companion**: a small, calm digital space that helps people
**Datang → Bertumbuh → Terhubung → Melayani**.

The app should feel closer to a personal spiritual companion than a church notice board.

---

## Benchmark patterns studied

### YouVersion
Patterns worth borrowing:
- Bible-first daily engagement
- offline Scripture and plans
- highlights, bookmarks, notes
- compare versions
- plans with friends / private discussion

Reference:
https://www.youversion.com/bible-app

### Life.Church
Patterns worth borrowing:
- clear “next step” journey
- QR check-in
- milestones
- LifeGroups discovery
- giving
- sermon/media hub

Reference:
https://www.life.church/app/

### Planning Center / Church Center
Patterns worth borrowing:
- compact congregation-facing navigation
- groups
- events / registrations
- giving
- check-in
- serving schedule
- member profile

References:
https://churchcenter.com/
https://support.planningcenteronline.com/hc/en-us

### Subsplash
Patterns worth borrowing:
- unified app + website experience
- Bible + reading plans
- media / livestream
- group messaging
- prayer requests
- volunteer schedules
- personalized media
- push notifications
- phone-number login
- AI-assisted sermon content workflow

References:
https://www.subsplash.com/
https://www.subsplash.com/product/custom-church-apps
https://www.subsplash.com/product/pulpit-ai

### Pushpay
Patterns worth borrowing:
- giving inside the app
- groups + built-in messaging
- volunteer scheduling
- touchless check-in
- sermon content / notes
- push notifications, polls, forms

References:
https://pushpay.com/
https://pushpay.com/product/mobile-app/

### Churchome
Patterns worth borrowing:
- guided prayer
- weekly service
- pastoral connection
- full Bible
- digital community

Reference:
https://www.churchome.org/app

---

# Recommended GRIA Information Architecture

## Bottom navigation — keep only 4 tabs
The existing 4-tab concept is strong. Do not overload it.

### 1. Home
Reposition as **“Hari Ini di GRIA”**.

Show only:
- next worship service
- Verse of the Day
- one featured announcement
- 3 contextual quick actions
- small “Continue where you left off” card when relevant

Avoid long institutional text.

### 2. Warta
Reposition as **“Minggu Ini”**.

Core:
- service roster swipe cards
- offering transparency + totals
- PA / prayer schedule
- Agape giving details
- announcements

Later:
- calendar
- event RSVP
- push reminders

### 3. Persekutuan
Reposition as **“Bertumbuh Bersama”**.

Core:
- Pendalaman Alkitab
- Persekutuan Doa
- Komunitas / KKR

Later:
- join/request a group
- group attendance
- discussion prompts
- prayer requests
- group leader tools

### 4. Jemaat
Reposition as **“Ruang Jemaat”** — private member hub.

Current:
- AYT Bible Reader
- member-only access

Coming soon:
- Bible Reading Tracker 2027
- Bank Ayat Tahunan

Future:
- My Serving Schedule
- My Groups
- My Prayer Requests
- My Events / RSVP
- My Milestones
- member profile

---

# Original GRIA Signature Features

These should differentiate GRIA instead of copying global apps.

## Pemulihan Journey
A gentle journey instead of gamification:
1. Datang
2. Bertumbuh
3. Terhubung
4. Melayani

Future milestones could include:
- first visit
- joined PA
- joined prayer fellowship
- completed a reading plan
- began serving

## Warta Hidup
Warta should not look like a PDF bulletin.
It becomes a living weekly interface:
- swipe service roster
- current schedule
- transparent offering summary
- one-tap directions / WhatsApp / calendar

## AYT-first Bible
GRIA has a strong Indonesian identity by keeping AYT as the default local/offline Bible,
with a clean distraction-free reader.

## Restoration, not engagement metrics
Avoid streak pressure or social-score mechanics.
Progress should communicate encouragement and spiritual rhythm, not competition.

---

# Visual Direction

## Keep
- black / graphite base
- neon-lime GRIA accent
- bold Syne display typography
- Manrope for UI/body
- rounded cards
- translucent navigation

## Evolve
- fewer words per screen
- one dominant action per card
- contextual cards instead of grids everywhere
- horizontal swipe only where it has meaning
- subtle scale/fade transitions
- strong whitespace
- dark and light reading mode for Bible
- reduced-motion support later

Home should feel **editorial + calm**.
Warta should feel **operational + clear**.
Persekutuan should feel **relational + warm**.
Jemaat should feel **personal + private**.

---

# Roadmap

## Phase 1 — Now
No backend dependency:
- PWA shell
- AYT local Bible
- Warta cards
- Persekutuan
- Jemaat code gate
- Dark/light Bible reader

## Phase 2 — 2027
- Bible Reading Tracker 2027
- Bank Ayat Tahunan
- event RSVP
- serving schedule
- local notifications / reminders
- sermon notes
- offline-first improvements

## Phase 3 — Secure Member Platform
Requires real authentication and backend:
- phone OTP / passkey
- member profile
- groups and messaging
- prayer requests
- member directory with privacy controls
- giving history
- QR attendance/check-in
- volunteer scheduling
- targeted push notifications

## Phase 4 — Ministry Intelligence
Admin-side, not intrusive member AI:
- sermon transcript + recap
- PA discussion guide generation
- sermon-linked devotionals
- content search
- anonymized engagement analytics

---

## Security note
The current shared code `GRIA2026` is appropriate only as a lightweight gate.
Do not use it to protect:
- personal member data
- prayer requests
- counselling information
- giving history
- private directory data

Those features should wait for real authentication.
