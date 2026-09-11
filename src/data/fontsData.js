/**
 * AuraWish World Typography Library
 * Fully integrated with the 25 Major World Languages System.
 * Supports: Latin, Perso-Arabic, Arabic, Devanagari, Bengali, Gurmukhi,
 * CJK (Chinese Han, Japanese Kana/Kanji, Korean Hangul), Cyrillic, Thai, Greek.
 */

// ── 1. URDU & ARABIC FONTS (Perso-Arabic & Arabic Scripts) ───────
export const URDU_ARABIC_FONTS = [
  // ─── Nastaliq Style (Urdu, Punjabi Shahmukhi, Persian) ───
  {
    id: 'Noto Nastaliq Urdu',
    name: 'نوٹو نستعلیق اردو',
    nameEn: 'Noto Nastaliq Urdu',
    family: 'Noto Nastaliq Urdu',
    supportedLanguages: ['ur', 'pa', 'fa', 'ar'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Nastaliq',
    direction: 'rtl',
    googleFamily: 'Noto+Nastaliq+Urdu:wght@400;700',
    weights: ['400', '700'],
    fallback: ['"Jameel Noori Nastaleeq"', '"Nafees Nastaleeq"', 'serif'],
    previewText: 'سالگرہ مبارک! اللہ آپ کو ہمیشہ خوش رکھے',
    previewEn: 'Classical Nastaliq calligraphy',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Gulzar',
    name: 'گلزار نستعلیق',
    nameEn: 'Gulzar',
    family: 'Gulzar',
    supportedLanguages: ['ur', 'pa', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Nastaliq',
    direction: 'rtl',
    googleFamily: 'Gulzar',
    weights: ['400'],
    fallback: ['"Noto Nastaliq Urdu"', 'serif'],
    previewText: 'جنم دن کی ڈھیروں خوشیاں مبارک ہوں',
    previewEn: 'Ornate and expressive Nastaliq',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Mirza',
    name: 'مرزا نستعلیق',
    nameEn: 'Mirza',
    family: 'Mirza',
    supportedLanguages: ['ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Nastaliq',
    direction: 'rtl',
    googleFamily: 'Mirza:wght@400;500;600;700',
    weights: ['400', '500', '600', '700'],
    fallback: ['"Noto Nastaliq Urdu"', 'serif'],
    previewText: 'ہماری دعا ہے کہ آپ کا ہر دن مسکراہٹوں سے بھرا ہو',
    previewEn: 'Stylized Nastaliq script',
    isUrdu: true,
    license: 'OFL'
  },

  // ─── Classical Naskh Style (Arabic, Urdu, Persian) ───
  {
    id: 'Amiri',
    name: 'امیری نسخ',
    nameEn: 'Amiri',
    family: 'Amiri',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Naskh',
    direction: 'rtl',
    googleFamily: 'Amiri:ital,wght@0,400;0,700;1,400;1,700',
    weights: ['400', '700'],
    fallback: ['"Noto Naskh Arabic"', 'serif'],
    previewText: 'عيد ميلاد سعيد! أتمنى لك عامًا مليئًا بالسعادة',
    previewEn: 'Classical Arabic book Naskh',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Noto Naskh Arabic',
    name: 'نوٹو نسخ',
    nameEn: 'Noto Naskh Arabic',
    family: 'Noto Naskh Arabic',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Naskh',
    direction: 'rtl',
    googleFamily: 'Noto+Naskh+Arabic:wght@400;500;600;700',
    weights: ['400', '500', '600', '700'],
    fallback: ['"Amiri"', 'serif'],
    previewText: 'كل عام وأنتم بألف خير وسعادة وسلام',
    previewEn: 'Universal balanced Naskh',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Scheherazade New',
    name: 'شہرزاد نسخ',
    nameEn: 'Scheherazade New',
    family: 'Scheherazade New',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Naskh',
    direction: 'rtl',
    googleFamily: 'Scheherazade+New:wght@400;500;600;700',
    weights: ['400', '500', '600', '700'],
    fallback: ['"Noto Naskh Arabic"', 'serif'],
    previewText: 'آپ کو سالگرہ کی دل کی گہرائیوں سے مبارکباد',
    previewEn: 'Traditional Arabian manuscript style',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Lateef',
    name: 'لطیف خط',
    nameEn: 'Lateef',
    family: 'Lateef',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Naskh',
    direction: 'rtl',
    googleFamily: 'Lateef:wght@200;300;400;500;600;700;800',
    weights: ['200', '400', '600', '700'],
    fallback: ['"Scheherazade New"', 'serif'],
    previewText: 'اللہ آپ کو صحت، خوشی اور لمبی عمر عطا فرمائے',
    previewEn: 'Delicate high-contrast manuscript Naskh',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Vazirmatn',
    name: 'وزیرمتن فارسی',
    nameEn: 'Vazirmatn',
    family: 'Vazirmatn',
    supportedLanguages: ['fa', 'ar', 'ur'],
    scripts: ['perso-arabic', 'arabic'],
    category: 'Modern Persian',
    direction: 'rtl',
    googleFamily: 'Vazirmatn:wght@300;400;500;600;700;800',
    weights: ['300', '400', '600', '700'],
    fallback: ['"Noto Sans Arabic"', 'sans-serif'],
    previewText: 'تولدت مبارک! با آرزوی روزهایی شاد و روشن',
    previewEn: 'Contemporary Persian digital typeface',
    isUrdu: false,
    license: 'OFL'
  },

  // ─── Calligraphic, Ruqaa & Kufi ───
  {
    id: 'Aref Ruqaa',
    name: 'عارف رقعہ',
    nameEn: 'Aref Ruqaa',
    family: 'Aref Ruqaa',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Calligraphic',
    direction: 'rtl',
    googleFamily: 'Aref+Ruqaa:wght@400;700',
    weights: ['400', '700'],
    fallback: ['"Amiri"', 'cursive'],
    previewText: 'جشنِ ولادت مبارک! سالگرہ کی مبارکباد',
    previewEn: 'Classical Ruqaa quick handwriting script',
    isUrdu: true,
    license: 'OFL'
  },
  {
    id: 'Reem Kufi',
    name: 'ریم کوفی',
    nameEn: 'Reem Kufi',
    family: 'Reem Kufi',
    supportedLanguages: ['ar', 'ur'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Calligraphic',
    direction: 'rtl',
    googleFamily: 'Reem+Kufi:wght@400;500;600;700',
    weights: ['400', '600', '700'],
    fallback: ['sans-serif'],
    previewText: 'سالگرہ مبارک ✦ خوبصورت لمحات آپ کے نام',
    previewEn: 'Geometric ancient Kufic script',
    isUrdu: true,
    license: 'OFL'
  },

  // ─── Modern Sans Arabic / Perso-Arabic ───
  {
    id: 'Cairo',
    name: 'قاہرہ جدید',
    nameEn: 'Cairo',
    family: 'Cairo',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Modern Arabic',
    direction: 'rtl',
    googleFamily: 'Cairo:wght@200..900',
    weights: ['300', '400', '600', '700', '800'],
    fallback: ['sans-serif'],
    previewText: 'عيد ميلاد سعيد وعام مليء بالفرح والنجاح',
    previewEn: 'Contemporary high-impact geometric sans',
    isUrdu: false,
    license: 'OFL'
  },
  {
    id: 'Tajawal',
    name: 'تجوال سان',
    nameEn: 'Tajawal',
    family: 'Tajawal',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Modern Arabic',
    direction: 'rtl',
    googleFamily: 'Tajawal:wght@200;300;400;500;700;800;900',
    weights: ['300', '400', '500', '700'],
    fallback: ['sans-serif'],
    previewText: 'كل عام وأنت بألف خير وصحة وسعادة',
    previewEn: 'Clean minimalist contemporary UI typeface',
    isUrdu: false,
    license: 'OFL'
  },
  {
    id: 'Almarai',
    name: 'المرعی',
    nameEn: 'Almarai',
    family: 'Almarai',
    supportedLanguages: ['ar', 'ur', 'fa'],
    scripts: ['arabic', 'perso-arabic'],
    category: 'Modern Arabic',
    direction: 'rtl',
    googleFamily: 'Almarai:wght@300;400;700;800',
    weights: ['300', '400', '700'],
    fallback: ['sans-serif'],
    previewText: 'أجمل التهاني بمناسبة عيد ميلادك السعيد',
    previewEn: 'Sleek luxury Arabic sans-serif',
    isUrdu: false,
    license: 'OFL'
  }
];

// ── 2. INDIC & SOUTH ASIAN FONTS (Hindi, Bengali, Punjabi) ────────
export const INDIC_FONTS = [
  // ─── Hindi / Devanagari ───
  {
    id: 'Rozha One',
    name: 'रोज़ा वन (Rozha One)',
    family: 'Rozha One',
    supportedLanguages: ['hi'],
    scripts: ['devanagari'],
    category: 'Devanagari Display',
    direction: 'ltr',
    googleFamily: 'Rozha+One',
    weights: ['400'],
    fallback: ['"Noto Serif Devanagari"', 'serif'],
    previewText: 'जन्मदिन की हार्दिक शुभकामनाएँ!',
    previewEn: 'High-contrast majestic Devanagari display',
    license: 'OFL'
  },
  {
    id: 'Noto Serif Devanagari',
    name: 'नोतो सेरिफ़ (Noto Serif)',
    family: 'Noto Serif Devanagari',
    supportedLanguages: ['hi'],
    scripts: ['devanagari'],
    category: 'Devanagari Serif',
    direction: 'ltr',
    googleFamily: 'Noto+Serif+Devanagari:wght@400;600;700',
    weights: ['400', '600', '700'],
    fallback: ['serif'],
    previewText: 'ईश्वर आपको हमेशा खुश और स्वस्थ रखे।',
    previewEn: 'Classic literary Devanagari serif',
    license: 'OFL'
  },
  {
    id: 'Poppins Devanagari',
    name: 'पॉपिन्स (Poppins Hindi)',
    family: 'Poppins',
    supportedLanguages: ['hi', 'en', 'es', 'fr'],
    scripts: ['devanagari', 'latin'],
    category: 'Devanagari Modern',
    direction: 'ltr',
    googleFamily: 'Poppins:wght@300;400;500;600;700',
    weights: ['300', '400', '500', '600', '700'],
    fallback: ['sans-serif'],
    previewText: 'जन्मदिन मुबारक! जीवन खुशियों से भरा रहे',
    previewEn: 'Modern geometric Devanagari & Latin',
    license: 'OFL'
  },

  // ─── Bengali ───
  {
    id: 'Anek Bangla',
    name: 'অনেক বাংলা (Anek Bangla)',
    family: 'Anek Bangla',
    supportedLanguages: ['bn'],
    scripts: ['bengali'],
    category: 'Bengali Modern',
    direction: 'ltr',
    googleFamily: 'Anek+Bangla:wght@300;400;500;600;700;800',
    weights: ['300', '400', '600', '700'],
    fallback: ['"Noto Serif Bengali"', 'sans-serif'],
    previewText: 'শুভ জন্মদিন! জীবন আনন্দে ভরে উঠুক',
    previewEn: 'Versatile contemporary Bengali typography',
    license: 'OFL'
  },
  {
    id: 'Noto Serif Bengali',
    name: 'নোতো বাংলা (Noto Serif)',
    family: 'Noto Serif Bengali',
    supportedLanguages: ['bn'],
    scripts: ['bengali'],
    category: 'Bengali Serif',
    direction: 'ltr',
    googleFamily: 'Noto+Serif+Bengali:wght@400;600;700',
    weights: ['400', '600', '700'],
    fallback: ['serif'],
    previewText: 'তোমার জীবনের প্রতিটি দিন সুন্দর হোক',
    previewEn: 'Elegant classical Bengali serif',
    license: 'OFL'
  },

  // ─── Punjabi / Gurmukhi ───
  {
    id: 'Noto Sans Gurmukhi',
    name: 'ਨੋਤੋ ਗੁਰਮੁਖੀ (Noto Gurmukhi)',
    family: 'Noto Sans Gurmukhi',
    supportedLanguages: ['pa'],
    scripts: ['gurmukhi'],
    category: 'Punjabi Gurmukhi',
    direction: 'ltr',
    googleFamily: 'Noto+Sans+Gurmukhi:wght@400;600;700',
    weights: ['400', '600', '700'],
    fallback: ['sans-serif'],
    previewText: 'ਜਨਮਦਿਨ ਮੁਬਾਰਕ! ਚੜ੍ਹਦੀ ਕਲਾ ਰਹੇ',
    previewEn: 'Standard authentic Gurmukhi script',
    license: 'OFL'
  },
  {
    id: 'Anek Gurmukhi',
    name: 'ਅਨੇਕ ਗੁਰਮੁਖੀ (Anek Gurmukhi)',
    family: 'Anek Gurmukhi',
    supportedLanguages: ['pa'],
    scripts: ['gurmukhi'],
    category: 'Punjabi Gurmukhi',
    direction: 'ltr',
    googleFamily: 'Anek+Gurmukhi:wght@400;600;700;800',
    weights: ['400', '600', '700'],
    fallback: ['sans-serif'],
    previewText: 'ਵਾਹਿਗੁਰੂ ਤੁਹਾਨੂੰ ਬੇਅੰਤ ਖੁਸ਼ੀਆਂ ਬਖ਼ਸ਼ਣ',
    previewEn: 'Modern expressive Gurmukhi typeface',
    license: 'OFL'
  }
];

// ── 3. EAST ASIAN & CJK FONTS (Chinese, Japanese, Korean) ────────
export const CJK_FONTS = [
  // ─── Chinese Simplified ───
  {
    id: 'Noto Serif SC',
    name: '思源宋体 (Noto Serif SC)',
    family: 'Noto Serif SC',
    supportedLanguages: ['zh-CN'],
    scripts: ['chinese han'],
    category: 'Chinese Serif (Song)',
    direction: 'ltr',
    googleFamily: 'Noto+Serif+SC:wght@400;600;700;900',
    weights: ['400', '600', '700', '900'],
    fallback: ['serif'],
    previewText: '生日快乐！愿你每天都充满幸福',
    previewEn: 'Refined Songti classical Chinese serif',
    license: 'OFL'
  },
  {
    id: 'Noto Sans SC',
    name: '思源黑体 (Noto Sans SC)',
    family: 'Noto Sans SC',
    supportedLanguages: ['zh-CN'],
    scripts: ['chinese han'],
    category: 'Chinese Modern (Heiti)',
    direction: 'ltr',
    googleFamily: 'Noto+Sans+SC:wght@300;400;500;700;900',
    weights: ['300', '400', '700'],
    fallback: ['sans-serif'],
    previewText: '祝你岁岁平安，万事顺遂如意',
    previewEn: 'Modern clean Chinese sans-serif',
    license: 'OFL'
  },
  {
    id: 'Ma Shan Zheng',
    name: '马善政楷书 (Ma Shan Zheng)',
    family: 'Ma Shan Zheng',
    supportedLanguages: ['zh-CN'],
    scripts: ['chinese han'],
    category: 'Chinese Calligraphy',
    direction: 'ltr',
    googleFamily: 'Ma+Shan+Zheng',
    weights: ['400'],
    fallback: ['cursive', 'serif'],
    previewText: '吉星高照，福寿安康，生辰吉庆',
    previewEn: 'Expressive traditional brush calligraphy',
    license: 'OFL'
  },

  // ─── Japanese ───
  {
    id: 'Shippori Mincho',
    name: 'しっぽり明朝 (Shippori Mincho)',
    family: 'Shippori Mincho',
    supportedLanguages: ['ja'],
    scripts: ['japanese kana+kanji'],
    category: 'Japanese Mincho',
    direction: 'ltr',
    googleFamily: 'Shippori+Mincho:wght@400;600;700;800',
    weights: ['400', '600', '700'],
    fallback: ['serif'],
    previewText: 'お誕生日おめでとう！素敵な一年に',
    previewEn: 'Exquisite literary Japanese Mincho serif',
    license: 'OFL'
  },
  {
    id: 'Noto Sans JP',
    name: 'Noto Sans 日本語',
    family: 'Noto Sans JP',
    supportedLanguages: ['ja'],
    scripts: ['japanese kana+kanji'],
    category: 'Japanese Modern',
    direction: 'ltr',
    googleFamily: 'Noto+Sans+JP:wght@300;400;500;700',
    weights: ['300', '400', '700'],
    fallback: ['sans-serif'],
    previewText: '笑顔と喜びに満ちた最高の一日を',
    previewEn: 'Crisp contemporary Japanese Gothic',
    license: 'OFL'
  },
  {
    id: 'Yuji Boku',
    name: '游字墨 (Yuji Boku)',
    family: 'Yuji Boku',
    supportedLanguages: ['ja'],
    scripts: ['japanese kana+kanji'],
    category: 'Japanese Calligraphy',
    direction: 'ltr',
    googleFamily: 'Yuji+Boku',
    weights: ['400'],
    fallback: ['cursive', 'serif'],
    previewText: '心からの祝福と愛を込めて',
    previewEn: 'Artistic Japanese sumi ink brushwork',
    license: 'OFL'
  },

  // ─── Korean ───
  {
    id: 'Noto Serif KR',
    name: '본명조 (Noto Serif KR)',
    family: 'Noto Serif KR',
    supportedLanguages: ['ko'],
    scripts: ['korean hangul'],
    category: 'Korean Batang / Serif',
    direction: 'ltr',
    googleFamily: 'Noto+Serif+KR:wght@400;600;700;900',
    weights: ['400', '600', '700'],
    fallback: ['serif'],
    previewText: '생일 축하해요! 행복한 한 해 보내세요',
    previewEn: 'Graceful Korean Batang serif',
    license: 'OFL'
  },
  {
    id: 'Noto Sans KR',
    name: '본고딕 (Noto Sans KR)',
    family: 'Noto Sans KR',
    supportedLanguages: ['ko'],
    scripts: ['korean hangul'],
    category: 'Korean Gothic / Modern',
    direction: 'ltr',
    googleFamily: 'Noto+Sans+KR:wght@300;400;500;700',
    weights: ['300', '400', '700'],
    fallback: ['sans-serif'],
    previewText: '당신의 가장 특별한 날을 축하합니다',
    previewEn: 'Modern clean Korean Gothic',
    license: 'OFL'
  }
];

// ── 4. SOUTHEAST ASIAN FONTS (Thai, Vietnamese) ─────────────────
export const SOUTHEAST_ASIAN_FONTS = [
  // ─── Thai ───
  {
    id: 'Noto Serif Thai',
    name: 'โนโต เซริฟ (Noto Serif Thai)',
    family: 'Noto Serif Thai',
    supportedLanguages: ['th'],
    scripts: ['thai'],
    category: 'Thai Serif',
    direction: 'ltr',
    googleFamily: 'Noto+Serif+Thai:wght@400;600;700',
    weights: ['400', '600', '700'],
    fallback: ['serif'],
    previewText: 'สุขสันต์วันเกิด! ขอให้มีความสุขมากๆ',
    previewEn: 'Classical looping Thai serif',
    license: 'OFL'
  },
  {
    id: 'Kanit',
    name: 'คณิต (Kanit Thai Modern)',
    family: 'Kanit',
    supportedLanguages: ['th', 'en'],
    scripts: ['thai', 'latin'],
    category: 'Thai Modern',
    direction: 'ltr',
    googleFamily: 'Kanit:wght@300;400;500;600;700',
    weights: ['300', '400', '600', '700'],
    fallback: ['sans-serif'],
    previewText: 'สุขภาพแข็งแรง สมหวังในทุกสิ่ง',
    previewEn: 'Modern loopless high-impact Thai',
    license: 'OFL'
  }
];

// ── 5. EUROPEAN, CYRILLIC & GREEK (Russian, Ukrainian, Greek, Western) ─
export const EUROPEAN_FONTS = [
  // ─── Elegant Serif ───
  {
    id: 'Playfair Display',
    name: 'Playfair Display',
    family: 'Playfair Display',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'uk', 'tr', 'vi', 'nl', 'pl'],
    scripts: ['latin', 'cyrillic'],
    category: 'Elegant Serif',
    direction: 'ltr',
    googleFamily: 'Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600',
    weights: ['400', '600', '700', '900'],
    fallback: ['Georgia', 'serif'],
    previewText: 'Timeless literary elegance & celebration',
    license: 'OFL'
  },
  {
    id: 'Cinzel',
    name: 'Cinzel',
    family: 'Cinzel',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'tr', 'nl', 'el'],
    scripts: ['latin', 'greek'],
    category: 'Elegant Serif',
    direction: 'ltr',
    googleFamily: 'Cinzel:wght@400;600;700;800;900',
    weights: ['400', '600', '700', '800', '900'],
    fallback: ['Georgia', 'serif'],
    previewText: 'Prestige & majesty',
    license: 'OFL'
  },
  {
    id: 'Cormorant Garamond',
    name: 'Cormorant Garamond',
    family: 'Cormorant Garamond',
    supportedLanguages: ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'uk', 'vi'],
    scripts: ['latin', 'cyrillic'],
    category: 'Elegant Serif',
    direction: 'ltr',
    googleFamily: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400',
    weights: ['300', '400', '600', '700'],
    fallback: ['Georgia', 'serif'],
    previewText: 'Refined French sophistication',
    license: 'OFL'
  },
  {
    id: 'EB Garamond',
    name: 'EB Garamond',
    family: 'EB Garamond',
    supportedLanguages: ['en', 'de', 'fr', 'es', 'it', 'ru', 'uk', 'el'],
    scripts: ['latin', 'cyrillic', 'greek'],
    category: 'Elegant Serif',
    direction: 'ltr',
    googleFamily: 'EB+Garamond:ital,wght@0,400;0,600;0,700;1,400',
    weights: ['400', '600', '700'],
    fallback: ['Georgia', 'serif'],
    previewText: 'Classic book typography',
    license: 'OFL'
  },
  {
    id: 'Lora',
    name: 'Lora',
    family: 'Lora',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'uk', 'vi', 'pl'],
    scripts: ['latin', 'cyrillic'],
    category: 'Elegant Serif',
    direction: 'ltr',
    googleFamily: 'Lora:ital,wght@0,400;0,500;0,600;0,700;1,400',
    weights: ['400', '500', '600', '700'],
    fallback: ['Georgia', 'serif'],
    previewText: 'Warm & readable elegance',
    license: 'OFL'
  },
  {
    id: 'Merriweather',
    name: 'Merriweather',
    family: 'Merriweather',
    supportedLanguages: ['en', 'ru', 'uk', 'es', 'fr', 'de', 'pt'],
    scripts: ['latin', 'cyrillic'],
    category: 'Elegant Serif',
    direction: 'ltr',
    googleFamily: 'Merriweather:ital,wght@0,300;0,400;0,700;1,400',
    weights: ['300', '400', '700'],
    fallback: ['Georgia', 'serif'],
    previewText: 'Dense & distinctive editorial',
    license: 'OFL'
  },

  // ─── Modern Sans ───
  {
    id: 'Outfit',
    name: 'Outfit',
    family: 'Outfit',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'id', 'ms', 'tr', 'vi', 'nl', 'pl'],
    scripts: ['latin'],
    category: 'Modern Sans',
    direction: 'ltr',
    googleFamily: 'Outfit:wght@300;400;500;600;700;800',
    weights: ['300', '400', '500', '600', '700', '800'],
    fallback: ['system-ui', 'sans-serif'],
    previewText: 'Clean geometric modern',
    license: 'OFL'
  },
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    family: 'Plus Jakarta Sans',
    supportedLanguages: ['en', 'id', 'ms', 'es', 'fr', 'de', 'it', 'pt', 'tr', 'nl', 'pl', 'vi'],
    scripts: ['latin'],
    category: 'Modern Sans',
    direction: 'ltr',
    googleFamily: 'Plus+Jakarta+Sans:wght@300;400;500;600;700;800',
    weights: ['300', '400', '500', '600', '700', '800'],
    fallback: ['system-ui', 'sans-serif'],
    previewText: 'Minimalist editorial clarity',
    license: 'OFL'
  },
  {
    id: 'Inter',
    name: 'Inter',
    family: 'Inter',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'uk', 'tr', 'vi', 'el', 'nl', 'pl', 'id', 'ms'],
    scripts: ['latin', 'cyrillic', 'greek'],
    category: 'Modern Sans',
    direction: 'ltr',
    googleFamily: 'Inter:wght@300;400;500;600;700;800',
    weights: ['300', '400', '500', '600', '700', '800'],
    fallback: ['system-ui', 'sans-serif'],
    previewText: 'UI-focused clarity worldwide',
    license: 'OFL'
  },
  {
    id: 'Montserrat',
    name: 'Montserrat',
    family: 'Montserrat',
    supportedLanguages: ['en', 'ru', 'uk', 'es', 'fr', 'de', 'it', 'pt', 'tr', 'vi', 'nl', 'pl'],
    scripts: ['latin', 'cyrillic'],
    category: 'Modern Sans',
    direction: 'ltr',
    googleFamily: 'Montserrat:wght@300;400;500;600;700;800',
    weights: ['300', '400', '500', '600', '700', '800'],
    fallback: ['system-ui', 'sans-serif'],
    previewText: 'Urban architectural sophistication',
    license: 'OFL'
  },

  // ─── Script & Calligraphy ───
  {
    id: 'Great Vibes',
    name: 'Great Vibes',
    family: 'Great Vibes',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'id', 'ms'],
    scripts: ['latin'],
    category: 'Script & Calligraphy',
    direction: 'ltr',
    googleFamily: 'Great+Vibes',
    weights: ['400'],
    fallback: ['cursive'],
    previewText: 'Flowing connected script',
    license: 'OFL'
  },
  {
    id: 'Dancing Script',
    name: 'Dancing Script',
    family: 'Dancing Script',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'tr', 'vi'],
    scripts: ['latin'],
    category: 'Script & Calligraphy',
    direction: 'ltr',
    googleFamily: 'Dancing+Script:wght@400;600;700',
    weights: ['400', '600', '700'],
    fallback: ['cursive'],
    previewText: 'Casual joyful script',
    license: 'OFL'
  },
  {
    id: 'Pacifico',
    name: 'Pacifico',
    family: 'Pacifico',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'tr', 'ru', 'uk'],
    scripts: ['latin', 'cyrillic'],
    category: 'Script & Calligraphy',
    direction: 'ltr',
    googleFamily: 'Pacifico',
    weights: ['400'],
    fallback: ['cursive'],
    previewText: 'Retro celebratory vibes',
    license: 'OFL'
  },
  {
    id: 'Caveat',
    name: 'Caveat',
    family: 'Caveat',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'uk'],
    scripts: ['latin', 'cyrillic'],
    category: 'Script & Calligraphy',
    direction: 'ltr',
    googleFamily: 'Caveat:wght@400;600;700',
    weights: ['400', '600', '700'],
    fallback: ['cursive'],
    previewText: 'Natural organic handwriting',
    license: 'OFL'
  },

  // ─── Display & Luxury ───
  {
    id: 'Abril Fatface',
    name: 'Abril Fatface',
    family: 'Abril Fatface',
    supportedLanguages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'tr', 'ru', 'uk'],
    scripts: ['latin', 'cyrillic'],
    category: 'Display & Bold',
    direction: 'ltr',
    googleFamily: 'Abril+Fatface',
    weights: ['400'],
    fallback: ['serif'],
    previewText: 'Ultra bold editorial display',
    license: 'OFL'
  },
  {
    id: 'Bodoni Moda',
    name: 'Bodoni Moda',
    family: 'Bodoni Moda',
    supportedLanguages: ['en', 'it', 'fr', 'es', 'de', 'pt'],
    scripts: ['latin'],
    category: 'Luxury & Premium',
    direction: 'ltr',
    googleFamily: 'Bodoni+Moda:ital,wght@0,400;0,600;0,800;1,400',
    weights: ['400', '600', '800'],
    fallback: ['serif'],
    previewText: 'Italian high-fashion luxury serif',
    license: 'OFL'
  },
  {
    id: 'Cinzel Decorative',
    name: 'Cinzel Decorative',
    family: 'Cinzel Decorative',
    supportedLanguages: ['en', 'es', 'fr', 'it', 'el'],
    scripts: ['latin', 'greek'],
    category: 'Luxury & Premium',
    direction: 'ltr',
    googleFamily: 'Cinzel+Decorative:wght@400;700;900',
    weights: ['400', '700', '900'],
    fallback: ['serif'],
    previewText: 'Ornamental prestige & royal honors',
    license: 'OFL'
  }
];

// ── COMBINED MASTER FONT REGISTRY ───────────────────────────────
export const ALL_FONTS = [
  ...URDU_ARABIC_FONTS,
  ...INDIC_FONTS,
  ...CJK_FONTS,
  ...SOUTHEAST_ASIAN_FONTS,
  ...EUROPEAN_FONTS
];

export const FONT_MAP = {};
ALL_FONTS.forEach(f => {
  FONT_MAP[f.id] = f;
  FONT_MAP[f.family] = f;
  FONT_MAP[f.id.toLowerCase()] = f;
});

// ── FONT CATEGORIES (INDEPENDENT OF LANGUAGE) ────────────────────
export const FONT_CATEGORIES = [
  { id: 'all', label: 'All Compatible Fonts' },
  { id: 'Nastaliq', label: '✒️ Nastaliq (Urdu/Persian)' },
  { id: 'Naskh', label: '📖 Naskh (Arabic/Urdu)' },
  { id: 'Calligraphic', label: '✨ Calligraphic & Ruqaa' },
  { id: 'Modern Arabic', label: '💎 Modern Arabic & Persian' },
  { id: 'Devanagari Display', label: '🌸 Devanagari (Hindi)' },
  { id: 'Bengali Modern', label: '🌊 Bengali Fonts' },
  { id: 'Punjabi Gurmukhi', label: '🌾 Punjabi Gurmukhi' },
  { id: 'Chinese Serif (Song)', label: '🏮 Chinese Fonts' },
  { id: 'Japanese Mincho', label: '🏯 Japanese Fonts' },
  { id: 'Korean Batang / Serif', label: '🇰🇷 Korean Fonts' },
  { id: 'Thai Serif', label: '🇹🇭 Thai Fonts' },
  { id: 'Elegant Serif', label: 'Elegant Serif' },
  { id: 'Modern Sans', label: 'Modern Sans' },
  { id: 'Script & Calligraphy', label: 'Script & Calligraphy' },
  { id: 'Display & Bold', label: 'Display & Bold' },
  { id: 'Luxury & Premium', label: 'Luxury & Premium' }
];

/**
 * Filter fonts compatible with a specific language code
 */
export function getFontsForLanguage(langCode) {
  if (!langCode || langCode === 'all') return ALL_FONTS;

  return ALL_FONTS.filter(f => {
    if (!f.supportedLanguages) return true;
    return f.supportedLanguages.includes(langCode);
  });
}

/**
 * Returns the CSS font-family string with comprehensive global fallback stack
 * Ensures NO BROKEN GLYPHS (□, ) across all 25 languages
 */
export function getFontFamily(fontId) {
  if (!fontId) {
    return '"Plus Jakarta Sans", "Noto Nastaliq Urdu", "Noto Serif Devanagari", "Noto Serif SC", "Shippori Mincho", "Noto Serif KR", system-ui, sans-serif';
  }

  const font = FONT_MAP[fontId] || FONT_MAP[fontId.toLowerCase()];
  const primary = font ? `"${font.family}"` : `"${fontId}"`;

  // Global bulletproof fallback stack covering all 25 language scripts
  const globalFallbacks = [
    '"Noto Nastaliq Urdu"',
    '"Noto Naskh Arabic"',
    '"Vazirmatn"',
    '"Noto Serif Devanagari"',
    '"Noto Serif Bengali"',
    '"Noto Sans Gurmukhi"',
    '"Noto Serif SC"',
    '"Shippori Mincho"',
    '"Noto Serif KR"',
    '"Noto Serif Thai"',
    '"Playfair Display"',
    '"Plus Jakarta Sans"',
    'system-ui',
    'sans-serif'
  ].join(', ');

  return `${primary}, ${globalFallbacks}`;
}

/**
 * Checks if a font is an Urdu font
 */
export function isUrduFont(fontId) {
  if (!fontId) return false;
  const f = FONT_MAP[fontId] || FONT_MAP[fontId.toLowerCase()];
  return Boolean(f && (f.isUrdu || (f.supportedLanguages && f.supportedLanguages.includes('ur'))));
}

/**
 * Dynamically loads a font from Google Fonts with caching
 */
const loadedFonts = new Set();

export async function loadFont(fontId) {
  if (typeof window === 'undefined' || !fontId) return true;

  const font = FONT_MAP[fontId] || FONT_MAP[fontId.toLowerCase()];
  if (!font) return true;

  // Check if already loaded
  if (loadedFonts.has(font.id)) return true;

  const familyName = font.family;
  const googleFamily = font.googleFamily || `${font.id.replace(/ /g, '+')}:wght@400;700`;

  const linkId = `gf-${font.id.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${googleFamily}&display=swap`;
    document.head.appendChild(link);
  }

  // Mark as loaded immediately to prevent duplicate requests
  loadedFonts.add(font.id);

  if (document.fonts && document.fonts.load) {
    try {
      await Promise.race([
        Promise.all([
          document.fonts.load(`400 32px "${familyName}"`),
          document.fonts.load(`700 32px "${familyName}"`)
        ]),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
    } catch (e) {}
  }

  return true;
}

/**
 * Detects if a text contains Urdu/Arabic script
 */
export function containsUrduText(text) {
  if (!text || typeof text !== 'string') return false;
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
}

/**
 * Preloads ONLY essential fonts for initial page load (lazy load the rest)
 * Reduced from 6 to 2 critical fonts to improve initial load time
 */
export function preloadMultilingualFonts() {
  if (typeof window === 'undefined') return;
  // Only preload the absolute essentials - others load on-demand
  const essentials = [
    'Playfair Display', // Default English
    'Noto Nastaliq Urdu', // Default Urdu
  ];
  essentials.forEach(f => loadFont(f));
}

export function preloadUrduFonts() {
  // Deprecated - fonts now load on demand
  // Keeping function for backward compatibility
}
