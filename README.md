# International Hotel Project

Trianglz group UX assignment: the **Cecil Hotel** concept, international edition. A housekeeping operations app for housekeepers working in an international hotel chain with multinational staff.

Team: Sally, Salma, Amr.

**Live prototype:** https://sanwartrianglz.github.io/international-hotel-project/ (opens in an iPhone frame on a laptop and full-screen on a phone; ☰ → Demo controls simulates reception and the supervisor). It republishes automatically a minute or two after each push to `main`.

## Start here
1. `BRIEF.md`: the assignment and open questions
2. `DECISIONS.md`: dated decisions log
3. `CHANGELOG.md`: what was done in each work session
4. `CLAUDE.md`: project rules (also read by AI tools)

## Folders
| Folder | Holds |
|---|---|
| `00_inputs/` | Raw material (brief, meeting notes, references), kept unedited |
| `01_research/` | Competitor analysis, user research, concept & brand research |
| `02_define/` | Personas, journey map, feature list, RSD |
| `03_structure/` | Sitemap / IA, screen inventory, user flows |
| `04_design/` | Moodboards, design system, Figma links, exports, reference storybook |
| `05_build/` | The coded mobile app |
| `06_test/` | Test script, usability findings |

## Working together
First time: accept the GitHub invite, install [Git](https://git-scm.com) and [Node.js](https://nodejs.org) (LTS), then:
```bash
git clone https://github.com/sanwartrianglz/international-hotel-project.git
cd international-hotel-project/05_build/app
npm install
npm run dev       # opens the app at http://localhost:5173
```
Every time:
```bash
git pull          # before you start working
git add .
git commit -m "Short description of what you changed"
git push          # share your changes
```
If you edit the same file as someone else at the same time, `git pull` may ask you to merge. Tell the team before making big edits to shared files like `DECISIONS.md`.
