# Cecil Housekeeping: housekeeper app (PWA)

The coded build for the International team (Sally, Salma, Amr). Built from the FigJam board "International Hotel - SAS":
the MoSCoW **MUST** list, user flows F1–F6, and Amr's foundations (U2 objects, key tag, stamps & hanger, tone of voice).

## Run it
```bash
cd 05_build/app
npm install
npm run dev        # open the printed URL; use phone size in DevTools (or your phone on the same Wi-Fi with --host)
npm run build      # production build in dist/ (offline-ready PWA)
```

On a desktop-size window the app shows inside an **iPhone 15 Pro mockup** (Dynamic Island, live status bar, home indicator; the signal bars go empty when Demo controls simulate "no signal"). On a real phone it runs full-screen. Add `?frame=off` to hide the phone or `?frame=on` to force it.

## Demo script (Joy's day)
1. **My phone** → face unlock → briefing → **Start shift**.
2. **My next room = 412** (VIP, prayer mat, no alcohol, female staff, 2 pillows). Tap a purple note to see *do / don't / why* + 🔊.
3. **Start cleaning** → tick the object tiles (Bed, Bath…), pillows, minibar → **Room done** unlocks at n / n.
4. ☰ → **Demo controls**: Reception marks **418 urgent** → full-screen ⚡ alert. Supervisor: **412 needs a fix** → Fix-it card on top.
5. 💬 tap **Need towels** → ✓✓ seen → "👍 Coming, 5 min". 🛟 help sheet. ⏸ break = full-screen paused.
6. Report issue (icon → photo → note or 🎤) → tracked in ☰ My reports (Sent → Being fixed → Fixed).
7. Demo controls → **No signal**: the offline banner shows and changes queue up, then sync when turned off.
8. ☰ → Language → **العربية**: the whole app mirrors to RTL.
9. ☰ → End shift → summary, hand over DND rooms → Off duty.

## Where things are
| | |
|---|---|
| `src/styles/tokens.css` | Amr's design tokens (colours, type, touch sizes) |
| `src/data/` | Mock PMS feed (`seed.ts`), checklists, culture notes, pre-set messages |
| `src/i18n/` | English, Arabic (RTL, gender-neutral nouns), Filipino. **Translations are drafts; please review.** |
| `src/store.ts` | Room status flow, offline queue, simulated reception / supervisor / PMS |
| `src/screens/` | Start (login, briefing), Home, Clean (checklist, done, fix-it), Issue, More (messages, rooms, menu, end, demo) |
| `public/brand/` | Logo lock-up and arch mark from the Cecil Hotel logo; also `pwa-*.png` and `favicon.png`. Regenerate with `npm run brand`. |
| `public/objects/` | Navy-gradient object icons as 256 px WebP with transparent background. Source images live in `00_inputs/Icons/`; run `npm run objects` to regenerate. Missing icons show a navy-tinted placeholder. |

## Not built yet
- Supervisor view (Floor · Team · Inbox · Inspect). Its actions are simulated in **Demo controls** for now.
- SHOULD / COULD extras: video how-to, before/after photo proof, progress & recognition history.
- Real PMS / push notifications: mocked.
