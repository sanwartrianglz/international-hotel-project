// Puts the board's navy-gradient object images into public/objects/<object>.png.
// Export the selected images from FigJam Section 4 (left column) into public/objects, then run:
//   npm run objects            (or: node scripts/import-objects.mjs <folder-with-exports>)
// It understands Figma's export names ("image 3@2x.png", "Gemini_Generated_Image_… 1.png")
// and already-named files ("towels.png", "U2 · towels@2x.png").
import { readdirSync, renameSync, copyFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

/** Layer name in FigJam Section 4 (navy column) → object id. */
const NAVY = {
  "Gemini_Generated_Image_fl8f48fl8f48fl8f 1": "towels",
  "Gemini_Generated_Image_q74ly3q74ly3q74l 1": "toiletries",
  "Gemini_Generated_Image_7f8rf47f8rf47f8r 1": "pillows",
  "Gemini_Generated_Image_a6y6h5a6y6h5a6y6 1": "wine",
  "image 3": "tv",
  "image 1": "clipboard",
  "image 2": "throw",
  "Gemini_Generated_Image_o3b71zo3b71zo3b7 1": "service-dog",
  "Gemini_Generated_Image_2vhhyd2vhhyd2vhh 1": "furniture",
  "Gemini_Generated_Image_uj7p79uj7p79uj7p 1": "coffee-pods",
  "Gemini_Generated_Image_l3e0uel3e0uel3e0 1": "dnd",
};

const dest = resolve(import.meta.dirname, "../public/objects");
const src = resolve(process.argv[2] ?? dest);
let n = 0;
for (const f of readdirSync(src)) {
  if (!/\.png$/i.test(f)) continue;
  const base = f.replace(/(@\dx)?\.png$/i, "");
  const id = NAVY[base] ?? base.replace(/^U2\s*·\s*/i, "").toLowerCase();
  if (!/^[a-z-]+$/.test(id)) { console.log("skipped (unknown name):", f); continue; }
  const target = join(dest, id + ".png");
  if (join(src, f) === target) continue;
  if (src === dest) renameSync(join(src, f), target); else copyFileSync(join(src, f), target);
  n++;
}
const have = readdirSync(dest).filter((f) => f.endsWith(".png")).length;
console.log(`${n} renamed · ${have} object images in public/objects` + (existsSync(join(dest, "towels.png")) ? "" : " (towels.png missing)"));
