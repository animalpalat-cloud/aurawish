const fonts = [
  'Noto+Nastaliq+Urdu',
  'Gulzar',
  'Amiri',
  'Scheherazade+New',
  'Lateef',
  'Aref+Ruqaa',
  'Reem+Kufi',
  'Cairo',
  'Tajawal',
  'Almarai',
  'Harmattan',
  'Markazi+Text',
  'Mirza',
  'Vibes',
  'Changa',
  'El+Messiri',
  'Mada',
  'Noto+Sans+Arabic',
  'Noto+Kufi+Arabic'
];

async function check() {
  for (const f of fonts) {
    try {
      const url = 'https://fonts.googleapis.com/css2?family=' + f + '&display=swap';
      const res = await fetch(url);
      const css = await res.text();
      const familyMatch = css.match(/font-family:\s*['"]?([^'";]+)/);
      console.log(f, '=>', familyMatch ? familyMatch[1].trim() : 'NONE');
    } catch(e) {
      console.log(f, 'ERROR', e.message);
    }
  }
}
check();
