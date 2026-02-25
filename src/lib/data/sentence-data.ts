/**
 * Vaakya (ವಾಕ್ಯ) — Pattern Internalization Engine
 *
 * Research Foundation:
 * - Krashen's i+1 Comprehensible Input Hypothesis
 * - Sweller's Cognitive Load Theory (color-coded grammar roles)
 * - Vygotsky's Scaffolding (progressive transliteration fade)
 * - Schmidt's Noticing Hypothesis (contrast mode)
 * - Input Flood (pattern-clustered repetition)
 *
 * Architecture: Sentences are grouped by PATTERN CLUSTERS, not topics.
 * The user internalizes patterns subconsciously via repeated exposure.
 */

// ─── TYPES ──────────────────────────────────────────────────────
export type GrammarRole =
  | "subject"
  | "object"
  | "verb"
  | "postposition"
  | "adjective"
  | "question"
  | "connector"
  | "auxiliary";

export interface SentencePart {
  en: string;
  hi: string;
  kn: string;
  transliteration: string;
  role: GrammarRole;
}

export interface DistractorTile {
  kn: string;
  transliteration: string;
  reason: string; // Why it's wrong: "wrong-tense", "wrong-case", "wrong-subject"
}

export interface MicroDialogue {
  speakerLabel: string; // "Auto Driver", "Waiter", "Friend"
  speakerLine: SentencePart[];
  userLine: SentencePart[];
}

export interface MicroReflection {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Sentence {
  id: string;
  parts: SentencePart[];
  level: 1 | 2 | 3 | 4 | 5;
  patternTag: string; // "identity-be", "SOV-present", "dative-ge", "progressive", "polite-form"
  category: "daily" | "transport" | "food" | "work" | "social" | "market";
  context: string; // Bangalore life context
  tip?: string; // Optional learning insight
  distractors?: DistractorTile[]; // For Build mode
  dialogue?: MicroDialogue; // Every ~5th sentence has a mini exchange
}

// ─── GRAMMAR ROLE COLOR MAP ─────────────────────────────────────
export const ROLE_COLORS: Record<
  GrammarRole,
  { text: string; bg: string; label: string }
> = {
  subject: { text: "text-indigo", bg: "bg-indigo/10", label: "Who?" },
  object: { text: "text-terracotta", bg: "bg-terracotta/10", label: "What?" },
  verb: { text: "text-emerald-600", bg: "bg-emerald-50", label: "Action" },
  postposition: { text: "text-blue-500", bg: "bg-blue-50", label: "Where/To" },
  adjective: { text: "text-amber-600", bg: "bg-amber-50", label: "Describes" },
  question: { text: "text-pink-500", bg: "bg-pink-50", label: "Asks" },
  connector: { text: "text-violet-500", bg: "bg-violet-50", label: "Joins" },
  auxiliary: { text: "text-slate-500", bg: "bg-slate-50", label: "Helper" },
};

// ─── LEVEL METADATA ─────────────────────────────────────────────
export const LEVELS = [
  {
    level: 1 as const,
    title: "Identity & State",
    titleKn: "ಗುರುತು",
    description: "Self-reference builds retention. Say who you are.",
    pattern: "Subject + 'to be'",
    icon: "🪞",
  },
  {
    level: 2 as const,
    title: "Habitual Present",
    titleKn: "ಅಭ್ಯಾಸ",
    description: "Lock in the SOV reflex. What you do every day.",
    pattern: "S + O + V (present habitual)",
    icon: "🔁",
  },
  {
    level: 3 as const,
    title: "Continuous Action",
    titleKn: "ಮುಂದುವರಿಕೆ",
    description: "The Kannada progressive. Hindi helps massively here.",
    pattern: "S + V (progressive tense)",
    icon: "⏳",
  },
  {
    level: 4 as const,
    title: "Case Markers",
    titleKn: "ವಿಭಕ್ತಿ",
    description: "The real Kannada engine: -ge, -annu, -inda.",
    pattern: "S + O + case marker + V",
    icon: "🔧",
  },
  {
    level: 5 as const,
    title: "Social Kannada",
    titleKn: "ನಮ್ಮ ಮಾತು",
    description: "Politeness levels. Tu vs Tum vs Aap — in Kannada.",
    pattern: "Formal vs Informal registers",
    icon: "🤝",
  },
];

// ─── MICRO-REFLECTIONS ──────────────────────────────────────────
export const REFLECTIONS: Record<number, MicroReflection[]> = {
  1: [
    {
      question: "In Kannada, what comes at the end of a sentence?",
      options: ["Subject", "Object", "Verb"],
      correctIndex: 2,
    },
    {
      question: "'ನಾನು' (Naanu) means...",
      options: ["You", "I/Me", "He"],
      correctIndex: 1,
    },
  ],
  2: [
    {
      question: "In 'Naanu kaapi kudiyuttene', who is doing the action?",
      options: ["Coffee", "I (Naanu)", "The cup"],
      correctIndex: 1,
    },
    {
      question: "Kannada follows which word order?",
      options: ["SVO (like English)", "SOV (like Hindi)", "VSO (like Arabic)"],
      correctIndex: 1,
    },
  ],
  3: [
    {
      question: "'-uttiddene' at the end of a verb means...",
      options: ["I did it", "I am doing it (right now)", "I will do it"],
      correctIndex: 1,
    },
  ],
  4: [
    {
      question: "'-ge' at the end of a word means...",
      options: ["from", "to / for", "with"],
      correctIndex: 1,
    },
    {
      question: "'-annu' marks the...",
      options: ["Subject (doer)", "Object (thing acted upon)", "Place"],
      correctIndex: 1,
    },
    {
      question: "'-inda' means...",
      options: ["to", "from / by", "in"],
      correctIndex: 1,
    },
  ],
  5: [
    {
      question: "'Neevu' is used for...",
      options: ["Informal (friends)", "Formal/Respectful", "Children"],
      correctIndex: 1,
    },
  ],
};

// ─── SCAFFOLDING CONFIG ─────────────────────────────────────────
export const SCAFFOLDING_BY_LEVEL: Record<
  number,
  {
    showEnglish: boolean;
    englishOpacity: number;
    showHindi: boolean;
    hindiOptional: boolean;
    showTransliteration: boolean;
    kannadaDominant: boolean;
  }
> = {
  1: {
    showEnglish: true,
    englishOpacity: 1,
    showHindi: true,
    hindiOptional: false,
    showTransliteration: true,
    kannadaDominant: false,
  },
  2: {
    showEnglish: true,
    englishOpacity: 1,
    showHindi: true,
    hindiOptional: false,
    showTransliteration: true,
    kannadaDominant: false,
  },
  3: {
    showEnglish: true,
    englishOpacity: 0.6,
    showHindi: true,
    hindiOptional: true,
    showTransliteration: true,
    kannadaDominant: true,
  },
  4: {
    showEnglish: true,
    englishOpacity: 0.4,
    showHindi: true,
    hindiOptional: true,
    showTransliteration: true,
    kannadaDominant: true,
  },
  5: {
    showEnglish: true,
    englishOpacity: 0.3,
    showHindi: false,
    hindiOptional: true,
    showTransliteration: false,
    kannadaDominant: true,
  },
};

// ─── SENTENCE DATA (PATTERN-CLUSTERED) ──────────────────────────

export const SENTENCES: Sentence[] = [
  // ═══════════════════════════════════════════════════════════════
  // LEVEL 1: IDENTITY & STATE — "I am ___"
  // Pattern cluster: Subject + "to be" (iru/aagiddeene)
  // ═══════════════════════════════════════════════════════════════

  // Cluster 1A: "I am [name]"
  {
    id: "L1-01",
    level: 1,
    patternTag: "identity-be",
    category: "social",
    context: "Introducing yourself at a new Bangalore office.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "Ashu",
        hi: "आशु",
        kn: "ಆಶು",
        transliteration: "Aashu",
        role: "object",
      },
    ],
    tip: "In Kannada, 'I am [name]' doesn't need a verb — just say 'Naanu [name]'!",
  },
  {
    id: "L1-02",
    level: 1,
    patternTag: "identity-be",
    category: "social",
    context: "Meeting your neighbor in the apartment.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "new",
        hi: "नया",
        kn: "ಹೊಸ",
        transliteration: "hosa",
        role: "adjective",
      },
      {
        en: "here",
        hi: "यहाँ",
        kn: "ಇಲ್ಲಿ",
        transliteration: "illi",
        role: "postposition",
      },
    ],
    tip: "Adjectives come before the noun they describe, just like Hindi!",
  },
  {
    id: "L1-03",
    level: 1,
    patternTag: "identity-state",
    category: "daily",
    context: "Telling your roommate how you feel after a day at work.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "tired",
        hi: "थका हुआ",
        kn: "ಸುಸ್ತಾಗಿದ್ದೇನೆ",
        transliteration: "sustaagiddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L1-04",
    level: 1,
    patternTag: "identity-state",
    category: "daily",
    context: "Feeling happy after watching a Kannada movie.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "happy",
        hi: "खुश हूँ",
        kn: "ಸಂತೋಷವಾಗಿದ್ದೇನೆ",
        transliteration: "santoshavaagiddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L1-05",
    level: 1,
    patternTag: "identity-state",
    category: "daily",
    context: "Being hungry while walking through Malleshwaram market.",
    parts: [
      {
        en: "I",
        hi: "मुझे",
        kn: "ನನಗೆ",
        transliteration: "Nanage",
        role: "subject",
      },
      {
        en: "hungry",
        hi: "भूख लगी है",
        kn: "ಹಸಿವಾಗಿದೆ",
        transliteration: "hasivaaagide",
        role: "verb",
      },
    ],
    tip: "Hunger in Kannada happens TO you (nanage), not inside you. Same pattern as Hindi (mujhe bhookh)!",
    dialogue: {
      speakerLabel: "Friend",
      speakerLine: [
        {
          en: "Are you",
          hi: "क्या तुम",
          kn: "ನೀನು",
          transliteration: "Neenu",
          role: "subject",
        },
        {
          en: "hungry?",
          hi: "भूखे हो?",
          kn: "ಹಸಿವಾ?",
          transliteration: "hasivaa?",
          role: "verb",
        },
      ],
      userLine: [
        {
          en: "Yes,",
          hi: "हाँ,",
          kn: "ಹೌದು,",
          transliteration: "Haudu,",
          role: "connector",
        },
        {
          en: "I am",
          hi: "मुझे",
          kn: "ನನಗೆ",
          transliteration: "nanage",
          role: "subject",
        },
        {
          en: "very hungry",
          hi: "बहुत भूख है",
          kn: "ತುಂಬಾ ಹಸಿವಾಗಿದೆ",
          transliteration: "tumba hasivaaagide",
          role: "verb",
        },
      ],
    },
  },
  {
    id: "L1-06",
    level: 1,
    patternTag: "identity-location",
    category: "daily",
    context: "Calling home to say where you are.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "at home",
        hi: "घर पर",
        kn: "ಮನೆಯಲ್ಲಿ",
        transliteration: "maneyalli",
        role: "postposition",
      },
      {
        en: "am",
        hi: "हूँ",
        kn: "ಇದ್ದೇನೆ",
        transliteration: "iddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L1-07",
    level: 1,
    patternTag: "identity-location",
    category: "work",
    context: "Texting your friend from the office.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "at office",
        hi: "ऑफ़िस में",
        kn: "ಆಫೀಸಿನಲ್ಲಿ",
        transliteration: "aafeesinalli",
        role: "postposition",
      },
      {
        en: "am",
        hi: "हूँ",
        kn: "ಇದ್ದೇನೆ",
        transliteration: "iddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L1-08",
    level: 1,
    patternTag: "identity-location",
    category: "transport",
    context: "In an auto near Majestic.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "at Majestic",
        hi: "मेजेस्टिक पर",
        kn: "ಮೆಜೆಸ್ಟಿಕ್‌ನಲ್ಲಿ",
        transliteration: "Majestic-nalli",
        role: "postposition",
      },
      {
        en: "am",
        hi: "हूँ",
        kn: "ಇದ್ದೇನೆ",
        transliteration: "iddeene",
        role: "verb",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 2: HABITUAL PRESENT — "I [verb] [object]"
  // Pattern cluster: SOV reflex builder
  // ═══════════════════════════════════════════════════════════════

  // Cluster 2A: Daily habits
  {
    id: "L2-01",
    level: 2,
    patternTag: "SOV-present",
    category: "food",
    context: "Your morning ritual in Bangalore.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "coffee",
        hi: "कॉफ़ी",
        kn: "ಕಾಫಿ",
        transliteration: "kaafi",
        role: "object",
      },
      {
        en: "drink",
        hi: "पीता/पीती हूँ",
        kn: "ಕುಡಿಯುತ್ತೇನೆ",
        transliteration: "kudiyuttene",
        role: "verb",
      },
    ],
    distractors: [
      {
        kn: "ಕುಡಿಯುತ್ತಿದ್ದೇನೆ",
        transliteration: "kudiyuttiddeene",
        reason: "wrong-tense",
      },
      { kn: "ಕಾಫಿಗೆ", transliteration: "kaafige", reason: "wrong-case" },
    ],
    tip: "Notice: In Kannada, the verb always goes at the END. 'I coffee drink' — not 'I drink coffee'!",
  },
  {
    id: "L2-02",
    level: 2,
    patternTag: "SOV-present",
    category: "daily",
    context: "Your reading habit before sleep.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "books",
        hi: "किताबें",
        kn: "ಪುಸ್ತಕ",
        transliteration: "pustaka",
        role: "object",
      },
      {
        en: "read",
        hi: "पढ़ता/पढ़ती हूँ",
        kn: "ಓದುತ್ತೇನೆ",
        transliteration: "oduttene",
        role: "verb",
      },
    ],
  },
  {
    id: "L2-03",
    level: 2,
    patternTag: "SOV-present",
    category: "food",
    context: "Lunch time at the office canteen.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "rice",
        hi: "चावल",
        kn: "ಅನ್ನ",
        transliteration: "anna",
        role: "object",
      },
      {
        en: "eat",
        hi: "खाता/खाती हूँ",
        kn: "ತಿನ್ನುತ್ತೇನೆ",
        transliteration: "tinnuttene",
        role: "verb",
      },
    ],
  },
  {
    id: "L2-04",
    level: 2,
    patternTag: "SOV-present",
    category: "daily",
    context: "Your Kannada colleague at work.",
    parts: [
      {
        en: "He",
        hi: "वो",
        kn: "ಅವನು",
        transliteration: "Avanu",
        role: "subject",
      },
      {
        en: "Kannada",
        hi: "कन्नड़",
        kn: "ಕನ್ನಡ",
        transliteration: "Kannada",
        role: "object",
      },
      {
        en: "speaks",
        hi: "बोलता है",
        kn: "ಮಾತಾಡುತ್ತಾನೆ",
        transliteration: "maataaduttaane",
        role: "verb",
      },
    ],
  },
  {
    id: "L2-05",
    level: 2,
    patternTag: "SOV-present",
    category: "social",
    context: "Talking about your friend's habit.",
    parts: [
      {
        en: "She",
        hi: "वो",
        kn: "ಅವಳು",
        transliteration: "Avalu",
        role: "subject",
      },
      {
        en: "music",
        hi: "गाना",
        kn: "ಹಾಡು",
        transliteration: "haadu",
        role: "object",
      },
      {
        en: "listens",
        hi: "सुनती है",
        kn: "ಕೇಳುತ್ತಾಳೆ",
        transliteration: "keluttaale",
        role: "verb",
      },
    ],
    dialogue: {
      speakerLabel: "You",
      speakerLine: [
        {
          en: "What does",
          hi: "वो क्या",
          kn: "ಅವಳು ಏನು",
          transliteration: "Avalu eenu",
          role: "question",
        },
        {
          en: "she do?",
          hi: "करती है?",
          kn: "ಮಾಡುತ್ತಾಳೆ?",
          transliteration: "maaduttaale?",
          role: "verb",
        },
      ],
      userLine: [
        {
          en: "She",
          hi: "वो",
          kn: "ಅವಳು",
          transliteration: "Avalu",
          role: "subject",
        },
        {
          en: "music",
          hi: "गाना",
          kn: "ಹಾಡು",
          transliteration: "haadu",
          role: "object",
        },
        {
          en: "listens",
          hi: "सुनती है",
          kn: "ಕೇಳುತ್ತಾಳೆ",
          transliteration: "keluttaale",
          role: "verb",
        },
      ],
    },
  },
  {
    id: "L2-06",
    level: 2,
    patternTag: "SOV-present",
    category: "work",
    context: "Your daily work routine.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "work",
        hi: "काम",
        kn: "ಕೆಲಸ",
        transliteration: "kelasa",
        role: "object",
      },
      {
        en: "do",
        hi: "करता/करती हूँ",
        kn: "ಮಾಡುತ್ತೇನೆ",
        transliteration: "maaduttene",
        role: "verb",
      },
    ],
  },
  {
    id: "L2-07",
    level: 2,
    patternTag: "SOV-present",
    category: "daily",
    context: "Your morning exercise.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "water",
        hi: "पानी",
        kn: "ನೀರು",
        transliteration: "neeru",
        role: "object",
      },
      {
        en: "drink",
        hi: "पीता/पीती हूँ",
        kn: "ಕುಡಿಯುತ್ತೇನೆ",
        transliteration: "kudiyuttene",
        role: "verb",
      },
    ],
    distractors: [
      { kn: "ಕುಡಿದೆ", transliteration: "kudide", reason: "wrong-tense" },
      { kn: "ನೀರಿಗೆ", transliteration: "neerige", reason: "wrong-case" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 3: CONTINUOUS/PROGRESSIVE — "I am [verb]-ing"
  // Pattern cluster: Progressive tense (-uttiddeene)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "L3-01",
    level: 3,
    patternTag: "progressive",
    category: "transport",
    context: "In an auto heading to Indiranagar.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "am going",
        hi: "जा रहा/रही हूँ",
        kn: "ಹೋಗುತ್ತಿದ್ದೇನೆ",
        transliteration: "hoguttiddeene",
        role: "verb",
      },
    ],
    tip: "'-uttiddeene' = I am doing [right now]. Compare with Hindi: jaa raha/rahi hoon.",
  },
  {
    id: "L3-02",
    level: 3,
    patternTag: "progressive",
    category: "food",
    context: "At a darshini restaurant.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "am eating",
        hi: "खा रहा/रही हूँ",
        kn: "ತಿನ್ನುತ್ತಿದ್ದೇನೆ",
        transliteration: "tinnuttiddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L3-03",
    level: 3,
    patternTag: "progressive",
    category: "food",
    context: "At a Café Coffee Day in Koramangala.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "coffee",
        hi: "कॉफ़ी",
        kn: "ಕಾಫಿ",
        transliteration: "kaafi",
        role: "object",
      },
      {
        en: "am drinking",
        hi: "पी रहा/रही हूँ",
        kn: "ಕುಡಿಯುತ್ತಿದ್ದೇನೆ",
        transliteration: "kudiyuttiddeene",
        role: "verb",
      },
    ],
    distractors: [
      {
        kn: "ಕುಡಿಯುತ್ತೇನೆ",
        transliteration: "kudiyuttene",
        reason: "wrong-tense",
      },
    ],
  },
  {
    id: "L3-04",
    level: 3,
    patternTag: "progressive",
    category: "work",
    context: "Busy at your desk.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "am working",
        hi: "काम कर रहा/रही हूँ",
        kn: "ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇನೆ",
        transliteration: "kelasa maaduttiddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L3-05",
    level: 3,
    patternTag: "progressive",
    category: "social",
    context: "Your friend is on the phone.",
    parts: [
      {
        en: "He",
        hi: "वो",
        kn: "ಅವನು",
        transliteration: "Avanu",
        role: "subject",
      },
      {
        en: "is talking",
        hi: "बात कर रहा है",
        kn: "ಮಾತಾಡುತ್ತಿದ್ದಾನೆ",
        transliteration: "maataaduttiddaane",
        role: "verb",
      },
    ],
  },
  {
    id: "L3-06",
    level: 3,
    patternTag: "progressive",
    category: "daily",
    context: "Watching Kannada shows.",
    parts: [
      {
        en: "We",
        hi: "हम",
        kn: "ನಾವು",
        transliteration: "Naavu",
        role: "subject",
      },
      {
        en: "movie",
        hi: "फ़िल्म",
        kn: "ಸಿನಿಮಾ",
        transliteration: "sinimaa",
        role: "object",
      },
      {
        en: "are watching",
        hi: "देख रहे हैं",
        kn: "ನೋಡುತ್ತಿದ್ದೇವೆ",
        transliteration: "noduttiddeeve",
        role: "verb",
      },
    ],
    dialogue: {
      speakerLabel: "Roommate",
      speakerLine: [
        {
          en: "What are you",
          hi: "तुम क्या",
          kn: "ನೀವು ಏನು",
          transliteration: "Neevu eenu",
          role: "question",
        },
        {
          en: "doing?",
          hi: "कर रहे हो?",
          kn: "ಮಾಡುತ್ತಿದ್ದೀರಿ?",
          transliteration: "maaduttiddeeri?",
          role: "verb",
        },
      ],
      userLine: [
        {
          en: "We",
          hi: "हम",
          kn: "ನಾವು",
          transliteration: "Naavu",
          role: "subject",
        },
        {
          en: "movie",
          hi: "फ़िल्म",
          kn: "ಸಿನಿಮಾ",
          transliteration: "sinimaa",
          role: "object",
        },
        {
          en: "are watching",
          hi: "देख रहे हैं",
          kn: "ನೋಡುತ್ತಿದ್ದೇವೆ",
          transliteration: "noduttiddeeve",
          role: "verb",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 4: CASE MARKERS — The Real Kannada Engine
  // Pattern clusters: -ge (dative), -annu (accusative), -inda (instrumental/ablative)
  // ═══════════════════════════════════════════════════════════════

  // Cluster 4A: -ge (to/for) — Dative
  {
    id: "L4-01",
    level: 4,
    patternTag: "dative-ge",
    category: "transport",
    context: "Telling the auto driver your destination.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "to office",
        hi: "ऑफ़िस",
        kn: "ಆಫೀಸಿಗೆ",
        transliteration: "aafisige",
        role: "postposition",
      },
      {
        en: "am going",
        hi: "जा रहा/रही हूँ",
        kn: "ಹೋಗುತ್ತಿದ್ದೇನೆ",
        transliteration: "hoguttiddeene",
        role: "verb",
      },
    ],
    tip: "'-ge' = to/for. Office → Office-ge. Notice it ATTACHES to the word!",
    distractors: [
      {
        kn: "ಆಫೀಸಿನಲ್ಲಿ",
        transliteration: "aafeesinalli",
        reason: "wrong-case",
      },
      { kn: "ಆಫೀಸಿಂದ", transliteration: "aafisinda", reason: "wrong-case" },
    ],
    dialogue: {
      speakerLabel: "Auto Driver",
      speakerLine: [
        {
          en: "Where",
          hi: "कहाँ",
          kn: "ಎಲ್ಲಿ",
          transliteration: "Elli",
          role: "question",
        },
        {
          en: "to go?",
          hi: "जाना है?",
          kn: "ಹೋಗ್ಬೇಕು?",
          transliteration: "hogbeku?",
          role: "verb",
        },
      ],
      userLine: [
        {
          en: "To Majestic",
          hi: "मेजेस्टिक",
          kn: "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ",
          transliteration: "Majestic-ge",
          role: "postposition",
        },
        {
          en: "go",
          hi: "जाना है",
          kn: "ಹೋಗ್ಬೇಕು",
          transliteration: "hogbeku",
          role: "verb",
        },
      ],
    },
  },
  {
    id: "L4-02",
    level: 4,
    patternTag: "dative-ge",
    category: "transport",
    context: "Heading to school.",
    parts: [
      {
        en: "He",
        hi: "वो",
        kn: "ಅವನು",
        transliteration: "Avanu",
        role: "subject",
      },
      {
        en: "to school",
        hi: "स्कूल",
        kn: "ಶಾಲೆಗೆ",
        transliteration: "shaalege",
        role: "postposition",
      },
      {
        en: "goes",
        hi: "जाता है",
        kn: "ಹೋಗುತ್ತಾನೆ",
        transliteration: "hoguttaane",
        role: "verb",
      },
    ],
  },
  {
    id: "L4-03",
    level: 4,
    patternTag: "dative-ge",
    category: "market",
    context: "Weekend market run.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "to market",
        hi: "बाज़ार",
        kn: "ಮಾರ್ಕೆಟ್‌ಗೆ",
        transliteration: "market-ge",
        role: "postposition",
      },
      {
        en: "am going",
        hi: "जा रहा/रही हूँ",
        kn: "ಹೋಗುತ್ತಿದ್ದೇನೆ",
        transliteration: "hoguttiddeene",
        role: "verb",
      },
    ],
  },
  {
    id: "L4-04",
    level: 4,
    patternTag: "dative-ge",
    category: "social",
    context: "Inviting someone home.",
    parts: [
      {
        en: "You",
        hi: "तुम/आप",
        kn: "ನೀವು",
        transliteration: "Neevu",
        role: "subject",
      },
      {
        en: "to house",
        hi: "घर",
        kn: "ಮನೆಗೆ",
        transliteration: "manege",
        role: "postposition",
      },
      {
        en: "come",
        hi: "आइए",
        kn: "ಬನ್ನಿ",
        transliteration: "banni",
        role: "verb",
      },
    ],
  },

  // Cluster 4B: -annu (accusative — marks the object)
  {
    id: "L4-05",
    level: 4,
    patternTag: "accusative-annu",
    category: "food",
    context: "Ordering at a darshini.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "dosa",
        hi: "दोसा",
        kn: "ದೋಸೆಯನ್ನು",
        transliteration: "doseyaannu",
        role: "object",
      },
      {
        en: "want",
        hi: "चाहता/चाहती हूँ",
        kn: "ಬೇಕು",
        transliteration: "beku",
        role: "verb",
      },
    ],
    tip: "'-annu' marks WHAT you act on. 'Dosa' → 'Doseyaannu'. Like 'ko' in Hindi!",
    distractors: [
      { kn: "ದೋಸೆಗೆ", transliteration: "dosege", reason: "wrong-case" },
      { kn: "ದೋಸೆಯಿಂದ", transliteration: "doseyinda", reason: "wrong-case" },
    ],
  },
  {
    id: "L4-06",
    level: 4,
    patternTag: "accusative-annu",
    category: "daily",
    context: "Your morning coffee ritual.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "that book",
        hi: "वो किताब",
        kn: "ಆ ಪುಸ್ತಕವನ್ನು",
        transliteration: "aa pustakavannu",
        role: "object",
      },
      {
        en: "am reading",
        hi: "पढ़ रहा/रही हूँ",
        kn: "ಓದುತ್ತಿದ್ದೇನೆ",
        transliteration: "oduttiddeene",
        role: "verb",
      },
    ],
  },

  // Cluster 4C: -inda (from/by)
  {
    id: "L4-07",
    level: 4,
    patternTag: "ablative-inda",
    category: "transport",
    context: "Explaining where you came from.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "from office",
        hi: "ऑफ़िस से",
        kn: "ಆಫೀಸಿಂದ",
        transliteration: "aafisinda",
        role: "postposition",
      },
      {
        en: "came",
        hi: "आया/आयी",
        kn: "ಬಂದೆ",
        transliteration: "bande",
        role: "verb",
      },
    ],
    tip: "'-inda' = from/by. Office → Office-inda. Compare with Hindi 'se'!",
  },
  {
    id: "L4-08",
    level: 4,
    patternTag: "ablative-inda",
    category: "transport",
    context: "Your commute story.",
    parts: [
      {
        en: "I",
        hi: "मैं",
        kn: "ನಾನು",
        transliteration: "Naanu",
        role: "subject",
      },
      {
        en: "from Bangalore",
        hi: "बैंगलोर से",
        kn: "ಬೆಂಗಳೂರಿಂದ",
        transliteration: "Bengaluurinda",
        role: "postposition",
      },
      {
        en: "came",
        hi: "आया/आयी",
        kn: "ಬಂದೆ",
        transliteration: "bande",
        role: "verb",
      },
    ],
    dialogue: {
      speakerLabel: "Colleague",
      speakerLine: [
        {
          en: "Where",
          hi: "कहाँ",
          kn: "ಎಲ್ಲಿ",
          transliteration: "Elli",
          role: "question",
        },
        {
          en: "from?",
          hi: "से?",
          kn: "ಇಂದ?",
          transliteration: "inda?",
          role: "postposition",
        },
      ],
      userLine: [
        {
          en: "From Bangalore",
          hi: "बैंगलोर से",
          kn: "ಬೆಂಗಳೂರಿಂದ",
          transliteration: "Bengaluurinda",
          role: "postposition",
        },
        {
          en: "came",
          hi: "आया",
          kn: "ಬಂದೆ",
          transliteration: "bande",
          role: "verb",
        },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEVEL 5: SOCIAL KANNADA — Politeness Registers
  // Pattern cluster: Formal (Neevu) vs Informal (Neenu)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "L5-01",
    level: 5,
    patternTag: "polite-neevu",
    category: "social",
    context: "Speaking to your senior at work.",
    parts: [
      {
        en: "You (formal)",
        hi: "आप",
        kn: "ನೀವು",
        transliteration: "Neevu",
        role: "subject",
      },
      {
        en: "where",
        hi: "कहाँ",
        kn: "ಎಲ್ಲಿ",
        transliteration: "elli",
        role: "question",
      },
      {
        en: "are going?",
        hi: "जा रहे हैं?",
        kn: "ಹೋಗುತ್ತಿದ್ದೀರಿ?",
        transliteration: "hoguttiddeeri?",
        role: "verb",
      },
    ],
    tip: "'Neevu' = formal 'you' (like Hindi 'aap'). Use with elders, strangers, and at work.",
  },
  {
    id: "L5-02",
    level: 5,
    patternTag: "informal-neenu",
    category: "social",
    context: "Chatting with your close friend.",
    parts: [
      {
        en: "You (informal)",
        hi: "तू",
        kn: "ನೀನು",
        transliteration: "Neenu",
        role: "subject",
      },
      {
        en: "where",
        hi: "कहाँ",
        kn: "ಎಲ್ಲಿ",
        transliteration: "elli",
        role: "question",
      },
      {
        en: "are going?",
        hi: "जा रहा/रही है?",
        kn: "ಹೋಗುತ್ತಿದ್ದೀಯ?",
        transliteration: "hoguttiddeeya?",
        role: "verb",
      },
    ],
    tip: "'Neenu' = casual 'you' (like Hindi 'tu'). Only with close friends!",
  },
  {
    id: "L5-03",
    level: 5,
    patternTag: "polite-neevu",
    category: "food",
    context: "Offering tea to a guest.",
    parts: [
      {
        en: "You (formal)",
        hi: "आप",
        kn: "ನೀವು",
        transliteration: "Neevu",
        role: "subject",
      },
      {
        en: "tea",
        hi: "चाय",
        kn: "ಚಹಾ",
        transliteration: "chahaa",
        role: "object",
      },
      {
        en: "will drink?",
        hi: "पिएँगे?",
        kn: "ಕುಡಿಯುತ್ತೀರಾ?",
        transliteration: "kudiyutteeraa?",
        role: "verb",
      },
    ],
  },
  {
    id: "L5-04",
    level: 5,
    patternTag: "informal-neenu",
    category: "food",
    context: "Asking your best friend if they want chai.",
    parts: [
      {
        en: "You (informal)",
        hi: "तू",
        kn: "ನೀನು",
        transliteration: "Neenu",
        role: "subject",
      },
      {
        en: "tea",
        hi: "चाय",
        kn: "ಚಹಾ",
        transliteration: "chahaa",
        role: "object",
      },
      {
        en: "will drink?",
        hi: "पिएगा/पिएगी?",
        kn: "ಕುಡಿಯುತ್ತೀಯಾ?",
        transliteration: "kudiyutteeyaa?",
        role: "verb",
      },
    ],
  },
  {
    id: "L5-05",
    level: 5,
    patternTag: "polite-neevu",
    category: "social",
    context: "Greeting an elder in your apartment complex.",
    parts: [
      {
        en: "You (formal)",
        hi: "आप",
        kn: "ನೀವು",
        transliteration: "Neevu",
        role: "subject",
      },
      {
        en: "how",
        hi: "कैसे",
        kn: "ಹೇಗೆ",
        transliteration: "hege",
        role: "question",
      },
      {
        en: "are?",
        hi: "हैं?",
        kn: "ಇದ್ದೀರಿ?",
        transliteration: "iddeeri?",
        role: "verb",
      },
    ],
    dialogue: {
      speakerLabel: "You",
      speakerLine: [
        {
          en: "Uncle,",
          hi: "अंकल,",
          kn: "ಅಂಕಲ್,",
          transliteration: "Uncle,",
          role: "connector",
        },
        {
          en: "how are you?",
          hi: "कैसे हैं?",
          kn: "ಹೇಗಿದ್ದೀರಿ?",
          transliteration: "hegiddeeri?",
          role: "verb",
        },
      ],
      userLine: [
        {
          en: "I am",
          hi: "मैं",
          kn: "ನಾನು",
          transliteration: "Naanu",
          role: "subject",
        },
        {
          en: "fine",
          hi: "ठीक हूँ",
          kn: "ಚೆನ್ನಾಗಿದ್ದೇನೆ",
          transliteration: "chennaagiddeene",
          role: "verb",
        },
      ],
    },
  },
  {
    id: "L5-06",
    level: 5,
    patternTag: "polite-neevu",
    category: "work",
    context: "Politely asking your manager a question.",
    parts: [
      {
        en: "Sir,",
        hi: "सर,",
        kn: "ಸರ್,",
        transliteration: "Sir,",
        role: "connector",
      },
      {
        en: "this",
        hi: "यह",
        kn: "ಇದನ್ನು",
        transliteration: "idannu",
        role: "object",
      },
      {
        en: "please see",
        hi: "देखिए",
        kn: "ನೋಡಿ",
        transliteration: "nodi",
        role: "verb",
      },
    ],
    tip: "'Nodi' = polite imperative (please see/look). Used constantly in professional settings.",
  },
];

// ─── CONTRAST MODE PAIRS ────────────────────────────────────────
// For "Brain Hacker" mode: spot the difference
export interface ContrastPair {
  prompt: { en: string; hi: string };
  optionA: {
    kn: string;
    transliteration: string;
    correct: boolean;
    explanation: string;
  };
  optionB: {
    kn: string;
    transliteration: string;
    correct: boolean;
    explanation: string;
  };
  patternTag: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  {
    prompt: { en: "I am going TO office", hi: "मैं ऑफ़िस जा रहा हूँ" },
    optionA: {
      kn: "ನಾನು ಆಫೀಸಿಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ",
      transliteration: "Naanu aafisige hoguttiddeene",
      correct: true,
      explanation: "'-ge' means 'to' — it marks the destination.",
    },
    optionB: {
      kn: "ನಾನು ಆಫೀಸ್ ಹೋಗುತ್ತಿದ್ದೇನೆ",
      transliteration: "Naanu aafis hoguttiddeene",
      correct: false,
      explanation: "Missing '-ge'! Without it, there's no direction.",
    },
    patternTag: "dative-ge",
    level: 4,
  },
  {
    prompt: { en: "I came FROM Bangalore", hi: "मैं बैंगलोर से आया" },
    optionA: {
      kn: "ನಾನು ಬೆಂಗಳೂರಿಗೆ ಬಂದೆ",
      transliteration: "Naanu Bengaluurige bande",
      correct: false,
      explanation: "'-ge' means 'to', not 'from'. Wrong direction!",
    },
    optionB: {
      kn: "ನಾನು ಬೆಂಗಳೂರಿಂದ ಬಂದೆ",
      transliteration: "Naanu Bengaluurinda bande",
      correct: true,
      explanation: "'-inda' means 'from' — correct origin marker.",
    },
    patternTag: "ablative-inda",
    level: 4,
  },
  {
    prompt: { en: "I drink coffee (every day)", hi: "मैं कॉफ़ी पीता हूँ" },
    optionA: {
      kn: "ನಾನು ಕಾಫಿ ಕುಡಿಯುತ್ತೇನೆ",
      transliteration: "Naanu kaafi kudiyuttene",
      correct: true,
      explanation: "'-uttene' = habitual present. I do this regularly.",
    },
    optionB: {
      kn: "ನಾನು ಕಾಫಿ ಕುಡಿಯುತ್ತಿದ್ದೇನೆ",
      transliteration: "Naanu kaafi kudiyuttiddeene",
      correct: false,
      explanation:
        "'-uttiddeene' = right now (progressive). The question is about habit!",
    },
    patternTag: "SOV-present",
    level: 2,
  },
  {
    prompt: {
      en: "Where are you going? (to elder)",
      hi: "आप कहाँ जा रहे हैं?",
    },
    optionA: {
      kn: "ನೀವು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
      transliteration: "Neevu elli hoguttiddeeri?",
      correct: true,
      explanation: "'Neevu' = formal 'you'. Correct for elders.",
    },
    optionB: {
      kn: "ನೀನು ಎಲ್ಲಿ ಹೋಗುತ್ತಿದ್ದೀಯ?",
      transliteration: "Neenu elli hoguttiddeeya?",
      correct: false,
      explanation: "'Neenu' = informal 'tu'. Too casual for elders!",
    },
    patternTag: "polite-neevu",
    level: 5,
  },
];

// ─── HELPERS ────────────────────────────────────────────────────
export function getSentencesByLevel(level: number): Sentence[] {
  return SENTENCES.filter((s) => s.level === level);
}

export function getSentencesByPattern(patternTag: string): Sentence[] {
  return SENTENCES.filter((s) => s.patternTag === patternTag);
}

export function getContrastPairsByLevel(level: number): ContrastPair[] {
  return CONTRAST_PAIRS.filter((p) => p.level === level);
}

export function getUniquePatternTags(level?: number): string[] {
  const sentences = level ? getSentencesByLevel(level) : SENTENCES;
  return [...new Set(sentences.map((s) => s.patternTag))];
}
