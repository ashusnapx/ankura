import { Mission, MissionWord } from "./mission-types";
import { BATCH_1_MISSIONS } from "./missions-batch-1";
import { BATCH_2_MISSIONS } from "./missions-batch-2";
import { BATCH_3_MISSIONS } from "./missions-batch-3";

// Tutorial Mission (Onboarding)
const tutorialMission: Mission = {
  id: "tutorial_001",
  title: "A New Beginning",
  titleKannada: "ಹೊಸ ಆರಂಭ",
  subtitle: "Your first steps in Kannada",
  description: "Learn essential greetings to start your journey in Bangalore.",
  difficulty: 1,
  estimatedMinutes: 2,
  illustration: "🌅",
  category: "basics",
  words: [
    {
      id: "w1",
      kannada: "ನಮಸ್ಕಾರ",
      transliteration: "Namaskāra",
      hindi: "नमस्ते",
      english: "Hello/Greetings",
      emotionalHint: "Universal warmth",
    },
    {
      id: "w2",
      kannada: "ಹೆಸರು",
      transliteration: "Hesaru",
      hindi: "नाम",
      english: "Name",
      emotionalHint: "Identity",
    },
    {
      id: "w3",
      kannada: "ಏನು",
      transliteration: "Ēnu",
      hindi: "क्या",
      english: "What",
      emotionalHint: "Curiosity",
    },
  ],
  scenes: [
    {
      id: "intro",
      narrative:
        "You've just arrived in the Garden City. The morning breeze is cool.",
      illustration: "🏢",
    },
    {
      id: "greeting",
      narrative: "A friendly local greets you with a smile.",
      kannadaDialogue: "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಹೆಸರು ಏನು?",
      transliteration: "Namaskāra, nimma hesaru ēnu?",
      hindiHint: "नमस्ते, आपका नाम क्या है?",
      englishHint: "Hello, what is your name?",
      speaker: "Local",
      illustration: "👨‍💼",
      choices: [
        {
          id: "c1",
          kannada: "ನಮಸ್ಕಾರ",
          transliteration: "Namaskāra",
          hindi: "नमस्ते",
          english: "Hello",
          nextSceneId: "reply",
          speakRequired: true,
        },
      ],
    },
    {
      id: "reply",
      narrative: "You reply warmly.",
      kannadaDialogue: "ನನ್ನ ಹೆಸರು ಬೆನ್ನಿ.",
      transliteration: "Nanna hesaru Benny.",
      hindiHint: "मेरा नाम बेनी है।",
      englishHint: "My name is Benny.",
      speaker: "You",
      illustration: "👋",
      choices: [
        {
          id: "c2",
          kannada: "ಧನ್ಯವಾದ",
          transliteration: "Dhanyavāda",
          hindi: "ಧನ್ಯವಾದ",
          english: "Thank you",
          nextSceneId: "finish",
        },
      ],
    },
    {
      id: "finish",
      narrative:
        "You've completed your first interaction! Welcome to the world of Kannada.",
      illustration: "🎉",
      isEnding: true,
    },
  ],
};

// Mission 1: The Coffee Shop
const mission1: Mission = {
  id: "mission_001",
  title: "Coffee & Conversation",
  titleKannada: "ಕಾಫಿ ಮತ್ತು ಮಾತು",
  subtitle: "Order your first drink",
  description: "Visit a local 'Darshini' and order a filter coffee.",
  difficulty: 1,
  estimatedMinutes: 3,
  illustration: "☕",
  category: "food",
  unlockAfter: "tutorial_001",
  words: [
    {
      id: "w4",
      kannada: "ಕಾಫಿ",
      transliteration: "Kāphi",
      hindi: "कॉफी",
      english: "Coffee",
      emotionalHint: "Morning ritual",
    },
    {
      id: "w5",
      kannada: "ಬೇಕು",
      transliteration: "Bēku",
      hindi: "चाहिए",
      english: "Want",
      emotionalHint: "Need/Desire",
    },
    {
      id: "w6",
      kannada: "ಎಷ್ಟು",
      transliteration: "Eshṭu",
      hindi: "कितना",
      english: "How much",
      emotionalHint: "Value/Price",
    },
  ],
  scenes: [
    {
      id: "s1",
      narrative:
        "The aroma of fresh brew and the sound of frothing milk fill the shop.",
      illustration: "☕",
    },
    {
      id: "s2",
      narrative: "The waiter approaches you.",
      kannadaDialogue: "ಏನು ಬೇಕು?",
      transliteration: "Ēnu bēku?",
      hindiHint: "क्या चाहिए?",
      speaker: "Waiter",
      illustration: "👨‍🍳",
      choices: [
        {
          id: "c3",
          kannada: "ಒಂದು ಕಾಫಿ ಬೇಕು",
          transliteration: "Ondu kāphi bēku",
          hindi: "एक कॉफी चाहिए",
          english: "I want one coffee",
          nextSceneId: "s3",
          speakRequired: true,
        },
      ],
    },
    {
      id: "s3",
      narrative: "He points to the bill counter.",
      kannadaDialogue: "ಹತ್ತು ರೂಪಾಯಿ",
      transliteration: "Hattu rūpāyi",
      hindiHint: "दस रुपये",
      speaker: "Waiter",
      illustration: "💵",
      choices: [
        {
          id: "c4",
          kannada: "ಎಷ್ಟು?",
          transliteration: "Eshṭu?",
          hindi: "कितना?",
          english: "How much?",
          nextSceneId: "s4",
        },
      ],
    },
    {
      id: "s4",
      narrative: "You pay and enjoy the best filter coffee in town.",
      illustration: "✨",
      isEnding: true,
    },
  ],
};

// Mission 2: The Auto Ride
const mission2: Mission = {
  id: "mission_002",
  title: "Auto Ride Saga",
  titleKannada: "ಆಟೋ ಪ್ರಯಾಣ",
  subtitle: "Negotiate like a local",
  description: "Navigate the streets of Bangalore in a yellow-and-green auto.",
  difficulty: 2,
  estimatedMinutes: 4,
  illustration: "🛺",
  category: "travel",
  unlockAfter: "mission_001",
  words: [
    {
      id: "w7",
      kannada: "ಹೋಗಿ",
      transliteration: "Hōgi",
      hindi: "जाइये",
      english: "Go",
      emotionalHint: "Direction",
    },
    {
      id: "w8",
      kannada: "ಇಲ್ಲಿ",
      transliteration: "Illi",
      hindi: "यहाँ",
      english: "Here",
      emotionalHint: "Location",
    },
    {
      id: "w9",
      kannada: "ನಿಲ್ಲಿಸಿ",
      transliteration: "Nillisi",
      hindi: "रोकिए",
      english: "Stop",
      emotionalHint: "Completion",
    },
  ],
  scenes: [
    {
      id: "s1",
      narrative: "An auto stops near you. The driver looks at you expectantly.",
      illustration: "🛺",
    },
    {
      id: "s2",
      narrative: "You tell him your destination.",
      kannadaDialogue: "ಎಂ.ಜಿ ರೋಡ್‌ಗೆ ಹೋಗಿ",
      transliteration: "MG Rōḍge hōgi",
      hindiHint: "एमजी रोड जाइये",
      speaker: "You",
      illustration: "👨‍✈️",
      choices: [
        {
          id: "c5",
          kannada: "ಎಂ.ಜಿ ರೋಡ್‌",
          transliteration: "MG Rōḍ",
          hindi: "एमजी रोड",
          english: "MG Road",
          nextSceneId: "s3",
          speakRequired: true,
        },
      ],
    },
    {
      id: "s3",
      narrative: "You've reached your destination.",
      kannadaDialogue: "ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ",
      transliteration: "Illi nillisi",
      hindiHint: "यहाँ रोकिए",
      speaker: "You",
      illustration: "📍",
      choices: [
        {
          id: "c6",
          kannada: "ಧನ್ಯವಾದ",
          transliteration: "Dhanyavāda",
          hindi: "धन्यवाद",
          english: "Thank you",
          nextSceneId: "s4",
        },
      ],
    },
    {
      id: "s4",
      narrative: "You hop out, ready for your MG Road adventure.",
      illustration: "🎉",
      isEnding: true,
    },
  ],
};

// Mission 3: Asking Directions
const mission3: Mission = {
  id: "mission_003",
  title: "Lost in Indiranagar",
  titleKannada: "ದಾರಿ ಕೇಳುವುದು",
  subtitle: "Find your way back",
  description:
    "You're lost in the lanes of Indiranagar. Ask a passerby for help.",
  difficulty: 2,
  estimatedMinutes: 4,
  illustration: "📍",
  category: "social",
  unlockAfter: "mission_002",
  words: [
    {
      id: "w10",
      kannada: "ಯಲ್ಲಿ",
      transliteration: "Yelli",
      hindi: "कहाँ",
      english: "Where",
      emotionalHint: "Seeking",
    },
    {
      id: "w11",
      kannada: "ದಾರಿ",
      transliteration: "Dāri",
      hindi: "रास्ता",
      english: "Way/Path",
      emotionalHint: "Guidance",
    },
    {
      id: "w12",
      kannada: "ಹತ್ತಿರ",
      transliteration: "Hattira",
      hindi: "पास",
      english: "Near",
      emotionalHint: "Proximity",
    },
  ],
  scenes: [
    {
      id: "s1",
      narrative: "The 100ft road is busy. You need to find the Metro station.",
      illustration: "🏢",
    },
    {
      id: "s2",
      narrative: "You approach a student.",
      kannadaDialogue: "ಮೆಟ್ರೋ ಸ್ಟೇಷನ್ ಎಲ್ಲಿ?",
      transliteration: "Meṭrō sṭēshan yelli?",
      hindiHint: "मेट्रो स्टेशन कहाँ है?",
      speaker: "You",
      illustration: "🙋‍♂️",
      choices: [
        {
          id: "c7",
          kannada: "ದಾರಿ ತೋರಿಸಿ",
          transliteration: "Dāri tōrisi",
          hindi: "रास्ता दिखाइए",
          english: "Show the way",
          nextSceneId: "s3",
          speakRequired: true,
        },
      ],
    },
    {
      id: "s3",
      narrative: "The student points towards the main road.",
      kannadaDialogue: "ಅಲ್ಲಿದೆ, ತುಂಬಾ ಹತ್ತಿರ",
      transliteration: "Allide, thumbā hattira",
      hindiHint: "वहाँ है, बहुत पास",
      speaker: "Student",
      illustration: "👉",
      choices: [
        {
          id: "c8",
          kannada: "ಧನ್ಯವಾದ",
          transliteration: "Dhanyavāda",
          hindi: "धन्यवाद",
          english: "Thank you",
          nextSceneId: "s4",
        },
      ],
    },
    {
      id: "s4",
      narrative: "You see the Metro station in the distance. Saved!",
      illustration: "🚉",
      isEnding: true,
    },
  ],
};

export const ALL_MISSIONS: Mission[] = [
  tutorialMission,
  mission1,
  mission2,
  mission3,
  ...BATCH_1_MISSIONS,
  ...BATCH_2_MISSIONS,
  ...BATCH_3_MISSIONS,
];

// Helper Functions
export const getMissionById = (id: string): Mission | undefined => {
  return ALL_MISSIONS.find((m) => m.id === id);
};

export const getNextMission = (completedIds: string[]): Mission | undefined => {
  // Return the first mission that hasn't been completed
  return ALL_MISSIONS.find((m) => !completedIds.includes(m.id));
};

export const getAllWords = (): MissionWord[] => {
  const allWords: MissionWord[] = [];
  const seenIds = new Set<string>();

  ALL_MISSIONS.forEach((mission) => {
    mission.words.forEach((word) => {
      if (!seenIds.has(word.id)) {
        seenIds.add(word.id);
        allWords.push(word);
      }
    });
  });

  return allWords;
};
