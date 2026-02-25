"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Brain } from "lucide-react";
import { BottomNav } from "@/components/shared/BottomNav";
import { useBridgeProgress } from "@/hooks/useBridgeProgress";
import { useStats } from "@/hooks/useStats";
import {
  BRIDGE_CATEGORIES,
  BRIDGE_WORDS,
  BridgeWord,
} from "@/lib/data/bridge-vocab";

export default function BridgePracticePage() {
  const { bridgeLevel, isLoading, getTestBatch, levelUp } = useBridgeProgress();
  const { recordActivity } = useStats();

  const [activeCategory, setActiveCategory] = useState(BRIDGE_CATEGORIES[0].id);
  const [isTesting, setIsTesting] = useState(false);
  const [testBatch, setTestBatch] = useState<BridgeWord[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [testFeedback, setTestFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );

  // Store generated options in state to ensure purity during render
  const [currentOptions, setCurrentOptions] = useState<BridgeWord[]>([]);

  const filteredWords = useMemo(() => {
    return BRIDGE_WORDS.filter(
      (w) => w.category === activeCategory && w.level <= bridgeLevel,
    );
  }, [activeCategory, bridgeLevel]);

  // Pure function for generating options
  const generateOptionsForWord = (word: BridgeWord) => {
    const otherWords = BRIDGE_WORDS.filter((w) => w.id !== word.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 3);
    return [...selectedOthers, word].sort(() => 0.5 - Math.random());
  };

  const startTest = () => {
    const batch = getTestBatch(10);
    setTestBatch(batch);
    setCurrentTestIndex(0);
    setTestScore(0);
    setIsTesting(true);
    setShowResult(false);

    if (batch[0]) {
      setCurrentOptions(generateOptionsForWord(batch[0]));
    }
  };

  const handleAnswer = (word: BridgeWord, answer: string) => {
    if (answer === word.kannada) {
      setTestScore((s) => s + 1);
      setTestFeedback("correct");
    } else {
      setTestFeedback("wrong");
    }

    setTimeout(() => {
      setTestFeedback(null);
      if (currentTestIndex < testBatch.length - 1) {
        const nextIndex = currentTestIndex + 1;
        setCurrentTestIndex(nextIndex);
        setCurrentOptions(generateOptionsForWord(testBatch[nextIndex]));
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='w-12 h-12 rounded-full border-4 border-terracotta/20 border-t-terracotta animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white pb-24'>
      <div className='container-responsive pt-12'>
        {/* Header & Level Info */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
          <div className='space-y-2'>
            <h1 className='text-4xl font-black text-indigo tracking-tight font-ui'>
              Bridge <span className='text-terracotta'>Practice</span>
            </h1>
            <p className='text-lg font-medium text-indigo-light font-narrative'>
              Upgrade your vocabulary through Hindi cousins.
            </p>
          </div>

          <div className='flex items-center gap-4 bg-secondary p-2 rounded-[24px]'>
            <div className='flex flex-col items-center px-6 py-2'>
              <span className='text-[10px] font-black text-indigo/30 uppercase tracking-[0.2em] font-ui'>
                Current Level
              </span>
              <span className='text-2xl font-black text-indigo font-technical'>
                {bridgeLevel}
              </span>
            </div>
            <button
              onClick={startTest}
              className='bg-indigo text-white px-8 py-4 rounded-[20px] font-bold text-sm shadow-xl shadow-indigo/20 flex items-center gap-2 hover:scale-105 transition-all active:scale-95'
            >
              <Zap size={16} /> Take Level Up Test
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className='flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar'>
          {BRIDGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[24px] whitespace-nowrap transition-all ${
                activeCategory === cat.id ?
                  "bg-terracotta text-white shadow-lg shadow-terracotta/20"
                : "bg-secondary text-indigo hover:bg-gold-dark/10"
              }`}
            >
              <span className='text-xl'>{cat.icon}</span>
              <span className='text-sm font-bold font-ui'>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Word Grid */}
        <motion.div
          layout
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'
        >
          <AnimatePresence mode='popLayout'>
            {filteredWords.map((word) => (
              <motion.div
                key={word.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='group p-8 rounded-[32px] bg-white border border-gold hover:border-terracotta/30 shadow-sm hover:shadow-xl transition-all'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='space-y-1'>
                    <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
                      Level {word.level}
                    </p>
                    <h3 className='text-2xl font-black text-indigo font-narrative'>
                      {word.hindi}
                    </h3>
                  </div>
                  {word.isSanskritOrigin && (
                    <div className='text-[10px] font-black text-gold-dark py-1 px-2 bg-gold/10 rounded-full flex items-center gap-1'>
                      <Brain size={12} /> Root
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-4 py-4 mb-4 border-y border-gold-dark/5'>
                  <span className='text-terracotta font-black'>→</span>
                  <div className='space-y-1'>
                    <p className='font-native text-3xl font-black text-indigo'>
                      {word.kannada}
                    </p>
                    <p className='text-xs font-medium text-indigo/40 font-technical lowercase'>
                      {word.transliteration}
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <span className='font-bold text-indigo/60 font-narrative italic'>
                    {word.meaning}
                  </span>
                  {word.note && (
                    <span className='text-[10px] text-green font-black uppercase tracking-widest font-ui'>
                      {word.note}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Words Placeholder */}
        {filteredWords.length === 0 && (
          <div className='text-center py-24 bg-secondary/50 rounded-[40px] border-2 border-dashed border-gold-dark/20'>
            <div className='text-6xl mb-6 grayscale opacity-20'>📖</div>
            <h3 className='text-xl font-bold text-indigo/30'>
              No words found in this category yet.
            </h3>
            <p className='text-sm text-indigo/20 mt-2'>
              Level up or switch categories to see more.
            </p>
          </div>
        )}
      </div>

      {/* Test Overlay */}
      <AnimatePresence>
        {isTesting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-indigo/95 backdrop-blur-xl flex items-center justify-center p-6'
          >
            <div className='w-full max-w-lg bg-white rounded-[48px] overflow-hidden shadow-2xl'>
              {!showResult ?
                <div className='p-10 space-y-12'>
                  {/* Progress */}
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                      {testBatch.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-6 rounded-full transition-all ${
                            i < currentTestIndex ? "bg-green"
                            : i === currentTestIndex ? "bg-terracotta w-10"
                            : "bg-gold"
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-[10px] font-black text-indigo/30'>
                      {currentTestIndex + 1} / {testBatch.length}
                    </span>
                  </div>

                  {/* Question */}
                  {testBatch[currentTestIndex] && (
                    <div className='text-center space-y-4'>
                      <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
                        Select the Kannada Meaning
                      </p>
                      <h2 className='text-5xl font-black text-indigo uppercase tracking-tight'>
                        {testBatch[currentTestIndex].hindi}
                      </h2>
                      <p className='text-xl font-medium text-indigo-light italic'>
                        {testBatch[currentTestIndex].meaning}
                      </p>
                    </div>
                  )}

                  {/* Options */}
                  <div className='grid grid-cols-2 gap-4'>
                    {currentOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          handleAnswer(testBatch[currentTestIndex], opt.kannada)
                        }
                        disabled={testFeedback !== null}
                        className={`p-6 rounded-[24px] text-center transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                          (
                            testFeedback === "correct" &&
                            opt.kannada === testBatch[currentTestIndex].kannada
                          ) ?
                            "bg-green border-green text-white"
                          : (
                            testFeedback === "wrong" &&
                            opt.kannada !== testBatch[currentTestIndex].kannada
                          ) ?
                            "bg-gold-dark/10 border-gold-dark/30 text-indigo/20"
                          : "bg-white border-gold text-indigo hover:border-terracotta active:scale-95"
                        }`}
                      >
                        <span className='text-kannada text-2xl font-bold'>
                          {opt.kannada}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-widest ${
                            (
                              testFeedback === "correct" &&
                              opt.kannada ===
                                testBatch[currentTestIndex].kannada
                            ) ?
                              "text-white/70"
                            : "text-indigo-light"
                          }`}
                        >
                          {opt.transliteration}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              : <div className='p-10 text-center space-y-8'>
                  <div className='text-6xl mb-6'>
                    {testScore >= 8 ? "🏆" : "💪"}
                  </div>
                  <div className='space-y-2'>
                    <h2 className='text-3xl font-black text-indigo'>
                      Test Results
                    </h2>
                    <p className='text-indigo/50 font-medium'>
                      You scored{" "}
                      <span className='text-terracotta'>{testScore}</span> out
                      of {testBatch.length}
                    </p>
                  </div>

                  <div className='bg-secondary/50 rounded-[32px] p-8 space-y-4'>
                    {testScore >= 8 ?
                      <>
                        <p className='text-sm font-bold text-indigo uppercase tracking-widest'>
                          Promotion Available!
                        </p>
                        <p className='text-md text-indigo-light'>
                          Congratulations! You&apos;ve mastered Level{" "}
                          {bridgeLevel}.
                        </p>
                        <button
                          onClick={() => {
                            levelUp();
                            recordActivity("bridge", { xp: 500 }); // 500 XP for Level Up
                            setIsTesting(false);
                          }}
                          className='w-full bg-indigo text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-indigo/20 hover:scale-105 transition-all'
                        >
                          Level Up to {bridgeLevel + 1} (+500 XP)
                        </button>
                      </>
                    : <>
                        <p className='text-sm font-bold text-terracotta uppercase tracking-widest'>
                          Keep Practicing
                        </p>
                        <p className='text-md text-indigo-light'>
                          You need a score of 8/10 to unlock the next level.
                        </p>
                        <button
                          onClick={startTest}
                          className='w-full bg-indigo text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-indigo/20 flex items-center justify-center gap-3'
                        >
                          <RotateCcw size={20} /> Try Again
                        </button>
                      </>
                    }
                  </div>

                  <button
                    onClick={() => setIsTesting(false)}
                    className='text-sm font-black text-indigo/30 hover:text-indigo transition-colors uppercase tracking-widest'
                  >
                    Back to Practice
                  </button>
                </div>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='md:hidden'>
        <BottomNav />
      </div>
    </div>
  );
}
