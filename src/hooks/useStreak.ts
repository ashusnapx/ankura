"use client";
import { useState, useEffect, useCallback } from "react";
import { db, getTodayString } from "@/lib/db/dexie";

interface StreakState {
  current: number;
  longest: number;
  freezeTokens: number;
  lastActiveDate: string | null;
  milestoneReached: number | null;
  history: { date: string; completed: boolean }[];
  activityMap: Record<string, boolean>;
  isLoading: boolean;
}

const MILESTONES = [7, 30, 60, 100, 365];

export function useStreak() {
  const [state, setState] = useState<StreakState>({
    current: 0,
    longest: 0,
    freezeTokens: 2,
    lastActiveDate: null,
    milestoneReached: null,
    history: [],
    activityMap: {},
    isLoading: true,
  });

  const calculateStreak = useCallback(async () => {
    try {
      const records = await db.streakData.orderBy("date").reverse().toArray();
      if (records.length === 0) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      const today = getTodayString();
      let streak = 0;
      let longest = 0;
      let tempStreak = 0;
      const sortedDates = records
        .filter((r) => r.completed)
        .map((r) => r.date)
        .sort()
        .reverse();

      // Calculate current streak
      const checkDate = new Date(today);
      for (let i = 0; i < 400; i++) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (sortedDates.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (i === 0) {
          // Today not yet practiced, check from yesterday
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        } else {
          break;
        }
      }

      // Calculate longest streak
      for (const date of sortedDates) {
        const idx = sortedDates.indexOf(date);
        if (idx === 0) {
          tempStreak = 1;
        } else {
          const prev = new Date(sortedDates[idx - 1]);
          const curr = new Date(date);
          const diff =
            (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
          tempStreak = diff <= 1 ? tempStreak + 1 : 1;
        }
        longest = Math.max(longest, tempStreak);
      }

      const milestone = MILESTONES.find((m) => streak === m) || null;

      const activityMap: Record<string, boolean> = {};
      records.forEach((r) => {
        activityMap[r.date] = r.completed;
      });

      setState({
        current: streak,
        longest: Math.max(longest, streak),
        freezeTokens: 2,
        lastActiveDate: sortedDates[0] || null,
        milestoneReached: milestone,
        history: records.map((r) => ({
          date: r.date,
          completed: r.completed,
        })),
        activityMap,
        isLoading: false,
      });
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const markTodayComplete = useCallback(
    async (minutes: number) => {
      const today = getTodayString();
      const existing = await db.streakData.get(today);
      if (existing) {
        await db.streakData.update(today, {
          completed: true,
          minutesPracticed: existing.minutesPracticed + minutes,
        });
      } else {
        await db.streakData.put({
          date: today,
          completed: true,
          minutesPracticed: minutes,
        });
      }
      await calculateStreak();
    },
    [calculateStreak],
  );

  useEffect(() => {
    calculateStreak();
  }, [calculateStreak]);

  return {
    ...state,
    markTodayComplete,
    refresh: calculateStreak,
    milestones: MILESTONES,
  };
}
