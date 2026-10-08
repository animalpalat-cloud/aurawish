const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const publicDir = path.resolve(__dirname, '..', 'public');

function getHtml(size, isApple = false) {
  // Border radius: For Apple Touch Icon, standard rounded rect. For favicons, clean rounded square.
  const borderRadius = isApple ? `${Math.round(size * 0.22)}px` : `${Math.round(size * 0.20)}px`;
  
  // For small sizes (16, 32), optimize padding & contrast
  const isSmall = size <= 32;
  const padding = isSmall ? Math.round(size * 0.10) : Math.round(size * 0.13);
  const sparkSize = size - (padding * 2);

  // Gradient border thickness
  const borderPad = isSmall ? 1 : Math.max(1, Math.round(size * 0.04));

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${size}px;
    height: ${size}px;
    background: transparent;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .app-icon {
    width: ${size}px;
    height: ${size}px;
    border-radius: ${borderRadius};
    background: #090B10;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .border-gradient {
    position: absolute;
    inset: 0;
    border-radius: ${borderRadius};
    background: linear-gradient(135deg, #c026d3 0%, #e879f9 35%, #fbbf24 100%);
    padding: ${borderPad}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inner-container {
    width: 100%;
    height: 100%;
    border-radius: ${Math.max(1, Math.round(size * 0.18))}px;
    background: ${isSmall ? '#090B10' : 'radial-gradient(circle at 70% 30%, #1c102c 0%, #090b10 85%)'};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  svg {
    position: relative;
    z-index: 2;
    shape-rendering: geometricPrecision;
  }
</style>
</head>
<body>
  <div class="app-icon">
    <div class="border-gradient">
      <div class="inner-container">
        <svg width="${sparkSize}" height="${sparkSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Main 4-point sparkle star -->
          <path d="M12 2C12.55 6.6 15.9 10.2 20.5 10.75C15.9 11.3 12.55 14.9 12 19.5C11.45 14.9 8.1 11.3 3.5 10.75C8.1 10.2 11.45 6.6 12 2Z" fill="url(#sparkleGradient)" />
          
          <!-- Secondary playful accent star (top right) -->
          <path d="M18.8 2.8C19.1 4.3 20.3 5.5 21.8 5.8C20.3 6.1 19.1 7.3 18.8 8.8C18.5 7.3 17.3 6.1 15.8 5.8C17.3 5.5 18.5 4.3 18.8 2.8Z" fill="#FDE047" />

          <!-- Delicate micro sparkle (bottom left) -->
          <path d="M5.2 16.2C5.4 17.3 6.3 18.2 7.4 18.4C6.3 18.6 5.4 19.5 5.2 20.6C5 19.5 4.1 18.6 3 18.4C4.1 18.2 5 17.3 5.2 16.2Z" fill="#F472B6" />
          
          <defs>
            <linearGradient id="sparkleGradient" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#FFFBEB" />
              <stop offset="25%" stop-color="#FDE047" />
              <stop offset="60%" stop-color="#F59E0B" />
              <stop offset="85%" stop-color="#F472B6" />
              <stop offset="100%" stop-color="#D946EF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function capturePng(size, outputPath, isApple = false) {
  const tempHtml = path.join(__dirname, `temp_${size}.html`);
  fs.writeFileSync(tempHtml, getHtml(size, isApple), 'utf8');

  try {
    execFileSync(chromePath, [
      '--headless',
      '--disable-gpu',
      `--screenshot=${outputPath}`,
      `--window-size=${size},${size}`,
      '--default-background-color=00000000',
      tempHtml
    ]);
    console.log(`Generated ${path.basename(outputPath)} (${size}x${size}): ${fs.statSync(outputPath).size} bytes`);
  } finally {
    if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
  }
}

function createIco(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + (dirEntrySize * numImages);

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(numImages, 4);

  const entries = [];
  for (const { buffer, size } of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

function generateSvgFavicon() {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <defs>
    <linearGradient id="borderGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#c026d3" />
      <stop offset="35%" stop-color="#e879f9" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>
    <radialGradient id="bgGrad" cx="22" cy="10" r="24" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1c102c" />
      <stop offset="85%" stop-color="#090b10" />
    </radialGradient>
    <linearGradient id="sparkleGrad" x1="4" y1="3" x2="28" y2="27" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FDE047" />
      <stop offset="60%" stop-color="#F59E0B" />
      <stop offset="85%" stop-color="#F472B6" />
      <stop offset="100%" stop-color="#D946EF" />
    </linearGradient>
  </defs>
  <!-- Outer Rounded Square Container -->
  <rect width="32" height="32" rx="7" fill="url(#borderGrad)" />
  <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="6" fill="url(#bgGrad)" />
  <!-- Sparkle Icons -->
  <g transform="translate(4, 4) scale(1)">
    <!-- Primary 4-point Sparkle -->
    <path d="M12 2C12.55 6.6 15.9 10.2 20.5 10.75C15.9 11.3 12.55 14.9 12 19.5C11.45 14.9 8.1 11.3 3.5 10.75C8.1 10.2 11.45 6.6 12 2Z" fill="url(#sparkleGrad)" />
    <!-- Secondary Top Sparkle -->
    <path d="M18.8 2.8C19.1 4.3 20.3 5.5 21.8 5.8C20.3 6.1 19.1 7.3 18.8 8.8C18.5 7.3 17.3 6.1 15.8 5.8C17.3 5.5 18.5 4.3 18.8 2.8Z" fill="#FDE047" />
    <!-- Delicate Accent Sparkle -->
    <path d="M5.2 16.2C5.4 17.3 6.3 18.2 7.4 18.4C6.3 18.6 5.4 19.5 5.2 20.6C5 19.5 4.1 18.6 3 18.4C4.1 18.2 5 17.3 5.2 16.2Z" fill="#F472B6" />
  </g>
</svg>
`;
  // Write both favicon.svg and icon.svg for full standard compatibility
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('Saved public/favicon.svg and public/icon.svg');
}

function main() {
  console.log('Generating Google Favicon compliant & multi-DPI assets...');

  // Standard sizes and Google Search multiples of 48px
  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon-48x48.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 144, name: 'favicon-144x144.png' },
    { size: 180, name: 'apple-touch-icon.png', isApple: true },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' }
  ];

  for (const item of sizes) {
    const outPath = path.join(publicDir, item.name);
    capturePng(item.size, outPath, item.isApple);
  }

  // Generate multi-resolution .ico containing 16x16, 32x32, and 48x48
  const icoPath = path.join(publicDir, 'favicon.ico');
  const icoData = createIco([
    { size: 16, buffer: fs.readFileSync(path.join(publicDir, 'favicon-16x16.png')) },
    { size: 32, buffer: fs.readFileSync(path.join(publicDir, 'favicon-32x32.png')) },
    { size: 48, buffer: fs.readFileSync(path.join(publicDir, 'favicon-48x48.png')) }
  ]);
  fs.writeFileSync(icoPath, icoData);
  console.log(`Generated favicon.ico with 16x16, 32x32, 48x48 embedded (${icoData.length} bytes)`);

  // SVG vectors
  generateSvgFavicon();

  console.log('All Google-compliant favicon assets generated successfully!');
}

main();
