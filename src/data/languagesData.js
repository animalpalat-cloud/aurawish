/**
 * AuraWish Multilingual System Architecture
 * Supports 25 major world languages with exact scripts,
 * text directions, authentic birthday messages, and font compatibility mapping.
 */

export const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'Happy Birthday!',
    sampleSubtitle: 'A Special Day For You',
    sampleMessage: 'Wishing you endless joy, love, laughter, and happiness on this wonderful milestone birthday!',
    sampleRecipient: 'Alexandra Vance',
    sampleSender: 'With all our love',
    locale: 'en-US'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    direction: 'rtl',
    defaultFont: 'Noto Nastaliq Urdu',
    sampleTitle: 'سالگرہ مبارک!',
    sampleSubtitle: 'ایک خاص دن آپ کے نام',
    sampleMessage: 'سالگرہ مبارک! اللہ آپ کو ہمیشہ خوش رکھے اور زندگی کے ہر موڑ پر کامیابی اور لمبی عمر عطا فرمائے۔',
    sampleRecipient: 'احمد علی',
    sampleSender: 'دلی دعاؤں کے ساتھ',
    locale: 'ur-PK'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    script: 'Arabic',
    direction: 'rtl',
    defaultFont: 'Amiri',
    sampleTitle: 'عيد ميلاد سعيد!',
    sampleSubtitle: 'يوم مميز لشخص مميز',
    sampleMessage: 'عيد ميلاد سعيد! أتمنى لك عامًا مليئًا بالسعادة والنجاح وراحة البال وتحقيق كل الأمنيات.',
    sampleRecipient: 'عمر الفاروق',
    sampleSender: 'مع خالص الحب والتقدير',
    locale: 'ar-SA'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    defaultFont: 'Rozha One',
    sampleTitle: 'जन्मदिन की हार्दिक शुभकामनाएँ!',
    sampleSubtitle: 'आपके जीवन का विशेष दिन',
    sampleMessage: 'आपको जन्मदिन की ढेर सारी बधाई और शुभकामनाएँ! ईश्वर आपको हमेशा खुश, स्वस्थ और दीर्घायु रखे।',
    sampleRecipient: 'आरोही शर्मा',
    sampleSender: 'ढेर सारे प्यार और आशीर्वाद के साथ',
    locale: 'hi-IN'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    defaultFont: 'Anek Bangla',
    sampleTitle: 'শুভ জন্মদিন!',
    sampleSubtitle: 'তোমার জীবনের এক আনন্দময় দিন',
    sampleMessage: 'শুভ জন্মদিন! তোমার জীবন সর্বদা আনন্দ, সুস্বাস্থ্য এবং অবিরাম সাফল্যে ভরে উঠুক।',
    sampleRecipient: 'সৌরভ মুখার্জি',
    sampleSender: 'অনেক ভালোবাসা ও শুভেচ্ছাসহ',
    locale: 'bn-BD'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    direction: 'ltr',
    defaultFont: 'Noto Sans Gurmukhi',
    sampleTitle: 'ਜਨਮਦਿਨ ਮੁਬਾਰਕ!',
    sampleSubtitle: 'ਤੁਹਾਡੇ ਲਈ ਇੱਕ ਖ਼ਾਸ ਦਿਨ',
    sampleMessage: 'ਜਨਮਦਿਨ ਮੁਬਾਰਕ! ਵਾਹਿਗੁਰੂ ਤੁਹਾਨੂੰ ਹਮੇਸ਼ਾ ਚੜ੍ਹਦੀ ਕਲਾ, ਚੰਗੀ ਸਿਹਤ ਅਤੇ ਬੇਅੰਤ ਖੁਸ਼ੀਆਂ ਬਖ਼ਸ਼ਣ।',
    sampleRecipient: 'ਸਿਮਰਨਜੀਤ ਕੌਰ',
    sampleSender: 'ਦਿਲੋਂ ਪਿਆਰ ਅਤੇ ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਨਾਲ',
    locale: 'pa-IN'
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    script: 'Perso-Arabic',
    direction: 'rtl',
    defaultFont: 'Vazirmatn',
    sampleTitle: 'تولدت مبارک!',
    sampleSubtitle: 'روزی سرشار از نور و شادمانی',
    sampleMessage: 'تولدت مبارک! امیدوارم سالی پر از شادی، سلامتی، آرامش و موفقیت‌های درخشان پیش رو داشته باشی.',
    sampleRecipient: 'سهراب سپهری',
    sampleSender: 'با آرزوی بهترین‌ها و عشق فراوان',
    locale: 'fa-IR'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'Doğum Günün Kutlu Olsun!',
    sampleSubtitle: 'Senin İçin Çok Özel Bir Gün',
    sampleMessage: 'Doğum günün kutlu olsun! Yeni yaşında sağlık, huzur, mutluluk ve tüm hayallerinin gerçekleşmesini dilerim.',
    sampleRecipient: 'Deniz Yılmaz',
    sampleSender: 'Tüm sevgimizle',
    locale: 'tr-TR'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: '¡Feliz Cumpleaños!',
    sampleSubtitle: 'Un Día Radiante y Especial',
    sampleMessage: '¡Feliz cumpleaños! Que la vida te regale momentos inolvidables, salud inquebrantable y toda la felicidad del mundo.',
    sampleRecipient: 'Sofía Navarro',
    sampleSender: 'Con todo nuestro cariño',
    locale: 'es-ES'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Cormorant Garamond',
    sampleTitle: 'Joyeux Anniversaire !',
    sampleSubtitle: 'Une Journée Magique Pour Toi',
    sampleMessage: 'Joyeux anniversaire ! Que cette nouvelle année t’apporte d’immenses bonheurs, la santé et l’accomplissement de tous tes rêves.',
    sampleRecipient: 'Camille Laurent',
    sampleSender: 'Avec toute mon affection',
    locale: 'fr-FR'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Vollkorn',
    sampleTitle: 'Herzlichen Glückwunsch zum Geburtstag!',
    sampleSubtitle: 'Ein ganz besonderer Ehrentag',
    sampleMessage: 'Alles Gute zum Geburtstag! Möge dein neues Lebensjahr voller Glück, Gesundheit und unvergesslicher Abenteuer sein.',
    sampleRecipient: 'Maximilian Weber',
    sampleSender: 'Von Herzen alles Liebe',
    locale: 'de-DE'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Bodoni Moda',
    sampleTitle: 'Buon Compleanno!',
    sampleSubtitle: 'Un Giorno Speciale Solo Per Te',
    sampleMessage: 'Buon compleanno! Ti auguro un anno straordinario, colmo di gioia, serenità e sogni che si trasformano in realtà.',
    sampleRecipient: 'Matteo Rossi',
    sampleSender: 'Con immenso affetto',
    locale: 'it-IT'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'Feliz Aniversário!',
    sampleSubtitle: 'Um Dia Luminoso e Especial',
    sampleMessage: 'Feliz aniversário! Que o seu novo ano venha repleto de saúde, conquistas, sorrisos e momentos verdadeiramente inesquecíveis.',
    sampleRecipient: 'Beatriz Santos',
    sampleSender: 'Com muito carinho e amor',
    locale: 'pt-BR'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    script: 'Cyrillic',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'С Днём Рождения!',
    sampleSubtitle: 'Твой Особенный Праздник',
    sampleMessage: 'От всей души поздравляю с днём рождения! Желаю крепкого здоровья, безграничного счастья, тепла и исполнения заветных желаний.',
    sampleRecipient: 'Анастасия Смирнова',
    sampleSender: 'С любовью и наилучшими пожеланиями',
    locale: 'ru-RU'
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    script: 'Cyrillic',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'З Днем Народження!',
    sampleSubtitle: 'Твоє Особливе Свято',
    sampleMessage: 'Щиро вітаю з днем народження! Нехай кожен день приносить мир, щиру радість, міцне здоров’я та здійснення мрій.',
    sampleRecipient: 'Олена Ковальчук',
    sampleSender: 'З найтеплішими побажаннями',
    locale: 'uk-UA'
  },
  {
    code: 'zh-CN',
    name: 'Chinese Simplified',
    nativeName: '简体中文',
    script: 'Chinese Han',
    direction: 'ltr',
    defaultFont: 'Noto Serif SC',
    sampleTitle: '生日快乐！',
    sampleSubtitle: '属于你的璀璨时刻',
    sampleMessage: '祝你生日快乐！愿生活充满阳光与欢笑，平安顺遂，万事如意，所有的美好与期盼都如期而至。',
    sampleRecipient: '李子涵',
    sampleSender: '献上最诚挚的祝福',
    locale: 'zh-CN'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    script: 'Japanese Kana+Kanji',
    direction: 'ltr',
    defaultFont: 'Shippori Mincho',
    sampleTitle: 'お誕生日おめでとう！',
    sampleSubtitle: 'あなたにとって特別な記念日',
    sampleMessage: 'お誕生日おめでとうございます！新しい一年が笑顔と健康、そしてたくさんの喜びに満ちた素晴らしいものになりますように。',
    sampleRecipient: '佐藤 美咲',
    sampleSender: '心からの愛と祝福を込めて',
    locale: 'ja-JP'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    script: 'Korean Hangul',
    direction: 'ltr',
    defaultFont: 'Noto Serif KR',
    sampleTitle: '생일 축하해요!',
    sampleSubtitle: '당신을 위한 가장 특별한 날',
    sampleMessage: '생일을 진심으로 축하합니다! 앞으로의 모든 날들이 행복과 웃음, 따뜻한 축복으로 가득하길 소망합니다.',
    sampleRecipient: '이지은',
    sampleSender: '진심 어린 축하와 사랑을 담아',
    locale: 'ko-KR'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'Chúc Mừng Sinh Nhật!',
    sampleSubtitle: 'Một Ngày Tuyệt Vời Của Bạn',
    sampleMessage: 'Chúc mừng sinh nhật! Chúc bạn tuổi mới luôn ngập tràn niềm vui, sức khỏe dồi dào, hạnh phúc và gặt hái được mọi thành công.',
    sampleRecipient: 'Nguyễn Thảo Linh',
    sampleSender: 'Gửi ngàn lời chúc tốt đẹp nhất',
    locale: 'vi-VN'
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Outfit',
    sampleTitle: 'Selamat Ulang Tahun!',
    sampleSubtitle: 'Hari Istimewa Penuh Kebahagiaan',
    sampleMessage: 'Selamat ulang tahun! Semoga senantiasa diberikan kesehatan, rezeki yang melimpah, kebahagiaan sejati, dan tercapai segala cita-cita.',
    sampleRecipient: 'Rian Pratama',
    sampleSender: 'Dengan penuh cinta dan doa',
    locale: 'id-ID'
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Outfit',
    sampleTitle: 'Selamat Hari Lahir!',
    sampleSubtitle: 'Detik Indah Yang Bermakna',
    sampleMessage: 'Selamat hari lahir! Semoga dipanjangkan umur, dikurniakan kesihatan yang baik serta sentiasa dilimpahi rezeki dan kebahagiaan.',
    sampleRecipient: 'Nurul Hidayah',
    sampleSender: 'Dengan ingatan tulus ikhlas',
    locale: 'ms-MY'
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    script: 'Thai',
    direction: 'ltr',
    defaultFont: 'Noto Serif Thai',
    sampleTitle: 'สุขสันต์วันเกิด!',
    sampleSubtitle: 'วันพิเศษที่สุดสำหรับคุณ',
    sampleMessage: 'สุขสันต์วันเกิด! ขอให้อายุมั่นขวัญยืน สุขภาพแข็งแรง ประสบความสำเร็จในทุกสิ่งที่ปรารถนา และมีความสุขในทุกๆ วัน',
    sampleRecipient: 'พิมพ์ชนก สุขสวัสดิ์',
    sampleSender: 'ด้วยความรักและความปรารถนาดี',
    locale: 'th-TH'
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'Van Harte Gefeliciteerd!',
    sampleSubtitle: 'Een Schitterende Dag Voor Jou',
    sampleMessage: 'Gefeliciteerd met je verjaardag! Ik wens je een fantastisch nieuw levensjaar toe vol gezondheid, warmte, liefde en geluk.',
    sampleRecipient: 'Lars van Dijk',
    sampleSender: 'Met heel veel liefs',
    locale: 'nl-NL'
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    script: 'Latin',
    direction: 'ltr',
    defaultFont: 'Playfair Display',
    sampleTitle: 'Wszystkiego Najlepszego!',
    sampleSubtitle: 'Twój Wyjątkowy Dzień',
    sampleMessage: 'Wszystkiego najlepszego z okazji urodzin! Życzę Ci dużo zdrowia, radości każdego dnia, spełnienia marzeń oraz niesłabnącego uśmiechu.',
    sampleRecipient: 'Marta Wiśniewska',
    sampleSender: 'Z najserdeczniejszymi życzeniami',
    locale: 'pl-PL'
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    script: 'Greek',
    direction: 'ltr',
    defaultFont: 'Cinzel',
    sampleTitle: 'Χρόνια Πολλά!',
    sampleSubtitle: 'Μια Ξεχωριστή Ημέρα Για Εσένα',
    sampleMessage: 'Χρόνια πολλά για τα γενέθλιά σου! Σου εύχομαι ολόψυχα υγεία, ευτυχία, αγάπη και να πραγματοποιηθούν όλα σου τα όνειρα.',
    sampleRecipient: 'Νίκος Παπαδόπουλος',
    sampleSender: 'Με πολλή αγάπη και θερμές ευχές',
    locale: 'el-GR'
  }
];

export const LANGUAGE_MAP = {};
LANGUAGES.forEach(lang => {
  LANGUAGE_MAP[lang.code] = lang;
});

export function getLanguage(code) {
  return LANGUAGE_MAP[code] || LANGUAGE_MAP['en'];
}

/**
 * Intelligent Script Detection for automatic direction & shaping
 */
export function detectScriptAndDirection(text, langCode) {
  const lang = getLanguage(langCode);
  if (!text || typeof text !== 'string') {
    return { direction: lang.direction || 'ltr', isRtl: lang.direction === 'rtl' };
  }

  // Arabic / Urdu / Persian / Hebrew regex
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/;
  const hasRtl = rtlRegex.test(text);

  if (hasRtl || lang.direction === 'rtl') {
    return { direction: 'rtl', isRtl: true };
  }

  return { direction: 'ltr', isRtl: false };
}
