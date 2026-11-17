# Changelog

Dated log of work sessions: what was done and what's next.

## 2026-11-09
- Connected Claude to the FigJam board "International Hotel - SAS" through the Desktop Bridge.
- Reviewed the Cecil Hotel baseline (`D:\Trianglz\Cecil Hotel`) and the existing board content.
- Clarified the brief: housekeepers, international chain plus multinational staff, coded build, due the week of 2026-11-16.
- Set up the project folder structure, CLAUDE.md, BRIEF.md and DECISIONS.md.
- Competitive analysis of 8 housekeeping apps (Optii, Flexkeeping, HotSOS, Quore, hotelkit, ALICE, OPERA Cloud, RoomChecking) through an international lens. Built in the new FigJam section "Competitive Analysis · International lens" to the right of Section 1, with a matrix, app cards and 7 gaps/opportunities. Mirrored in `01_research/competitors/competitor-matrix.md`.
- Added App Store icons to the app cards and above the table header. Added a "🇪🇬 Used in Egypt" row to the matrix: OPERA (Orascom) and HotSOS (Mövenpick Cairo) are confirmed; hotelkit, ALICE and Optii only have Middle East presence; the rest have no evidence.
- Drafted the features list (35 features, 7 categories) in a new FigJam section "Features List · Housekeeper app (draft)" right of the competitive analysis, with empty MoSCoW zones below. Mirrored in `02_define/features-list.md`. Language features dropped from design scope (dev handles i18n).
- Clarified and rewrote many feature stickies with the user. Visual sketch examples (visual checklist, progress bar, culture notes, pre-set messages, fix-it flow) are linked to their stickies. Removed "voice note" and "brand checklist local items".
- User flows: 6 flows + a happy scenario (Joy's day), built from the 👍 features. FigJam section "User Flows · Housekeeper (👍 features)"; mirrored in `03_structure/user-flows/user-flows.md`.
- **Next:** the team verifies the "?" cells; resolve the open questions in BRIEF.md (manager dashboard?); turn the gaps into the feature list.

## 2026-11-11
- Rewrote the feature stickies as housekeeper-voice bullets and sorted them into the MoSCoW text lists on the FigJam board: MUST 17 points, SHOULD 7, COULD 5, nothing in WON'T. Two points are starred: culture notes and lost & found. Sub-points sit under culture notes, maintenance tracking and inspection. The original stickies are unchanged. `02_define/features-list.md` is not yet updated to the MoSCoW sort.
- Saved the Airbnb DESIGN.md reference: `00_inputs/references/airbnb-DESIGN.md` (from the npm package, hash verified) and `airbnb.design.md` (the user's download, which adds SEO/FAQ notes).
- Studied airbnb.com live (home, search + filters, map, listing page) and recorded where it differs from the file: 5 nav tabs, 4 shadow tiers, 32px modals, a gradient pill CTA, dark and grey buttons, the translation pattern, skeletons, and 3D "photo icons".
- Built an unofficial study storybook. It exists as a single page (`04_design/reference-systems/airbnb-storybook.html`) and as a real Storybook 9 project (`04_design/reference-systems/airbnb-storybook/`, 43 stories, local git repo). It includes our own 3D housekeeping photo-icon set (bed, towels, bucket, spray, cart, door, key, checklist, etc.).
- Published the storybook to Chromatic: https://6af44e46707bf6dc8d660abf-tbfzxvxjrj.chromatic.com/ (build 1, 43 stories, 43 snapshots).
- **Next:** update features-list.md to the MoSCoW sort; decide whether we adopt the 3D photo-icon style for our own icon set.
- Folded the live-site study into the main storybook groups (Docs, Actions, Navigation, Listings, Listing detail, Inputs, Page) and republished to Chromatic as build 2. Permanent link: https://main--6af44e46707bf6dc8d660abf.chromatic.com/. The Chromatic token is saved in the user's Windows environment as CHROMATIC_PROJECT_TOKEN.
- Added a "Checklists" group to the storybook: House rules & requests (checked on the live site), Arrival guide (from Airbnb's host resources, layout rebuilt), and our own Housekeeper room checklist concept in EN / AR (RTL) / Filipino. Published to Chromatic as build 3 (46 stories). Not confirmed: Airbnb's predefined checkout task list and its listing-setup progress checklist.

## 2026-11-12
- Made the Airbnb study storybook on Chromatic public (Manage → Collaborate → Storybook visibility) so teammates can open https://main--6af44e46707bf6dc8d660abf.chromatic.com/ without a Chromatic account. The library, tests and settings stay private.
- FigJam: added section "6b · U2 object set · flat-vector alternative" (node 68:1669) to the right of Amr's "4 · Amr" section. It holds 46 empty tiles, one for each U2 object, each with a copy-ready Google Flow prompt in the flat-vector style Salma proposed (no outlines, subtle gradients, sky blue / bright green / coral red / pastel pink with forest green accents, on off-white). It is an alternative only: Amr's set in section 6 is unchanged, and there is no decision to switch. The style reference image still has to be pasted into its placeholder box by hand.
- **Next:** generate the 46 images in Google Flow with the reference attached; the team compares them with Amr's clay-3D set and logs the outcome in DECISIONS.md.

## 2026-11-17
- Installed GitHub CLI and signed in as `sanwartrianglz`.
- Turned the project folder into a git repo and pushed it to the public repo https://github.com/sanwartrianglz/international-hotel-project. Added `README.md` (team how-to), `.gitignore` (node_modules, build output, env files) and `.gitattributes` (LF line endings).
- Merged the Airbnb storybook's standalone git history (3 commits) into the main repo. Its old `.git` folder is kept as `.git-standalone-backup/` (git ignores it); delete it once Chromatic republishing from the main repo has been confirmed.
- **Next:** invite Sally and Amr as collaborators; set up the mobile app in `05_build/` from the FigJam findings.
- Read the whole FigJam board: the MoSCoW sort (20 MUST · 8 SHOULD · 5 COULD), user flows v2, Amr's sections A–F (concept U2, tone of voice, navigation model, foundations, key tag + stamp & hanger, supervisor slice), Sally's feature tables, and the 46-object U2 image set.
- Built the housekeeper app in `05_build/app` (React + Vite + TS PWA): fast login (phone face unlock / cart tablet PIN), briefing, My next room (priority queue), all rooms + filter, room card with culture notes (do / don't / why + audio), VIP / privacy rules, long-stay choice, DND / refused + reminder, object-tile checklist with step sheets and reference, guest requests, minibar ±, progress bar with locked Room done, report issue (icon + photo + note or voice) + tracking, lost & found, pre-set messages with auto reply, help sheet, full-screen break, urgent alert, fix-it flow, end-of-shift summary + DND hand-over, offline banner + sync queue, EN / AR (RTL) / FIL. Supervisor-side events are in Demo controls.
- Tested in Chrome: login → 412 clean → urgent 418 → needs a fix → re-check, Arabic RTL, messages. Fixed: screens kept the previous scroll position; the mixed-direction score line in Arabic.
- Amr's object PNGs still need to be exported from Figma into `05_build/app/public/objects/` (then `npm run objects`). Until then the app shows emoji stand-ins.
- **Next:** export the object images; native-speaker review of the Arabic and Filipino strings; supervisor view (Floor · Team · Inbox · Inspect); deploy to GitHub Pages for a shareable link.
- Added an iPhone 15 Pro mockup around the app on desktop screens (for reviews and presenting). Sheets, alerts and toasts stay inside the phone screen; the status bar follows offline mode and the break screen; Arabic mirrors only the app, not the phone. `?frame=off` / `?frame=on`.
- UI v2: smaller sizes, brass + serif hotel character, line icons for controls, Cecil crest on login, daily-card briefing, key tag with brass ring, seal on completion, door-hanger break screen, segmented language picker, initials instead of flag avatars. Removed the side panel next to the iPhone mockup.
- Guest needs section under the room card (home + room screens); icon-only markers on list cards.
- Switched objects to the navy-gradient set: import script maps the 11 board layers to file names; placeholder emoji are tinted navy. Added FigJam section "Icons to generate · navy set (34)" (node 102:2056) to the right of Sally's section, plus 04_design/icons-to-generate.md.
- **Next:** export the 11 navy images (they are selected in Figma) and generate the other 34; Amr to confirm the smaller sizes.
