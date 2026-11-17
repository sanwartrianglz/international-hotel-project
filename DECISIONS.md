# Decisions Log

Newest first. One decision per row. Mirror important ones as green stickies on the FigJam board (working agreement G).

| Date | Decision | Why | Decided by |
|---|---|---|---|
| 2026-11-17 | App icons are shown in emerald: the navy source images get a hue shift on import (`ICON_HUE=-95` in `scripts/import-objects.mjs`; set 0 to go back to navy). Sources in 00_inputs/Icons stay navy | Salma prefers an emerald hint; no need to regenerate | Salma |
| 2026-11-17 | UI v2: smaller iOS-scale sizes (body 15, title 22, room no. 32, main action 48 px, caption 13) and grand-hotel character (brass accent, Playfair Display serif for numbers/headings with Amiri for Arabic, key tag with brass ring, stationery labels, one line-icon set for controls). Status colours unchanged. Deviates from Amr's 12 Nov sizes (body 18, button 50, caption ≥ 14): Amr to confirm | Salma found the first build too big and too generic | Salma |
| 2026-11-17 | App objects use the navy-gradient set (FigJam Section 4, left column), not the clay-3D U2 set. 11 done; the 34 still needed are listed on the board (section "Icons to generate · navy set") and in 04_design/icons-to-generate.md. Missing ones show a navy-tinted placeholder | Fits the navy/brass palette | Salma |
| 2026-11-17 | Guest notes and requests move out of the room card into a "Guest needs" section below it (rows with the main instruction; tap for the why). List cards show icon-only markers | Badges crowded the card | Salma |
| 2026-11-17 | Coded build = mobile-first web app / PWA (React + Vite + TypeScript) in `05_build/app`, not native | Fastest to build this week; opens from a link on any phone; offline via service worker; Arabic RTL via dir="rtl" | Salma |
| 2026-11-17 | Build the housekeeper app first (all MUST features, flows F1–F6); add a supervisor view afterwards if time allows. Until then, supervisor / reception / PMS events are simulated in a Demo controls screen | Housekeeper is the core user; the supervisor loop still has to be demoable | Salma |
| 2026-11-17 | Project lives in a PUBLIC GitHub repo: https://github.com/sanwartrianglz/international-hotel-project (whole project folder, not just the app) | So Sally and Amr get every update; public was chosen knowing the brief and meeting notes become visible | Salma |
| 2026-11-09 | Devices: housekeepers use the app on their OWN phone or a TABLET on the cart (both supported) | Hotels differ; design must work at phone and tablet size; own phone stays signed in, cart tablet needs quick PIN / face login | Salma |
| 2026-11-09 | Dropped the "brand checklist with local items marked" feature (country/property variation layer) from the features list | Removed by the team on the FigJam board | Team |
| 2026-11-09 | Language (multi-language, translation, Arabic RTL) is NOT a design feature; developers handle it via i18n. Design only ensures layouts mirror for RTL and survive longer text | Easily handled in development; design focus goes to visual-first UI, brand standards and culture notes | Salma |
| 2026-11-09 | New visual identity, not Cecil's green/teal | Must look clearly different from the Gulf and Nubian versions | Team |
| 2026-11-09 | Assume a PMS (e.g. Opera) feeds room status and guest preferences | International chains virtually always run a PMS; it also makes guest culture notes realistic | Claude (delegated by Salma) |
| 2026-11-09 | In-scope features: multi-language + RTL, icon/visual-first UI, brand standards per country, guest culture notes | These are what "international" changes for a housekeeper | Team |
| 2026-11-09 | Deliverable goes up to a coded build | Per brief | Fawzia |
| 2026-11-09 | "International" = a chain across countries + multinational staff | Covers both scale and workforce diversity | Team |
| 2026-11-09 | Focus: housekeeper experience only (manager dashboard: open) | Per brief | Fawzia |
| 2026-11-09 | Whole team works on everything together | Short deadline (one week) | Team |
