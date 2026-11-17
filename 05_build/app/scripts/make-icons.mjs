// Draws the app icon (navy square, cream hotel key fob) as PNG without extra dependencies.
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };

function draw(size) {
  const navy = [30, 41, 59], cream = [246, 245, 242], ready = [35, 135, 90];
  const px = Buffer.alloc(size * (size * 3 + 1));
  const u = size / 64;
  const inRound = (x, y, x0, y0, x1, y1, r) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  for (let y = 0; y < size; y++) {
    px[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const X = x / u, Y = y / u;
      let c = navy;
      if (inRound(X, Y, 19, 9, 45, 55, 11)) c = cream;
      if ((X - 32) ** 2 + (Y - 18) ** 2 <= 16) c = navy;            // key hole
      if (inRound(X, Y, 25, 30, 39, 34, 2) || inRound(X, Y, 25, 38, 39, 42, 2)) c = navy; // "lines"
      if ((X - 32) ** 2 + (Y - 48) ** 2 <= 9) c = ready;            // ready dot
      const o = y * (size * 3 + 1) + 1 + x * 3;
      px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(px)), chunk("IEND", Buffer.alloc(0))]);
}
for (const s of [192, 512]) writeFileSync(new URL(`../public/pwa-${s}.png`, import.meta.url), draw(s));
console.log("icons written");
