import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStats {
  xp: number;
  level: number;
  totalMinutes: number;
  streakCount: number;
  wordsMastered: number;
  storiesCompleted: number;
}

interface AppState {
  user: {
    name: string;
    avatar?: string;
    points: number;
    xp: number;
    level: number;
  };
  stats: UserStats;

  // Actions
  setName: (name: string) => void;
  addXP: (amount: number) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  resetUser: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: "Explorer",
        points: 0,
        xp: 0,
        level: 1,
      },
      stats: {
        xp: 0,
        level: 1,
        totalMinutes: 0,
        streakCount: 0,
        wordsMastered: 0,
        storiesCompleted: 0,
      },

      setName: (name) =>
        set((state) => ({
          user: { ...state.user, name },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            },
          };
        }),

      updateStats: (newStats) =>
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        })),

      resetUser: () =>
        set({
          user: {
            name: "Explorer",
            points: 0,
            xp: 0,
            level: 1,
          },
          stats: {
            xp: 0,
            level: 1,
            totalMinutes: 0,
            streakCount: 0,
            wordsMastered: 0,
            storiesCompleted: 0,
          },
        }),
    }),
    {
      name: "ankura-storage",
    },
  ),
);
