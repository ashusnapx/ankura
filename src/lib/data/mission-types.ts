// ═══════════════════════════════════════════
// MISSION DATA — Interactive Bangalore Stories
// ═══════════════════════════════════════════

export interface MissionWord {
  id: string;
  kannada: string;
  transliteration: string;
  hindi: string;
  english: string;
  emotionalHint: string;
}

export interface StoryChoice {
  id: string;
  kannada: string;
  transliteration: string;
  hindi: string;
  english: string;
  nextSceneId: string;
  speakRequired?: boolean;
}

export interface StoryScene {
  id: string;
  narrative: string;
  kannadaDialogue?: string;
  transliteration?: string;
  hindiHint?: string;
  englishHint?: string;
  speaker?: string;
  illustration: string;
  choices?: StoryChoice[];
  isEnding?: boolean;
  isClifhanger?: boolean;
  wordsIntroduced?: string[];
}

export interface Mission {
  id: string;
  title: string;
  titleKannada: string;
  subtitle: string;
  description: string;
  difficulty: number;
  estimatedMinutes: number;
  illustration: string;
  category: string;
  words: MissionWord[];
  scenes: StoryScene[];
  unlockAfter?: string;
}
