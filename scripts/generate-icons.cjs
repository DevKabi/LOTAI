const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}
function crc32(buf) {
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xFF];
  }
  return (c ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function renderIconPNG(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rowLen = 1 + width * 4;
  const raw = Buffer.alloc(height * rowLen);

  const cx = width / 2;
  const cy = height / 2;
  const scale = isMaskable ? 0.72 : 0.88;
  const cardRadius = (size * 0.24) * scale;
  const cardHalf = (size * 0.44) * scale;

  function distToRoundedRect(px, py) {
    const dx = Math.abs(px - cx) - (cardHalf - cardRadius);
    const dy = Math.abs(py - cy) - (cardHalf - cardRadius);
    if (dx <= 0 && dy <= 0) return -cardRadius;
    if (dx > 0 && dy <= 0) return dx - cardRadius;
    if (dx <= 0 && dy > 0) return dy - cardRadius;
    return Math.hypot(dx, dy) - cardRadius;
  }

  function distToStar(px, py, sx, sy, r) {
    const dx = Math.abs(px - sx);
    const dy = Math.abs(py - sy);
    return (dx + dy) - r;
  }

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      let r = 5;
      let g = 8;
      let b = 22;
      let a = 255;

      const dRect = distToRoundedRect(x, y);

      if (dRect < 2) {
        const t = ((x - (cx - cardHalf)) + (y - (cy - cardHalf))) / (cardHalf * 4);
        const bgR = Math.round(109 * (1 - t * 0.6) + 30 * (t * 0.6));
        const bgG = Math.round(93 * (1 - t * 0.6) + 27 * (t * 0.6));
        const bgB = Math.round(254 * (1 - t * 0.4) + 120 * (t * 0.4));

        if (dRect >= -2 && dRect <= 1.5) {
          r = 167;
          g = 139;
          b = 250;
        } else if (dRect < -2) {
          r = bgR;
          g = bgG;
          b = bgB;

          const nx = (x - cx) / (size * 0.28 * scale);
          const ny = (y - cy) / (size * 0.28 * scale);
          const ellipseDist = Math.abs(Math.sqrt(nx * nx + ny * ny) - 0.78);

          if (ellipseDist < 0.12 && (ny > -0.7 || nx > -0.2)) {
            const blend = Math.max(0, 1 - ellipseDist / 0.12);
            r = Math.round(r * (1 - blend) + 255 * blend);
            g = Math.round(g * (1 - blend) + 255 * blend);
            b = Math.round(b * (1 - blend) + 255 * blend);
          }

          const lx = (x - cx) / (size * scale);
          const ly = (y - cy) / (size * scale);

          const isLVert = (lx >= -0.16 && lx <= -0.06 && ly >= -0.22 && ly <= 0.20);
          const isLHoriz = (lx >= -0.16 && lx <= 0.18 && ly >= 0.10 && ly <= 0.20);

          if (isLVert || isLHoriz) {
            const lGrad = (lx + 0.16) / 0.34;
            const lr = Math.round(240 * (1 - lGrad * 0.2));
            const lg = Math.round(245 * (1 - lGrad * 0.1));
            const lb = 255;
            r = lr;
            g = lg;
            b = lb;
          }

          const starX = cx + (size * 0.12 * scale);
          const starY = cy - (size * 0.12 * scale);
          const starR = size * 0.08 * scale;
          const starDist = distToStar(x, y, starX, starY, starR);

          if (starDist < 0) {
            r = 255;
            g = 255;
            b = 255;
          } else if (starDist < size * 0.04 * scale) {
            const halo = 1 - (starDist / (size * 0.04 * scale));
            r = Math.min(255, Math.round(r + 180 * halo));
            g = Math.min(255, Math.round(g + 200 * halo));
            b = Math.min(255, Math.round(b + 255 * halo));
          }
        }
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
sizes.forEach(s => {
  const buf = renderIconPNG(s, false);
  const fileName = s === 180 ? 'apple-touch-icon.png' : 'icon-' + s + 'x' + s + '.png';
  const filePath = path.join(iconsDir, fileName);
  fs.writeFileSync(filePath, buf);
  console.log('Generated:', fileName, '(' + buf.length + ' bytes)');
  if (s === 180) {
    fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf);
  }
});

[192, 512].forEach(s => {
  const buf = renderIconPNG(s, true);
  const fileName = 'icon-maskable-' + s + 'x' + s + '.png';
  const filePath = path.join(iconsDir, fileName);
  fs.writeFileSync(filePath, buf);
  console.log('Generated maskable:', fileName, '(' + buf.length + ' bytes)');
});

const fav32 = renderIconPNG(32, false);
fs.writeFileSync(path.join(iconsDir, 'favicon-32x32.png'), fav32);
fs.writeFileSync(path.join(publicDir, 'favicon.png'), fav32);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
      <stop offset="0%" stop-color="#151336" />
      <stop offset="100%" stop-color="#050816" />
    </radialGradient>
    <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C6BFF" />
      <stop offset="45%" stop-color="#6D5DFE" />
      <stop offset="100%" stop-color="#4F3FF0" />
    </linearGradient>
    <linearGradient id="neonL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#E0E7FF" />
      <stop offset="100%" stop-color="#38BDF8" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="56" y="56" width="400" height="400" rx="92" fill="url(#emblemGrad)" stroke="#A78BFA" stroke-width="4" stroke-opacity="0.4" />
  <ellipse cx="256" cy="256" rx="140" ry="140" stroke="#38BDF8" stroke-width="8" stroke-opacity="0.6" stroke-dasharray="16 8" />
  <ellipse cx="256" cy="256" rx="120" ry="120" stroke="#FFFFFF" stroke-width="4" stroke-opacity="0.8" />
  <path d="M190 160 V330 H320" stroke="url(#neonL)" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M336 176 Q336 208 304 208 Q336 208 336 240 Q336 208 368 208 Q336 208 336 176 Z" fill="#FFFFFF" />
  <circle cx="336" cy="208" r="4" fill="#38BDF8" />
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
console.log('PWA icon generation completed successfully!');
