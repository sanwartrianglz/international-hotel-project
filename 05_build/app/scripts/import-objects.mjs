// Imports the navy-gradient object icons into the app as small WebP files.
//   npm run objects                 → reads ../../00_inputs/Icons (raw, untouched)
//   node scripts/import-objects.mjs <folder>
// Output: public/objects/<object>.webp, 256 × 256 (shown at most ~112 px, so 2x-sharp).
// Files are recognised by their Gemini id (see MAP), a FigJam layer name, or an object name ("bed.png").
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

/** Gemini id (or FigJam layer name) → object id. Identified by eye on 17 Nov. */
const MAP = {
  "2vhhyd": "furniture", "3tbb8p (1)": "toiletries", "3tbb8p (2)": "pillows", "3tbb8p (3)": "wine",
  "3tbb8p (4)": "clipboard", "3tbb8p": "towels", "4uswkg": "toilet", "5bri0n": "throw", "5oobia": "bathrobe",
  "a1xzlb": "soft-drink", "a3fcwd": "bed", "ba17sm": "crib", "d1i2yn": "linen", "f4czif": "prayer-mat",
  "g74blu": "sink", "k2n7nw": "shower", "kxr4f3": "snack", "l3e0ue": "dnd", "lq6dqa": "bathtub",
  "o3b71z": "service-dog", "osjhl5": "duster", "rpr7r2": "vacuum", "tewrsl": "bin", "toqizq": "shoes-off",
  "tzbkfa": "minibar", "uj7p79": "coffee-pods", "xqa5zj": "water", "y5t357": "quiet", "yoxriv": "tv",
  "z2slr8": "window",
  // second batch (17 Nov)
  "s7gq1v": "no-rooms", "v53hp8": "all-done", "slf0jh": "lost-item", "repbml": "cart", "nn7vud": "privacy",
  "tj9617": "vip", "cyoq9s": "key-card", "sh6qpv": "safe", "n25vzw": "socket", "ew1j2s": "door-lock",
  "qdgr7o": "tap-leak", "tz14u4": "light", "69gxwb": "ac",
  // device choice (17 Nov)
  "gasc6o": "own-phone", "qvkky7": "cart-tablet",
  // FigJam Section 4 layer names (if exported from the board instead)
  "fl8f48": "towels", "q74ly3": "toiletries", "7f8rf4": "pillows", "a6y6h5": "wine",
  "image 3": "tv", "image 1": "clipboard", "image 2": "throw",
};

function idFor(file) {
  const base = file.replace(/(@\dx)?\.(png|jpe?g|webp)$/i, "");
  const g = base.match(/Gemini_Generated_Image_([a-z0-9]{6})[a-z0-9]*( 1)?( \(\d\))?$/i);
  if (g) return MAP[g[1] + (g[3] ?? "")] ?? MAP[g[1]];
  if (MAP[base]) return MAP[base];
  const plain = base.replace(/^U2\s*·\s*/i, "").toLowerCase();
  return /^[a-z-]+$/.test(plain) ? plain : null;
}

/** Colour of the set: the source images are navy; this hue shift turns them emerald (0 = keep navy). */
const HUE_SHIFT = Number(process.env.ICON_HUE ?? -95);

/** Resize to 256 px and cut out the off-white paper background (near-white AND low-colour pixels),
 *  so light-blue highlights stay solid. Soft ramp keeps edges anti-aliased. */
async function toTransparentWebp(input, output) {
  const { data, info } = await sharp(input).resize(256, 256, { fit: "contain", background: "#ffffff" })
    .modulate({ hue: HUE_SHIFT })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mn = Math.min(r, g, b), sat = Math.max(r, g, b) - mn;
    const d = Math.max(0, 232 - mn) + Math.max(0, sat - 16) * 2;   // 0 = paper
    out[j] = r; out[j + 1] = g; out[j + 2] = b; out[j + 3] = Math.min(255, d * 14);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 85, alphaQuality: 90 }).toFile(output);
}

const root = resolve(import.meta.dirname, "..");
const src = resolve(process.argv[2] ?? join(root, "../../00_inputs/Icons"));
const dest = join(root, "public/objects");
mkdirSync(dest, { recursive: true });

let n = 0;
for (const f of readdirSync(src).sort()) {
  if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
  if (/oj3ili/.test(f)) continue; // Cecil logo: handled by make-brand.mjs, not an object
  const id = idFor(f);
  if (!id) { console.log("skipped (unknown):", f); continue; }
  await toTransparentWebp(join(src, f), join(dest, id + ".webp"));
  console.log(`${f}  →  ${id}.webp`);
  n++;
}
console.log(`\n${n} icons written to public/objects` + (existsSync(join(dest, "bed.webp")) ? "" : " (bed.webp missing)"));
