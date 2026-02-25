"use client";
import { useMemo, useCallback } from "react";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { useBridgeProgress } from "@/hooks/useBridgeProgress";
import { useAppStore } from "@/lib/store/useAppStore";
import { ALL_MISSIONS } from "@/lib/data/missions";
import { BRIDGE_CATEGORIES, BRIDGE_WORDS } from "@/lib/data/bridge-vocab";

// ─── Types ──────────────────────────────────────────────────

/** Activity types that any module can record */
export type ActivityType =
  | "sentence"
  | "bridge"
  | "shadow"
  | "writing"
  | "mission"
  | "story";

export interface ActivityPayload {
  xp?: number;
  minutes?: number;
  wordId?: string;
  wordIds?: string[];
  missionId?: string;
  timeSpent?: number;
}

export interface CategoryMastery {
  id: string;
  name: string;
  icon: string;
  percentage: number;
  count: number;
  total: number;
}

export interface AggregatedStats {
  // Core numbers
  wordsLearned: number;
  totalWords: number;
  missionsDone: number;
  totalMissions: number;
  minutes: number;
  bridgeWordsUnlocked: number;
  progressPercent: number;

  // Streak
  streak: number;
  longestStreak: number;
  streakHistory: { date: string; completed: boolean }[];

  // User
  userName: string;
  xp: number;
  level: number;
  avatar?: string;

  // Module-specific
  sentencesCompleted: number;
  sentenceLevel: number;
  bridgeLevel: number;
  bridgeSessionsCompleted: number;
  shadowSessionsCompleted: number;
  writingSessionsCompleted: number;

  // Derived
  categoryMastery: CategoryMastery[];

  // Radar-ready data
  radarData: { subject: string; A: number; fullMark: number }[];
}

// ─── Hook ───────────────────────────────────────────────────

export function useStats() {
  // ── Existing hooks (unchanged — they remain the IndexedDB source) ──
  const {
    current: streak,
    longest: longestStreak,
    history: streakHistory,
    markTodayComplete,
    isLoading: streakLoading,
  } = useStreak();

  const {
    progress,
    completedMissionIds,
    isLoading: progressLoading,
    addWordsEncountered,
    completeMission,
    refresh: refreshProgress,
  } = useProgress();

  const {
    bridgeLevel,
    unlockedWordIds,
    isLoading: bridgeLoading,
    unlockWord,
    levelUp: bridgeLevelUp,
  } = useBridgeProgress();

  // ── Zustand store (for XP, user info, module counters) ────
  const {
    user,
    modules,
    addXP,
    incrementSentencesCompleted,
    incrementBridgeSessions,
    incrementShadowSessions,
    incrementWritingSessions,
    recordMistake,
    updateStats,
  } = useAppStore();

  const isLoading = progressLoading || bridgeLoading || streakLoading;

  // ── Aggregated Stats (single computation) ─────────────────
  const stats: AggregatedStats = useMemo(() => {
    const wordsLearned = progress?.wordsEncountered?.length || 0;
    const totalWords = ALL_MISSIONS.reduce((acc, m) => acc + m.words.length, 0);
    const missionsDone = completedMissionIds.length;
    const totalMissions = ALL_MISSIONS.length;
    const minutes = progress?.totalMinutesLearned || 0;
    const bridgeWordsUnlocked = unlockedWordIds.length;
    const progressPercent =
      totalWords > 0 ? Math.round((wordsLearned / totalWords) * 100) : 0;

    // Category mastery
    const categoryMastery: CategoryMastery[] = BRIDGE_CATEGORIES.map((cat) => {
      const wordsInCat = BRIDGE_WORDS.filter((w) => w.category === cat.id);
      const unlockedInCat = wordsInCat.filter((w) =>
        unlockedWordIds.includes(w.id),
      );
      const percentage =
        wordsInCat.length > 0 ?
          Math.round((unlockedInCat.length / wordsInCat.length) * 100)
        : 0;
      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        percentage,
        count: unlockedInCat.length,
        total: wordsInCat.length,
      };
    });

    // Radar data
    const vocabScore = Math.min((wordsLearned / 500) * 100, 100);
    const storyScore = Math.min((missionsDone / 20) * 100, 100);
    const bridgeScore = Math.min((bridgeWordsUnlocked / 100) * 100, 100);
    const streakScore = Math.min((streak / 30) * 100, 100);
    const consistency = Math.min((minutes / 500) * 100, 100);

    const radarData = [
      { subject: "Vocab", A: vocabScore, fullMark: 100 },
      { subject: "Stories", A: storyScore, fullMark: 100 },
      { subject: "Bridge", A: bridgeScore, fullMark: 100 },
      { subject: "Streak", A: streakScore, fullMark: 100 },
      { subject: "Focus", A: consistency, fullMark: 100 },
    ];

    return {
      wordsLearned,
      totalWords,
      missionsDone,
      totalMissions,
      minutes,
      bridgeWordsUnlocked,
      progressPercent,

      streak,
      longestStreak,
      streakHistory,

      userName: progress?.userName || user.name,
      xp: user.xp,
      level: user.level,
      avatar: user.avatar,

      sentencesCompleted: modules.sentencesCompleted,
      sentenceLevel: modules.sentenceLevel,
      bridgeLevel,
      bridgeSessionsCompleted: modules.bridgeSessionsCompleted,
      shadowSessionsCompleted: modules.shadowSessionsCompleted,
      writingSessionsCompleted: modules.writingSessionsCompleted,

      categoryMastery,
      radarData,
    };
  }, [
    progress,
    completedMissionIds,
    unlockedWordIds,
    streak,
    longestStreak,
    streakHistory,
    user,
    modules,
    bridgeLevel,
  ]);

  // ── Generic Activity Recorder ─────────────────────────────
  // Any module calls this ONE function. Easy to extend for new types.
  const recordActivity = useCallback(
    async (type: ActivityType, payload: ActivityPayload = {}) => {
      const xp = payload.xp ?? 10;

      switch (type) {
        case "sentence":
          incrementSentencesCompleted();
          addXP(xp);
          break;

        case "bridge":
          if (payload.wordId) await unlockWord(payload.wordId);
          incrementBridgeSessions();
          addXP(xp);
          break;

        case "shadow":
          incrementShadowSessions();
          if (payload.minutes) await markTodayComplete(payload.minutes);
          addXP(xp);
          break;

        case "writing":
          incrementWritingSessions();
          addXP(xp);
          break;

        case "mission":
        case "story":
          if (payload.missionId) {
            await completeMission(payload.missionId, payload.timeSpent ?? 0);
          }
          if (payload.wordIds) {
            await addWordsEncountered(payload.wordIds);
          }
          addXP(xp);
          break;
      }

      // Sync aggregate stats to Zustand for persistence
      updateStats({
        wordsMastered: stats.wordsLearned,
        storiesCompleted: stats.missionsDone,
        totalMinutes: stats.minutes,
        streakCount: streak,
        xp: user.xp + xp,
        level: Math.floor((user.xp + xp) / 1000) + 1,
      });
    },
    [
      incrementSentencesCompleted,
      incrementBridgeSessions,
      incrementShadowSessions,
      incrementWritingSessions,
      addXP,
      unlockWord,
      markTodayComplete,
      completeMission,
      addWordsEncountered,
      updateStats,
      stats,
      streak,
      user.xp,
    ],
  );

  // ── Record a mistake (for sentence module error tracking) ──
  const logMistake = useCallback(
    (patternTag: string) => {
      recordMistake(patternTag);
    },
    [recordMistake],
  );

  return {
    stats,
    isLoading,
    recordActivity,
    logMistake,

    // Expose granular APIs for edge cases
    refreshProgress,
    bridgeLevelUp,
    markTodayComplete,
  };
}
