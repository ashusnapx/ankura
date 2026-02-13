import Dexie, { type EntityTable } from "dexie";

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

export interface MissionProgress {
  id: string;
  completed: boolean;
  currentSceneIndex: number;
  choices: string[];
  wordsEncountered: string[];
  startedAt: string | null;
  completedAt: string | null;
  timeSpentSeconds: number;
}

export interface WordRecord {
  id: string;
  kannadaText: string;
  transliteration: string;
  hindi: string;
  english: string;
  firstSeenDate: string;
  lastReviewDate: string | null;
  reviewLevel: number; // 0-5, maps to spacing intervals
  health: number; // 0-100, garden health
  correctCount: number;
  incorrectCount: number;
  missionContext: string; // which mission introduced this word
  emotionalAnchor?: string;
}

export interface UserProgress {
  id: string; // always 'singleton'
  currentLevel: number;
  onboardingComplete: boolean;
  goals: string[];
  userName: string;
  totalMinutesLearned: number;
  wordsEncountered: string[];
  speakingConfidence: number; // 0-100
  missionsCompleted: number;
  bridgeLevel: number;
  bridgeUnlockedWordIds: string[];
  createdAt: string;
}

export interface StreakRecord {
  date: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  minutesPracticed: number;
}

export interface Preference {
  key: string;
  value: string;
}

export interface AnalyticsEvent {
  id?: number;
  event: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface FeedbackRecord {
  id?: number;
  type: "bug" | "suggestion" | "nps";
  message: string;
  rating?: number;
  timestamp: string;
}

// ═══════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════

export class AnkuraDB extends Dexie {
  missions!: EntityTable<MissionProgress, "id">;
  words!: EntityTable<WordRecord, "id">;
  userProgress!: EntityTable<UserProgress, "id">;
  streakData!: EntityTable<StreakRecord, "date">;
  preferences!: EntityTable<Preference, "key">;
  analytics!: EntityTable<AnalyticsEvent, "id">;
  feedback!: EntityTable<FeedbackRecord, "id">;

  constructor() {
    super("AnkuraDB");

    this.version(1).stores({
      missions: "id, completed",
      words: "id, kannadaText, lastReviewDate, reviewLevel, missionContext",
      userProgress: "id",
      streakData: "date, completed",
      preferences: "key",
      analytics: "++id, event, timestamp",
      feedback: "++id, type, timestamp",
    });
  }
}

export const db = new AnkuraDB();

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

export async function initializeUser(
  name: string,
  goals: string[],
): Promise<void> {
  const existing = await db.userProgress.get("singleton");
  if (!existing) {
    await db.userProgress.put({
      id: "singleton",
      currentLevel: 1,
      onboardingComplete: true,
      goals,
      userName: name,
      totalMinutesLearned: 0,
      wordsEncountered: [],
      speakingConfidence: 0,
      missionsCompleted: 0,
      bridgeLevel: 1,
      bridgeUnlockedWordIds: [],
      createdAt: new Date().toISOString(),
    });
  }
}

export async function getUserProgress(): Promise<UserProgress | undefined> {
  return db.userProgress.get("singleton");
}

export async function updateProgress(
  updates: Partial<UserProgress>,
): Promise<void> {
  await db.userProgress.update("singleton", updates);
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Data backup & restore
export async function exportAllData(): Promise<string> {
  const data = {
    missions: await db.missions.toArray(),
    words: await db.words.toArray(),
    userProgress: await db.userProgress.toArray(),
    streakData: await db.streakData.toArray(),
    preferences: await db.preferences.toArray(),
    feedback: await db.feedback.toArray(),
    exportedAt: new Date().toISOString(),
    version: 1,
  };
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  await db.transaction(
    "rw",
    [
      db.missions,
      db.words,
      db.userProgress,
      db.streakData,
      db.preferences,
      db.feedback,
    ],
    async () => {
      if (data.missions) {
        await db.missions.clear();
        await db.missions.bulkPut(data.missions);
      }
      if (data.words) {
        await db.words.clear();
        await db.words.bulkPut(data.words);
      }
      if (data.userProgress) {
        await db.userProgress.clear();
        await db.userProgress.bulkPut(data.userProgress);
      }
      if (data.streakData) {
        await db.streakData.clear();
        await db.streakData.bulkPut(data.streakData);
      }
      if (data.preferences) {
        await db.preferences.clear();
        await db.preferences.bulkPut(data.preferences);
      }
      if (data.feedback) {
        await db.feedback.clear();
        await db.feedback.bulkPut(data.feedback);
      }
    },
  );
}
