"use client";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Target,
  Flame,
  Trophy,
  Clock,
  BookOpen,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Crown,
  MousePointer2,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BottomNav } from "@/components/shared/BottomNav";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { useBridgeProgress } from "@/hooks/useBridgeProgress";
import { useAppStore } from "@/lib/store/useAppStore";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { ALL_MISSIONS } from "@/lib/data/missions";
import { BRIDGE_CATEGORIES, BRIDGE_WORDS } from "@/lib/data/bridge-vocab";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { current: streak, longest, history } = useStreak();
  const {
    progress,
    completedMissionIds,
    isLoading: progressLoading,
  } = useProgress();
  const {
    bridgeLevel,
    unlockedWordIds,
    isLoading: bridgeLoading,
  } = useBridgeProgress();
  const { user, stats: appStats, updateStats } = useAppStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoading = progressLoading || bridgeLoading || !mounted;

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const wordsLearned = progress?.wordsEncountered?.length || 0;
    const totalMissionsWords = ALL_MISSIONS.reduce(
      (acc, m) => acc + m.words.length,
      0,
    );
    const missionsDone = completedMissionIds.length;
    const totalMissions = ALL_MISSIONS.length;
    const minutes = progress?.totalMinutesLearned || 0;
    const bridgeWordsUnlocked = unlockedWordIds.length;

    // Category Mastery
    const categoryMastery = BRIDGE_CATEGORIES.map((cat) => {
      const wordsInCat = BRIDGE_WORDS.filter((w) => w.category === cat.id);
      const unlockedInCat = wordsInCat.filter((w) =>
        unlockedWordIds.includes(w.id),
      );
      const percentage =
        wordsInCat.length > 0 ?
          Math.round((unlockedInCat.length / wordsInCat.length) * 100)
        : 0;
      return {
        ...cat,
        percentage,
        count: unlockedInCat.length,
        total: wordsInCat.length,
      };
    });

    return {
      wordsLearned,
      totalMissionsWords,
      missionsDone,
      totalMissions,
      minutes,
      bridgeWordsUnlocked,
      categoryMastery,
    };
  }, [progress, completedMissionIds, unlockedWordIds]);

  // Sync with AppStore
  useEffect(() => {
    if (!isLoading) {
      updateStats({
        wordsMastered: stats.wordsLearned,
        storiesCompleted: stats.missionsDone,
        totalMinutes: stats.minutes,
        streakCount: streak,
        xp: user.xp,
        level: user.level,
      });
    }
  }, [isLoading, stats, streak, user.xp, user.level, updateStats]);

  // Radar Data
  const radarData = useMemo(() => {
    const vocabScore = Math.min((stats.wordsLearned / 500) * 100, 100);
    const storyScore = Math.min((stats.missionsDone / 20) * 100, 100);
    const bridgeScore = Math.min((stats.bridgeWordsUnlocked / 100) * 100, 100);
    const streakScore = Math.min((streak / 30) * 100, 100);
    const consistency = Math.min((stats.minutes / 500) * 100, 100);

    return [
      { subject: "Vocab", A: vocabScore, fullMark: 100 },
      { subject: "Stories", A: storyScore, fullMark: 100 },
      { subject: "Bridge", A: bridgeScore, fullMark: 100 },
      { subject: "Streak", A: streakScore, fullMark: 100 },
      { subject: "Focus", A: consistency, fullMark: 100 },
    ];
  }, [stats, streak]);

  // Activity Data
  const activityData = useMemo(() => {
    return history.slice(-7).map((h) => ({
      day: new Date(h.date).toLocaleDateString("en-US", { weekday: "short" }),
      completed: h.completed ? 1 : 0,
    }));
  }, [history]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center font-sans'>
        <div className='w-12 h-12 rounded-full border-4 border-terracotta/20 border-t-terracotta animate-spin shadow-xl' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#FDFDFD] pb-32 font-sans'>
      {/* Premium Header */}
      <div className='relative overflow-hidden bg-indigo pt-20 pb-32 px-6'>
        <div className='absolute inset-0 opacity-10 bg-[url("https://grainy-gradients.vercel.app/noise.svg")]' />
        <div className='absolute top-0 right-0 w-64 h-64 bg-terracotta/20 rounded-full -translate-y-20 translate-x-20 blur-3xl animate-pulse' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full translate-y-20 -translate-x-10 blur-3xl' />

        <div className='mx-auto max-w-lg relative z-10'>
          <div className='flex items-center justify-between mb-8'>
            <div className='space-y-1'>
              <h1 className='text-4xl font-black text-white tracking-tight flex items-center gap-3 font-ui'>
                Hello{" "}
                <span className='text-gold font-narrative italic'>
                  {user.name}
                </span>
                <Crown className='text-gold' size={24} />
              </h1>
              <p className='text-white/40 text-sm font-black uppercase tracking-[0.2em] font-technical'>
                Lvl {user.level} • {appStats.xp} XP Earned
              </p>
            </div>
            <div className='w-16 h-16 rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl shadow-2xl'>
              {user.avatar || "🧘"}
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex justify-between items-end'>
              <span className='text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-ui'>
                Level {user.level} Journey
              </span>
              <span className='text-xs font-black text-white font-technical'>
                {user.xp % 1000} / 1000 XP
              </span>
            </div>
            <div className='h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp % 1000) / 10}%` }}
                className='h-full bg-gradient-to-r from-terracotta to-gold rounded-full shadow-[0_0_20px_rgba(224,122,95,0.4)]'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-lg px-6 -mt-16 relative z-20'>
        <motion.div
          initial='hidden'
          animate='show'
          transition={{ staggerChildren: 0.1 }}
          className='space-y-8'
        >
          {/* Main Highlights Grid */}
          <motion.div variants={fadeUp} className='grid grid-cols-2 gap-4'>
            {[
              {
                icon: <Flame size={20} />,
                value: streak,
                label: "Day Streak",
                color: "text-terracotta",
                bg: "bg-terracotta/5",
              },
              {
                icon: <Clock size={20} />,
                value: `${stats.minutes}m`,
                label: "Engagement",
                color: "text-gold-dark",
                bg: "bg-gold/10",
              },
              {
                icon: <Trophy size={20} />,
                value: stats.wordsLearned,
                label: "Words Known",
                color: "text-green",
                bg: "bg-green/5",
              },
              {
                icon: <TrendingUp size={20} />,
                value: stats.missionsDone,
                label: "Stories Read",
                color: "text-indigo",
                bg: "bg-indigo/5",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className='bg-white/90 backdrop-blur-xl p-6 rounded-[40px] border border-gold/20 shadow-xl shadow-indigo/5 flex flex-col gap-4 group hover:scale-[1.02] transition-transform cursor-default'
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p
                    className={`text-4xl font-black tracking-tighter font-technical ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                  <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest leading-none mt-1 font-ui'>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Radar Visualization */}
          <motion.div
            variants={fadeUp}
            className='bg-white rounded-[44px] border border-gold/20 p-8 shadow-xl shadow-indigo/5'
          >
            <div className='flex items-center justify-between mb-8'>
              <div className='space-y-1'>
                <h3 className='text-lg font-black text-indigo tracking-tight font-ui'>
                  Skill Matrix
                </h3>
                <p className='text-[10px] font-bold text-indigo/30 uppercase tracking-widest font-ui'>
                  Core Competencies
                </p>
              </div>
              <Activity className='text-terracotta/30' size={20} />
            </div>

            <div className='h-[240px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <RadarChart
                  cx='50%'
                  cy='50%'
                  outerRadius='80%'
                  data={radarData}
                >
                  <PolarGrid stroke='#F2E9E1' strokeWidth={1} />
                  <PolarAngleAxis
                    dataKey='subject'
                    tick={{ fill: "#2D2267", fontSize: 10, fontWeight: 900 }}
                  />
                  <Radar
                    name='Skills'
                    dataKey='A'
                    stroke='#E07A5F'
                    fill='#E07A5F'
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Coach Insights (Redesigned) */}
          <motion.div variants={fadeUp} className='space-y-4'>
            <div className='flex items-center gap-2 px-2'>
              <Sparkles size={16} className='text-indigo' />
              <h3 className='text-sm font-black text-indigo uppercase tracking-widest font-ui'>
                Ankura AI Context
              </h3>
            </div>
            <div className='grid grid-cols-1 gap-3'>
              {[
                {
                  title: "Mastery Insight",
                  text: `Your ${[...radarData].sort((a, b) => b.A - a.A)[0].subject} is elite. Focus on ${[...radarData].sort((a, b) => a.A - b.A)[0].subject} to balance your profile.`,
                  icon: <MousePointer2 className='text-white' size={16} />,
                  color: "bg-indigo",
                },
                {
                  title: "Story Velocity",
                  text:
                    stats.missionsDone < 5 ?
                      "Read 2 more stories to unlock the 'Citizen' rank in Bangalore."
                    : "You've passed the 'Local' threshold. Keep exploring!",
                  icon: <Zap className='text-white' size={16} />,
                  color: "bg-terracotta",
                },
              ].map((insight, i) => (
                <div
                  key={i}
                  className={`${insight.color} text-white p-7 rounded-[32px] shadow-lg flex items-start gap-4 relative overflow-hidden group`}
                >
                  <div className='absolute right-0 bottom-0 opacity-10 group-hover:scale-150 transition-transform duration-1000'>
                    {insight.icon}
                  </div>
                  <div className='w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0'>
                    {insight.icon}
                  </div>
                  <div className='space-y-1 relative z-10'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-white/50 font-ui'>
                      {insight.title}
                    </p>
                    <p className='text-sm font-medium leading-relaxed font-narrative'>
                      {insight.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bridge Category Breakdown (Compact) */}
          <motion.div
            variants={fadeUp}
            className='bg-white rounded-[44px] border border-gold/20 p-10 shadow-xl shadow-indigo/5 space-y-8'
          >
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <h3 className='text-lg font-black text-indigo tracking-tight font-ui'>
                  Bridge Mastery
                </h3>
                <p className='text-[10px] font-bold text-indigo/30 uppercase tracking-widest font-ui'>
                  Level {bridgeLevel} Progress
                </p>
              </div>
              <div className='bg-secondary px-4 py-2 rounded-full text-xs font-black text-indigo font-technical'>
                {stats.bridgeWordsUnlocked} Words
              </div>
            </div>

            <div className='space-y-6'>
              {stats.categoryMastery.map((cat) => (
                <div key={cat.id} className='group'>
                  <div className='flex justify-between items-end mb-3'>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl group-hover:scale-125 transition-transform'>
                        {cat.icon}
                      </span>
                      <span className='text-xs font-black text-indigo uppercase tracking-wider font-ui'>
                        {cat.name}
                      </span>
                    </div>
                    <span className='text-[10px] font-black text-indigo/20 font-technical'>
                      {cat.count}/{cat.total}
                    </span>
                  </div>
                  <div className='h-2.5 bg-secondary rounded-full overflow-hidden border border-gold/10'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full rounded-full transition-colors ${
                        cat.percentage === 100 ?
                          "bg-green shadow-[0_0_10px_rgba(129,178,154,0.3)]"
                        : cat.percentage > 50 ? "bg-terracotta"
                        : "bg-gold-dark"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action CTA */}
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full bg-indigo py-8 rounded-[36px] text-white flex items-center justify-center gap-4 shadow-2xl shadow-indigo/20 group'
          >
            <Layers
              className='group-hover:rotate-12 transition-transform'
              size={24}
            />
            <span className='font-black uppercase tracking-[0.3em] text-sm font-ui'>
              Begin Daily Quest
            </span>
            <ChevronRight size={20} className='opacity-40' />
          </motion.button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
