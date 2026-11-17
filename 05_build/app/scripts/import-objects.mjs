// Renames Figma exports ("U2 · towels@2x.png", "U2 · towels.png") in public/objects to "towels.png".
// Usage: npm run objects            (or: node scripts/import-objects.mjs <folder-with-exports>)
import { readdirSync, renameSync, copyFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const dest = resolve(import.meta.dirname, "../public/objects");
const src = resolve(process.argv[2] ?? dest);
let n = 0;
for (const f of readdirSync(src)) {
  const m = f.match(/^(?:U2\s*·\s*)?([a-z-]+)(?:@\dx)?\.png$/i);
  if (!m) continue;
  const target = join(dest, m[1].toLowerCase() + ".png");
  if (join(src, f) === target) continue;
  if (src === dest) renameSync(join(src, f), target); else copyFileSync(join(src, f), target);
  n++;
}
console.log(`${n} object images ready in public/objects` + (existsSync(join(dest, "towels.png")) ? "" : " (towels.png still missing)"));
