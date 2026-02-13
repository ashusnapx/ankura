"use client";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  Share2,
  Linkedin,
  Twitter,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { getMissionById } from "@/lib/data/missions";
import type { StoryScene, StoryChoice } from "@/lib/data/mission-types";
import { useProgress } from "@/hooks/useProgress";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useStreak } from "@/hooks/useStreak";
import { speakText, isSpeechSynthesisSupported } from "@/lib/utils/speech";
import { db } from "@/lib/db/dexie";
import { trackEvent } from "@/lib/utils/analytics";
import { Confetti } from "@/components/shared/Confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const mission = getMissionById(id);
  const { completeMission, addWordsEncountered } = useProgress();
  const { markTodayComplete } = useStreak();
  const { addXP } = useAppStore();
  const {
    isListening,
    transcript,
    accuracy,
    isSupported,
    startListening,
    stopListening,
    reset,
  } = useSpeechRecognition();

  const [sceneIndex, setSceneIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [speechMode, setSpeechMode] = useState(false);
  const [currentExpected, setCurrentExpected] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackEvent("mission_start", { missionId: id });
  }, [id]);

  const currentScene: StoryScene | undefined = mission?.scenes[sceneIndex];

  const handleAdvance = useCallback(
    async (nextSceneId?: string) => {
      let nextIdx: number;
      if (nextSceneId) {
        nextIdx = mission?.scenes.findIndex((s) => s.id === nextSceneId) ?? -1;
      } else {
        nextIdx = sceneIndex + 1;
      }

      if (
        nextIdx !== undefined &&
        nextIdx >= 0 &&
        nextIdx < (mission?.scenes.length || 0)
      ) {
        // Record words introduced
        const scene = mission?.scenes[nextIdx];
        if (scene?.wordsIntroduced) {
          await addWordsEncountered(scene.wordsIntroduced);
          // Add words to DB
          for (const wordId of scene.wordsIntroduced) {
            const word = mission?.words.find((w) => w.id === wordId);
            if (word) {
              const existing = await db.words.get(wordId);
              if (!existing) {
                await db.words.put({
                  id: wordId,
                  kannadaText: word.kannada,
                  transliteration: word.transliteration,
                  hindi: word.hindi,
                  english: word.english,
                  firstSeenDate: new Date().toISOString(),
                  lastReviewDate: new Date().toISOString(),
                  reviewLevel: 0,
                  health: 100,
                  correctCount: 0,
                  incorrectCount: 0,
                  missionContext: id,
                  emotionalAnchor: word.emotionalHint,
                });
              }
            }
          }
        }
        setSceneIndex(nextIdx);
        setSelectedChoice(null);
        setSpeechMode(false);
        setShowResult(false);
        setTextInput("");
        reset();
      }
    },
    [mission, addWordsEncountered, id, reset, sceneIndex],
  );

  const handleMissionComplete = useCallback(async () => {
    try {
      setIsSaving(true);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      await completeMission(id, elapsed);
      await markTodayComplete(Math.round(elapsed / 60));

      // Award XP based on mission difficulty and words
      const xpReward =
        (mission?.difficulty || 1) * 100 + (mission?.words.length || 0) * 10;
      addXP(xpReward);

      trackEvent("mission_complete", {
        missionId: id,
        timeSpent: elapsed,
        xpEarned: xpReward,
      });
      setShowConfetti(true);

      // Give a moment for confetti and state update
      setTimeout(() => {
        router.push("/missions");
      }, 2000);
    } catch (error) {
      console.error("Failed to complete mission:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    id,
    startTime,
    completeMission,
    markTodayComplete,
    router,
    mission,
    addXP,
  ]);

  const handleChoiceSelect = (choice: StoryChoice) => {
    setSelectedChoice(choice.id);
    if (choice.speakRequired && isSupported) {
      setSpeechMode(true);
      setCurrentExpected(choice.kannada); // Pass Kannada script instead of transliteration
    } else {
      setTimeout(() => handleAdvance(choice.nextSceneId), 500);
    }
  };

  const handleSpeechSubmit = (choice: StoryChoice) => {
    setShowResult(true);
    setTimeout(() => handleAdvance(choice.nextSceneId), 1500);
  };

  const handleTextSubmit = (choice: StoryChoice) => {
    setShowResult(true);
    setTimeout(() => handleAdvance(choice.nextSceneId), 800);
  };

  if (!mission || !currentScene) {
    return (
      <div className='min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center gap-6'>
        <div className='w-24 h-24 rounded-[32px] bg-secondary flex items-center justify-center text-5xl'>
          🔍
        </div>
        <div className='space-y-2'>
          <h2 className='text-2xl font-black text-indigo tracking-tight'>
            Mission Not Found
          </h2>
          <p className='text-sm font-medium text-indigo/40'>
            We couldn&apos;t find the chapter you&apos;re looking for. It might
            be coming soon!
          </p>
        </div>
        <div className='flex flex-col gap-3 w-full max-w-xs'>
          <button
            onClick={() => router.push("/missions")}
            className='w-full py-4 rounded-2xl bg-indigo text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo/20 hover:scale-[1.02] active:scale-[0.98] transition-all'
          >
            Explore Stories
          </button>
          <button
            onClick={() => router.push("/")}
            className='w-full py-4 rounded-2xl bg-secondary text-indigo font-black text-sm uppercase tracking-widest hover:bg-gold-dark/10 transition-all'
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const progress = ((sceneIndex + 1) / mission.scenes.length) * 100;
  const activeChoice = currentScene.choices?.find(
    (c) => c.id === selectedChoice,
  );
  const isComplete = currentScene.isEnding;

  return (
    <div className='min-h-screen bg-white'>
      <Confetti show={showConfetti} />

      {/* Header */}
      <div className='sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gold-dark/30 px-4 py-4'>
        <div className='mx-auto max-w-lg flex items-center gap-4'>
          <button
            onClick={() => router.back()}
            className='text-indigo/40 hover:text-indigo transition-colors'
            aria-label='Go back'
          >
            <ArrowLeft size={22} />
          </button>
          <div className='flex-1 px-2'>
            <div className='h-1 rounded-full bg-gold-dark/20 overflow-hidden'>
              <motion.div
                className='h-full rounded-full bg-terracotta'
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
          </div>
          <span className='text-[10px] font-bold tracking-widest text-indigo/30 uppercase'>
            {sceneIndex + 1} / {mission.scenes.length}
          </span>
        </div>
      </div>

      {/* Scene Content */}
      <div className='mx-auto max-w-lg px-6 py-10'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className='space-y-10'
          >
            {/* Illustration */}
            <div className='flex justify-center'>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className='flex h-28 w-28 items-center justify-center rounded-[32px] bg-secondary text-6xl shadow-inner-white'
              >
                {currentScene.illustration}
              </motion.div>
            </div>

            {/* Narrative */}
            <motion.p className='text-lg font-medium text-indigo leading-snug text-center tracking-tight'>
              {currentScene.narrative}
            </motion.p>

            {/* Dialogue */}
            {currentScene.kannadaDialogue && (
              <motion.div className='rounded-[24px] bg-secondary p-7'>
                {currentScene.speaker && (
                  <p className='text-[10px] font-bold text-terracotta mb-3 uppercase tracking-widest'>
                    {currentScene.speaker}
                  </p>
                )}
                <div className='space-y-2'>
                  <p className='text-kannada text-3xl font-bold text-indigo leading-tight'>
                    {currentScene.kannadaDialogue}
                  </p>
                  <p className='text-md font-medium text-indigo-light'>
                    {currentScene.transliteration}
                  </p>
                </div>

                <div className='mt-6 pt-6 border-t border-gold-dark/30 flex items-center justify-between'>
                  <div className='flex flex-wrap gap-2'>
                    <div className='text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-indigo/40 uppercase tracking-tighter'>
                      HI: {currentScene.hindiHint}
                    </div>
                    <div className='text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-indigo/40 uppercase tracking-tighter'>
                      EN: {currentScene.englishHint}
                    </div>
                  </div>
                  {isSpeechSynthesisSupported() && (
                    <button
                      onClick={() => speakText(currentScene.kannadaDialogue!)}
                      className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo/40 hover:text-terracotta hover:scale-110 transition-all shadow-sm'
                      aria-label='Listen'
                    >
                      <Volume2 size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Choices */}
            {currentScene.choices && !isComplete && (
              <motion.div className='space-y-4 pt-4'>
                <p className='text-[10px] font-bold text-indigo/30 uppercase tracking-[0.2em] text-center mb-6'>
                  Your Response
                </p>
                {currentScene.choices.map((choice, i) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={selectedChoice !== null}
                    className={`w-full rounded-[20px] p-6 text-left transition-all relative overflow-hidden group ${
                      selectedChoice === choice.id ?
                        "bg-terracotta text-white shadow-xl shadow-terracotta/20 scale-[0.98]"
                      : "bg-white border-2 border-gold hover:border-terracotta/30 hover:shadow-lg active:scale-95"
                    } disabled:opacity-60`}
                  >
                    <div className='flex items-start gap-4'>
                      {choice.speakRequired && (
                        <Mic
                          size={18}
                          className={`mt-1 shrink-0 ${selectedChoice === choice.id ? "text-white" : "text-terracotta/40"}`}
                        />
                      )}
                      <div className='space-y-1'>
                        <p
                          className={`text-kannada text-xl font-bold ${selectedChoice === choice.id ? "text-white" : "text-indigo"}`}
                        >
                          {choice.kannada}
                        </p>
                        <p
                          className={`text-sm font-medium ${selectedChoice === choice.id ? "text-white/80" : "text-indigo-light"}`}
                        >
                          {choice.transliteration}
                        </p>
                        <div
                          className={`flex gap-3 mt-2 text-[10px] font-bold uppercase tracking-tighter ${selectedChoice === choice.id ? "text-white/60" : "text-indigo/30"}`}
                        >
                          <span>HI: {choice.hindi}</span>
                          <span>EN: {choice.english}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Linear Advancement Button */}
            {!currentScene.choices && !isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='pt-8 flex justify-center'
              >
                <button
                  onClick={() => handleAdvance()}
                  className='group flex items-center gap-3 rounded-2xl bg-indigo px-10 py-5 text-white font-black hover:bg-indigo/90 active:scale-95 transition-all shadow-xl shadow-indigo/20'
                >
                  Continue{" "}
                  <ArrowLeft
                    size={20}
                    className='rotate-180 transition-transform group-hover:translate-x-1'
                  />
                </button>
              </motion.div>
            )}

            {/* Speech Mode */}
            {speechMode && activeChoice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='rounded-[32px] bg-indigo p-8 text-white shadow-2xl relative overflow-hidden'
              >
                <div className='absolute top-0 left-0 w-full h-1 bg-white/10 overflow-hidden'>
                  {isListening && (
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className='w-1/2 h-full bg-terracotta'
                    />
                  )}
                </div>

                <p className='text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] text-center mb-8'>
                  Speak Now
                </p>

                <div className='text-center space-y-4 mb-10'>
                  <p className='text-kannada text-4xl font-bold leading-tight'>
                    {activeChoice.kannada}
                  </p>
                  <p className='text-lg font-medium text-white/60'>
                    {activeChoice.transliteration}
                  </p>
                </div>

                {isSupported ?
                  <div className='flex flex-col items-center gap-8'>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        isListening ? stopListening() : (
                          startListening(currentExpected)
                        )
                      }
                      className={`flex h-24 w-24 items-center justify-center rounded-full transition-all shadow-xl ${
                        isListening ?
                          "bg-destructive animate-pulse scale-110 shadow-destructive/50"
                        : "bg-terracotta shadow-terracotta/50"
                      }`}
                    >
                      {isListening ?
                        <MicOff size={32} />
                      : <Mic size={32} />}
                    </motion.button>

                    {transcript && (
                      <div className='text-center space-y-2'>
                        <p className='text-sm text-white/40 italic'>
                          &ldquo;{transcript}&rdquo;
                        </p>
                        <div className='inline-block rounded-full bg-white/10 px-4 py-1'>
                          <p
                            className={`text-xl font-black ${
                              accuracy >= 70 ? "text-green"
                              : accuracy >= 40 ? "text-gold"
                              : "text-destructive"
                            }`}
                          >
                            {accuracy}%
                          </p>
                        </div>
                      </div>
                    )}

                    {(transcript || showResult) && (
                      <button
                        onClick={() => handleSpeechSubmit(activeChoice)}
                        className='w-full rounded-2xl bg-white py-4 text-indigo font-bold text-sm tracking-wide shadow-lg active:scale-95 transition-all'
                      >
                        Continue
                      </button>
                    )}
                  </div>
                : /* Text fallback - Refined */
                  <div className='space-y-6'>
                    <p className='text-xs text-white/40 text-center leading-relaxed'>
                      Type the transliteration to continue:
                    </p>
                    <input
                      type='text'
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={activeChoice.transliteration}
                      className='w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-center text-white text-lg font-medium focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/10'
                    />
                    <button
                      onClick={() => handleTextSubmit(activeChoice)}
                      className='w-full rounded-2xl bg-white py-4 text-indigo font-bold text-sm tracking-wide shadow-lg'
                      disabled={!textInput.trim()}
                    >
                      Verify Text
                    </button>
                  </div>
                }
              </motion.div>
            )}

            {/* Mission Complete */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='text-center space-y-8 py-10'
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className='text-7xl'
                >
                  🎉
                </motion.div>
                <div className='space-y-2'>
                  <h3 className='text-3xl font-black text-indigo tracking-tight'>
                    Chapter Finished
                  </h3>
                  <p className='text-md font-medium text-indigo-light'>
                    You mastered {mission.words.length} new expressions today.
                  </p>
                </div>

                <div className='flex flex-wrap justify-center gap-3 py-4'>
                  {mission.words.map((w) => (
                    <div
                      key={w.id}
                      className='rounded-xl bg-gold px-4 py-2 text-center'
                    >
                      <p className='text-kannada text-lg font-bold text-indigo'>
                        {w.kannada}
                      </p>
                      <p className='text-[10px] font-bold text-indigo-light uppercase tracking-tighter'>
                        {w.english}
                      </p>
                    </div>
                  ))}
                </div>

                <div className='flex flex-col gap-4 pt-6'>
                  <button
                    onClick={handleMissionComplete}
                    disabled={isSaving}
                    className='w-full rounded-2xl bg-terracotta py-5 text-white font-bold text-base shadow-xl shadow-terracotta/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    {isSaving ?
                      <>
                        <Loader2 className='animate-spin' size={20} />
                        Saving Progress...
                      </>
                    : "Finish and Save"}
                  </button>
                  <div className='flex gap-4'>
                    <button className='flex-1 rounded-2xl bg-secondary py-4 text-indigo font-bold text-sm tracking-wide transition-all hover:bg-gold-dark/20'>
                      Practice Vocab
                    </button>

                    <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                      <DialogTrigger asChild>
                        <button className='w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-indigo/40 hover:text-indigo hover:bg-gold-dark/20 transition-all'>
                          <Share2 size={20} />
                        </button>
                      </DialogTrigger>
                      <DialogContent className='rounded-[32px] max-w-sm border-gold-dark/20 bg-white p-8'>
                        <DialogHeader>
                          <DialogTitle className='text-2xl font-black text-indigo'>
                            Share Success
                          </DialogTitle>
                          <DialogDescription className='text-indigo-light font-medium'>
                            Tell the world about your Kannada journey!
                          </DialogDescription>
                        </DialogHeader>
                        <div className='grid grid-cols-1 gap-4 mt-6'>
                          <button
                            onClick={() => {
                              const text = `I just mastered ${mission.words.length} Kannada expressions on Ankura! 🚀 #Kannada #Ankura`;
                              window.open(
                                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                              );
                            }}
                            className='flex items-center gap-4 p-4 rounded-2xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-all font-bold'
                          >
                            <Twitter size={20} /> Share on Twitter
                          </button>
                          <button
                            onClick={() => {
                              const url = window.location.origin;
                              window.open(
                                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                              );
                            }}
                            className='flex items-center gap-4 p-4 rounded-2xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all font-bold'
                          >
                            <Linkedin size={20} /> Share on LinkedIn
                          </button>
                          <button
                            onClick={() => {
                              const text = `I just mastered ${mission.words.length} Kannada expressions on Ankura! Check it out at ${window.location.origin}`;
                              navigator.clipboard.writeText(text);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className='flex items-center justify-between p-4 rounded-2xl bg-secondary text-indigo hover:bg-gold-dark/20 transition-all font-bold'
                          >
                            <div className='flex items-center gap-4'>
                              <Copy size={20} /> Copy Link
                            </div>
                            {copied && (
                              <Check size={18} className='text-green' />
                            )}
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {currentScene.isClifhanger && (
                  <p className='text-xs font-bold text-indigo/20 uppercase tracking-[0.2em] pt-4'>
                    Stay tuned for Chapter{" "}
                    {parseInt(id.split("_").pop() || "0") + 1}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
