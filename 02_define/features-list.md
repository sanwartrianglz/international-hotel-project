# Features List: Housekeeper App (draft, unsorted)

Drafted 2026-11-09. Mirror of the FigJam section "Features List · Housekeeper app (draft)". Next step: the team sorts it into MoSCoW on the board (Must = in the coded build).

**Source tags:** Cecil = Cecil Hotel baseline · competitor name = inspired by that app · Gap # = opportunity from `01_research/competitors/competitor-matrix.md`.

**Out of design scope:** multi-language, translation and Arabic RTL are handled by developers (i18n). Design rule only: every layout mirrors for RTL and survives longer text. See DECISIONS.md.

## 🕐 My shift & rooms
- Start shift → see my floor/section + room count · Cecil
- "My next room" focus: one room at a time, ordered by priority (arrivals, VIP, early check-in from PMS) · Gap 7, ALICE
- All my rooms today in one list, filter by status (to clean / cleaning / done / ready) · Cecil
- One-tap room status: Dirty → Cleaning → Cleaned → Inspected → Ready · Cecil
- Each room shows if the guest left, is staying, or is arriving, and opens the right checklist for it · Cecil
- If the room has "Do Not Disturb" or the guest says no, I mark it and the app reminds me to try again later · ALICE
- When a room is needed urgently (guest arriving early), reception marks it as rush, my phone / tablet alerts me and it jumps to the top of my list · Cecil
- "On break" button: pauses new rooms & alerts · OPERA, HotSOS
- End-of-shift summary · ALICE

## ✅ Visual checklists
- Icon + photo checklist per room type, minimal text · Gap 3
- "How it should look" reference photos · Gap 5
- Before/after photo proof · RoomChecking
- Short video / audio how-to for a step · hotelkit, Gap 3
- Progress bar per room: shows how many steps are done (e.g. 3 / 6) · Cecil

## 🧭 Guest culture notes
- Culture notes on the room card as icons (prayer direction, no alcohol, female staff only, shoes off) · Gap 4
- Tap a guest note icon → see what to do, what not to do, and why (with audio) · Gap 4
- Guest requests (extra pillows, crib) added to my checklist automatically → I bring, place & tick them · ALICE
- Long-stay custom cleaning options · RoomChecking
- ⭐ VIP / 🔒 privacy flag on the room → I know to give extra care, and never share the guest's name or room or take photos · HotSOS

## 🛠️ Issues & requests
- Report maintenance issue: pick icon + photo + required note explaining the issue (type or voice) · Cecil, all apps
- Track status of issues I reported · Cecil
- Lost & found log with photo · Quore
- Tap + / − to log what I used or the guest took (minibar, towels, amenities) → minibar is billed & stock is refilled · RoomChecking
- "Need help" button: pick 🧺 supplies, 🙋 extra hands or 🆘 safety → supervisor gets my room number & I see "on the way" · OPERA

## 💬 Team communication
- Pre-set icon messages to supervisor · Gap 3
- Shift briefing / announcements feed · hotelkit

## ⭐ Inspection & growth
- See inspection score + failed items with photos · Cecil rubric
- Fix-it flow for failed items → resubmit · Cecil
- Personal progress & recognition · HotSOS, new

## 📶 Reliability & device
- Offline-first, incl. photos → auto sync · Gap 6
- One-hand, glove-friendly big touch targets · Gap 7
- Works on my own phone OR the cart tablet: fast login (PIN / face), my phone stays signed in · new
- Live sync with PMS (OPERA) room status · Decision: assume PMS
