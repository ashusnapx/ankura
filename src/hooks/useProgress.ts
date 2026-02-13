"use client";
import { useState, useEffect, useCallback } from "react";
import {
  db,
  getUserProgress,
  updateProgress,
  type UserProgress,
} from "@/lib/db/dexie";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    try {
      const p = await getUserProgress();
      setProgress(p || null);

      const missions = await db.missions.toArray();
      const completedIds = missions
        .filter((m) => m.completed === true || (m as any).completed === 1)
        .map((m) => m.id);
      setCompletedMissionIds(completedIds);
    } catch {
      console.warn("Failed to load progress");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addWordsEncountered = useCallback(
    async (wordIds: string[]) => {
      if (!progress) return;
      const existing = new Set(progress.wordsEncountered);
      wordIds.forEach((id) => existing.add(id));
      const updated = Array.from(existing);
      await updateProgress({ wordsEncountered: updated });
      setProgress((p) => (p ? { ...p, wordsEncountered: updated } : p));
    },
    [progress],
  );

  const completeMission = useCallback(
    async (missionId: string, timeSpent: number) => {
      await db.missions.put({
        id: missionId,
        completed: true,
        currentSceneIndex: 0,
        choices: [],
        wordsEncountered: [],
        startedAt: null,
        completedAt: new Date().toISOString(),
        timeSpentSeconds: timeSpent,
      });
      if (progress) {
        await updateProgress({
          missionsCompleted: progress.missionsCompleted + 1,
          totalMinutesLearned:
            progress.totalMinutesLearned + Math.round(timeSpent / 60),
        });
      }
      await refresh();
    },
    [progress, refresh],
  );

  return {
    progress,
    isLoading,
    completedMissionIds,
    refresh,
    addWordsEncountered,
    completeMission,
  };
}
