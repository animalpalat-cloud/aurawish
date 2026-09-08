// AuraWish Birthday Card Maker - 100+ Curated Birthday Music Tracks & Sound FX
// Procedural Web Audio synthesis fallback guarantees 100% playback reliability with zero broken links!

export const MUSIC_CATEGORIES = [
  {
    "id": "all",
    "name": "All Tracks"
  },
  {
    "id": "classic",
    "name": "Classic & Traditional"
  },
  {
    "id": "party",
    "name": "Happy & Party"
  },
  {
    "id": "elegant",
    "name": "Elegant & Luxury"
  },
  {
    "id": "romantic",
    "name": "Romantic & Love"
  },
  {
    "id": "heartfelt",
    "name": "Emotional & Heartfelt"
  },
  {
    "id": "best-friend",
    "name": "Best Friend"
  },
  {
    "id": "kids",
    "name": "Kids & Playful"
  },
  {
    "id": "cinematic",
    "name": "Modern & Cinematic"
  },
  {
    "id": "chill",
    "name": "Chill & Ambient"
  },
  {
    "id": "instrumental",
    "name": "Acoustic & Instrumental"
  }
];

export const SOUND_EFFECTS = [
  {
    "id": "pop",
    "name": "Confetti Pop",
    "desc": "Party popper explosion with paper crackle",
    "icon": "PartyPopper"
  },
  {
    "id": "sparkle",
    "name": "Magical Chime",
    "desc": "Glistening fairy dust chime cascade",
    "icon": "Sparkles"
  },
  {
    "id": "unseal",
    "name": "Wax Unseal",
    "desc": "Satisfying envelope unbox swoosh",
    "icon": "Mail"
  },
  {
    "id": "blow",
    "name": "Candle Blow",
    "desc": "Breath over candle flame with sparkling wish chime",
    "icon": "Flame"
  },
  {
    "id": "cheer",
    "name": "Celebration Cheer",
    "desc": "Joyful birthday applause & crowd cheer",
    "icon": "ThumbsUp"
  },
  {
    "id": "bells",
    "name": "Birthday Bells",
    "desc": "Festive resonant cathedral jubilee chime",
    "icon": "Bell"
  },
  {
    "id": "fireworks",
    "name": "Fireworks Boom",
    "desc": "Grand celebratory aerial firework burst",
    "icon": "Zap"
  },
  {
    "id": "balloon-pop",
    "name": "Balloon Pop",
    "desc": "Playful party balloon burst snap",
    "icon": "Disc"
  }
];

export const MUSIC_TRACKS = [
  {
    "id": "classic-happy-birthday",
    "title": "Classic Happy Birthday",
    "category": "classic",
    "mood": "Nostalgic",
    "style": "classic",
    "bpm": 104,
    "duration": "2:14",
    "instruments": [
      "Grand Piano",
      "Strings",
      "Warm Chimes"
    ],
    "description": "The timeless, traditional birthday melody performed on a warm concert grand piano with soft string accompaniment.",
    "relationshipTags": [
      "family",
      "mom",
      "dad",
      "grandma",
      "grandpa"
    ],
    "isFeatured": true,
    "audioUrl": "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=happy-birthday-to-you-piano-version-12345.mp3",
    "waveform": [
      20,
      35,
      60,
      80,
      65,
      45,
      70,
      90,
      85,
      60,
      40,
      30
    ],
    "synthPreset": {
      "style": "classic",
      "bpm": 104,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.04
    }
  },
  {
    "id": "traditional-acoustic-birthday",
    "title": "Traditional Acoustic Birthday",
    "category": "classic",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 110,
    "duration": "2:30",
    "instruments": [
      "Nylon Guitar",
      "Acoustic Bass",
      "Light Shaker"
    ],
    "description": "A warm fingerstyle acoustic guitar rendition of the birthday theme, perfect for home celebrations.",
    "relationshipTags": [
      "dad",
      "brother",
      "family",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      75,
      80,
      55,
      60,
      70,
      85,
      65,
      40,
      35,
      25
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 110,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.1
    }
  },
  {
    "id": "vintage-music-box",
    "title": "Vintage Music Box",
    "category": "classic",
    "mood": "Nostalgic",
    "style": "music-box",
    "bpm": 88,
    "duration": "1:52",
    "instruments": [
      "Music Box Mechanism",
      "Celesta",
      "Glockenspiel"
    ],
    "description": "Magical tinkling antique music box chimes playing the birthday theme with pure vintage charm.",
    "relationshipTags": [
      "mom",
      "sister",
      "kids",
      "baby",
      "best-friend"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      40,
      60,
      80,
      95,
      70,
      85,
      90,
      75,
      60,
      50,
      30,
      20
    ],
    "synthPreset": {
      "style": "music-box",
      "bpm": 88,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "orchestral-birthday-jubilee",
    "title": "Orchestral Birthday Jubilee",
    "category": "classic",
    "mood": "Festive",
    "style": "orchestral",
    "bpm": 116,
    "duration": "2:45",
    "instruments": [
      "Violins",
      "French Horn",
      "Timpani",
      "Woodwinds"
    ],
    "description": "Grand symphony orchestra arrangement with soaring brass fanfares and lush celebratory strings.",
    "relationshipTags": [
      "dad",
      "boss",
      "mentor",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      85,
      100,
      90,
      80,
      85,
      95,
      75,
      55,
      40,
      30
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 116,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.16
    }
  },
  {
    "id": "ukulele-sunshine-birthday",
    "title": "Ukulele Sunshine Birthday",
    "category": "classic",
    "mood": "Happy",
    "style": "acoustic",
    "bpm": 124,
    "duration": "1:58",
    "instruments": [
      "Soprano Ukulele",
      "Hand Claps",
      "Whistle",
      "Bass"
    ],
    "description": "Breezy Hawaiian-style ukulele strumming with upbeat handclaps and cheerful whistling.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "brother",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      65,
      85,
      90,
      75,
      80,
      85,
      90,
      70,
      55,
      40,
      30
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 124,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.24
    }
  },
  {
    "id": "golden-chimes-celebration",
    "title": "Golden Bells & Chimes",
    "category": "classic",
    "mood": "Festive",
    "style": "orchestral",
    "bpm": 96,
    "duration": "2:10",
    "instruments": [
      "Tubular Bells",
      "Orchestral Harp",
      "Strings"
    ],
    "description": "Resonant cathedral bells ringing in harmony with warm harp arpeggios.",
    "relationshipTags": [
      "grandma",
      "grandpa",
      "family",
      "mom"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      55,
      75,
      90,
      80,
      70,
      85,
      90,
      65,
      45,
      35,
      20
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 96,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.96
    }
  },
  {
    "id": "warm-folk-birthday",
    "title": "Warm Hearth Folk Birthday",
    "category": "classic",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 108,
    "duration": "2:22",
    "instruments": [
      "Acoustic Guitar",
      "Harmonica",
      "Stomp Box"
    ],
    "description": "Earthy indie-folk celebration with foot stomps, acoustic strumming, and warm harmonies.",
    "relationshipTags": [
      "brother",
      "best-friend",
      "dad",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      55,
      70,
      85,
      75,
      80,
      90,
      85,
      65,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 108,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.08
    }
  },
  {
    "id": "chamber-strings-birthday",
    "title": "Chamber Strings Serenade",
    "category": "classic",
    "mood": "Elegant",
    "style": "classical",
    "bpm": 92,
    "duration": "2:36",
    "instruments": [
      "String Quartet",
      "Cello Solo",
      "Viola"
    ],
    "description": "Refined classical string quartet serenade with deep emotive cello lines and delicate violin counterpoints.",
    "relationshipTags": [
      "mom",
      "wife",
      "husband",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "classical",
      "bpm": 92,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.92
    }
  },
  {
    "id": "solo-grand-piano-waltz",
    "title": "Grand Piano Birthday Waltz",
    "category": "classic",
    "mood": "Elegant",
    "style": "piano",
    "bpm": 112,
    "duration": "2:20",
    "instruments": [
      "Steinway Grand Piano"
    ],
    "description": "Romantic 3/4 waltz reimagining the birthday theme with flowing left-hand arpeggios.",
    "relationshipTags": [
      "mom",
      "grandma",
      "wife",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      75,
      80,
      85,
      75,
      60,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 112,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.12
    }
  },
  {
    "id": "celebration-brass-fanfare",
    "title": "Royal Brass Birthday Fanfare",
    "category": "classic",
    "mood": "Festive",
    "style": "orchestral",
    "bpm": 120,
    "duration": "1:45",
    "instruments": [
      "Trumpets",
      "Trombones",
      "Snare Drum",
      "Cymbals"
    ],
    "description": "Noble regal fanfare heralding milestone birthdays and triumphant new chapters.",
    "relationshipTags": [
      "dad",
      "mentor",
      "boss",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      70,
      95,
      100,
      85,
      90,
      100,
      95,
      75,
      60,
      40,
      25
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 120,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.2
    }
  },
  {
    "id": "big-birthday-party",
    "title": "Big Birthday Party Bash",
    "category": "party",
    "mood": "Energetic",
    "style": "party",
    "bpm": 128,
    "duration": "2:50",
    "instruments": [
      "Synth Bass",
      "Brass Stabs",
      "Electro Drums",
      "Claps"
    ],
    "description": "High-octane modern dance-pop celebration packed with driving beats and infectious party hooks.",
    "relationshipTags": [
      "best-friend",
      "teen",
      "brother",
      "sister"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      50,
      80,
      95,
      100,
      90,
      95,
      100,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 128,
      "baseFreq": 321.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.28
    }
  },
  {
    "id": "confetti-pop-celebration",
    "title": "Confetti Pop Anthem",
    "category": "party",
    "mood": "Joyful",
    "style": "party",
    "bpm": 125,
    "duration": "2:35",
    "instruments": [
      "Electric Guitars",
      "Pop Drums",
      "Vocoder FX"
    ],
    "description": "Upbeat pop-rock celebration track with explosive choruses and glittery synth arpeggios.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      75,
      90,
      95,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 125,
      "baseFreq": 341.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.25
    }
  },
  {
    "id": "party-lights-disco-groove",
    "title": "Party Lights Disco Groove",
    "category": "party",
    "mood": "Fun",
    "style": "party",
    "bpm": 120,
    "duration": "3:05",
    "instruments": [
      "Slap Bass",
      "Funky Rhythm Guitar",
      "Rhodes",
      "Congas"
    ],
    "description": "Retro 70s-inspired funky disco bassline with shimmering rhythm guitars and danceable groove.",
    "relationshipTags": [
      "best-friend",
      "brother",
      "sister",
      "teen"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      55,
      75,
      85,
      95,
      90,
      85,
      90,
      95,
      85,
      70,
      55,
      40
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 120,
      "baseFreq": 361.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.2
    }
  },
  {
    "id": "cake-and-candles-bounce",
    "title": "Cake & Candles Bounce",
    "category": "party",
    "mood": "Playful",
    "style": "party",
    "bpm": 122,
    "duration": "2:18",
    "instruments": [
      "808 Bass",
      "Marimba",
      "Shakers",
      "Snap Beats"
    ],
    "description": "Catchy tropical house bounce track full of bright marimbas, energetic snaps, and joyful vibes.",
    "relationshipTags": [
      "kids",
      "teen",
      "best-friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      90,
      80,
      85,
      90,
      85,
      75,
      60,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 122,
      "baseFreq": 381.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.22
    }
  },
  {
    "id": "birthday-carnival-parade",
    "title": "Birthday Carnival Parade",
    "category": "party",
    "mood": "Festive",
    "style": "party",
    "bpm": 130,
    "duration": "2:40",
    "instruments": [
      "Samba Whistle",
      "Surdo Drums",
      "Agogo Bells",
      "Brass"
    ],
    "description": "Samba-infused festival parade with vibrant Latin percussion, festive horns, and non-stop movement.",
    "relationshipTags": [
      "family",
      "friend",
      "best-friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      60,
      85,
      100,
      95,
      90,
      100,
      95,
      90,
      85,
      75,
      55,
      40
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 130,
      "baseFreq": 261.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.3
    }
  },
  {
    "id": "neon-nightlife-celebrate",
    "title": "Neon Nightlife Celebrate",
    "category": "party",
    "mood": "Energetic",
    "style": "party",
    "bpm": 126,
    "duration": "3:12",
    "instruments": [
      "Analog Synths",
      "Sidechain Bass",
      "Hi-hat Rolls"
    ],
    "description": "Club-ready EDM anthem built around shimmering synth drops and punchy festival rhythms.",
    "relationshipTags": [
      "teen",
      "best-friend",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      95,
      100,
      90,
      95,
      100,
      90,
      80,
      65,
      45,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 126,
      "baseFreq": 281.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.26
    }
  },
  {
    "id": "sunshine-birthday-reggae",
    "title": "Sunshine Birthday Reggae",
    "category": "party",
    "mood": "Joyful",
    "style": "party",
    "bpm": 98,
    "duration": "2:48",
    "instruments": [
      "Organ Skank",
      "Deep Reggae Bass",
      "Rimshot",
      "Horns"
    ],
    "description": "Relaxed island reggae groove with bright organ skanks and carefree tropical horn fills.",
    "relationshipTags": [
      "dad",
      "brother",
      "best-friend",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      60,
      75,
      85,
      80,
      75,
      80,
      85,
      70,
      55,
      40,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 98,
      "baseFreq": 301.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 0.98
    }
  },
  {
    "id": "electro-swing-jubilee",
    "title": "Electro Swing Jubilee",
    "category": "party",
    "mood": "Playful",
    "style": "party",
    "bpm": 132,
    "duration": "2:32",
    "instruments": [
      "Clarinet",
      "Vintage Gramophone Sample",
      "Modern Beats"
    ],
    "description": "1920s speakeasy jazz crossed with modern dancefloor punch for a roaring birthday party.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      55,
      80,
      95,
      90,
      85,
      95,
      90,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 132,
      "baseFreq": 321.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.32
    }
  },
  {
    "id": "balloon-drop-cheer",
    "title": "Balloon Drop Celebration",
    "category": "party",
    "mood": "Happy",
    "style": "party",
    "bpm": 124,
    "duration": "2:25",
    "instruments": [
      "Piano Chords",
      "Glockenspiel",
      "Four-on-the-floor Drums"
    ],
    "description": "Euphoric indie pop with driving piano chords and feel-good chorus energy.",
    "relationshipTags": [
      "kids",
      "teen",
      "best-friend",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      95,
      85,
      90,
      95,
      90,
      80,
      60,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 124,
      "baseFreq": 341.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.24
    }
  },
  {
    "id": "sparkler-night-fever",
    "title": "Sparkler Night Fever",
    "category": "party",
    "mood": "Energetic",
    "style": "party",
    "bpm": 126,
    "duration": "2:55",
    "instruments": [
      "Synth Arps",
      "Live Bass",
      "Crisp Drums"
    ],
    "description": "Dazzling synthwave energy that sparkles like birthday candles against a midnight sky.",
    "relationshipTags": [
      "best-friend",
      "teen",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      90,
      100,
      85,
      95,
      90,
      95,
      80,
      65,
      50,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 126,
      "baseFreq": 361.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.26
    }
  },
  {
    "id": "champagne-poppers-groove",
    "title": "Champagne Poppers",
    "category": "party",
    "mood": "Joyful",
    "style": "party",
    "bpm": 118,
    "duration": "2:40",
    "instruments": [
      "Electric Piano",
      "Slap Bass",
      "Finger Snaps"
    ],
    "description": "Sophisticated yet high-energy cocktail party funk with popping basslines and sparkling rhodes.",
    "relationshipTags": [
      "partner",
      "wife",
      "husband",
      "best-friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      80,
      90,
      85,
      80,
      85,
      90,
      75,
      60,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 118,
      "baseFreq": 381.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.18
    }
  },
  {
    "id": "cheer-and-chant-chorus",
    "title": "Shout & Sing Chorus",
    "category": "party",
    "mood": "Fun",
    "style": "party",
    "bpm": 128,
    "duration": "2:15",
    "instruments": [
      "Acoustic Drums",
      "Group Chants",
      "Distorted Organ"
    ],
    "description": "Infectious singalong anthem with crowd claps and chant-along hooks.",
    "relationshipTags": [
      "best-friend",
      "brother",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      55,
      80,
      95,
      100,
      90,
      95,
      100,
      95,
      85,
      70,
      55,
      40
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 128,
      "baseFreq": 261.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.28
    }
  },
  {
    "id": "glitter-cannon-jam",
    "title": "Glitter Cannon Jam",
    "category": "party",
    "mood": "Playful",
    "style": "party",
    "bpm": 122,
    "duration": "2:28",
    "instruments": [
      "Funky Brass",
      "Talkbox Synthesizer",
      "Groove Drums"
    ],
    "description": "Punchy electro-funk track loaded with playful talkbox accents and shimmering glitter synth riffs.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      95,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 122,
      "baseFreq": 281.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.22
    }
  },
  {
    "id": "festival-mainstage-birthday",
    "title": "Mainstage Birthday Drop",
    "category": "party",
    "mood": "Epic",
    "style": "party",
    "bpm": 130,
    "duration": "3:20",
    "instruments": [
      "Supersaw Leads",
      "Festival Kick",
      "White Noise Sweeps"
    ],
    "description": "Massive EDM festival build-up and drop for epic milestone birthdays that demand all the noise.",
    "relationshipTags": [
      "teen",
      "brother",
      "best-friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      60,
      85,
      100,
      100,
      95,
      100,
      100,
      95,
      90,
      75,
      60,
      45
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 130,
      "baseFreq": 301.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.3
    }
  },
  {
    "id": "lets-celebrate-now",
    "title": "Let’s Celebrate Now",
    "category": "party",
    "mood": "Happy",
    "style": "party",
    "bpm": 120,
    "duration": "2:42",
    "instruments": [
      "Piano",
      "Horns",
      "Tambourine",
      "Bass"
    ],
    "description": "Motown-influenced celebration groove that will get everyone on their feet smiling and dancing.",
    "relationshipTags": [
      "family",
      "mom",
      "dad",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      90,
      85,
      85,
      90,
      95,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 120,
      "baseFreq": 321.63,
      "harmonyType": "major-pop",
      "speedMultiplier": 1.2
    }
  },
  {
    "id": "velvet-champagne-gala",
    "title": "Velvet Champagne Gala",
    "category": "elegant",
    "mood": "Luxury",
    "style": "classical",
    "bpm": 94,
    "duration": "3:05",
    "instruments": [
      "Concert Grand Piano",
      "Cello Ensemble",
      "Golden Harp"
    ],
    "description": "Opulent black-tie gala soundtrack with sweeping velvet strings and sparkling golden harp glissandos.",
    "relationshipTags": [
      "wife",
      "husband",
      "mom",
      "boss",
      "mentor"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      80,
      75,
      85,
      90,
      75,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "classical",
      "bpm": 94,
      "baseFreq": 341.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 0.94
    }
  },
  {
    "id": "royal-soiree-strings",
    "title": "Royal Soiree Strings",
    "category": "elegant",
    "mood": "Elegant",
    "style": "classical",
    "bpm": 90,
    "duration": "2:50",
    "instruments": [
      "Violin Solo",
      "Pizzicato Strings",
      "Harpsichord Accent"
    ],
    "description": "Sophisticated royal court serenade filled with exquisite baroque phrasing and distinguished grace.",
    "relationshipTags": [
      "mom",
      "grandma",
      "wife",
      "mentor"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "classical",
      "bpm": 90,
      "baseFreq": 361.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 0.9
    }
  },
  {
    "id": "golden-anniversary-glow",
    "title": "Golden Milestone Glow",
    "category": "elegant",
    "mood": "Luxury",
    "style": "orchestral",
    "bpm": 96,
    "duration": "3:15",
    "instruments": [
      "Lush French Horns",
      "Strings",
      "Warm Piano"
    ],
    "description": "Prestigious cinematic harmony celebrating wisdom, milestone achievements, and a life well-lived.",
    "relationshipTags": [
      "dad",
      "grandpa",
      "mom",
      "boss"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      90,
      85,
      80,
      85,
      90,
      75,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 96,
      "baseFreq": 381.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 0.96
    }
  },
  {
    "id": "midnight-luxe-ballroom",
    "title": "Midnight Luxe Ballroom",
    "category": "elegant",
    "mood": "Luxury",
    "style": "piano",
    "bpm": 106,
    "duration": "2:40",
    "instruments": [
      "Fazioli Piano",
      "Subtle Ambient Synth",
      "Chamber Cello"
    ],
    "description": "Modern luxury boutique hotel aesthetic featuring pristine piano dynamics and velvet atmosphere.",
    "relationshipTags": [
      "partner",
      "wife",
      "husband"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      70,
      85,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 106,
      "baseFreq": 261.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 1.06
    }
  },
  {
    "id": "champagne-bubbles-waltz",
    "title": "Champagne Bubbles Waltz",
    "category": "elegant",
    "mood": "Joyful",
    "style": "classical",
    "bpm": 114,
    "duration": "2:25",
    "instruments": [
      "Flute",
      "Harp",
      "Light Strings"
    ],
    "description": "Effervescent Parisian waltz that dances with the lightness and sparkle of vintage Dom Pérignon.",
    "relationshipTags": [
      "sister",
      "best-friend",
      "mom"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      55,
      75,
      85,
      80,
      75,
      80,
      85,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "classical",
      "bpm": 114,
      "baseFreq": 281.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 1.14
    }
  },
  {
    "id": "sophisticated-candlelight-trio",
    "title": "Candlelight Trio",
    "category": "elegant",
    "mood": "Elegant",
    "style": "jazz",
    "bpm": 92,
    "duration": "3:00",
    "instruments": [
      "Upright Bass",
      "Brushed Drums",
      "Jazz Piano"
    ],
    "description": "Intimate five-star dining atmosphere with warm upright bass plucks and smooth brushed drums.",
    "relationshipTags": [
      "husband",
      "wife",
      "partner",
      "dad"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      65,
      80,
      75,
      70,
      75,
      80,
      70,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "jazz",
      "bpm": 92,
      "baseFreq": 301.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 0.92
    }
  },
  {
    "id": "ivory-monarch-prestige",
    "title": "Ivory Monarch Serenade",
    "category": "elegant",
    "mood": "Luxury",
    "style": "piano",
    "bpm": 88,
    "duration": "2:55",
    "instruments": [
      "Yamaha CFX Grand Piano",
      "Subtle Pad"
    ],
    "description": "Poetic, expressive piano solo evoking timeless grandeur and distinguished honor.",
    "relationshipTags": [
      "mentor",
      "boss",
      "dad",
      "grandpa"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      40,
      60,
      75,
      70,
      65,
      75,
      80,
      65,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 88,
      "baseFreq": 321.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "opulent-chateau-celebration",
    "title": "Opulent Chateau Celebration",
    "category": "elegant",
    "mood": "Luxury",
    "style": "orchestral",
    "bpm": 100,
    "duration": "2:45",
    "instruments": [
      "Oboe",
      "French Horn",
      "Full Strings"
    ],
    "description": "European aristocrat estate garden party with noble melodies and breathtaking warmth.",
    "relationshipTags": [
      "mom",
      "family",
      "grandma"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      55,
      75,
      85,
      80,
      75,
      85,
      90,
      75,
      55,
      35,
      25
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 100,
      "baseFreq": 341.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 1
    }
  },
  {
    "id": "diamonds-and-gold-radiance",
    "title": "Diamonds & Gold Radiance",
    "category": "elegant",
    "mood": "Luxury",
    "style": "cinematic",
    "bpm": 98,
    "duration": "3:10",
    "instruments": [
      "Celesta",
      "Shimmering Strings",
      "Warm Brass"
    ],
    "description": "Cinematic luxury arrangement glistening with timeless brilliance and prestige.",
    "relationshipTags": [
      "wife",
      "mom",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      90,
      85,
      80,
      85,
      95,
      75,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 98,
      "baseFreq": 361.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 0.98
    }
  },
  {
    "id": "rooftop-starlight-champagne",
    "title": "Rooftop Starlight Champagne",
    "category": "elegant",
    "mood": "Elegant",
    "style": "jazz",
    "bpm": 102,
    "duration": "2:52",
    "instruments": [
      "Muted Trumpet",
      "Piano",
      "Upright Bass"
    ],
    "description": "Chic skyline evening vibe with a soft muted trumpet melody overlooking illuminated city lights.",
    "relationshipTags": [
      "husband",
      "boyfriend",
      "best-friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      80,
      75,
      70,
      75,
      80,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "jazz",
      "bpm": 102,
      "baseFreq": 381.63,
      "harmonyType": "classical-chords",
      "speedMultiplier": 1.02
    }
  },
  {
    "id": "forever-my-love-birthday",
    "title": "Forever My Love",
    "category": "romantic",
    "mood": "Romantic",
    "style": "piano",
    "bpm": 76,
    "duration": "3:14",
    "instruments": [
      "Warm Grand Piano",
      "Solo Cello",
      "Emotional Strings"
    ],
    "description": "Deeply emotional, romantic piano and cello dialogue celebrating the birth of the love of your life.",
    "relationshipTags": [
      "partner",
      "wife",
      "husband",
      "girlfriend",
      "boyfriend"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 76,
      "baseFreq": 261.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.76
    }
  },
  {
    "id": "candlelight-sweetheart-melody",
    "title": "Candlelight Sweetheart",
    "category": "romantic",
    "mood": "Romantic",
    "style": "acoustic",
    "bpm": 82,
    "duration": "2:48",
    "instruments": [
      "Fingerstyle Guitar",
      "Warm Pad",
      "Soft Chimes"
    ],
    "description": "Tender acoustic guitar serenade whispering gratitude for every sweet moment shared together.",
    "relationshipTags": [
      "girlfriend",
      "wife",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      40,
      60,
      75,
      70,
      65,
      75,
      80,
      65,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 82,
      "baseFreq": 281.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.82
    }
  },
  {
    "id": "roses-and-whispers-piano",
    "title": "Roses & Soft Whispers",
    "category": "romantic",
    "mood": "Romantic",
    "style": "piano",
    "bpm": 74,
    "duration": "3:22",
    "instruments": [
      "Mellow Felt Piano",
      "Ambient Reverb",
      "String Swells"
    ],
    "description": "Gentle felted piano notes floating in romantic intimacy like petals drifting in the breeze.",
    "relationshipTags": [
      "partner",
      "wife",
      "girlfriend"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      20,
      35,
      55,
      70,
      65,
      60,
      70,
      75,
      60,
      45,
      30,
      15
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 74,
      "baseFreq": 301.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.74
    }
  },
  {
    "id": "holding-hands-into-tomorrow",
    "title": "Holding Hands Into Tomorrow",
    "category": "romantic",
    "mood": "Emotional",
    "style": "cinematic",
    "bpm": 86,
    "duration": "3:05",
    "instruments": [
      "Orchestral Strings",
      "Piano",
      "French Horns"
    ],
    "description": "Cinematic romance building from quiet reverence into an overwhelming swell of heartfelt devotion.",
    "relationshipTags": [
      "husband",
      "wife",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      85,
      80,
      75,
      85,
      95,
      75,
      55,
      35,
      20
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 86,
      "baseFreq": 321.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.86
    }
  },
  {
    "id": "moonlight-birthday-serenade",
    "title": "Moonlight Birthday Serenade",
    "category": "romantic",
    "mood": "Romantic",
    "style": "classical",
    "bpm": 80,
    "duration": "2:58",
    "instruments": [
      "Violin Solo",
      "Acoustic Guitar",
      "Harp"
    ],
    "description": "A moonlit balcony serenade honoring the beauty and grace of your partner on their birthday.",
    "relationshipTags": [
      "wife",
      "girlfriend",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "classical",
      "bpm": 80,
      "baseFreq": 341.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.8
    }
  },
  {
    "id": "you-are-my-universe",
    "title": "You Are My Universe",
    "category": "romantic",
    "mood": "Epic",
    "style": "cinematic",
    "bpm": 90,
    "duration": "3:18",
    "instruments": [
      "Cinematic Synth",
      "Piano",
      "Warm Sub Bass",
      "Choir"
    ],
    "description": "Dreamy modern romance track expressing how the world became brighter the day they were born.",
    "relationshipTags": [
      "husband",
      "wife",
      "boyfriend",
      "girlfriend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      80,
      85,
      90,
      95,
      80,
      60,
      40,
      25
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 90,
      "baseFreq": 361.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.9
    }
  },
  {
    "id": "sunset-kiss-acoustic",
    "title": "Sunset Kiss Acoustic",
    "category": "romantic",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 94,
    "duration": "2:38",
    "instruments": [
      "Dual Acoustic Guitars",
      "Light Percussion"
    ],
    "description": "Warm and sunny romantic acoustic duet with smiling rhythmic playfulness.",
    "relationshipTags": [
      "boyfriend",
      "girlfriend",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      55,
      75,
      85,
      80,
      75,
      80,
      85,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 94,
      "baseFreq": 381.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.94
    }
  },
  {
    "id": "starlit-vows-celebration",
    "title": "Starlit Birthday Vows",
    "category": "romantic",
    "mood": "Romantic",
    "style": "piano",
    "bpm": 78,
    "duration": "3:08",
    "instruments": [
      "Grand Piano",
      "Violin Duet"
    ],
    "description": "Reaffirming eternal love on their birthday with tender melodies that evoke wedding vows.",
    "relationshipTags": [
      "husband",
      "wife",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      80,
      85,
      65,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 78,
      "baseFreq": 261.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.78
    }
  },
  {
    "id": "sweetheart-lullaby-chime",
    "title": "Sweetheart Birthday Chime",
    "category": "romantic",
    "mood": "Cute",
    "style": "music-box",
    "bpm": 84,
    "duration": "2:12",
    "instruments": [
      "Celesta",
      "Acoustic Guitar",
      "Bells"
    ],
    "description": "Adorable, sweet music-box love lullaby filled with tenderness and warm smiles.",
    "relationshipTags": [
      "girlfriend",
      "wife",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      75,
      80,
      85,
      75,
      60,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "music-box",
      "bpm": 84,
      "baseFreq": 281.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.84
    }
  },
  {
    "id": "golden-hour-romance",
    "title": "Golden Hour Romance",
    "category": "romantic",
    "mood": "Romantic",
    "style": "chill",
    "bpm": 88,
    "duration": "2:45",
    "instruments": [
      "Rhodes Piano",
      "Guitar Harmonics",
      "Soft Shaker"
    ],
    "description": "Basking in the golden hour warmth with the person who holds your heart on their birthday.",
    "relationshipTags": [
      "partner",
      "wife",
      "husband",
      "girlfriend",
      "boyfriend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      75,
      70,
      70,
      75,
      80,
      65,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 88,
      "baseFreq": 301.63,
      "harmonyType": "sweet-major7",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "memories-through-the-years",
    "title": "Memories Through the Years",
    "category": "heartfelt",
    "mood": "Emotional",
    "style": "piano",
    "bpm": 80,
    "duration": "3:15",
    "instruments": [
      "Felt Piano",
      "Lush Cello",
      "Subtle Ambient Vinyl"
    ],
    "description": "Tender nostalgic tribute recalling childhood albums, shared laughter, and irreplaceable milestones.",
    "relationshipTags": [
      "mom",
      "dad",
      "sister",
      "brother",
      "family"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 80,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.8
    }
  },
  {
    "id": "mothers-loving-embrace",
    "title": "Mother’s Gentle Embrace",
    "category": "heartfelt",
    "mood": "Emotional",
    "style": "piano",
    "bpm": 76,
    "duration": "3:20",
    "instruments": [
      "Concert Piano",
      "Solo Violin",
      "Warm Strings"
    ],
    "description": "An emotional masterpiece dedicated to mothers, honoring unconditional sacrifices and eternal love.",
    "relationshipTags": [
      "mom",
      "grandma"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      20,
      40,
      65,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      30,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 76,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.76
    }
  },
  {
    "id": "fathers-guiding-hand",
    "title": "Father’s Guiding Hand",
    "category": "heartfelt",
    "mood": "Emotional",
    "style": "orchestral",
    "bpm": 84,
    "duration": "3:10",
    "instruments": [
      "French Horn",
      "Cello",
      "Acoustic Guitar",
      "Piano"
    ],
    "description": "Noble, grounded tribute to a father’s strength, wisdom, quiet mentorship, and enduring pride.",
    "relationshipTags": [
      "dad",
      "grandpa",
      "mentor"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      50,
      70,
      85,
      80,
      75,
      85,
      90,
      75,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 84,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.84
    }
  },
  {
    "id": "family-roots-and-wings",
    "title": "Family Roots & Wings",
    "category": "heartfelt",
    "mood": "Nostalgic",
    "style": "acoustic",
    "bpm": 92,
    "duration": "2:50",
    "instruments": [
      "Warm Acoustic Guitar",
      "Piano",
      "Mandolin"
    ],
    "description": "Homestyle folk acoustic melody celebrating family reunions, dinner tables, and lifelong bonds.",
    "relationshipTags": [
      "family",
      "sister",
      "brother",
      "mom",
      "dad"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      55,
      75,
      85,
      80,
      75,
      80,
      85,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 92,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.92
    }
  },
  {
    "id": "gratitude-from-the-heart",
    "title": "Gratitude From the Heart",
    "category": "heartfelt",
    "mood": "Emotional",
    "style": "piano",
    "bpm": 78,
    "duration": "3:05",
    "instruments": [
      "Solo Grand Piano",
      "Atmospheric Strings"
    ],
    "description": "Pure, heartfelt expression of thanks for being someone who makes every day infinitely better.",
    "relationshipTags": [
      "friend",
      "best-friend",
      "mom",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      80,
      75,
      70,
      75,
      80,
      65,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 78,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.78
    }
  },
  {
    "id": "precious-childhood-album",
    "title": "Precious Childhood Album",
    "category": "heartfelt",
    "mood": "Nostalgic",
    "style": "music-box",
    "bpm": 86,
    "duration": "2:30",
    "instruments": [
      "Celesta",
      "Acoustic Guitar",
      "Warm Pad"
    ],
    "description": "Flipping through dog-eared photo albums with tears of gratitude and joyful remembrance.",
    "relationshipTags": [
      "sister",
      "brother",
      "family",
      "mom"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      75,
      80,
      85,
      75,
      60,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "music-box",
      "bpm": 86,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.86
    }
  },
  {
    "id": "tears-of-joy-crescendo",
    "title": "Tears of Joy",
    "category": "heartfelt",
    "mood": "Emotional",
    "style": "cinematic",
    "bpm": 88,
    "duration": "3:25",
    "instruments": [
      "Strings Crescendo",
      "Timpani",
      "Piano Solo"
    ],
    "description": "Overwhelming emotional swell celebrating milestones, overcoming hardships, and triumphing together.",
    "relationshipTags": [
      "family",
      "partner",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      85,
      80,
      85,
      95,
      100,
      80,
      60,
      40,
      25
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 88,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "generations-of-love",
    "title": "Generations of Love",
    "category": "heartfelt",
    "mood": "Nostalgic",
    "style": "orchestral",
    "bpm": 82,
    "duration": "3:12",
    "instruments": [
      "Harp",
      "Woodwinds",
      "Strings"
    ],
    "description": "Honoring grandparents and family patriarchs/matriarchs whose love bridges entire generations.",
    "relationshipTags": [
      "grandma",
      "grandpa",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      50,
      70,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 82,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.82
    }
  },
  {
    "id": "unspoken-pride-melody",
    "title": "Unspoken Pride",
    "category": "heartfelt",
    "mood": "Emotional",
    "style": "piano",
    "bpm": 84,
    "duration": "2:55",
    "instruments": [
      "Piano",
      "Cello",
      "French Horn"
    ],
    "description": "When words fall short, this quiet melody speaks of profound pride in everything you have accomplished.",
    "relationshipTags": [
      "brother",
      "sister",
      "dad",
      "mentor"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      40,
      65,
      80,
      75,
      70,
      75,
      80,
      65,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 84,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.84
    }
  },
  {
    "id": "home-is-where-you-are",
    "title": "Home Is Where You Are",
    "category": "heartfelt",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 96,
    "duration": "2:40",
    "instruments": [
      "Acoustic Guitar",
      "Accordion Accent",
      "Upright Bass"
    ],
    "description": "A cozy reminder that wherever life leads, being with family on their birthday feels like home.",
    "relationshipTags": [
      "family",
      "sister",
      "brother",
      "mom",
      "dad"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      55,
      75,
      85,
      80,
      75,
      80,
      85,
      70,
      55,
      35,
      25
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 96,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.96
    }
  },
  {
    "id": "partners-in-crime-groove",
    "title": "Partners in Crime",
    "category": "best-friend",
    "mood": "Fun",
    "style": "party",
    "bpm": 122,
    "duration": "2:36",
    "instruments": [
      "Funky Bass",
      "Electric Guitar Riffs",
      "Upbeat Drums"
    ],
    "description": "High-energy, cheeky funk groove celebrating inside jokes, wild adventures, and unbreakable friendship.",
    "relationshipTags": [
      "best-friend",
      "brother",
      "sister",
      "teen"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      95,
      90,
      85,
      90,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 122,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.22
    }
  },
  {
    "id": "ride-or-die-anthem",
    "title": "Ride or Die Friendship",
    "category": "best-friend",
    "mood": "Energetic",
    "style": "party",
    "bpm": 126,
    "duration": "2:45",
    "instruments": [
      "Distorted Bass",
      "Modern Synth",
      "Trap Hats"
    ],
    "description": "Trendy, upbeat modern bop dedicated to the friend who has your back through every single storm.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "brother",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      90,
      100,
      90,
      95,
      95,
      100,
      85,
      65,
      50,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 126,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.26
    }
  },
  {
    "id": "midnight-snack-giggles",
    "title": "Midnight Snack & Giggles",
    "category": "best-friend",
    "mood": "Playful",
    "style": "acoustic",
    "bpm": 114,
    "duration": "2:18",
    "instruments": [
      "Ukulele",
      "Glockenspiel",
      "Whistling",
      "Snaps"
    ],
    "description": "Lighthearted, bubbly acoustic jam reminding you of late-night phone calls and uncontrollable laughter.",
    "relationshipTags": [
      "best-friend",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      60,
      80,
      90,
      80,
      85,
      85,
      90,
      75,
      60,
      40,
      30
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 114,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.14
    }
  },
  {
    "id": "golden-friendship-years",
    "title": "Golden Friendship Memories",
    "category": "best-friend",
    "mood": "Nostalgic",
    "style": "piano",
    "bpm": 98,
    "duration": "2:50",
    "instruments": [
      "Piano",
      "Acoustic Guitar",
      "Strings"
    ],
    "description": "A tribute to friendships that weathered every season of life without ever fading.",
    "relationshipTags": [
      "best-friend",
      "friend"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      80,
      75,
      80,
      85,
      70,
      55,
      35,
      25
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 98,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.98
    }
  },
  {
    "id": "crazy-besties-road-trip",
    "title": "Besties Road Trip Jump",
    "category": "best-friend",
    "mood": "Energetic",
    "style": "party",
    "bpm": 130,
    "duration": "2:30",
    "instruments": [
      "Indie Guitars",
      "Driving Drum Beat",
      "Tambourine"
    ],
    "description": "Windows down, music blasting on highway 101 with your favorite person on their birthday.",
    "relationshipTags": [
      "best-friend",
      "brother",
      "sister",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      95,
      100,
      90,
      95,
      100,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 130,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.3
    }
  },
  {
    "id": "inside-jokes-and-secrets",
    "title": "Inside Jokes & Secrets",
    "category": "best-friend",
    "mood": "Fun",
    "style": "chill",
    "bpm": 104,
    "duration": "2:40",
    "instruments": [
      "Wurlitzer Piano",
      "Funky Bassline",
      "Claps"
    ],
    "description": "Mischievous, playful groove capturing the unspoken code between best friends.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      75,
      85,
      80,
      85,
      85,
      80,
      70,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 104,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.04
    }
  },
  {
    "id": "never-grow-old-together",
    "title": "Never Grow Old Together",
    "category": "best-friend",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 118,
    "duration": "2:25",
    "instruments": [
      "Acoustic Guitar",
      "Glockenspiel",
      "Kick & Snare"
    ],
    "description": "Joyful folk-pop pledge to stay young at heart and continue acting silly together forever.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      90,
      85,
      85,
      90,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 118,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.18
    }
  },
  {
    "id": "cheers-to-the-bestie",
    "title": "Cheers to My Bestie",
    "category": "best-friend",
    "mood": "Festive",
    "style": "party",
    "bpm": 120,
    "duration": "2:35",
    "instruments": [
      "Brass Section",
      "Pop Piano",
      "Handclaps"
    ],
    "description": "Raising a toast with the whole crew to the most loyal friend anyone could ever ask for.",
    "relationshipTags": [
      "best-friend",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      95,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 120,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.2
    }
  },
  {
    "id": "photo-booth-strips",
    "title": "Photo Booth Strips",
    "category": "best-friend",
    "mood": "Playful",
    "style": "chill",
    "bpm": 108,
    "duration": "2:20",
    "instruments": [
      "Lofi Beats",
      "Vibraphone",
      "Vinyl Crackle"
    ],
    "description": "Lofi nostalgic stroll through countless photo booth strips, selfies, and shared coffee runs.",
    "relationshipTags": [
      "best-friend",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      55,
      70,
      80,
      75,
      75,
      80,
      80,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 108,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.08
    }
  },
  {
    "id": "unbreakable-bond-rock",
    "title": "Unbreakable Bond",
    "category": "best-friend",
    "mood": "Energetic",
    "style": "party",
    "bpm": 124,
    "duration": "2:42",
    "instruments": [
      "Electric Guitars",
      "Driving Bass",
      "Full Rock Kit"
    ],
    "description": "Uplifting indie-rock anthem celebrating friends who became real family.",
    "relationshipTags": [
      "best-friend",
      "brother",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      75,
      90,
      95,
      90,
      95,
      95,
      90,
      80,
      65,
      45,
      35
    ],
    "synthPreset": {
      "style": "party",
      "bpm": 124,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.24
    }
  },
  {
    "id": "rainbow-candy-carousel",
    "title": "Rainbow Candy Carousel",
    "category": "kids",
    "mood": "Playful",
    "style": "kids",
    "bpm": 126,
    "duration": "2:05",
    "instruments": [
      "Toy Glockenspiel",
      "Xylophone",
      "Tubular Bells",
      "Pizzicato Strings"
    ],
    "description": "Bright, colorful carnival of sugary sounds with bouncy xylophones and cheerful toy bells.",
    "relationshipTags": [
      "kids",
      "baby",
      "sister",
      "brother"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      95,
      85,
      90,
      95,
      90,
      80,
      60,
      40,
      30
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 126,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.26
    }
  },
  {
    "id": "dino-stomp-birthday-party",
    "title": "Dino Stomp Birthday Party",
    "category": "kids",
    "mood": "Playful",
    "style": "kids",
    "bpm": 116,
    "duration": "2:15",
    "instruments": [
      "Heavy Tuba",
      "Woodblocks",
      "Funny Horns",
      "Stomp Percussion"
    ],
    "description": "Stomp your prehistoric feet to funny dinosaur brass beats and roaring birthday fun!",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      90,
      95,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 116,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.16
    }
  },
  {
    "id": "princess-fairytale-glitter",
    "title": "Princess Fairytale Castle",
    "category": "kids",
    "mood": "Cute",
    "style": "kids",
    "bpm": 102,
    "duration": "2:25",
    "instruments": [
      "Harp Glissando",
      "Celesta",
      "Magical Flutes",
      "Chimes"
    ],
    "description": "Enchanted kingdom fairytale waltz with magical chimes and royal tiara sparkle.",
    "relationshipTags": [
      "kids",
      "sister"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      30,
      55,
      75,
      85,
      80,
      75,
      85,
      90,
      75,
      55,
      35,
      20
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 102,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.02
    }
  },
  {
    "id": "space-rocket-countdown",
    "title": "Space Rocket Birthday Blast",
    "category": "kids",
    "mood": "Energetic",
    "style": "kids",
    "bpm": 130,
    "duration": "2:10",
    "instruments": [
      "Space Beeps",
      "Synth Leads",
      "Futuristic Drums"
    ],
    "description": "3, 2, 1, BLASTOFF! A cosmic galactic adventure rocket ship ride through starry skies.",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      80,
      95,
      100,
      90,
      95,
      100,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 130,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.3
    }
  },
  {
    "id": "tiny-teddy-bear-picnic",
    "title": "Tiny Teddy Bear Picnic",
    "category": "kids",
    "mood": "Cute",
    "style": "kids",
    "bpm": 108,
    "duration": "2:00",
    "instruments": [
      "Pizzicato Cello",
      "Clarinet",
      "Toy Piano"
    ],
    "description": "Gentle, heartwarming march for toddlers and teddy bears having tea and birthday cake.",
    "relationshipTags": [
      "kids",
      "baby"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      80,
      75,
      70,
      80,
      80,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 108,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.08
    }
  },
  {
    "id": "superhero-birthday-save-day",
    "title": "Superhero Birthday Rescue",
    "category": "kids",
    "mood": "Epic",
    "style": "kids",
    "bpm": 132,
    "duration": "2:20",
    "instruments": [
      "Heroic Trumpets",
      "Cinematic Drums",
      "Action Strings"
    ],
    "description": "Cape fluttering in the wind, saving the city just in time for cake and presents!",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      55,
      80,
      95,
      100,
      95,
      100,
      95,
      100,
      90,
      75,
      55,
      40
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 132,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.32
    }
  },
  {
    "id": "puppy-paws-and-balloons",
    "title": "Puppy Paws & Balloons",
    "category": "kids",
    "mood": "Playful",
    "style": "kids",
    "bpm": 124,
    "duration": "2:08",
    "instruments": [
      "Marimba",
      "Boing FX",
      "Whistle",
      "Snare"
    ],
    "description": "Cute puppies chasing bouncing balloons across the living room with joyous yips and bounces.",
    "relationshipTags": [
      "kids",
      "sister",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      90,
      85,
      85,
      90,
      95,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 124,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.24
    }
  },
  {
    "id": "magic-bubble-pop-parade",
    "title": "Magic Bubble Pop Parade",
    "category": "kids",
    "mood": "Cute",
    "style": "kids",
    "bpm": 118,
    "duration": "2:12",
    "instruments": [
      "Water Drop Plucks",
      "Glockenspiel",
      "Light Kick"
    ],
    "description": "Iridescent soap bubbles floating up into the sky and popping with sweet musical notes.",
    "relationshipTags": [
      "kids",
      "baby"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      85,
      80,
      75,
      80,
      85,
      70,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 118,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.18
    }
  },
  {
    "id": "jungle-safari-celebration",
    "title": "Jungle Safari Birthday",
    "category": "kids",
    "mood": "Playful",
    "style": "kids",
    "bpm": 120,
    "duration": "2:18",
    "instruments": [
      "Bongo Drums",
      "Marimba",
      "Bird Whistles",
      "Flute"
    ],
    "description": "Lions, monkeys, and giraffes joining together for the ultimate jungle birthday expedition.",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      90,
      85,
      80,
      85,
      90,
      75,
      60,
      45,
      30
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 120,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.2
    }
  },
  {
    "id": "little-star-wishing-well",
    "title": "Little Star Wishing Well",
    "category": "kids",
    "mood": "Cute",
    "style": "music-box",
    "bpm": 90,
    "duration": "2:35",
    "instruments": [
      "Twinkling Chimes",
      "Warm Harp",
      "Soft Flute"
    ],
    "description": "Sweet lullaby-style arrangement weaving \"Twinkle Twinkle Little Star\" into birthday wishes.",
    "relationshipTags": [
      "baby",
      "kids"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      75,
      70,
      65,
      75,
      80,
      65,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "music-box",
      "bpm": 90,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.9
    }
  },
  {
    "id": "clown-carnival-laughter",
    "title": "Carnival Chuckles & Cake",
    "category": "kids",
    "mood": "Funny",
    "style": "kids",
    "bpm": 128,
    "duration": "2:04",
    "instruments": [
      "Slide Whistle",
      "Kazoos",
      "Accordion",
      "Snare"
    ],
    "description": "Silly cartoon slapstick sounds, comical slides, and bouncy carnival accordion music.",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      90,
      95,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      35
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 128,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.28
    }
  },
  {
    "id": "pirate-treasure-island",
    "title": "Pirate Birthday Treasure",
    "category": "kids",
    "mood": "Playful",
    "style": "kids",
    "bpm": 122,
    "duration": "2:16",
    "instruments": [
      "Sea Shanty Accordion",
      "Fiddle",
      "Tambourine"
    ],
    "description": "Yo-ho-ho! Sailing the seven seas to find the legendary hidden chest of birthday presents!",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      90,
      85,
      85,
      90,
      95,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 122,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.22
    }
  },
  {
    "id": "fairy-garden-hide-and-seek",
    "title": "Fairy Garden Hide & Seek",
    "category": "kids",
    "mood": "Cute",
    "style": "kids",
    "bpm": 104,
    "duration": "2:22",
    "instruments": [
      "Pizzicato Strings",
      "Piccolo",
      "Celesta"
    ],
    "description": "Tiny woodland fairies playing beneath clover blossoms and delivering birthday sprinkles.",
    "relationshipTags": [
      "kids",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      80,
      75,
      75,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 104,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.04
    }
  },
  {
    "id": "monster-mash-birthday-bash",
    "title": "Cute Monster Birthday Bash",
    "category": "kids",
    "mood": "Funny",
    "style": "kids",
    "bpm": 124,
    "duration": "2:10",
    "instruments": [
      "Funny Synth Bass",
      "Cowbell",
      "Playful Organ"
    ],
    "description": "Friendly, furry monsters having a silly dance-off in celebration of your special day.",
    "relationshipTags": [
      "kids",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      95,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 124,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.24
    }
  },
  {
    "id": "happy-sunshine-singalong",
    "title": "Happy Sunshine Singalong",
    "category": "kids",
    "mood": "Happy",
    "style": "kids",
    "bpm": 114,
    "duration": "2:06",
    "instruments": [
      "Ukulele",
      "Children Choir Chimes",
      "Hand Claps"
    ],
    "description": "Wholesome, smiling morning singalong celebrating another bright, wonderful year of growth.",
    "relationshipTags": [
      "kids",
      "baby",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      85,
      80,
      80,
      85,
      90,
      75,
      60,
      40,
      25
    ],
    "synthPreset": {
      "style": "kids",
      "bpm": 114,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.14
    }
  },
  {
    "id": "cinematic-birthday-reveal",
    "title": "Cinematic Birthday Reveal",
    "category": "cinematic",
    "mood": "Cinematic",
    "style": "cinematic",
    "bpm": 96,
    "duration": "3:05",
    "instruments": [
      "Deep Cinema Braams",
      "Solo Cello",
      "Rising Orchestral Strings"
    ],
    "description": "Hollywood trailer-style atmospheric reveal building to a majestic and moving birthday crescendo.",
    "relationshipTags": [
      "husband",
      "mentor",
      "dad",
      "boss"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      85,
      85,
      90,
      95,
      100,
      85,
      65,
      45,
      25
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 96,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.96
    }
  },
  {
    "id": "interstellar-birthday-dream",
    "title": "Interstellar Birthday Dream",
    "category": "cinematic",
    "mood": "Epic",
    "style": "cinematic",
    "bpm": 92,
    "duration": "3:30",
    "instruments": [
      "Church Organ",
      "Analog Arpeggiator",
      "Lush Symphony"
    ],
    "description": "Hans Zimmer-inspired cosmic wonder celebrating the singular miracle of human life in the cosmos.",
    "relationshipTags": [
      "partner",
      "brother",
      "mentor"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      95,
      90,
      95,
      100,
      100,
      85,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 92,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.92
    }
  },
  {
    "id": "epic-hero-journey",
    "title": "The Hero’s Milestone Journey",
    "category": "cinematic",
    "mood": "Epic",
    "style": "cinematic",
    "bpm": 110,
    "duration": "3:15",
    "instruments": [
      "Taiko Drums",
      "French Horn Melodies",
      "Full Choir"
    ],
    "description": "Resounding orchestral victory march honoring triumphs, wisdom gained, and new frontiers.",
    "relationshipTags": [
      "dad",
      "brother",
      "boss",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      100,
      95,
      95,
      100,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 110,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.1
    }
  },
  {
    "id": "golden-dawn-piano-ambient",
    "title": "Golden Dawn Ambient Symphony",
    "category": "cinematic",
    "mood": "Calm",
    "style": "cinematic",
    "bpm": 84,
    "duration": "3:12",
    "instruments": [
      "Echoing Piano",
      "Warm Shimmer Reverb",
      "Soft Cello"
    ],
    "description": "Serene sunrise over mountain peaks, filling your birthday morning with peaceful reverence.",
    "relationshipTags": [
      "mom",
      "family",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      40,
      60,
      75,
      75,
      70,
      80,
      85,
      70,
      50,
      30,
      20
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 84,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.84
    }
  },
  {
    "id": "future-bass-celebration",
    "title": "Future Bass Glow",
    "category": "cinematic",
    "mood": "Energetic",
    "style": "cinematic",
    "bpm": 130,
    "duration": "2:50",
    "instruments": [
      "Detuned Saw Chords",
      "Vocal Chops",
      "Sub Bass"
    ],
    "description": "Euphoric modern electronic anthem with lush sweeping synth chords and uplifting festival energy.",
    "relationshipTags": [
      "teen",
      "best-friend",
      "sister",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      95,
      100,
      90,
      95,
      100,
      95,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 130,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.3
    }
  },
  {
    "id": "celestial-starlight-waltz",
    "title": "Celestial Starlight Waltz",
    "category": "cinematic",
    "mood": "Cinematic",
    "style": "orchestral",
    "bpm": 108,
    "duration": "3:00",
    "instruments": [
      "Orchestral Harp",
      "Glockenspiel",
      "Symphonic Strings"
    ],
    "description": "Soaring through constellations in a dreamlike 3/4 dance of celestial wonder.",
    "relationshipTags": [
      "wife",
      "partner",
      "daughter",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      55,
      75,
      85,
      80,
      80,
      85,
      90,
      75,
      55,
      35,
      25
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 108,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.08
    }
  },
  {
    "id": "neon-city-horizon-pulse",
    "title": "Neon Horizon Pulse",
    "category": "cinematic",
    "mood": "Modern",
    "style": "cinematic",
    "bpm": 118,
    "duration": "3:08",
    "instruments": [
      "Synth Wave Bass",
      "Vangelis Brass",
      "Arp 80s"
    ],
    "description": "Blade Runner-esque atmospheric synthwave driving along glowing nocturnal boulevards.",
    "relationshipTags": [
      "brother",
      "best-friend",
      "teen"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      90,
      85,
      90,
      95,
      90,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 118,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.18
    }
  },
  {
    "id": "soaring-hopes-and-dreams",
    "title": "Soaring Hopes & Dreams",
    "category": "cinematic",
    "mood": "Joyful",
    "style": "cinematic",
    "bpm": 104,
    "duration": "3:02",
    "instruments": [
      "Piano Arpeggios",
      "String Swells",
      "Light Timpani"
    ],
    "description": "Heart-swelling inspirational theme soundtracking the courage to pursue your highest ambitions.",
    "relationshipTags": [
      "sister",
      "daughter",
      "son",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      90,
      85,
      85,
      95,
      95,
      80,
      60,
      40,
      25
    ],
    "synthPreset": {
      "style": "cinematic",
      "bpm": 104,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.04
    }
  },
  {
    "id": "minimalist-modern-piano-echo",
    "title": "Minimalist Glass Reflections",
    "category": "cinematic",
    "mood": "Calm",
    "style": "piano",
    "bpm": 88,
    "duration": "2:55",
    "instruments": [
      "Steinway Piano",
      "Analog Delay",
      "Subtle Noise"
    ],
    "description": "Max Richter-style repetitive delicate motifs offering meditative luxury and refined depth.",
    "relationshipTags": [
      "boss",
      "mentor",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      35,
      55,
      70,
      70,
      65,
      70,
      75,
      65,
      45,
      30,
      15
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 88,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "triumphant-new-chapter",
    "title": "Triumphant New Chapter",
    "category": "cinematic",
    "mood": "Epic",
    "style": "orchestral",
    "bpm": 114,
    "duration": "3:20",
    "instruments": [
      "Trumpet Solo",
      "Snare Roll",
      "Full Orchestra"
    ],
    "description": "Grand symphonic coronation marking the opening page of a magnificent new year of life.",
    "relationshipTags": [
      "dad",
      "mentor",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      95,
      90,
      95,
      100,
      95,
      85,
      70,
      50,
      30
    ],
    "synthPreset": {
      "style": "orchestral",
      "bpm": 114,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.14
    }
  },
  {
    "id": "lofi-birthday-coffee-chill",
    "title": "Lofi Birthday Coffee Chill",
    "category": "chill",
    "mood": "Calm",
    "style": "chill",
    "bpm": 78,
    "duration": "2:40",
    "instruments": [
      "Rhodes Piano",
      "Vinyl Crackle",
      "Dusty Drums",
      "Upright Bass"
    ],
    "description": "Warm tape saturation, crackling vinyl, and relaxed jazz chords for a cozy birthday morning.",
    "relationshipTags": [
      "best-friend",
      "teen",
      "sister",
      "brother"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      65,
      75,
      70,
      70,
      75,
      80,
      70,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 78,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.78
    }
  },
  {
    "id": "cozy-candle-glow-ambient",
    "title": "Cozy Candle Glow",
    "category": "chill",
    "mood": "Calm",
    "style": "chill",
    "bpm": 72,
    "duration": "3:10",
    "instruments": [
      "Warm Drone Pad",
      "Acoustic Guitar Harmonics",
      "Soft Shaker"
    ],
    "description": "Peaceful twilight contemplation bathed in the warm amber flicker of birthday candles.",
    "relationshipTags": [
      "mom",
      "family",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      35,
      50,
      65,
      65,
      60,
      70,
      75,
      60,
      45,
      30,
      15
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 72,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.72
    }
  },
  {
    "id": "sunset-lounge-cocktails",
    "title": "Sunset Lounge Cocktails",
    "category": "chill",
    "mood": "Relaxed",
    "style": "chill",
    "bpm": 88,
    "duration": "3:05",
    "instruments": [
      "Electric Piano",
      "Muted Guitar",
      "Latin Shakers"
    ],
    "description": "Balearic seaside lounge vibes with refreshing breeze, sunset views, and birthday spritzes.",
    "relationshipTags": [
      "partner",
      "wife",
      "husband",
      "best-friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      80,
      75,
      75,
      80,
      85,
      70,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 88,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "midnight-meditation-drift",
    "title": "Midnight Birthday Drift",
    "category": "chill",
    "mood": "Calm",
    "style": "chill",
    "bpm": 65,
    "duration": "3:30",
    "instruments": [
      "Tibetan Bell Chimes",
      "Bowed Glass",
      "Sub Bass"
    ],
    "description": "Deep restorative ambient soundscape for quiet reflection, gratitude, and peaceful dreams.",
    "relationshipTags": [
      "mom",
      "grandma",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      15,
      30,
      45,
      60,
      60,
      55,
      65,
      70,
      55,
      40,
      25,
      15
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 65,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.65
    }
  },
  {
    "id": "garden-hammock-breeze",
    "title": "Garden Hammock Breeze",
    "category": "chill",
    "mood": "Relaxed",
    "style": "acoustic",
    "bpm": 84,
    "duration": "2:45",
    "instruments": [
      "Nylon Guitar",
      "Bird Song Ambiance",
      "Soft Percussion"
    ],
    "description": "Swinging under green garden branches on a lazy, sunny birthday afternoon.",
    "relationshipTags": [
      "mom",
      "dad",
      "grandpa",
      "grandma"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      75,
      70,
      70,
      75,
      80,
      65,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 84,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.84
    }
  },
  {
    "id": "rainy-window-birthday-tea",
    "title": "Rainy Window Birthday Tea",
    "category": "chill",
    "mood": "Nostalgic",
    "style": "chill",
    "bpm": 76,
    "duration": "2:50",
    "instruments": [
      "Soft Piano",
      "Raindrop Samples",
      "Warm Rhodes"
    ],
    "description": "Sipping hot tea indoors wrapped in a blanket while rain taps rhythmically on the glass.",
    "relationshipTags": [
      "sister",
      "best-friend",
      "mom"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      60,
      70,
      70,
      65,
      70,
      75,
      65,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 76,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.76
    }
  },
  {
    "id": "whispering-pines-cabin",
    "title": "Whispering Pines Cabin",
    "category": "chill",
    "mood": "Calm",
    "style": "acoustic",
    "bpm": 82,
    "duration": "3:00",
    "instruments": [
      "Fingerpicked Banjo",
      "Acoustic Guitar",
      "Warm Bass"
    ],
    "description": "Mountain cabin serenity surrounded by towering pine trees and woodstove warmth.",
    "relationshipTags": [
      "dad",
      "brother",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      50,
      65,
      80,
      75,
      70,
      75,
      80,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 82,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.82
    }
  },
  {
    "id": "velvet-starscape-lull",
    "title": "Velvet Starscape Lull",
    "category": "chill",
    "mood": "Calm",
    "style": "chill",
    "bpm": 70,
    "duration": "3:20",
    "instruments": [
      "Analog Pad",
      "Harp Harmonics",
      "Soft Kick"
    ],
    "description": "Gazing into a starry desert night sky wrapped in wonder and deep appreciation.",
    "relationshipTags": [
      "partner",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      20,
      35,
      50,
      65,
      65,
      60,
      70,
      75,
      60,
      45,
      30,
      15
    ],
    "synthPreset": {
      "style": "chill",
      "bpm": 70,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.7
    }
  },
  {
    "id": "coffee-and-croissant-morning",
    "title": "Birthday Morning Café",
    "category": "chill",
    "mood": "Relaxed",
    "style": "jazz",
    "bpm": 94,
    "duration": "2:38",
    "instruments": [
      "Accordion",
      "Nylon Guitar",
      "Upright Bass"
    ],
    "description": "A charming morning walk through cobblestone streets to your favorite French bakery.",
    "relationshipTags": [
      "best-friend",
      "sister",
      "mom"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      30,
      50,
      70,
      80,
      75,
      75,
      80,
      85,
      70,
      50,
      35,
      25
    ],
    "synthPreset": {
      "style": "jazz",
      "bpm": 94,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.94
    }
  },
  {
    "id": "peaceful-solitude-gratitude",
    "title": "Peaceful Solitude & Gratitude",
    "category": "chill",
    "mood": "Calm",
    "style": "piano",
    "bpm": 72,
    "duration": "3:15",
    "instruments": [
      "Solo Felt Piano",
      "Quiet Tape Hum"
    ],
    "description": "A quiet, private breath to smile, blow out your mental candles, and embrace the future.",
    "relationshipTags": [
      "self",
      "mentor",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      15,
      30,
      45,
      60,
      60,
      55,
      65,
      70,
      55,
      40,
      25,
      15
    ],
    "synthPreset": {
      "style": "piano",
      "bpm": 72,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.72
    }
  },
  {
    "id": "breezy-acoustic-sunshine",
    "title": "Breezy Acoustic Sunshine",
    "category": "instrumental",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 112,
    "duration": "2:35",
    "instruments": [
      "Dual Steel Guitars",
      "Tambourine",
      "Bass"
    ],
    "description": "Sunny morning fingerpicking with positive acoustic momentum and crisp guitar chime.",
    "relationshipTags": [
      "family",
      "sister",
      "brother",
      "best-friend"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      35,
      60,
      80,
      90,
      85,
      80,
      85,
      90,
      75,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 112,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.12
    }
  },
  {
    "id": "spanish-flamenco-fiesta",
    "title": "Flamenco Birthday Fiesta",
    "category": "instrumental",
    "mood": "Energetic",
    "style": "acoustic",
    "bpm": 128,
    "duration": "2:25",
    "instruments": [
      "Flamenco Guitar",
      "Castanets",
      "Palmas Claps",
      "Cajon"
    ],
    "description": "Passionate Andalusian acoustic celebration with fiery rasgueados and rhythmic handclaps.",
    "relationshipTags": [
      "best-friend",
      "brother",
      "dad"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      90,
      95,
      90,
      95,
      95,
      90,
      80,
      65,
      45,
      35
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 128,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.28
    }
  },
  {
    "id": "celtic-meadow-jubilee",
    "title": "Celtic Meadow Jubilee",
    "category": "instrumental",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 116,
    "duration": "2:40",
    "instruments": [
      "Tin Whistle",
      "Celtic Fiddle",
      "Bodhran",
      "Acoustic Guitar"
    ],
    "description": "Lively Irish reel dancing across emerald hills in spirited celebration of life and kinship.",
    "relationshipTags": [
      "family",
      "brother",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      90,
      85,
      85,
      90,
      95,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 116,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.16
    }
  },
  {
    "id": "bossa-nova-birthday-breeze",
    "title": "Bossa Nova Birthday Breeze",
    "category": "instrumental",
    "mood": "Relaxed",
    "style": "jazz",
    "bpm": 110,
    "duration": "2:50",
    "instruments": [
      "Nylon Guitar",
      "Flute Solo",
      "Shaker",
      "Bossa Bass"
    ],
    "description": "Ipanema beach warmth with effortless syncopated guitar rhythms and breezy flutes.",
    "relationshipTags": [
      "partner",
      "dad",
      "mom",
      "friend"
    ],
    "isFeatured": true,
    "audioUrl": "",
    "waveform": [
      35,
      55,
      75,
      85,
      80,
      75,
      80,
      85,
      70,
      55,
      40,
      25
    ],
    "synthPreset": {
      "style": "jazz",
      "bpm": 110,
      "baseFreq": 361.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.1
    }
  },
  {
    "id": "gypsy-jazz-swing-birthday",
    "title": "Gypsy Jazz Birthday Swing",
    "category": "instrumental",
    "mood": "Fun",
    "style": "jazz",
    "bpm": 134,
    "duration": "2:20",
    "instruments": [
      "Manouche Guitar",
      "Swing Violin",
      "Upright Bass"
    ],
    "description": "Django Reinhardt-inspired Parisian gypsy swing with virtuosic acoustic guitar pyrotechnics.",
    "relationshipTags": [
      "best-friend",
      "dad",
      "brother"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      50,
      75,
      90,
      95,
      90,
      95,
      95,
      90,
      85,
      70,
      50,
      35
    ],
    "synthPreset": {
      "style": "jazz",
      "bpm": 134,
      "baseFreq": 381.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.34
    }
  },
  {
    "id": "hawaiian-slack-key-melody",
    "title": "Hawaiian Slack Key Birthday",
    "category": "instrumental",
    "mood": "Calm",
    "style": "acoustic",
    "bpm": 94,
    "duration": "2:45",
    "instruments": [
      "Open-Tuned Guitar",
      "Ukulele",
      "Ocean Waves"
    ],
    "description": "Peaceful Aloha spirit resonating through gentle open-tuned guitar hammer-ons and pull-offs.",
    "relationshipTags": [
      "mom",
      "grandpa",
      "grandma",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      75,
      70,
      70,
      75,
      80,
      65,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 94,
      "baseFreq": 261.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.94
    }
  },
  {
    "id": "acoustic-country-hodown",
    "title": "Country Porch Birthday Jam",
    "category": "instrumental",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 120,
    "duration": "2:30",
    "instruments": [
      "Resonator Guitar",
      "Banjo",
      "Washboard",
      "Bass"
    ],
    "description": "Foot-tapping front porch country jamboree packed with down-home hospitality and smile.",
    "relationshipTags": [
      "dad",
      "brother",
      "family"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      45,
      70,
      85,
      95,
      85,
      90,
      90,
      95,
      80,
      65,
      45,
      30
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 120,
      "baseFreq": 281.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.2
    }
  },
  {
    "id": "fingerstyle-lullaby-waltz",
    "title": "Fingerstyle Birthday Lullaby",
    "category": "instrumental",
    "mood": "Nostalgic",
    "style": "acoustic",
    "bpm": 90,
    "duration": "2:48",
    "instruments": [
      "Solo Steel-String Guitar"
    ],
    "description": "Intimate solo guitar piece weaving intricate harmonics and heartfelt emotional melodies.",
    "relationshipTags": [
      "daughter",
      "sister",
      "mom",
      "partner"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      45,
      65,
      75,
      70,
      65,
      75,
      80,
      65,
      45,
      30,
      20
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 90,
      "baseFreq": 301.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.9
    }
  },
  {
    "id": "harp-and-flute-garden",
    "title": "Harp & Flute Garden Sonata",
    "category": "instrumental",
    "mood": "Elegant",
    "style": "classical",
    "bpm": 88,
    "duration": "3:00",
    "instruments": [
      "Concert Harp",
      "Silver Flute"
    ],
    "description": "Lyrical botanical duet floating gently over rose gardens and sparkling fountains.",
    "relationshipTags": [
      "mom",
      "grandma",
      "sister"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      25,
      50,
      70,
      80,
      75,
      70,
      80,
      85,
      70,
      50,
      35,
      20
    ],
    "synthPreset": {
      "style": "classical",
      "bpm": 88,
      "baseFreq": 321.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 0.88
    }
  },
  {
    "id": "joyful-mandolin-serenade",
    "title": "Joyful Mandolin Serenade",
    "category": "instrumental",
    "mood": "Joyful",
    "style": "acoustic",
    "bpm": 114,
    "duration": "2:22",
    "instruments": [
      "Mandolin Tremolo",
      "Acoustic Guitar",
      "Accordion"
    ],
    "description": "Italian village festive tremolo mandolin celebrating good wine, good food, and happy years.",
    "relationshipTags": [
      "family",
      "dad",
      "friend"
    ],
    "isFeatured": false,
    "audioUrl": "",
    "waveform": [
      40,
      65,
      85,
      90,
      85,
      80,
      85,
      90,
      75,
      60,
      45,
      30
    ],
    "synthPreset": {
      "style": "acoustic",
      "bpm": 114,
      "baseFreq": 341.63,
      "harmonyType": "chill-lofi",
      "speedMultiplier": 1.14
    }
  }
];
