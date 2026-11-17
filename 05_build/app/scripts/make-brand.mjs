// Builds the app's brand assets from the Cecil Hotel logo (00_inputs/Icons, the green + gold emblem).
//   npm run brand
// Writes: public/brand/logo.webp (full lock-up, splash), public/brand/mark.webp (arch + C, crests),
//         public/pwa-192.png, public/pwa-512.png (home-screen icon), public/favicon.png (browser tab).
// The logo is NOT recoloured. Its background green is --brand-green (#243f36) in tokens.css.
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const src = resolve(process.argv[2] ?? join(root, "../../00_inputs/Icons/Gemini_Generated_Image_oj3ilioj3ilioj3i.jpg"));
const pub = join(root, "public");
mkdirSync(join(pub, "brand"), { recursive: true });

// Measured on the 2048 px source: lock-up (arch + CECIL HOTEL EST. 1929) and the arch mark alone.
const LOCKUP = { left: 457, top: 317, width: 1135, height: 1414 };
const MARK = { left: 664, top: 398, width: 720, height: 720 };
const GREEN = { r: 0x24, g: 0x3f, b: 0x36 };

await sharp(src).extract(LOCKUP).resize({ height: 560 }).webp({ quality: 88 }).toFile(join(pub, "brand/logo.webp"));
await sharp(src).extract(MARK).resize(256, 256).webp({ quality: 88 }).toFile(join(pub, "brand/mark.webp"));
// home-screen icon: the mark centred on extra green, so it survives the round/maskable crop
const padded = await sharp(src).extract(MARK).extend({ top: 200, bottom: 200, left: 200, right: 200, background: GREEN }).toBuffer();
for (const s of [192, 512]) await sharp(padded).resize(s, s).png().toFile(join(pub, `pwa-${s}.png`));
await sharp(src).extract(MARK).resize(64, 64).png().toFile(join(pub, "favicon.png"));
console.log("brand assets written");
