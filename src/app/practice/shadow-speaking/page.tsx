"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Mic, MicOff, SkipForward, RefreshCw, Volume2 } from "lucide-react";
import { db, type WordRecord } from "@/lib/db/dexie";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { speakText, isSpeechSynthesisSupported } from "@/lib/utils/speech";
import { getAllWords } from "@/lib/data/missions";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ShadowSpeakingPage() {
  const {
    isListening,
    transcript,
    accuracy,
    isSupported,
    startListening,
    stopListening,
    reset,
  } = useSpeechRecognition();

  const [words, setWords] = useState<WordRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const updateBestScore = useCallback((newAccuracy: number) => {
    setBestScore((prev) => Math.max(prev, newAccuracy));
  }, []);

  useEffect(() => {
    const loadWords = async () => {
      const dbWords = await db.words.toArray();
      if (dbWords.length > 0) {
        setWords(dbWords);
      } else {
        const all = getAllWords();
        setWords(
          all.map((w) => ({
            id: Math.random().toString(),
            kannadaText: w.kannada,
            transliteration: w.transliteration,
            english: w.english,
            hindi: w.hindi,
            firstSeenDate: new Date().toISOString(),
            lastReviewDate: null,
            reviewLevel: 0,
            health: 100,
            correctCount: 0,
            incorrectCount: 0,
            missionContext: "init",
          })),
        );
      }
    };
    loadWords();
  }, []);

  const currentWord = words[currentIndex];

  const handleNext = () => {
    reset();
    setCurrentIndex((i) => (i + 1) % words.length);
    setBestScore(0);
  };

  const handleRetry = () => {
    reset();
  };

  const handleSpeak = () => {
    if (!currentWord) return;
    if (isListening) {
      stopListening();
    } else {
      startListening(currentWord.kannadaText, updateBestScore);
    }
  };

  if (words.length === 0) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center pb-24'>
        <div className='text-center px-10 space-y-4'>
          <p className='text-7xl'>🎤</p>
          <h2 className='text-2xl font-black text-indigo tracking-tight'>
            No words yet
          </h2>
          <p className='text-sm font-medium text-indigo-light'>
            Complete a mission first to unlock shadow speaking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='container-responsive pt-12 pb-24'>
        <div className='mb-12'>
          <h1 className='text-4xl font-black text-indigo tracking-tight mb-2'>
            Shadow Speaking
          </h1>
          <p className='text-lg font-medium text-indigo-light'>
            Listen, then repeat. Train your Kannada voice.
          </p>
        </div>

        <div className='flex items-center gap-3 mb-10'>
          <div className='rounded-full bg-secondary px-6 py-2 text-xs font-black text-indigo/40 uppercase tracking-widest'>
            Best: <span className='text-green'>{bestScore}%</span>
          </div>
          <div className='flex-1' />
          <div className='text-xs font-black text-indigo/20 uppercase tracking-[0.2em]'>
            {currentIndex + 1} of {words.length}
          </div>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            variants={fadeUp}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='space-y-12'
          >
            <div className='rounded-[40px] bg-secondary p-12 text-center space-y-8'>
              <div className='space-y-4'>
                <p className='text-kannada text-6xl font-black text-indigo leading-tight'>
                  {currentWord.kannadaText}
                </p>
                <p className='text-2xl font-bold text-indigo/40'>
                  {currentWord.transliteration}
                </p>
              </div>

              <div className='flex items-center justify-center gap-8'>
                <div className='text-xs font-black bg-white/50 px-4 py-2 rounded-xl text-indigo/30 uppercase tracking-widest'>
                  HI: {currentWord.hindi}
                </div>
                <div className='text-xs font-black bg-white/50 px-4 py-2 rounded-xl text-indigo/30 uppercase tracking-widest'>
                  EN: {currentWord.english}
                </div>
              </div>

              {isSpeechSynthesisSupported() && (
                <button
                  onClick={() => speakText(currentWord.kannadaText)}
                  className='inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-indigo hover:text-terracotta transition-all shadow-sm hover:shadow-xl active:scale-95'
                >
                  <Volume2 size={20} /> Listen to Guide
                </button>
              )}
            </div>

            <div className='flex flex-col items-center gap-8'>
              {isSupported ?
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSpeak}
                  className={`flex h-32 w-32 items-center justify-center rounded-full transition-all shadow-2xl relative ${
                    isListening ?
                      "bg-destructive scale-110 shadow-destructive/50"
                    : "bg-indigo shadow-indigo/50"
                  } text-white`}
                >
                  {isListening && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className='absolute inset-0 bg-destructive rounded-full'
                    />
                  )}
                  <div className='relative z-10'>
                    {isListening ?
                      <MicOff size={40} />
                    : <Mic size={40} />}
                  </div>
                </motion.button>
              : <div className='rounded-[32px] bg-destructive/5 text-destructive p-8 text-center border border-destructive/10'>
                  <p className='text-lg font-black'>
                    Speech Recognition Unsupported
                  </p>
                  <p className='text-sm opacity-70 mt-2'>
                    Try using Chrome or Safari.
                  </p>
                </div>
              }

              {isListening && (
                <p className='text-xs font-black text-indigo/20 uppercase tracking-[0.3em] animate-pulse'>
                  Listening for Kannada...
                </p>
              )}
            </div>

            <AnimatePresence>
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='rounded-[40px] bg-indigo p-10 text-center space-y-6 text-white shadow-2xl overflow-hidden relative'
                >
                  <div className='absolute top-0 left-0 w-full h-1 bg-white/5'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      className={`h-full ${accuracy >= 70 ? "bg-green" : "bg-terracotta"}`}
                    />
                  </div>
                  <p className='text-sm font-bold text-white/40 italic'>
                    You said &ldquo;{transcript}&rdquo;
                  </p>
                  <div className='flex flex-col items-center gap-2'>
                    <p
                      className={`text-6xl font-black ${
                        accuracy >= 70 ? "text-green"
                        : accuracy >= 40 ? "text-gold"
                        : "text-destructive"
                      }`}
                    >
                      {accuracy}%
                    </p>
                    <p className='text-xs font-black text-white/20 uppercase tracking-widest'>
                      Match Accuracy
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex gap-6'>
              <button
                onClick={handleRetry}
                className='flex-1 flex items-center justify-center gap-3 rounded-[24px] bg-secondary py-6 text-base font-black text-indigo transition-all hover:bg-gold-dark/20'
              >
                <RefreshCw size={20} /> Retry
              </button>
              <button
                onClick={handleNext}
                className='flex-1 flex items-center justify-center gap-3 rounded-[24px] bg-indigo py-6 text-base font-black text-white shadow-xl hover:bg-indigo/90 active:scale-95 transition-all'
              >
                Next Word <SkipForward size={20} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
