# Icons to generate: navy-gradient object set

Style: match the navy images in `00_inputs/Icons/` (e.g. bed, towels, minibar). Soft navy-blue gradients, light paper background, same angle and light. Attach one as the style reference when generating.

**How to add new ones:** save the PNG/JPG into `00_inputs/Icons/` (any size; Gemini file names are fine). Then, in `05_build/app`, run `npm run objects`. The script resizes each image to 256 px, cuts out the background, and writes `public/objects/<name>.webp`. For a new Gemini file, add its id to `MAP` in `scripts/import-objects.mjs`, or name the file after the object (e.g. `ac.png`).

## Done: 43 (imported 17 Nov)
All checklist, culture-note, request, minibar, issue and help icons, except the two below. Judgement calls: the empty trolley is used for `no-rooms`, and the bed with sparkles for `all-done`.

## Still needed: 2
Until these exist, the app shows a navy-tinted placeholder.

| File | Where | Draw |
|---|---|---|
| `female-staff` | Guest note "Female staff" | Female housekeeper in uniform (hair tied or headscarf), friendly and neutral |
| `first-aid` | Help → "Safety · I need help now" | First-aid kit |

Not used in the app (skip): `coffee-cup`, `turndown`.
