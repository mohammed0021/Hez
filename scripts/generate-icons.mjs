import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const APPLE_SIZES = [152, 167, 180];
const SPLASH_DIR = resolve(root, 'public', 'splash');
const ICONS_DIR = resolve(root, 'public', 'icons');

const SVG_PATH = resolve(ICONS_DIR, 'icon.svg');
const svgBuffer = readFileSync(SVG_PATH);

mkdirSync(SPLASH_DIR, { recursive: true });

async function generateIcons() {
  for (const size of SIZES) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(resolve(ICONS_DIR, `icon-${size}x${size}.png`));
    console.log(`  ✓ icon-${size}x${size}.png`);
  }

  for (const size of APPLE_SIZES) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(resolve(ICONS_DIR, `apple-icon-${size}x${size}.png`));
    console.log(`  ✓ apple-icon-${size}x${size}.png`);
  }

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(resolve(ICONS_DIR, 'icon-maskable.png'));
  console.log('  ✓ icon-maskable.png');

  const splashBg = { r: 10, g: 10, b: 10, alpha: 1 };
  const splashConfigs = [
    { w: 2048, h: 2732, name: 'apple-splash-2048x2732.png' },
    { w: 2732, h: 2048, name: 'apple-splash-2732x2048.png' },
    { w: 1668, h: 2388, name: 'apple-splash-1668x2388.png' },
    { w: 2388, h: 1668, name: 'apple-splash-2388x1668.png' },
    { w: 1668, h: 2224, name: 'apple-splash-1668x2224.png' },
    { w: 2224, h: 1668, name: 'apple-splash-2224x1668.png' },
    { w: 1536, h: 2048, name: 'apple-splash-1536x2048.png' },
    { w: 2048, h: 1536, name: 'apple-splash-2048x1536.png' },
    { w: 1290, h: 2796, name: 'apple-splash-1290x2796.png' },
    { w: 2796, h: 1290, name: 'apple-splash-2796x1290.png' },
    { w: 1179, h: 2556, name: 'apple-splash-1179x2556.png' },
    { w: 2556, h: 1179, name: 'apple-splash-2556x1179.png' },
    { w: 1125, h: 2436, name: 'apple-splash-1125x2436.png' },
    { w: 2436, h: 1125, name: 'apple-splash-2436x1125.png' },
    { w: 1242, h: 2688, name: 'apple-splash-1242x2688.png' },
    { w: 2688, h: 1242, name: 'apple-splash-2688x1242.png' },
    { w: 828, h: 1792, name: 'apple-splash-828x1792.png' },
    { w: 1792, h: 828, name: 'apple-splash-1792x828.png' },
    { w: 750, h: 1334, name: 'apple-splash-750x1334.png' },
    { w: 1334, h: 750, name: 'apple-splash-1334x750.png' },
    { w: 640, h: 1136, name: 'apple-splash-640x1136.png' },
    { w: 1136, h: 640, name: 'apple-splash-1136x640.png' },
  ];

  for (const { w, h, name } of splashConfigs) {
    const iconSize = Math.min(w, h) * 0.3;
    await sharp({
      create: { width: w, height: h, channels: 4, background: splashBg },
    })
      .composite([
        {
          input: await sharp(svgBuffer).resize(Math.round(iconSize), Math.round(iconSize)).png().toBuffer(),
          top: Math.round(h / 2 - iconSize / 2),
          left: Math.round(w / 2 - iconSize / 2),
        },
      ])
      .png()
      .toFile(resolve(SPLASH_DIR, name));
    console.log(`  ✓ ${name}`);
  }

  console.log('\n✅ All icons and splash screens generated!');
}

generateIcons().catch(console.error);
