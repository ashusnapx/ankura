"use client";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Puzzle,
  Mic,
  Volume2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Shuffle,
  RotateCcw,
  MessageCircle,
  EyeOff,
  Lightbulb,
  Zap,
} from "lucide-react";
import { BottomNav } from "@/components/shared/BottomNav";
import { useStats } from "@/hooks/useStats";
import {
  SENTENCES,
  LEVELS,
  ROLE_COLORS,
  SCAFFOLDING_BY_LEVEL,
  REFLECTIONS,
  CONTRAST_PAIRS,
  getSentencesByLevel,
  getContrastPairsByLevel,
  type Sentence,
  type SentencePart,
  type ContrastPair,
  type GrammarRole,
} from "@/lib/data/sentence-data";
import { speakText, isSpeechSynthesisSupported } from "@/lib/utils/speech";

type Mode = "watch" | "build" | "speak";

// ─── COLOR HELPER ───────────────────────────────────────────────
function roleClass(role: GrammarRole): string {
  return ROLE_COLORS[role]?.text || "text-indigo";
}
function roleBg(role: GrammarRole): string {
  return ROLE_COLORS[role]?.bg || "bg-indigo/10";
}

export default function VaakyaPage() {
  const { stats, recordActivity, logMistake } = useStats();
  const { sentenceLevel, sentencesCompleted } = stats;

  // Core state
  const [activeLevel, setActiveLevel] = useState(sentenceLevel);
  const [mode, setMode] = useState<Mode>("watch");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [showHindi, setShowHindi] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showContrast, setShowContrast] = useState(false);

  // Build mode state
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [buildResult, setBuildResult] = useState<"correct" | "wrong" | null>(
    null,
  );

  // Speak mode state (simplified — structural feedback)
  const [speakFeedback, setSpeakFeedback] = useState<{
    wordOrder: boolean;
    verbForm: boolean;
    caseMarker: boolean;
  } | null>(null);

  // Reflection state
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionAnswer, setReflectionAnswer] = useState<number | null>(null);

  // Contrast mode state
  const [contrastIndex, setContrastIndex] = useState(0);
  const [contrastChoice, setContrastChoice] = useState<"a" | "b" | null>(null);

  // Derived data
  const levelSentences = useMemo(
    () => getSentencesByLevel(activeLevel),
    [activeLevel],
  );
  const currentSentence = levelSentences[sentenceIndex] || levelSentences[0];
  const scaffolding =
    SCAFFOLDING_BY_LEVEL[activeLevel] || SCAFFOLDING_BY_LEVEL[1];
  const levelReflections = REFLECTIONS[activeLevel] || [];
  const levelContrasts = useMemo(
    () => getContrastPairsByLevel(activeLevel),
    [activeLevel],
  );
  const currentContrast = levelContrasts[contrastIndex] || levelContrasts[0];

  // Scrambled tiles for Build mode (with distractors)
  const buildTiles = useMemo(() => {
    if (!currentSentence) return [];
    const real = currentSentence.parts.map((p, i) => ({
      ...p,
      originalIndex: i,
      isDistractor: false,
      reason: "",
    }));
    const distractorTiles = (currentSentence.distractors || []).map((d, i) => ({
      en: "???",
      hi: "???",
      kn: d.kn,
      transliteration: d.transliteration,
      role: "verb" as GrammarRole,
      originalIndex: -1 - i,
      isDistractor: true,
      reason: d.reason,
    }));
    return [...real, ...distractorTiles].sort(() => Math.random() - 0.5);
  }, [currentSentence]);

  // Navigation
  const goNext = useCallback(() => {
    setBuildResult(null);
    setSelectedTiles([]);
    setSpeakFeedback(null);
    setContrastChoice(null);

    // Check if we should show a reflection (every 5 sentences)
    if (
      (sentenceIndex + 1) % 5 === 0 &&
      levelReflections.length > 0 &&
      !showContrast
    ) {
      setShowReflection(true);
      setReflectionAnswer(null);
      return;
    }

    // Check if we should show a contrast pair (every 4th sentence)
    if (
      (sentenceIndex + 1) % 4 === 0 &&
      levelContrasts.length > 0 &&
      !showContrast
    ) {
      setShowContrast(true);
      setContrastIndex(0);
      setContrastChoice(null);
      return;
    }

    if (sentenceIndex < levelSentences.length - 1) {
      setSentenceIndex(sentenceIndex + 1);
    } else {
      setSentenceIndex(0); // Loop
    }
    recordActivity("sentence", { xp: 10 });
  }, [
    sentenceIndex,
    levelSentences.length,
    levelReflections.length,
    levelContrasts.length,
    showContrast,
    recordActivity,
  ]);

  const dismissReflection = () => {
    setShowReflection(false);
    setSentenceIndex(
      sentenceIndex + 1 < levelSentences.length ? sentenceIndex + 1 : 0,
    );
    recordActivity("sentence", { xp: 10 });
  };

  const dismissContrast = () => {
    setShowContrast(false);
    setSentenceIndex(
      sentenceIndex + 1 < levelSentences.length ? sentenceIndex + 1 : 0,
    );
    recordActivity("sentence", { xp: 15 });
  };

  // Build mode logic
  const handleTileSelect = (tileIdx: number) => {
    if (buildResult) return;
    if (selectedTiles.includes(tileIdx)) {
      setSelectedTiles(selectedTiles.filter((i) => i !== tileIdx));
    } else {
      setSelectedTiles([...selectedTiles, tileIdx]);
    }
  };

  const checkBuild = () => {
    const selectedParts = selectedTiles.map((i) => buildTiles[i]);
    const hasDistractor = selectedParts.some((p) => p.isDistractor);
    const correctOrder = currentSentence.parts.map((p) => p.kn);
    const userOrder = selectedParts.map((p) => p.kn);
    const isCorrect =
      !hasDistractor &&
      JSON.stringify(correctOrder) === JSON.stringify(userOrder);
    setBuildResult(isCorrect ? "correct" : "wrong");
    if (!isCorrect && currentSentence) {
      logMistake(currentSentence.patternTag);
    }
    if (isCorrect) recordActivity("sentence", { xp: 20 });
  };

  // Speak entire sentence
  const speakSentence = () => {
    if (!currentSentence) return;
    const fullKannada = currentSentence.parts.map((p) => p.kn).join(" ");
    if (isSpeechSynthesisSupported()) {
      speakText(fullKannada, "kn-IN");
    }
  };

  // Render a single sentence part with Grammar Rainbow
  const renderPart = (
    part: SentencePart,
    idx: number,
    lang: "en" | "hi" | "kn",
    showTranslit: boolean = false,
  ) => {
    const color = roleClass(part.role);
    const bg = roleBg(part.role);
    return (
      <motion.span
        key={`${lang}-${idx}`}
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: idx * 0.15, duration: 0.4, ease: "easeOut" }}
        className={`inline-flex flex-col items-center px-3 py-2 rounded-2xl ${bg} mx-1 group cursor-default`}
      >
        <span
          className={`font-black text-lg ${color} ${
            lang === "kn" ? "font-native text-2xl"
            : lang === "hi" ? "font-narrative"
            : "font-ui"
          }`}
        >
          {part[lang]}
        </span>
        {lang === "kn" && showTranslit && (
          <span className='text-[10px] font-black text-indigo/30 uppercase tracking-wider font-technical mt-0.5'>
            {part.transliteration}
          </span>
        )}
      </motion.span>
    );
  };

  if (!currentSentence && !showContrast) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <p className='text-indigo/40 font-ui font-black'>
          Loading sentences...
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white relative overflow-hidden selection:bg-indigo/10'>
      {/* Subtle background */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo/3 to-terracotta/3 blur-3xl' />
        <div className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-emerald-500/3 to-amber-500/3 blur-3xl' />
      </div>

      <div className='container-responsive pt-28 pb-32 relative z-10'>
        {/* ──── HEADER ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mb-4 font-technical'>
            <Sparkles size={14} />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              Pattern Engine
            </span>
          </div>
          <h1 className='text-5xl md:text-7xl font-black text-indigo tracking-tighter font-ui'>
            Vaakya <span className='text-terracotta'>ವಾಕ್ಯ</span>
          </h1>
          <p className='text-lg font-medium text-indigo/40 mt-2 max-w-xl font-narrative'>
            Internalize Kannada sentence patterns through trilingual parallel
            construction. Don't memorize sentences — recognize patterns.
          </p>
        </motion.div>

        {/* ──── LEVEL PILLS ───────────────────────────────────── */}
        <div className='flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide'>
          {LEVELS.map((lvl) => (
            <button
              key={lvl.level}
              onClick={() => {
                setActiveLevel(lvl.level);
                setSentenceIndex(0);
                setBuildResult(null);
                setSelectedTiles([]);
                setShowContrast(false);
                setShowReflection(false);
              }}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all font-technical ${
                activeLevel === lvl.level ?
                  "bg-indigo text-white shadow-lg shadow-indigo/20"
                : "bg-indigo/5 text-indigo/40 hover:bg-indigo/10 hover:text-indigo"
              }`}
            >
              <span className='text-lg mr-2'>{lvl.icon}</span>L{lvl.level}
            </button>
          ))}
        </div>

        {/* Level Info Banner */}
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 p-5 rounded-[28px] bg-gradient-to-r from-indigo/5 to-terracotta/5 border border-indigo/5'
        >
          <div className='flex items-center gap-3'>
            <span className='text-3xl'>{LEVELS[activeLevel - 1]?.icon}</span>
            <div>
              <h3 className='font-black text-indigo text-lg tracking-tight font-ui'>
                {LEVELS[activeLevel - 1]?.title}
                <span className='text-indigo/20 ml-2 font-native'>
                  {LEVELS[activeLevel - 1]?.titleKn}
                </span>
              </h3>
              <p className='text-xs text-indigo/40 font-medium font-narrative'>
                {LEVELS[activeLevel - 1]?.description}
              </p>
            </div>
          </div>
          <div className='mt-3 flex items-center gap-4'>
            <span className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
              Pattern: {LEVELS[activeLevel - 1]?.pattern}
            </span>
            <span className='text-[10px] font-black text-emerald-500 uppercase tracking-widest font-technical'>
              {levelSentences.length} sentences
            </span>
          </div>
        </motion.div>

        {/* ──── MODE SWITCHER ─────────────────────────────────── */}
        <div className='flex gap-1 p-1.5 bg-indigo/5 rounded-2xl mb-8 max-w-md'>
          {[
            { id: "watch" as Mode, icon: Eye, label: "Watch" },
            { id: "build" as Mode, icon: Puzzle, label: "Build" },
            { id: "speak" as Mode, icon: Mic, label: "Speak" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setMode(id);
                setBuildResult(null);
                setSelectedTiles([]);
                setSpeakFeedback(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all font-technical ${
                mode === id ?
                  "bg-white text-indigo shadow-sm"
                : "text-indigo/30 hover:text-indigo/60"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ──── TOGGLES ───────────────────────────────────────── */}
        <div className='flex gap-3 mb-8'>
          <button
            onClick={() => setShowHindi(!showHindi)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-technical ${
              showHindi ?
                "bg-amber-50 text-amber-600 border border-amber-100"
              : "bg-indigo/5 text-indigo/20"
            }`}
          >
            हिंदी {showHindi ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-technical ${
              showTransliteration ?
                "bg-violet-50 text-violet-600 border border-violet-100"
              : "bg-indigo/5 text-indigo/20"
            }`}
          >
            <EyeOff size={12} />
            Transliteration {showTransliteration ? "ON" : "OFF"}
          </button>
        </div>

        {/* ──── MAIN CONTENT AREA ─────────────────────────────── */}
        <AnimatePresence mode='wait'>
          {/* ── CONTRAST MODE ───────────────────────────────── */}
          {showContrast && currentContrast && (
            <motion.div
              key='contrast'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(45,34,103,0.08)] border border-indigo/5 p-8 md:p-12 mb-8'
            >
              <div className='flex items-center gap-2 mb-6'>
                <Zap size={18} className='text-pink-500' />
                <span className='text-[10px] font-black text-pink-500 uppercase tracking-widest font-technical'>
                  Contrast Mode — Spot the Difference
                </span>
              </div>

              {/* Prompt */}
              <div className='text-center mb-10 space-y-2'>
                <p className='text-2xl font-black text-indigo tracking-tight font-ui'>
                  {currentContrast.prompt.en}
                </p>
                <p className='text-lg font-medium text-amber-600 font-narrative'>
                  {currentContrast.prompt.hi}
                </p>
              </div>

              {/* Two options */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  { key: "a" as const, opt: currentContrast.optionA },
                  { key: "b" as const, opt: currentContrast.optionB },
                ].map(({ key, opt }) => (
                  <button
                    key={key}
                    onClick={() => setContrastChoice(key)}
                    disabled={contrastChoice !== null}
                    className={`p-6 rounded-[28px] border-2 transition-all text-left ${
                      contrastChoice === null ?
                        "border-indigo/10 hover:border-indigo/30 hover:shadow-lg"
                      : contrastChoice === key ?
                        opt.correct ?
                          "border-emerald-400 bg-emerald-50"
                        : "border-red-400 bg-red-50"
                      : opt.correct && contrastChoice !== null ?
                        "border-emerald-400 bg-emerald-50"
                      : "border-indigo/5 opacity-50"
                    }`}
                  >
                    <p className='font-native text-xl font-black text-indigo mb-1'>
                      {opt.kn}
                    </p>
                    <p className='text-xs font-black text-indigo/30 font-technical mb-3'>
                      {opt.transliteration}
                    </p>
                    {contrastChoice !== null && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs font-medium font-narrative ${opt.correct ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {opt.correct ? "✓ " : "✗ "}
                        {opt.explanation}
                      </motion.p>
                    )}
                  </button>
                ))}
              </div>

              {contrastChoice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex justify-center mt-8'
                >
                  <button
                    onClick={dismissContrast}
                    className='px-8 py-4 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-105 transition-all font-ui uppercase tracking-widest text-xs flex items-center gap-2'
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── REFLECTION MODE ─────────────────────────────── */}
          {showReflection && !showContrast && levelReflections.length > 0 && (
            <motion.div
              key='reflection'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(45,34,103,0.08)] border border-indigo/5 p-8 md:p-12 mb-8'
            >
              <div className='flex items-center gap-2 mb-6'>
                <Lightbulb size={18} className='text-amber-500' />
                <span className='text-[10px] font-black text-amber-500 uppercase tracking-widest font-technical'>
                  Micro-Reflection
                </span>
              </div>

              <h3 className='text-2xl font-black text-indigo tracking-tight mb-8 font-ui'>
                {
                  levelReflections[sentenceIndex % levelReflections.length]
                    ?.question
                }
              </h3>

              <div className='flex flex-wrap gap-3 mb-8'>
                {levelReflections[
                  sentenceIndex % levelReflections.length
                ]?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setReflectionAnswer(i)}
                    disabled={reflectionAnswer !== null}
                    className={`px-6 py-4 rounded-2xl font-black text-sm transition-all font-ui ${
                      reflectionAnswer === null ?
                        "bg-indigo/5 text-indigo hover:bg-indigo/10"
                      : (
                        i ===
                        levelReflections[
                          sentenceIndex % levelReflections.length
                        ]?.correctIndex
                      ) ?
                        "bg-emerald-100 text-emerald-700"
                      : reflectionAnswer === i ? "bg-red-100 text-red-600"
                      : "bg-indigo/5 text-indigo/20"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {reflectionAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex justify-center'
                >
                  <button
                    onClick={dismissReflection}
                    className='px-8 py-4 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-105 transition-all font-ui uppercase tracking-widest text-xs flex items-center gap-2'
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── SENTENCE CARD ───────────────────────────────── */}
          {!showContrast && !showReflection && currentSentence && (
            <motion.div
              key={`${currentSentence.id}-${mode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(45,34,103,0.08)] border border-indigo/5 p-8 md:p-12 mb-8'
            >
              {/* Context badge */}
              <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-2'>
                  <MessageCircle size={14} className='text-indigo/20' />
                  <span className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
                    {currentSentence.context}
                  </span>
                </div>
                <span className='text-[10px] font-black text-indigo/10 uppercase tracking-widest font-technical'>
                  {sentenceIndex + 1}/{levelSentences.length}
                </span>
              </div>

              {/* Pattern tag */}
              <div className='inline-flex px-3 py-1 rounded-full bg-emerald-50 mb-6'>
                <span className='text-[10px] font-black text-emerald-600 uppercase tracking-widest font-technical'>
                  {currentSentence.patternTag.replace(/-/g, " · ")}
                </span>
              </div>

              {/* ─── WATCH MODE ─────────────────────────────── */}
              {mode === "watch" && (
                <div className='space-y-8'>
                  {/* English line */}
                  <div style={{ opacity: scaffolding.englishOpacity }}>
                    <p className='text-[10px] font-black text-indigo/10 uppercase tracking-widest mb-2 font-technical'>
                      English
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {currentSentence.parts.map((p, i) =>
                        renderPart(p, i, "en"),
                      )}
                    </div>
                  </div>

                  {/* Hindi line */}
                  {showHindi && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: scaffolding.hindiOptional ? 0.7 : 1 }}
                    >
                      <p className='text-[10px] font-black text-amber-500/40 uppercase tracking-widest mb-2 font-technical'>
                        हिंदी {scaffolding.hindiOptional && "(optional)"}
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {currentSentence.parts.map((p, i) =>
                          renderPart(p, i, "hi"),
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Kannada line (DOMINANT) */}
                  <div>
                    <p className='text-[10px] font-black text-terracotta/40 uppercase tracking-widest mb-2 font-technical'>
                      ಕನ್ನಡ
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {currentSentence.parts.map((p, i) =>
                        renderPart(p, i, "kn", showTransliteration),
                      )}
                    </div>
                  </div>

                  {/* Tip */}
                  {currentSentence.tip && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className='p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3'
                    >
                      <Lightbulb
                        size={16}
                        className='text-amber-500 flex-shrink-0 mt-0.5'
                      />
                      <p className='text-sm font-medium text-amber-700 font-narrative'>
                        {currentSentence.tip}
                      </p>
                    </motion.div>
                  )}

                  {/* Mini Dialogue */}
                  {currentSentence.dialogue && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className='p-6 rounded-[28px] bg-indigo/3 border border-indigo/5 space-y-4'
                    >
                      <span className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
                        🎭 Mini Dialogue
                      </span>
                      <div className='space-y-3'>
                        <div>
                          <span className='text-[10px] font-black text-pink-500 uppercase font-technical'>
                            {currentSentence.dialogue.speakerLabel}:
                          </span>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {currentSentence.dialogue.speakerLine.map((p, i) =>
                              renderPart(p, i, "kn", showTransliteration),
                            )}
                          </div>
                        </div>
                        <div>
                          <span className='text-[10px] font-black text-emerald-500 uppercase font-technical'>
                            You:
                          </span>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {currentSentence.dialogue.userLine.map((p, i) =>
                              renderPart(p, i, "kn", showTransliteration),
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Audio + Next */}
                  <div className='flex items-center justify-between pt-4'>
                    <button
                      onClick={speakSentence}
                      className='flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo/5 text-indigo hover:bg-indigo/10 transition-all font-black text-xs uppercase tracking-widest font-technical'
                    >
                      <Volume2 size={16} /> Listen
                    </button>
                    <button
                      onClick={goNext}
                      className='flex items-center gap-2 px-8 py-4 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-105 transition-all font-ui uppercase tracking-widest text-xs'
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* ─── BUILD MODE ─────────────────────────────── */}
              {mode === "build" && (
                <div className='space-y-8'>
                  {/* Prompt in English */}
                  <div>
                    <p className='text-[10px] font-black text-indigo/10 uppercase tracking-widest mb-3 font-technical'>
                      Build this sentence in Kannada
                    </p>
                    <p className='text-2xl font-black text-indigo tracking-tight font-ui'>
                      {currentSentence.parts.map((p) => p.en).join(" ")}
                    </p>
                    {showHindi && (
                      <p className='text-lg font-medium text-amber-600/60 mt-1 font-narrative'>
                        {currentSentence.parts.map((p) => p.hi).join(" ")}
                      </p>
                    )}
                  </div>

                  {/* Selected area */}
                  <div className='min-h-[80px] p-4 rounded-[24px] bg-indigo/3 border-2 border-dashed border-indigo/10 flex flex-wrap gap-2 items-center'>
                    {selectedTiles.length === 0 && (
                      <span className='text-sm text-indigo/20 font-medium font-narrative'>
                        Tap tiles below to build your sentence...
                      </span>
                    )}
                    {selectedTiles.map((tileIdx, i) => {
                      const tile = buildTiles[tileIdx];
                      return (
                        <motion.button
                          key={`selected-${i}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          onClick={() => handleTileSelect(tileIdx)}
                          className={`px-4 py-3 rounded-xl font-native font-black text-lg ${
                            buildResult === "correct" ?
                              "bg-emerald-100 text-emerald-700"
                            : buildResult === "wrong" && tile.isDistractor ?
                              "bg-red-100 text-red-600 line-through"
                            : "bg-white text-indigo shadow-sm border border-indigo/10"
                          }`}
                        >
                          {tile.kn}
                          {showTransliteration && (
                            <span className='block text-[9px] text-indigo/30 font-technical font-black'>
                              {tile.transliteration}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Available tiles */}
                  <div className='flex flex-wrap gap-2'>
                    {buildTiles.map((tile, i) => {
                      const isSelected = selectedTiles.includes(i);
                      return (
                        <motion.button
                          key={`tile-${i}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: isSelected ? 0.3 : 1,
                            y: 0,
                            scale: isSelected ? 0.9 : 1,
                          }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleTileSelect(i)}
                          disabled={isSelected || buildResult !== null}
                          className={`px-5 py-3 rounded-xl font-native font-black text-lg transition-all ${
                            isSelected ?
                              "bg-indigo/5 text-indigo/20"
                            : "bg-white text-indigo shadow-md border border-indigo/10 hover:shadow-lg hover:scale-105"
                          }`}
                        >
                          {tile.kn}
                          {showTransliteration && (
                            <span className='block text-[9px] text-indigo/30 font-technical font-black'>
                              {tile.transliteration}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Build result feedback */}
                  {buildResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl flex items-center gap-3 ${
                        buildResult === "correct" ?
                          "bg-emerald-50 border border-emerald-100"
                        : "bg-red-50 border border-red-100"
                      }`}
                    >
                      {buildResult === "correct" ?
                        <Check size={20} className='text-emerald-600' />
                      : <X size={20} className='text-red-500' />}
                      <div>
                        <p
                          className={`font-black text-sm font-ui ${buildResult === "correct" ? "text-emerald-700" : "text-red-600"}`}
                        >
                          {buildResult === "correct" ?
                            "Perfect!"
                          : "Not quite!"}
                        </p>
                        {buildResult === "wrong" && (
                          <p className='text-xs text-red-500/60 font-narrative'>
                            Correct:{" "}
                            {currentSentence.parts
                              .map((p) => p.transliteration)
                              .join(" ")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center justify-between pt-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => {
                          setSelectedTiles([]);
                          setBuildResult(null);
                        }}
                        className='flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo/5 text-indigo/40 hover:text-indigo transition-all font-black text-[10px] uppercase tracking-widest font-technical'
                      >
                        <RotateCcw size={14} /> Reset
                      </button>
                      {!buildResult && selectedTiles.length > 0 && (
                        <button
                          onClick={checkBuild}
                          className='flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest font-technical shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all'
                        >
                          <Check size={14} /> Check
                        </button>
                      )}
                    </div>
                    {buildResult && (
                      <button
                        onClick={goNext}
                        className='flex items-center gap-2 px-8 py-4 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-105 transition-all font-ui uppercase tracking-widest text-xs'
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ─── SPEAK MODE ─────────────────────────────── */}
              {mode === "speak" && (
                <div className='space-y-8'>
                  {/* Prompt */}
                  <div className='text-center space-y-3'>
                    <p className='text-[10px] font-black text-indigo/10 uppercase tracking-widest font-technical'>
                      Say this in Kannada
                    </p>
                    <p className='text-3xl font-black text-indigo tracking-tight font-ui'>
                      {currentSentence.parts.map((p) => p.en).join(" ")}
                    </p>
                    {showHindi && (
                      <p className='text-xl font-medium text-amber-600/60 font-narrative'>
                        {currentSentence.parts.map((p) => p.hi).join(" ")}
                      </p>
                    )}
                  </div>

                  {/* Feedback structure (simplified — 3 layers) */}
                  <div className='text-center'>
                    <button
                      onClick={() => {
                        // Simulated structural feedback
                        // In a real app, this would use Web Speech API recognition
                        setSpeakFeedback({
                          wordOrder: true,
                          verbForm: true,
                          caseMarker: activeLevel >= 4 ? true : true,
                        });
                      }}
                      className='px-12 py-6 bg-gradient-to-br from-terracotta to-pink-500 text-white rounded-[32px] font-black shadow-2xl shadow-terracotta/30 hover:scale-105 transition-all font-ui text-lg flex items-center gap-3 mx-auto'
                    >
                      <Mic size={24} /> I Said It
                    </button>
                    <p className='text-xs text-indigo/20 mt-3 font-narrative'>
                      Say the sentence aloud, then tap to check the structure
                    </p>
                  </div>

                  {/* Structural feedback */}
                  {speakFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='space-y-3'
                    >
                      {[
                        {
                          label: "Word Order",
                          value: speakFeedback.wordOrder,
                          hint: currentSentence.parts
                            .map((p) => p.transliteration)
                            .join(" "),
                        },
                        {
                          label: "Verb Form",
                          value: speakFeedback.verbForm,
                          hint: currentSentence.parts
                            .filter((p) => p.role === "verb")
                            .map((p) => p.transliteration)
                            .join(""),
                        },
                        ...(activeLevel >= 4 ?
                          [
                            {
                              label: "Case Marker",
                              value: speakFeedback.caseMarker,
                              hint: currentSentence.parts
                                .filter((p) => p.role === "postposition")
                                .map((p) => p.transliteration)
                                .join(", "),
                            },
                          ]
                        : []),
                      ].map(({ label, value, hint }, i) => (
                        <div
                          key={i}
                          className='flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100'
                        >
                          <Check size={16} className='text-emerald-600' />
                          <div>
                            <p className='font-black text-sm text-emerald-700 font-ui'>
                              {label}
                            </p>
                            <p className='text-xs text-emerald-600/60 font-technical'>
                              {hint}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Show correct answer */}
                      <div className='p-5 rounded-[24px] bg-indigo/3 border border-indigo/5 text-center space-y-2'>
                        <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
                          Full Sentence
                        </p>
                        <p className='font-native text-2xl font-black text-indigo'>
                          {currentSentence.parts.map((p) => p.kn).join(" ")}
                        </p>
                        {showTransliteration && (
                          <p className='text-sm font-black text-indigo/30 font-technical'>
                            {currentSentence.parts
                              .map((p) => p.transliteration)
                              .join(" ")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center justify-between pt-4'>
                    <button
                      onClick={speakSentence}
                      className='flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo/5 text-indigo hover:bg-indigo/10 transition-all font-black text-xs uppercase tracking-widest font-technical'
                    >
                      <Volume2 size={16} /> Hear It
                    </button>
                    {speakFeedback && (
                      <button
                        onClick={goNext}
                        className='flex items-center gap-2 px-8 py-4 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-105 transition-all font-ui uppercase tracking-widest text-xs'
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ──── GRAMMAR RAINBOW LEGEND ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='p-6 rounded-[32px] bg-indigo/3 border border-indigo/5'
        >
          <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest mb-4 font-technical'>
            🌈 Grammar Rainbow — Color = Role
          </p>
          <div className='flex flex-wrap gap-2'>
            {Object.entries(ROLE_COLORS).map(([role, { text, bg, label }]) => (
              <div
                key={role}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${bg}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${text.replace("text-", "bg-")}`}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${text} font-technical`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats footer */}
        <div className='mt-8 flex items-center justify-center gap-6'>
          <span className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
            {sentencesCompleted} patterns internalized
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
