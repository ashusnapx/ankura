"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  Briefcase,
  Heart,
  Film,
  ArrowRight,
  Check,
  Play,
  Volume2,
  MousePointer2,
} from "lucide-react";
import { initializeUser } from "@/lib/db/dexie";
import { trackEvent } from "@/lib/utils/analytics";
import { TiltCard } from "@/components/shared/TiltCard";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";

const GOALS = [
  {
    id: "work",
    icon: Briefcase,
    label: "Moving to Bangalore",
    labelKn: "ಕೆಲಸಕ್ಕಾಗಿ ಬೆಂಗಳೂರಿಗೆ",
    color: "#E07A5F",
    desc: "Navigate offices, autos, and local cafes with ease.",
  },
  {
    id: "family",
    icon: Heart,
    label: "Family & Friends",
    labelKn: "ಕುಟುಂಬದೊಂದಿಗೆ",
    color: "#81B29A",
    desc: "Connect deeper with your loved ones through their language.",
  },
  {
    id: "cinema",
    icon: Film,
    label: "Cinema & Culture",
    labelKn: "ಕನ್ನಡ ಸಿನಿಮಾ",
    color: "#F2CC8F",
    desc: "Understand movies and literature without subtitles.",
  },
  {
    id: "culture",
    icon: BookOpen,
    label: "Language Love",
    labelKn: "ಭಾಷೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ",
    color: "#3D405B",
    desc: "Experience the rich heritage of Karnataka.",
  },
];

const SHOWCASES = [
  {
    title: "See the World",
    kn: "ನೋಡಿ",
    icon: BookOpen,
    content: "Live through real stories set in the heart of Bangalore.",
    color: "bg-terracotta",
  },
  {
    title: "Hear the Rhythm",
    kn: "ಕೇಳಿ",
    icon: Volume2,
    content: "Natural conversations with authentic local pronunciations.",
    color: "bg-indigo",
  },
  {
    title: "Live the Story",
    kn: "ಬಾಳಿ",
    icon: Play,
    content: "Make choices that matter. Every dialogue is a real-life win.",
    color: "bg-green",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackEvent("onboarding_start");
  }, []);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleComplete = async () => {
    await initializeUser(name || "Learner", selectedGoals);
    trackEvent("onboarding_complete", { goals: selectedGoals });
    router.push("/missions/tutorial");
  };

  if (!mounted) return null;

  return (
    <div className='min-h-screen bg-[#FDFDFD] relative overflow-hidden font-sans selection:bg-indigo/10'>
      <AnimatedCosmos density={25} />

      <div className='relative z-10 flex items-center justify-center min-h-screen px-6 py-20'>
        <AnimatePresence mode='wait'>
          {/* Step 0: The Immersive Welcome */}
          {step === 0 && (
            <motion.div
              key='welcome'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className='max-w-4xl w-full text-center space-y-12'
            >
              <div className='space-y-6'>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='flex flex-col items-center'
                >
                  <div className='w-20 h-20 bg-indigo rounded-[24px] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo/20 mb-8 border-4 border-white'>
                    A
                  </div>
                  <h1 className='text-6xl md:text-8xl font-black text-indigo tracking-tighter font-ui'>
                    Welcome to <span className='text-terracotta'>Ankura</span>
                  </h1>
                  <p className='font-native text-3xl font-black text-terracotta/40 mt-2'>
                    ಅಂಕುರ — ದಿ ಬಿಗಿನಿಂಗ್ ಆಫ್ ಗ್ರೋತ್
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className='max-w-2xl mx-auto space-y-6'
                >
                  <p className='text-xl md:text-2xl text-indigo/60 leading-relaxed font-medium font-narrative'>
                    This is <span className='text-indigo font-black'>not</span>{" "}
                    a language app. It&apos;s your new life in Bangalore, told
                    through the stories that happen between people.
                  </p>
                </motion.div>
              </div>

              {/* Simplicity Showcases */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {SHOWCASES.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <TiltCard className='h-full'>
                      <div className='h-full p-8 rounded-[40px] bg-white border border-gold/20 shadow-xl shadow-indigo/5 space-y-4 text-left group hover:border-indigo/20 transition-all'>
                        <div
                          className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg`}
                        >
                          <item.icon size={24} />
                        </div>
                        <div className='space-y-1'>
                          <h3 className='text-xl font-black text-indigo font-ui'>
                            {item.title}
                          </h3>
                          <p className='font-native text-indigo/30 font-black'>
                            {item.kn}
                          </p>
                        </div>
                        <p className='text-sm font-medium text-indigo/60 leading-relaxed font-narrative'>
                          {item.content}
                        </p>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className='flex flex-col items-center gap-6'
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(1)}
                  className='rounded-[32px] bg-indigo px-12 py-6 text-xl font-black text-white shadow-2xl shadow-indigo/30 transition-all flex items-center gap-4 group font-ui'
                >
                  Start Your Odyssey
                  <ArrowRight
                    size={24}
                    className='group-hover:translate-x-2 transition-transform'
                  />
                </motion.button>
                <p className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.4em] font-technical'>
                  3 minutes to your first word
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Step 1: Personalized Identity */}
          {step === 1 && (
            <motion.div
              key='name'
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className='max-w-xl w-full text-center space-y-12'
            >
              <div className='space-y-4'>
                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/5 border border-indigo/10 text-indigo/40 mb-4 font-technical'>
                  <Sparkles size={14} />
                  <span className='text-[10px] font-black uppercase tracking-widest'>
                    Initialization
                  </span>
                </div>
                <h2 className='text-5xl font-black text-indigo tracking-tighter font-ui'>
                  Your Name, <span className='text-terracotta'>Explorer?</span>
                </h2>
                <p className='text-lg font-medium text-indigo/40 font-narrative'>
                  Every story needs a protagonist. What shall we call you?
                </p>
              </div>

              <div className='relative group max-w-sm mx-auto'>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter name...'
                  className='w-full rounded-[32px] border-2 border-gold/10 bg-white/50 backdrop-blur-xl px-8 py-6 text-center text-2xl font-black text-indigo placeholder:text-indigo/10 focus:border-indigo focus:bg-white focus:shadow-2xl transition-all outline-none font-ui'
                  autoFocus
                />
                <motion.div
                  animate={{ opacity: name.trim() ? 0 : 1 }}
                  className='absolute -bottom-10 left-0 right-0 text-[10px] font-black text-indigo/20 uppercase tracking-[0.3em] flex items-center justify-center gap-2 font-technical'
                >
                  <MousePointer2 size={12} /> Type to begin
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className='font-ui rounded-[24px] bg-terracotta px-12 py-5 text-lg font-black text-white shadow-2xl shadow-terracotta/20 transition-all disabled:opacity-20 disabled:grayscale'
              >
                Establish Identity
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Goal Galaxy */}
          {step === 2 && (
            <motion.div
              key='goals'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='max-w-3xl w-full text-center space-y-12'
            >
              <div className='space-y-4'>
                <h2 className='text-5xl font-black text-indigo tracking-tighter leading-tight font-ui'>
                  What <span className='text-terracotta'>Drives</span> You?
                </h2>
                <p className='text-lg font-medium text-indigo/40 max-w-lg mx-auto font-narrative'>
                  We&apos;ll curate your first stories based on your motivation.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                {GOALS.map((goal, i) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <motion.button
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleGoal(goal.id)}
                      className={`group relative flex flex-col items-start gap-6 rounded-[40px] p-8 text-left transition-all border-2 overflow-hidden ${
                        isSelected ?
                          "border-terracotta bg-white shadow-2xl shadow-terracotta/10"
                        : "border-gold/10 bg-white/50 hover:bg-white hover:border-gold/30"
                      }`}
                    >
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-[20px] shadow-lg transition-transform group-hover:scale-110 ${isSelected ? "bg-terracotta text-white" : "bg-indigo/5 text-indigo/40"}`}
                      >
                        <Icon size={24} />
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center gap-3'>
                          <p className='text-xl font-black text-indigo font-ui'>
                            {goal.label}
                          </p>
                          {isSelected && (
                            <Check size={18} className='text-terracotta' />
                          )}
                        </div>
                        <p className='text-sm font-medium text-indigo/40 leading-relaxed font-narrative'>
                          {goal.desc}
                        </p>
                        <p className='font-native text-[10px] font-black text-terracotta/40 tracking-widest pt-2 uppercase'>
                          {goal.labelKn}
                        </p>
                      </div>

                      {isSelected && (
                        <div className='absolute top-0 right-0 w-24 h-24 bg-terracotta/5 rounded-full -translate-y-12 translate-x-12 blur-2xl' />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className='flex flex-col items-center gap-8'>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleComplete}
                  disabled={selectedGoals.length === 0}
                  className='rounded-[40px] bg-indigo px-16 py-7 text-2xl font-black text-white shadow-2xl shadow-indigo/30 disabled:opacity-20 transition-all flex items-center gap-4 group font-ui'
                >
                  Enter Your Story
                  <Sparkles
                    size={24}
                    className='group-hover:rotate-12 transition-transform'
                  />
                </motion.button>

                <button
                  onClick={handleComplete}
                  className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.5em] hover:text-indigo/40 transition-colors font-technical'
                >
                  Skip Onboarding
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
