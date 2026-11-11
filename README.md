# Airbnb DS: study storybook (unofficial)

A reference Storybook built to study Airbnb's public design language for the International Hotel Project (Trianglz). It is **not affiliated with Airbnb**. The 3D "photo icons" are our own redraws in their style, and no Airbnb image assets are included.

Sources:
- Tokens: `00_inputs/references/airbnb.design.md`
- Live-site study: airbnb.com, 2026-11-11 (stories tagged "live site" in each group)

## Run locally
```bash
npm install
npm run storybook        # http://localhost:6006
```

## Where to edit
| What | File |
|---|---|
| Story markup | `src/sections/<id>.html` (one file per story) |
| Story behaviour | `src/init.js` (function keyed by the same `<id>`) |
| Sidebar groups / story names | `src/NN-<group>.stories.js` |
| Tokens & component CSS | `src/styles.css` |
| 3D photo icons (SVG sprite) | `src/photo-icons.svg.html` |
| Viewports, sort order | `.storybook/preview.js` |

To add a story:
1. Create `src/sections/<id>.html`.
2. Add `export const MyStory = { name: 'My story', render: () => section('<id>', html) }` to a stories file.
3. Optionally, add `init.<id>()` in `src/init.js`.

## Publish / update for the team (Chromatic)
Each publish creates a new version under the same project link. Teammates see the history and can comment.
```bash
# first time only: create a project at chromatic.com and copy its project token
set CHROMATIC_PROJECT_TOKEN=<token>      # PowerShell: $env:CHROMATIC_PROJECT_TOKEN="<token>"
npm run chromatic
```
Chromatic needs each change committed first: `git add -A && git commit -m "..."`, then run `npm run chromatic`.

Keep the Chromatic project **private** and invite teammates as collaborators, because this documents another company's brand.
