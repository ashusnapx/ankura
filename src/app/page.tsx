"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/shared/TiltCard";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";
import {
  Play,
  Flower2,
  Mic,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Layout,
  Flame,
  ArrowUpRight,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { getUserProgress } from "@/lib/db/dexie";
import { getNextMission, ALL_MISSIONS } from "@/lib/data/missions";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { StreakCounter } from "@/components/shared/StreakCounter";
import { BottomNav } from "@/components/shared/BottomNav";
import { ProgressRing } from "@/components/shared/ProgressRing";
import type { Mission } from "@/lib/data/mission-types";

const GREETINGS = [
  { en: "Welcome back", kn: "ಮರಳಿ ಸ್ವಾಗತ", hi: "वापस स्वागत है" },
  { en: "Happy learning", kn: "ಖುಷಿಯ ಕಲಿಕೆ", hi: "खुशहाल सीखना" },
  {
    en: "Ready to practice?",
    kn: "ಅಭ್ಯಾಸಕ್ಕೆ ಸಿದ್ಧರೇ?",
    hi: "अभ्यास के लिए तैयार?",
  },
  { en: "Keep growing", kn: "ಬೆಳೆಯುತ್ತಿರಿ", hi: "बढ़ते रहें" },
  {
    en: "Your journey continues",
    kn: "ನಿಮ್ಮ ಪಯಣ ಮುಂದುವರಿಯಲಿ",
    hi: "आपकी यात्रा जारी है",
  },
  { en: "Master of Kannada", kn: "ಕನ್ನಡದ ಮಾಸ್ಟರ್", hi: "कन्नड़ के उस्ताद" },
  {
    en: "Start the day right",
    kn: "ದಿನವನ್ನು ಸರಿಯಾಗಿ ಆರಂಭಿಸಿ",
    hi: "दिन की सही शुरुआत",
  },
  { en: "Language is power", kn: "ಭಾಷೆಯೇ ಶಕ್ತಿ", hi: "भाषा ही शक्ति है" },
  {
    en: "Connect through words",
    kn: "ಪದಗಳ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ",
    hi: "शब्दों से जुड़ें",
  },
  {
    en: "Explore Bangalore",
    kn: "ಬೆಂಗಳೂರನ್ನು ಅನ್ವೇಷಿಸಿ",
    hi: "बेंगलुरु का अन्वेषण करें",
  },
  {
    en: "Talk like a local",
    kn: "ಸ್ಥಳೀಯರಂತೆ ಮಾತನಾಡಿ",
    hi: "स्थानीय की तरह बात करें",
  },
  {
    en: "Level up today",
    kn: "ಇಂದು ಮಟ್ಟವನ್ನು ಹೆಚ್ಚಿಸಿ",
    hi: "आज लेवल अप करें",
  },
  { en: "Story time", kn: "ಕಥೆಯ ಸಮಯ", hi: "कहानी का समय" },
  { en: "The gift of gab", kn: "ಮಾತಿನ ಮಲ್ಲ", hi: "बातूनी का तोहफा" },
  {
    en: "Brilliance in learning",
    kn: "ಕಲಿಕೆಯಲ್ಲಿ ತೇಜಸ್ಸು",
    hi: "सीखने में तेज़",
  },
  { en: "Step by step", kn: "ಹಂತ ಹಂತವಾಗಿ", hi: "कदम दर कदम" },
  { en: "Vibrant Kannada", kn: "ವೈವಿಧ್ಯಮಯ ಕನ್ನಡ", hi: "जीवंत कन्नड़" },
  { en: "Fluent future", kn: "ಸರಾಗ ಭವಿಷ್ಯ", hi: "धाराप्रवाह भविष्य" },
  { en: "Smart Explorer", kn: "ಸ್ಮಾರ್ಟ್ ಅನ್ವೇಷಕ", hi: "स्मार्ट अन्वेषक" },
  { en: "Legendary progress", kn: "ಪೌರಾಣಿಕ ಪ್ರಗತಿ", hi: "शानदार प्रगति" },
];

// --- DETERMINISTIC COSMOS ELEMENTS ---
const CosmosBackground = () => <AnimatedCosmos density={15} />;

export default function HomePage() {
  const router = useRouter();
  const { current: streak } = useStreak();
  const { progress, completedMissionIds, isLoading } = useProgress();
  const [nextMission, setNextMission] = useState<Mission | null>(null);
  const [greeting, setGreeting] = useState<{
    en: string;
    kn: string;
    hi: string;
  } | null>(null);

  useEffect(() => {
    // Pick a random greeting from the array on client mount
    const randomIdx = Math.floor(Math.random() * GREETINGS.length);
    setGreeting(GREETINGS[randomIdx]);
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const p = await getUserProgress();
      if (!p) {
        router.push("/onboarding");
        return;
      }
      const next = getNextMission(completedMissionIds);
      setNextMission(next || null);
    };
    if (!isLoading) checkOnboarding();
  }, [isLoading, completedMissionIds, router]);

  const progressPercent = useMemo(() => {
    const wordsLearned = progress?.wordsEncountered?.length || 0;
    const totalWords = ALL_MISSIONS.reduce((acc, m) => acc + m.words.length, 0);
    return totalWords > 0 ? Math.round((wordsLearned / totalWords) * 100) : 0;
  }, [progress]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className='text-6xl text-terracotta/20'
        >
          ✦
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen relative'>
      <CosmosBackground />

      <div className='container-responsive pt-12 pb-32'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='space-y-20'
        >
          {/* Header Area */}
          <div className='flex flex-col md:flex-row items-center md:items-start justify-between gap-10'>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className='relative z-50 space-y-6 text-center md:text-left'
            >
              <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gold/20 shadow-sm'>
                <div className='w-2 h-2 rounded-full bg-green' />
                <span className='text-[10px] font-black text-indigo/60 uppercase tracking-[0.2em]'>
                  Live Learning Session
                </span>
              </div>

              <div className='space-y-4 py-4'>
                {greeting ?
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='space-y-2'
                  >
                    <h1 className='text-4xl sm:text-6xl md:text-8xl font-black text-indigo tracking-tighter leading-tight'>
                      {greeting.en},{" "}
                      <span className='text-terracotta'>
                        {progress?.userName || "Explorer"}
                      </span>
                    </h1>
                    <p className='font-kannada text-2xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo via-terracotta to-indigo bg-clip-text text-transparent leading-relaxed tracking-tight'>
                      {greeting.kn}
                    </p>
                  </motion.div>
                : <div className='h-40 w-full animate-pulse bg-indigo/5 rounded-[40px]' />
                }
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className='relative z-[100] flex flex-col items-center'
            >
              <div className='bg-white/90 backdrop-blur-2xl p-8 rounded-[40px] border border-gold/20 shadow-2xl relative group'>
                {/* Ensure StreakCounter/Calendar has highest priority */}
                <div className='absolute -top-3 -right-3 w-10 h-10 bg-terracotta text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform z-50'>
                  <Flame size={20} />
                </div>
                <StreakCounter count={streak} showMessage={true} />
              </div>
            </motion.div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
            <div className='lg:col-span-8 space-y-16'>
              {/* --- 3D HERO MISSION --- */}
              {nextMission && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TiltCard>
                    <Link href={`/missions/${nextMission.id}`}>
                      <div className='group relative overflow-hidden rounded-[40px] md:rounded-[60px] bg-indigo p-6 sm:p-12 text-white shadow-[0_40px_100px_-20px_rgba(45,34,103,0.3)] transition-all cursor-pointer'>
                        {/* Immersive FX */}
                        <div className='absolute inset-0 bg-gradient-to-br from-indigo via-indigo to-terracotta/20 opacity-90' />
                        <div className='absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-40 translate-x-40 blur-[120px] group-hover:bg-white/10 transition-all duration-1000' />

                        <div className='relative z-10 space-y-20'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10'>
                              <Sparkles size={14} className='text-gold' />
                              <span className='text-[10px] font-black uppercase tracking-[0.2em]'>
                                Recommended Next Step
                              </span>
                            </div>
                            <div className='flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]'>
                              <Clock size={12} strokeWidth={3} />~
                              {nextMission.estimatedMinutes} Mins
                            </div>
                          </div>

                          <div className='flex flex-col md:flex-row md:items-center gap-6 md:gap-12'>
                            <motion.div
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              className='flex h-24 w-24 sm:h-40 sm:w-40 shrink-0 items-center justify-center rounded-[32px] sm:rounded-[48px] bg-white/10 backdrop-blur-xl border border-white/20 text-5xl sm:text-7xl shadow-2xl relative overflow-hidden group-hover:shadow-terracotta/20'
                            >
                              <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent' />
                              {nextMission.illustration}
                            </motion.div>
                            <div className='space-y-4'>
                              <p className='text-xs font-black text-gold uppercase tracking-[0.4em]'>
                                Story Odyssey
                              </p>
                              <h2 className='text-4xl sm:text-6xl font-black tracking-tighter leading-[0.9] text-white'>
                                {nextMission.title}
                              </h2>
                              <p className='text-xl sm:text-3xl font-bold text-white/40 text-kannada'>
                                {nextMission.titleKannada}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center justify-between border-t border-white/10 pt-8 sm:pt-10'>
                            <div className='inline-flex items-center gap-4 sm:gap-5 rounded-full bg-white px-8 sm:px-10 py-4 sm:py-6 text-xs sm:text-sm font-black text-indigo transition-all group-hover:bg-terracotta group-hover:text-white shadow-2xl hover:scale-105 active:scale-95'>
                              <Play
                                size={16}
                                fill='currentColor'
                                className='sm:w-5 sm:h-5'
                              />
                              <span className='uppercase tracking-[0.2em]'>
                                Begin Journey
                              </span>
                            </div>
                            <div className='hidden md:flex flex-col items-end opacity-40 group-hover:opacity-100 transition-opacity'>
                              <p className='text-[10px] font-black uppercase tracking-[0.1em]'>
                                Target Vocabulary
                              </p>
                              <p className='text-xs font-bold'>
                                {nextMission.words.length} New Expressions
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                </motion.div>
              )}

              {/* --- PRACTICE HUB --- */}
              <div className='space-y-10'>
                <div className='flex items-center justify-between px-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center border border-gold/20'>
                      <Layout size={20} className='text-indigo' />
                    </div>
                    <h3 className='text-lg font-black text-indigo tracking-tight'>
                      Daily Practice Hub
                    </h3>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                  {[
                    {
                      href: "/practice/bridge",
                      icon: ArrowRight,
                      label: "Bridge Practice",
                      color: "#E07A5F",
                      desc: "The Hindi Advantage",
                      tag: "Cognates",
                    },
                    {
                      href: "/practice/shadow-speaking",
                      icon: Mic,
                      label: "Shadow Speaking",
                      color: "#3D405B",
                      desc: "Native Fluency",
                      tag: "Audio",
                    },
                    {
                      href: "/garden",
                      icon: Flower2,
                      label: "Word Garden",
                      color: "#81B29A",
                      desc: "Memory Palace",
                      tag: "Review",
                    },
                    {
                      href: "/practice/writing",
                      icon: PenTool,
                      label: "Script Scribe",
                      color: "#F2CC8F",
                      desc: "The Art of Tracing",
                      tag: "Writing",
                    },
                  ].map((item, i) => (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ y: -12, scale: 1.02 }}
                        className='group h-full rounded-[40px] sm:rounded-[48px] bg-white border border-gold/20 p-8 sm:p-10 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:border-indigo/10 cursor-pointer relative overflow-hidden'
                      >
                        <div className='relative z-10 flex items-start justify-between'>
                          <div className='space-y-8'>
                            <div
                              className='flex h-16 w-16 items-center justify-center rounded-[24px] transition-all group-hover:rotate-12 duration-500'
                              style={{
                                backgroundColor: `${item.color}15`,
                                color: item.color,
                              }}
                            >
                              <item.icon size={28} strokeWidth={2.5} />
                            </div>
                            <div className='space-y-2'>
                              <p className='text-2xl font-black text-indigo tracking-tighter'>
                                {item.label}
                              </p>
                              <p className='text-[10px] font-black text-indigo/30 uppercase tracking-[0.1em]'>
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <div className='text-terracotta/20 group-hover:text-terracotta transition-colors duration-500'>
                            <ArrowUpRight size={24} />
                          </div>
                        </div>
                        <div className='absolute -bottom-6 -right-6 text-8xl font-black text-indigo/[0.02] transform group-hover:scale-120 transition-transform duration-700'>
                          {item.tag}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* --- SIDEBAR INSIGHTS --- */}
            <div className='lg:col-span-4'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className='relative lg:sticky lg:top-28 rounded-[40px] sm:rounded-[56px] bg-white border border-gold/20 p-8 sm:p-10 shadow-2xl shadow-indigo/5 space-y-12 overflow-hidden'
              >
                <div className='absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full -translate-y-16 translate-x-16 blur-2xl opacity-50' />

                <div className='relative z-10'>
                  <p className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.2em] mb-10'>
                    Current Status
                  </p>

                  <div className='flex flex-col items-center gap-12'>
                    <div className='relative'>
                      <ProgressRing
                        progress={progressPercent}
                        size={220}
                        strokeWidth={14}
                        color='#E07A5F'
                        showValue={false}
                      />
                      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                        <span className='text-6xl font-black text-indigo leading-none tracking-tighter'>
                          {progressPercent}%
                        </span>
                        <span className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.4em] mt-4'>
                          Progress
                        </span>
                      </div>
                    </div>

                    <div className='w-full space-y-4'>
                      {[
                        {
                          label: "Vocabulary",
                          value: progress?.wordsEncountered?.length || 0,
                          color: "bg-terracotta",
                        },
                        {
                          label: "Completion",
                          value: `${completedMissionIds.length} Stories`,
                          color: "bg-gold-dark",
                        },
                        {
                          label: "Streak",
                          value: `${streak} Days`,
                          color: "bg-green",
                        },
                      ].map((stat, i) => (
                        <div key={i} className='flex flex-col gap-2'>
                          <div className='flex justify-between items-end px-1'>
                            <span className='text-[10px] font-black text-indigo/40 uppercase tracking-widest'>
                              {stat.label}
                            </span>
                            <span className='text-sm font-black text-indigo'>
                              {stat.value}
                            </span>
                          </div>
                          <div className='h-2 bg-secondary rounded-full overflow-hidden'>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              className={`h-full ${stat.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link href='/dashboard'>
                  <div className='group flex items-center justify-between p-7 rounded-[32px] bg-indigo text-white shadow-2xl shadow-indigo/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center'>
                        <TrendingUp size={18} />
                      </div>
                      <span className='text-sm font-black uppercase tracking-[0.2em]'>
                        Detailed Stats
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className='opacity-40 group-hover:translate-x-1 transition-transform'
                    />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className='md:hidden'>
        <BottomNav />
      </div>
    </div>
  );
}
