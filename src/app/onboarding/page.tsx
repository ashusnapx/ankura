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
} from "lucide-react";
import { initializeUser } from "@/lib/db/dexie";
import { trackEvent } from "@/lib/utils/analytics";

const GOALS = [
  {
    id: "work",
    icon: Briefcase,
    label: "Moving to Bangalore for work",
    labelKn: "ಕೆಲಸಕ್ಕಾಗಿ ಬೆಂಗಳೂರಿಗೆ",
    color: "#E07A5F",
  },
  {
    id: "family",
    icon: Heart,
    label: "Connect with Kannada family",
    labelKn: "ಕುಟುಂಬದೊಂದಿಗೆ",
    color: "#81B29A",
  },
  {
    id: "cinema",
    icon: Film,
    label: "Understand Kannada cinema",
    labelKn: "ಕನ್ನಡ ಸಿನಿಮಾ",
    color: "#F2CC8F",
  },
  {
    id: "culture",
    icon: BookOpen,
    label: "Love for the language & culture",
    labelKn: "ಭಾಷೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ",
    color: "#3D405B",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
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

  return (
    <div className='min-h-screen bg-cream flex flex-col items-center justify-center px-6'>
      <AnimatePresence mode='wait'>
        {/* Step 0: Welcome */}
        {step === 0 && (
          <motion.div
            key='welcome'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex flex-col items-center gap-8 text-center max-w-md'
          >
            {/* Rangoli animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className='text-7xl'
            >
              ✦
            </motion.div>

            <div>
              <h1 className='text-4xl font-bold text-indigo mb-2'>
                <span className='text-kannada text-terracotta'>ಅಂಕುರ</span>
              </h1>
              <h2 className='text-2xl font-bold text-indigo'>Ankura</h2>
              <p className='text-sm text-indigo/50 mt-1 italic'>
                meaning: &ldquo;sprout&rdquo; — the beginning of growth
              </p>
            </div>

            <div className='space-y-3'>
              <p className='text-lg text-indigo/80 leading-relaxed'>
                This is <strong>not</strong> a language app.
              </p>
              <p className='text-base text-indigo/60 leading-relaxed'>
                This is your life in Bangalore — told in Kannada. You don&apos;t
                study words. You <em>live</em> stories. Order coffee, negotiate
                auto fares, make friends — all in Kannada.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(1)}
              className='flex items-center gap-2 rounded-2xl bg-terracotta px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-terracotta/20 transition-shadow hover:shadow-xl'
            >
              Begin Your Story <ArrowRight size={20} />
            </motion.button>

            <p className='text-xs text-indigo/30'>
              3 minutes to your first Kannada word
            </p>
          </motion.div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <motion.div
            key='name'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex flex-col items-center gap-6 text-center max-w-md w-full'
          >
            <Sparkles className='text-gold' size={40} />
            <h2 className='text-2xl font-bold text-indigo'>
              What should we call you?
            </h2>
            <p className='text-indigo/60'>
              Your story protagonist needs a name!
            </p>

            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter your name...'
              className='w-full max-w-xs rounded-xl border-2 border-gold/30 bg-white px-5 py-3.5 text-center text-lg text-indigo placeholder:text-indigo/30 focus:border-terracotta focus:outline-none transition-colors'
              aria-label='Your name'
              autoFocus
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className='flex items-center gap-2 rounded-2xl bg-terracotta px-8 py-3.5 font-semibold text-white shadow-lg shadow-terracotta/20 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Continue <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <motion.div
            key='goals'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex flex-col items-center gap-6 text-center max-w-md w-full'
          >
            <h2 className='text-2xl font-bold text-indigo'>
              Why are you learning Kannada?
            </h2>
            <p className='text-indigo/60'>
              Pick one or more (we&apos;ll personalize your stories)
            </p>

            <div className='grid grid-cols-1 gap-3 w-full'>
              {GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`flex items-center gap-4 rounded-xl px-5 py-4 text-left transition-all border-2 ${
                      isSelected ?
                        "border-terracotta bg-terracotta/5 shadow-md"
                      : "border-transparent bg-white hover:bg-cream-dark"
                    }`}
                  >
                    <div
                      className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
                      style={{ backgroundColor: `${goal.color}15` }}
                    >
                      <Icon size={20} style={{ color: goal.color }} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-indigo'>
                        {goal.label}
                      </p>
                      <p className='text-xs text-indigo/40 text-kannada'>
                        {goal.labelKn}
                      </p>
                    </div>
                    {isSelected && (
                      <Check size={18} className='text-terracotta' />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={selectedGoals.length === 0}
              className='flex items-center gap-2 rounded-2xl bg-terracotta px-8 py-3.5 font-semibold text-white shadow-lg shadow-terracotta/20 disabled:opacity-40 disabled:cursor-not-allowed'
            >
              Start Your First Story <Sparkles size={18} />
            </motion.button>

            <button
              onClick={handleComplete}
              className='text-xs text-indigo/30 underline hover:text-indigo/50'
            >
              Skip for now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
