"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Droplets, Info } from "lucide-react";
import { db } from "@/lib/db/dexie";

interface GardenWord {
  id: string;
  kannadaText: string;
  transliteration: string;
  english: string;
  hindi: string;
  reviewLevel: number;
  health: number;
  lastReviewed: Date;
}

const PLANT_STAGES = [
  { emoji: "🌱", label: "Seed", minLevel: 0 },
  { emoji: "🌿", label: "Sprout", minLevel: 2 },
  { emoji: "🪴", label: "Young Plant", minLevel: 4 },
  { emoji: "🌳", label: "Mature Tree", minLevel: 6 },
  { emoji: "🌻", label: "Blooming Flower", minLevel: 8 },
  { emoji: "🌸", label: "Rare Blossom", minLevel: 10 },
  { emoji: "👑", label: "Golden Harvest", minLevel: 12 },
];

export default function GardenPage() {
  const [words, setWords] = useState<GardenWord[]>([]);
  const [filter, setFilter] = useState<
    "all" | "seed" | "sprout" | "plant" | "bloom"
  >("all");
  const [selectedWord, setSelectedWord] = useState<GardenWord | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [animationIndex, setAnimationIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      const dbWords = await db.words.toArray();
      setWords(
        dbWords.map((w) => ({
          id: w.id || Math.random().toString(),
          kannadaText: w.kannadaText,
          transliteration: w.transliteration,
          english: w.english,
          hindi: w.hindi,
          reviewLevel: w.reviewLevel ?? 0,
          health: w.health ?? 100,
          lastReviewed:
            w.lastReviewDate ? new Date(w.lastReviewDate) : new Date(),
        })),
      );
    };
    loadWords();
  }, []);

  const getPlantEmoji = (level: number, health: number) => {
    if (health <= 20) return "🥀";
    const stage =
      [...PLANT_STAGES].reverse().find((s) => level >= s.minLevel) ||
      PLANT_STAGES[0];
    return stage.emoji;
  };

  const handleWater = async (word: GardenWord) => {
    if (isWatering) return;
    setIsWatering(true);

    const nextLevel = Math.min(word.reviewLevel + 2, 12); // Growth step
    const wordId = word.id;

    // Growth sequence animation logic
    // We want to show the cycle from Seed (0) to the NEW level
    const stagesToCycle = PLANT_STAGES.filter((s) => s.minLevel <= nextLevel);

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stagesToCycle.length) {
        setAnimationIndex(currentIdx);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    try {
      // Update Dexie permanently
      await db.words.update(wordId, {
        health: 100,
        reviewLevel: nextLevel,
        lastReviewDate: new Date().toISOString(),
      });

      // Update local state after animation
      setTimeout(() => {
        setWords((prev) =>
          prev.map((w) =>
            w.id === wordId ?
              {
                ...w,
                health: 100,
                reviewLevel: nextLevel,
                lastReviewed: new Date(),
              }
            : w,
          ),
        );

        if (selectedWord?.id === wordId) {
          setSelectedWord((prev) =>
            prev ?
              {
                ...prev,
                health: 100,
                reviewLevel: nextLevel,
                lastReviewed: new Date(),
              }
            : null,
          );
        }
      }, stagesToCycle.length * 200);

      setTimeout(
        () => {
          setIsWatering(false);
          setAnimationIndex(null);
        },
        Math.max(2500, stagesToCycle.length * 200 + 500),
      );
    } catch (error) {
      console.error("Failed to grow plant:", error);
      setIsWatering(false);
      setAnimationIndex(null);
    }
  };

  const filteredWords = useMemo<GardenWord[]>(() => {
    if (filter === "all") return words;
    return words.filter((w) => {
      if (filter === "seed") return w.reviewLevel <= 1;
      if (filter === "sprout") return w.reviewLevel > 1 && w.reviewLevel <= 3;
      if (filter === "plant") return w.reviewLevel > 3 && w.reviewLevel <= 6;
      if (filter === "bloom") return w.reviewLevel > 6;
      return true;
    });
  }, [words, filter]);

  return (
    <div className='min-h-screen bg-[#FDFDFD] relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none bg-[url("https://grainy-gradients.vercel.app/noise.svg")]' />
      <div className='absolute -top-40 -right-40 w-96 h-96 bg-green/10 rounded-full blur-3xl' />
      <div className='absolute top-1/2 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl' />

      <div className='container-responsive pt-12 pb-32 relative z-10'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16'>
          <div className='flex items-center gap-3'>
            <h1 className='text-4xl font-black text-indigo tracking-tight'>
              Word <span className='text-terracotta'>Garden</span>
            </h1>
            <button
              onClick={() => setShowInfo(true)}
              className='w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-indigo/40 hover:text-indigo transition-all hover:scale-110'
            >
              <Info size={18} />
            </button>
          </div>
          <p className='text-lg font-medium text-indigo-light'>
            Your vocabulary memory palace. Bloom through practice.
          </p>

          <div className='flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide'>
            {(["all", "seed", "sprout", "plant", "bloom"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ?
                    "bg-indigo text-white shadow-xl scale-105"
                  : "bg-secondary text-indigo/40 hover:bg-gold-dark/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredWords.length === 0 ?
          <div className='flex flex-col items-center justify-center py-40 rounded-[56px] border-4 border-dashed border-gold-dark/10 bg-secondary/20'>
            <div className='text-8xl mb-8 opacity-10 animate-pulse'>🌱</div>
            <p className='text-xl font-black text-indigo/20 uppercase tracking-[0.3em]'>
              Your garden is quiet
            </p>
            <p className='text-sm font-bold text-indigo/10 mt-4 uppercase tracking-widest'>
              Complete missions to plant new seeds
            </p>
          </div>
        : <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8'>
            <AnimatePresence mode='popLayout'>
              {filteredWords.map((word) => (
                <motion.div
                  key={word.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedWord(word)}
                  className='group relative flex cursor-pointer flex-col items-center rounded-[44px] bg-white border border-gold p-10 transition-all hover:shadow-2xl hover:border-terracotta/20 hover:-translate-y-2'
                >
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5 + (word.id.length % 5) * 0.5,
                      ease: "easeInOut",
                    }}
                    className='text-6xl mb-10 filter drop-shadow-md group-hover:scale-110 transition-transform'
                  >
                    {getPlantEmoji(word.reviewLevel, word.health)}
                  </motion.div>
                  <div className='text-center'>
                    <p className='text-kannada text-2xl font-black text-indigo leading-tight line-clamp-1'>
                      {word.kannadaText}
                    </p>
                    <p className='text-xs font-bold text-indigo/30 uppercase tracking-tighter mt-3'>
                      {word.english}
                    </p>
                  </div>

                  <div className='mt-10 w-full h-2 rounded-full bg-gold-dark/10 overflow-hidden border border-gold-dark/5'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${word.health}%` }}
                      className={`h-full rounded-full ${
                        word.health > 70 ? "bg-green"
                        : word.health > 40 ? "bg-terracotta"
                        : "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        }
      </div>

      {/* Word Detail Modal */}
      <AnimatePresence>
        {selectedWord && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isWatering) setSelectedWord(null);
              }}
              className='absolute inset-0 bg-indigo/60 backdrop-blur-md'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className='relative w-full max-w-lg overflow-hidden rounded-[56px] bg-white p-12 shadow-2xl border border-gold/20'
            >
              <button
                onClick={() => setSelectedWord(null)}
                className='absolute right-10 top-10 rounded-full bg-secondary p-4 text-indigo/40 transition-all hover:text-indigo hover:scale-110'
              >
                <X size={20} />
              </button>

              <div className='text-center space-y-12'>
                <div className='space-y-4'>
                  <div className='w-40 h-40 bg-secondary/50 rounded-[48px] flex items-center justify-center mx-auto shadow-inner-white overflow-hidden relative group'>
                    <motion.span
                      animate={
                        isWatering ?
                          {
                            scale: [0.8, 1.2, 1],
                            rotate: [0, 5, -5, 0],
                            transition: { repeat: 1, duration: 1 },
                          }
                        : {}
                      }
                      className='text-8xl relative z-10'
                    >
                      {animationIndex !== null ?
                        PLANT_STAGES[animationIndex].emoji
                      : getPlantEmoji(
                          selectedWord.reviewLevel,
                          selectedWord.health,
                        )
                      }
                    </motion.span>
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </div>
                  <p className='text-sm font-black text-terracotta uppercase tracking-[0.4em]'>
                    {isWatering && animationIndex !== null ?
                      PLANT_STAGES[animationIndex].label
                    : PLANT_STAGES.find(
                        (s) => selectedWord.reviewLevel >= s.minLevel,
                      )?.label || "Seed"
                    }
                  </p>
                </div>

                <div className='space-y-4'>
                  <h2 className='text-kannada text-7xl font-black text-indigo tracking-tight'>
                    {selectedWord.kannadaText}
                  </h2>
                  <p className='text-3xl font-bold text-indigo/30 tracking-tight'>
                    {selectedWord.transliteration}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <div className='rounded-[40px] bg-secondary p-8 border border-gold/10'>
                    <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest mb-2'>
                      Hindi Translation
                    </p>
                    <p className='text-xl font-black text-indigo'>
                      {selectedWord.hindi}
                    </p>
                  </div>
                  <div className='rounded-[40px] bg-secondary p-8 border border-gold/10'>
                    <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest mb-2'>
                      English Meaning
                    </p>
                    <p className='text-xl font-black text-indigo'>
                      {selectedWord.english}
                    </p>
                  </div>
                </div>

                <div className='space-y-5'>
                  <div className='flex items-center justify-between text-[10px] font-black text-indigo/30 uppercase tracking-[0.2em] px-4'>
                    <span>Vitality</span>
                    <span>{selectedWord.health}%</span>
                  </div>
                  <div className='h-4 w-full rounded-full bg-secondary overflow-hidden border border-gold/5 shadow-inner'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedWord.health}%` }}
                      className={`h-full ${
                        selectedWord.health > 70 ? "bg-green"
                        : selectedWord.health > 40 ? "bg-terracotta"
                        : "bg-destructive"
                      } shadow-[0_0_15px_rgba(129,178,154,0.4)]`}
                    />
                  </div>
                </div>

                <div className='flex gap-4 relative'>
                  <AnimatePresence>
                    {isWatering && (
                      <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className='absolute inset-x-0 -top-32 flex justify-center pointer-events-none z-50'
                      >
                        <div className='flex gap-4'>
                          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <motion.div
                              key={i}
                              animate={{
                                y: [0, 80],
                                opacity: [0, 1, 0],
                                scale: [0.3, 1.2, 0.3],
                                rotate: [0, 180, 360],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.12,
                                ease: "easeIn",
                              }}
                              className='text-4xl filter blur-[1px]'
                            >
                              💧
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => handleWater(selectedWord)}
                    disabled={isWatering}
                    className='flex-1 flex items-center justify-center gap-4 rounded-[28px] bg-indigo py-7 text-lg font-black text-white shadow-2xl shadow-indigo/20 hover:bg-indigo/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
                  >
                    <Droplets
                      size={24}
                      className={
                        isWatering ? "animate-bounce" : (
                          "group-hover:animate-pulse"
                        )
                      }
                    />
                    {isWatering ? "Tending..." : "Water Plant"}
                  </button>
                  <button className='flex h-[84px] w-[84px] items-center justify-center rounded-[28px] bg-secondary text-indigo/40 hover:text-indigo transition-all hover:bg-gold-dark/10 group'>
                    <Info
                      size={28}
                      className='group-hover:scale-110 transition-transform'
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <div className='fixed inset-0 z-[110] flex items-center justify-center p-6'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className='absolute inset-0 bg-indigo/80 backdrop-blur-xl'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className='relative w-full max-w-lg overflow-hidden rounded-[56px] bg-white p-12 shadow-2xl'
            >
              <button
                onClick={() => setShowInfo(false)}
                className='absolute right-10 top-10 rounded-full bg-secondary p-4 text-indigo/40 hover:text-indigo'
              >
                <X size={20} />
              </button>

              <div className='space-y-10'>
                <div className='text-center space-y-2'>
                  <div className='text-6xl mb-6'>🏵️</div>
                  <h2 className='text-3xl font-black text-indigo tracking-tight'>
                    How it Works
                  </h2>
                  <p className='text-indigo-light font-medium'>
                    The Word Garden is your visual memory palace.
                  </p>
                </div>

                <div className='space-y-6'>
                  {[
                    {
                      icon: "🌱",
                      title: "Planting Seals",
                      text: "Every new word you encounter in a mission is planted as a seed.",
                    },
                    {
                      icon: "💧",
                      title: "Vitality (Health)",
                      text: "Plants wither over time. Water them (review) to keep them healthy.",
                    },
                    {
                      icon: "🌳",
                      title: "Growth Stages",
                      text: "Regular tending helps plants grow from sprouts into majestic blossoms.",
                    },
                    {
                      icon: "✨",
                      title: "Mastery",
                      text: "Healthier plants contribute more to your overall proficiency score.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-5 p-6 rounded-[32px] bg-secondary/50 border border-gold/10'
                    >
                      <div className='text-3xl shrink-0'>{item.icon}</div>
                      <div className='space-y-1'>
                        <h4 className='font-black text-indigo uppercase tracking-widest text-xs'>
                          {item.title}
                        </h4>
                        <p className='text-sm font-medium text-indigo-light leading-relaxed'>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className='w-full rounded-[28px] bg-indigo py-6 text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-indigo/20 hover:bg-indigo/90 transition-all'
                >
                  Got it, Gardener
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
