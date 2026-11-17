# User Flows: Housekeeper App (from the 👍 features)

Drafted 2026-11-09, refined into **v2** the same day. Mirror of the FigJam section "User Flows · Housekeeper (👍 features)".

**v2 notation:** each flow has 3 swimlanes: 👤 Housekeeper · 📱 App (own phone or cart tablet) · ⚙️ PMS / Supervisor / Reception.
Shapes: ⬭ start/end · rounded box = housekeeper action · square = app screen · ◇ decision · ▱ input (photo, note, count) · speech bubble = notification · cylinder = system/PMS update · hexagon = other person · double-bar box = link to another flow · queue = offline queue.
Arrows: green solid = happy path · orange dashed = alternative · grey dotted = system side-effect. Alternative steps have an orange outline.

## 😊 Happy scenario: a day for Joy
Joy is from the Philippines and works as a housekeeper at the chain's Cairo hotel. She reads a little English and no Arabic.
1. **07:00:** opens the app on her own phone and unlocks it with her face, reads today's briefing (icons), starts her shift: floor 4, 14 rooms. (F1)
2. **07:10:** "My next room" is 412: checkout, ⭐ VIP, ➕ 2 extra pillows. No DND. She taps "Start cleaning". (F2)
3. She follows the icon checklist. A reference photo shows how the VIP bed must look. She places and ticks the pillows and logs 2 waters 🥤. (F2)
4. She spots the AC leaking and reports it with the ❄️ icon, a photo and a quick note, then keeps cleaning. (F3)
5. At 6 / 6 she taps "Room done" → 412 is Cleaned. The PMS and the supervisor are updated, no call needed. (F2)
6. **10:30:** 🔔 rush alert: 418's guest arrived early. 418 jumps to the top, and she goes there next. (F4)
7. Out of towels, she taps 🧺 "Need towels" → "👍 Coming, 5 min". At **12:30** she taps "On break" for lunch, then "Back". (F4)
8. The supervisor inspects 412: ✅ 96 / 100 → Ready. The guest checks in on time. (F5)
9. **15:00:** last room done. Summary: 14 rooms, AC fixed ✅, pass rate 100% ⭐. She taps "End shift", so no alerts reach her at home. (F6)

## F1 · Start my shift
Covers: fast login (own phone or cart tablet) · shift briefing · start shift · rooms from PMS · offline-first · my next room · all my rooms list
- **Happy:** open the app on my own phone OR the cart tablet → log in (own phone stays signed in; cart tablet = quick PIN / face) → read shift briefing → start shift: my floor + rooms → [signal? yes] rooms load live from PMS (OPERA) → "My next room" shows the top-priority room → go to room (F2)
- **Alt, no signal:** use the last synced list and work offline → auto-sync when signal returns → My next room
- **Alt, wants the full picture:** open "All my rooms" + filter by status

## F2 · Clean a room
Covers: room type → right checklist · VIP / privacy · DND / refused · long-stay options · one-tap status · reference photos · how-to video/audio · guest requests · minibar / amenity log · progress bar · PMS sync
- **Happy:** next room → room card (long-stay guest → choose light clean / linen day): type (→ right checklist), ⭐ VIP / 🔒 privacy, ➕ guest requests → knock & announce → [can I enter? yes] tap "Start cleaning" (status Cleaning) → follow icon checklist + reference photos (progress bar fills) → place guest extras → tick → log minibar & amenities with + / − → 6 / 6 → "Room done" → Cleaned, PMS + supervisor updated → next room
- **Alt, can't enter (DND sign / guest says no):** tap DND or Refused → room moves aside, reminder later → retry (knock again)
- **Alt, unsure about a step:** play short video / audio how-to, then back to the checklist

## F3 · Report an issue  (+ F3b · Lost & found)
Covers: report maintenance issue (icon + photo + required note) · lost & found
- **Happy:** spot a problem → tap "Report issue" → pick icon → take photo → add required note (type or voice) → send (maintenance gets room + photo + note) → continue cleaning → track: 🔧 in progress → ✅ fixed
- **Lost & found:** find a guest's item → photo + where it was found → item logged, handed to supervisor → guest contacted / item claimed

## F4 · Interruptions (v2 splits into F4a Rush room · F4b Ask the supervisor · F4c Take a break)
Covers: rush-room alert (reception) · pre-set icon messages · on break
- **Rush:** reception marks a room as rush → 🔔 alert on my phone / cart tablet → room jumps to the top → finish current step, go there → F2
- **Message:** out of towels → open chat → tap 🧺 "Need towels" → sent with room no., ✓✓ seen → supervisor replies "👍 Coming, 5 min" → keep cleaning
- **Break:** break / prayer time → tap "On break" → no new rooms or alerts; supervisor sees I'm away → tap "Back" → my next room

## F5 · Inspection
Covers: inspection score + failed items with photos · fix-it flow → resubmit · personal progress
- **Happy:** supervisor inspects → [score ≥ 90? yes] 🔔 "passed · 96 / 100" → status Ready → my pass rate goes up
- **Alt, needs a fix:** 🔔 "needs a fix · 84 / 100" → see only the failed items + inspector photos → fix each → tap Fix → send for re-check → ↺ back to "Score ≥ 90?"

## F6 · End my shift
Covers: end-of-shift summary · personal progress & recognition · end shift / off-duty
- **Happy:** last room done → end-of-shift summary (rooms, issues, DND left) → [DND rooms left? no] my progress: pass rate, ⭐ recognition → tap "End shift" → off-duty (cart tablet logs me out for the next person)
- **Alt, DND rooms left:** hand them to the next shift / supervisor → my progress
