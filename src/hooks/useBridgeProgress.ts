"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getUserProgress, updateProgress } from "@/lib/db/dexie";
import { BRIDGE_WORDS, BridgeWord } from "@/lib/data/bridge-vocab";

export function useBridgeProgress() {
  const [bridgeLevel, setBridgeLevel] = useState(1);
  const [unlockedWordIds, setUnlockedWordIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const p = await getUserProgress();
      if (p) {
        setBridgeLevel(p.bridgeLevel || 1);
        setUnlockedWordIds(p.bridgeUnlockedWordIds || []);
      }
    } catch (error) {
      console.error("Failed to load bridge progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Words available in the current level
  const currentLevelWords = useMemo(() => {
    return BRIDGE_WORDS.filter((w) => w.level === bridgeLevel);
  }, [bridgeLevel]);

  // All words learned up to now (to support cumulative testing)
  const allLearnedWords = useMemo(() => {
    return BRIDGE_WORDS.filter((w) => w.level <= bridgeLevel);
  }, [bridgeLevel]);

  const unlockWord = useCallback(
    async (wordId: string) => {
      const updated = Array.from(new Set([...unlockedWordIds, wordId]));
      await updateProgress({ bridgeUnlockedWordIds: updated });
      setUnlockedWordIds(updated);
    },
    [unlockedWordIds],
  );

  const levelUp = useCallback(async () => {
    const nextLevel = bridgeLevel + 1;
    await updateProgress({ bridgeLevel: nextLevel });
    setBridgeLevel(nextLevel);
  }, [bridgeLevel]);

  // Logic to generate a cumulative test
  const getTestBatch = useCallback(
    (count: number = 10) => {
      // Cumulative logic: level1 + level2 in level3
      // We want a mix of CURRENT level words and PREVIOUS level words
      const currentWords = BRIDGE_WORDS.filter((w) => w.level === bridgeLevel);
      const previousWords = BRIDGE_WORDS.filter((w) => w.level < bridgeLevel);

      // Shuffle helper
      const shuffle = (arr: BridgeWord[]) =>
        [...arr].sort(() => Math.random() - 0.5);

      let mixed: BridgeWord[] = [];

      if (bridgeLevel === 1) {
        mixed = shuffle(currentWords).slice(0, count);
      } else {
        // 70% current, 30% previous for reinforcement
        const currentQuota = Math.ceil(count * 0.7);
        const prevQuota = count - currentQuota;

        const selectedCurrent = shuffle(currentWords).slice(0, currentQuota);
        const selectedPrev = shuffle(previousWords).slice(0, prevQuota);

        mixed = shuffle([...selectedCurrent, ...selectedPrev]);
      }

      return mixed;
    },
    [bridgeLevel],
  );

  return {
    bridgeLevel,
    unlockedWordIds,
    isLoading,
    currentLevelWords,
    allLearnedWords,
    unlockWord,
    levelUp,
    getTestBatch,
    refresh,
  };
}
