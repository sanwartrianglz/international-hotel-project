# CLAUDE.md: International Hotel Project

Context for Claude (and any AI tool) working in this folder. Read this file first, then `BRIEF.md` and `DECISIONS.md`.

## What this is
A group UX assignment at Trianglz. The Lead UX, Fawzia, split the team into 3 groups. Each group designs the **Cecil Hotel** concept for a different hotel context:
- **International**: this team (Sally, Salma, Amr)
- Gulf: another team
- Nubian: another team

Our version must feel clearly **cosmopolitan / international** and different from the Gulf and Nubian versions.

## Current scope (as of 2026-11-09, see DECISIONS.md)
- Product: a housekeeping operations tool. The users are **housekeepers**. Whether a manager/supervisor dashboard is also in scope is still OPEN (see BRIEF.md).
- "International" = a hotel chain across countries **and** multinational staff in each property.
- Deliverable: research → flows → Figma designs → prototype → **coded build**.
- Deadline: **the week of 2026-11-16**.
- Team works together on everything (no split by phase).

## Reference / baseline
- `D:\Trianglz\Cecil Hotel`: the earlier build for a single independent hotel with 4 roles (Housekeeper, Supervisor, Receptionist, Maintenance), no PMS. Reuse its logic (room status state machine, checklists, issue reporting) where it fits. **Do not reuse its visual identity** (green/teal); this project gets a new one.

## Tools
- **FigJam board**: "International Hotel - SAS" (file key `TCNCef37xuwIlrYmp3hTKJ`), used for research and synthesis. Reached through the figma-console Desktop Bridge plugin.
  - Section 1 = latest brainstorm notes. Section 3 = the earlier full process plan (guest-oriented; may be outdated).
  - Don't delete teammates' stickies. Add new content in new sections away from existing ones.
- **Figma design file**: wireframes, library and UI (link: TBD → add to `04_design/README.md`).

## Folder map
| Folder | Holds |
|---|---|
| `00_inputs/` | Raw material: Fawzia's brief, meeting notes, reference screenshots (Mobbin etc.) |
| `01_research/` | Competitor analysis, user research, concept & brand research |
| `02_define/` | Personas, journey map, feature list (MoSCoW), RSD |
| `03_structure/` | Sitemap / IA, screen inventory, user flows |
| `04_design/` | Moodboards, design system tokens, Figma links, exports |
| `05_build/` | The coded app (created when the build phase starts) |
| `06_test/` | Test script, usability findings |

## Rules for Claude
1. Housekeeper first: every screen and feature must serve the housekeeper's job on the floor (mobile, one hand, gloves, weak signal).
2. International requirements apply everywhere: multi-language, Arabic RTL + LTR, icon- and visual-first UI (language-independent, low-literacy), chain brand standards with country variations, guest culture notes per room.
3. Assume a PMS (e.g. Opera) feeds room status and guest preferences. Rationale is in DECISIONS.md.
4. Log every decision in `DECISIONS.md` with a date. Log each work session in `CHANGELOG.md`.
5. Raw inputs stay in `00_inputs/` unedited; synthesized output goes in the numbered folders.
6. Before writing to the FigJam board, read it first and confirm with the user.
