import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────

/** Aggregate stats that appear on the Stats/Dashboard page */
interface UserStats {
  xp: number;
  level: number;
  totalMinutes: number;
  streakCount: number;
  wordsMastered: number;
  storiesCompleted: number;
}

/** Per-module progress counters */
interface ModuleProgress {
  sentenceLevel: number;
  sentencesCompleted: number;
  bridgeSessionsCompleted: number;
  shadowSessionsCompleted: number;
  writingSessionsCompleted: number;
  mistakePatterns: Record<string, number>; // patternTag → error count
}

/** Full store shape */
interface AppState {
  // User identity
  user: {
    name: string;
    avatar?: string;
    points: number;
    xp: number;
    level: number;
  };

  // Dashboard-level stats
  stats: UserStats;

  // Per-module progress (modular — each practice page increments its own)
  modules: ModuleProgress;

  // ─── Actions ──────────────────────────────────────────────

  // User
  setName: (name: string) => void;
  addXP: (amount: number) => void;
  resetUser: () => void;

  // Stats (partial merge)
  updateStats: (stats: Partial<UserStats>) => void;

  // Module-specific incrementors (modular API)
  setSentenceLevel: (level: number) => void;
  incrementSentencesCompleted: () => void;
  incrementBridgeSessions: () => void;
  incrementShadowSessions: () => void;
  incrementWritingSessions: () => void;
  recordMistake: (patternTag: string) => void;
}

// ─── Defaults ─────────────────────────────────────────────

const DEFAULT_USER = {
  name: "Explorer",
  points: 0,
  xp: 0,
  level: 1,
};

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  totalMinutes: 0,
  streakCount: 0,
  wordsMastered: 0,
  storiesCompleted: 0,
};

const DEFAULT_MODULES: ModuleProgress = {
  sentenceLevel: 1,
  sentencesCompleted: 0,
  bridgeSessionsCompleted: 0,
  shadowSessionsCompleted: 0,
  writingSessionsCompleted: 0,
  mistakePatterns: {},
};

// ─── Store ────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      stats: DEFAULT_STATS,
      modules: DEFAULT_MODULES,

      // ── User ──────────────────────────────────────────

      setName: (name) =>
        set((state) => ({
          user: { ...state.user, name },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return {
            user: { ...state.user, xp: newXP, level: newLevel },
          };
        }),

      resetUser: () =>
        set({
          user: DEFAULT_USER,
          stats: DEFAULT_STATS,
          modules: DEFAULT_MODULES,
        }),

      // ── Stats ─────────────────────────────────────────

      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),

      // ── Module Progress ───────────────────────────────

      setSentenceLevel: (level) =>
        set((state) => ({
          modules: { ...state.modules, sentenceLevel: level },
        })),

      incrementSentencesCompleted: () =>
        set((state) => ({
          modules: {
            ...state.modules,
            sentencesCompleted: state.modules.sentencesCompleted + 1,
          },
        })),

      incrementBridgeSessions: () =>
        set((state) => ({
          modules: {
            ...state.modules,
            bridgeSessionsCompleted: state.modules.bridgeSessionsCompleted + 1,
          },
        })),

      incrementShadowSessions: () =>
        set((state) => ({
          modules: {
            ...state.modules,
            shadowSessionsCompleted: state.modules.shadowSessionsCompleted + 1,
          },
        })),

      incrementWritingSessions: () =>
        set((state) => ({
          modules: {
            ...state.modules,
            writingSessionsCompleted:
              state.modules.writingSessionsCompleted + 1,
          },
        })),

      recordMistake: (patternTag) =>
        set((state) => ({
          modules: {
            ...state.modules,
            mistakePatterns: {
              ...state.modules.mistakePatterns,
              [patternTag]:
                (state.modules.mistakePatterns[patternTag] || 0) + 1,
            },
          },
        })),
    }),
    {
      name: "ankura-storage",
    },
  ),
);
