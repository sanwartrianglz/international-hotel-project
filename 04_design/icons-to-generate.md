# Icons to generate: navy-gradient object set

Style: match the navy images in `00_inputs/Icons/` (e.g. bed, towels, minibar). Soft navy-blue gradients, light paper background, same angle and light. Attach one as the style reference when generating.

**How to add new ones:** save the PNG/JPG into `00_inputs/Icons/` (any size; Gemini file names are fine). Then, in `05_build/app`, run `npm run objects`. The script resizes each image to 256 px, cuts out the background, and writes `public/objects/<name>.webp`. For a new Gemini file, add its id to `MAP` in `scripts/import-objects.mjs`, or name the file after the object (e.g. `ac.png`).

## Done: 30 (imported 17 Nov)
bed · bathtub · shower · toilet · sink · bin · window · vacuum · linen · bathrobe · duster · minibar · prayer-mat · shoes-off · quiet · crib · water · soft-drink · snack · towels · toiletries · pillows · wine · tv · clipboard · throw · service-dog · furniture · coffee-pods · dnd

## Still needed: 15
Until these exist, the app shows a navy-tinted placeholder.

### Guest culture note
| File | Draw |
|---|---|
| `female-staff` | Female housekeeper in uniform (hair tied or headscarf), friendly and neutral |

### Report issue
| File | Draw |
|---|---|
| `ac` | Wall AC unit with airflow lines |
| `light` | Light bulb |
| `tap-leak` | Tap dripping water |
| `door-lock` | Hotel door handle with card lock |
| `socket` | Wall power socket |
| `safe` | Small in-room safe with keypad |
| `key-card` | Hotel key card |

### Other screens
| File | Draw |
|---|---|
| `vip` | Star badge / rosette |
| `privacy` | Closed eye or padlock with a shield |
| `cart` | Housekeeping trolley with linen and supplies (Help → Supplies) |
| `first-aid` | First-aid kit (Help → Safety) |
| `lost-item` | Wristwatch / small bag with a tag (Lost & found) |
| `all-done` | Large tick inside a circle / seal (all rooms done) |
| `no-rooms` | Empty clipboard (no rooms yet) |

Not used in the app (skip): `coffee-cup`, `turndown`.
