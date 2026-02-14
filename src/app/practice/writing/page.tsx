"use client";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, BookOpen, Volume2 } from "lucide-react";
import { speakText, isSpeechSynthesisSupported } from "@/lib/utils/speech";
import { BottomNav } from "@/components/shared/BottomNav";

const VOWELS = [
  { kn: "ಅ", hi: "अ", en: "a", category: "Vowels" },
  { kn: "ಆ", hi: "आ", en: "ā", category: "Vowels" },
  { kn: "ಇ", hi: "इ", en: "i", category: "Vowels" },
  { kn: "ಈ", hi: "ई", en: "ī", category: "Vowels" },
  { kn: "ಉ", hi: "उ", en: "u", category: "Vowels" },
  { kn: "ಊ", hi: "ऊ", en: "ū", category: "Vowels" },
  { kn: "ಋ", hi: "ऋ", en: "ṛ", category: "Vowels" },
  { kn: "ಎ", hi: "ए", en: "e", category: "Vowels" },
  { kn: "ಏ", hi: "ए", en: "ē", category: "Vowels" },
  { kn: "ಐ", hi: "ऐ", en: "ai", category: "Vowels" },
  { kn: "ಒ", hi: "ओ", en: "o", category: "Vowels" },
  { kn: "ಓ", hi: "ओ", en: "ō", category: "Vowels" },
  { kn: "ಔ", hi: "औ", en: "au", category: "Vowels" },
  { kn: "ಅಂ", hi: "ಅಂ", en: "am", category: "Yogavaha" },
  { kn: "ಅಃ", hi: "ಅಃ", en: "ah", category: "Yogavaha" },
];

const CONSONANTS = [
  { kn: "ಕ", hi: "क", en: "ka", category: "Consonants" },
  { kn: "ಖ", hi: "ख", en: "kha", category: "Consonants" },
  { kn: "ಗ", hi: "ग", en: "ga", category: "Consonants" },
  { kn: "ಘ", hi: "घ", en: "gha", category: "Consonants" },
  { kn: "ಙ", hi: "ङ", en: "ṅa", category: "Consonants" },
  { kn: "ಚ", hi: "च", en: "ca", category: "Consonants" },
  { kn: "ಛ", hi: "छ", en: "cha", category: "Consonants" },
  { kn: "ಜ", hi: "ज", en: "ja", category: "Consonants" },
  { kn: "ಝ", hi: "झ", en: "jha", category: "Consonants" },
  { kn: "ಞ", hi: "ञ", en: "ña", category: "Consonants" },
  { kn: "ಟ", hi: "ट", en: "ṭa", category: "Consonants" },
  { kn: "ಠ", hi: "ठ", en: "ṭha", category: "Consonants" },
  { kn: "ಡ", hi: "ड", en: "ḍa", category: "Consonants" },
  { kn: "ಢ", hi: "ढ", en: "ḍha", category: "Consonants" },
  { kn: "ಣ", hi: "ण", en: "ṇa", category: "Consonants" },
  { kn: "ತ", hi: "त", en: "ta", category: "Consonants" },
  { kn: "ಥ", hi: "थ", en: "tha", category: "Consonants" },
  { kn: "ದ", hi: "ದ", en: "da", category: "Consonants" },
  { kn: "ಧ", hi: "ಧ", en: "dha", category: "Consonants" },
  { kn: "ನ", hi: "ನ", en: "na", category: "Consonants" },
  { kn: "ಪ", hi: "ಪ", en: "pa", category: "Consonants" },
  { kn: "ಫ", hi: "ಫ", en: "pha", category: "Consonants" },
  { kn: "ಬ", hi: "ಬ", en: "ba", category: "Consonants" },
  { kn: "ಭ", hi: "ಭ", en: "bha", category: "Consonants" },
  { kn: "ಮ", hi: "ಮ", en: "ma", category: "Consonants" },
  { kn: "ಯ", hi: "ಯ", en: "ya", category: "Consonants" },
  { kn: "ರ", hi: "ರ", en: "ra", category: "Consonants" },
  { kn: "ಲ", hi: "ಲ", en: "la", category: "Consonants" },
  { kn: "ವ", hi: "ವ", en: "va", category: "Consonants" },
  { kn: "ಶ", hi: "ಶ", en: "śa", category: "Consonants" },
  { kn: "ಷ", hi: "ಷ", en: "ṣa", category: "Consonants" },
  { kn: "ಸ", hi: "ಸ", en: "sa", category: "Consonants" },
  { kn: "ಹ", hi: "ಹ", en: "ha", category: "Consonants" },
  { kn: "ಳ", hi: "ಳ", en: "ḷa", category: "Consonants" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.02,
      duration: 0.3,
    },
  }),
};

export default function ScriptExplorerPage() {
  const [activeTab, setActiveTab] = useState<"vowels" | "consonants">("vowels");
  const [search, setSearch] = useState("");

  const data = activeTab === "vowels" ? VOWELS : CONSONANTS;
  const filteredData = data.filter(
    (item) =>
      item.kn.includes(search) ||
      item.en.includes(search.toLowerCase()) ||
      item.hi.includes(search),
  );

  return (
    <div className='min-h-screen bg-white'>
      <div className='container-responsive pt-12 pb-32'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
          <div className='space-y-2'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-black uppercase tracking-widest font-ui'>
              <BookOpen size={12} /> Reference
            </div>
            <h1 className='text-4xl font-black text-indigo tracking-tight font-ui'>
              Script <span className='text-terracotta'>Explorer</span>
            </h1>
            <p className='text-lg font-medium text-indigo-light font-narrative'>
              Master the Warnamala in legendary trio format.
            </p>
          </div>

          <div className='flex flex-col gap-4 w-full md:w-auto'>
            <div className='relative'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-indigo/30'
                size={18}
              />
              <input
                type='text'
                placeholder='Search phonetic or Hindi...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full md:w-80 h-12 pl-12 pr-4 rounded-2xl bg-secondary border border-indigo/5 text-indigo font-bold focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all font-ui'
              />
            </div>
            <div className='flex p-1 bg-secondary rounded-2xl border border-indigo/5'>
              <button
                onClick={() => setActiveTab("vowels")}
                className={`flex-1 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-ui ${
                  activeTab === "vowels" ?
                    "bg-white text-indigo shadow-sm"
                  : "text-indigo/40 hover:text-indigo"
                }`}
              >
                Vowels
              </button>
              <button
                onClick={() => setActiveTab("consonants")}
                className={`flex-1 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-ui ${
                  activeTab === "consonants" ?
                    "bg-white text-indigo shadow-sm"
                  : "text-indigo/40 hover:text-indigo"
                }`}
              >
                Consonants
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          <AnimatePresence mode='popLayout'>
            {filteredData.map((item, i) => (
              <motion.div
                key={item.kn}
                custom={i}
                variants={fadeUp}
                initial='hidden'
                animate='show'
                className='group relative rounded-[32px] bg-secondary p-6 transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo/5 border border-transparent hover:border-gold-dark/20 flex flex-col items-center gap-4 text-center overflow-hidden'
              >
                <div className='absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-[40px] transition-transform group-hover:scale-150 group-hover:bg-terracotta/5' />

                <div className='w-full flex justify-between items-start mb-1'>
                  <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest font-technical'>
                    {item.en}
                  </p>
                  {isSpeechSynthesisSupported() && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(item.kn);
                      }}
                      className='opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-gold/20 text-indigo hover:text-terracotta transition-all'
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>

                <div className='relative leading-none'>
                  <span className='font-native text-7xl font-black text-indigo group-hover:text-terracotta transition-colors'>
                    {item.kn}
                  </span>
                </div>

                <div className='w-full pt-4 border-t border-indigo/5 flex items-center justify-center gap-3'>
                  <div className='text-sm font-black text-indigo/40 font-narrative'>
                    {item.hi}
                  </div>
                  <div className='w-1 h-1 rounded-full bg-indigo/5' />
                  <div className='text-[10px] font-black text-terracotta/40 uppercase tracking-tighter font-technical'>
                    {activeTab === "vowels" ? "Swar" : "Vyanjan"}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredData.length === 0 && (
          <div className='py-20 text-center'>
            <p className='text-5xl mb-4'>📭</p>
            <h3 className='text-xl font-black text-indigo mb-1'>
              Nothing found
            </h3>
            <p className='text-indigo/40 font-medium'>
              Try searching for a different character.
            </p>
          </div>
        )}

        <div className='mt-20 p-10 rounded-[40px] bg-indigo text-white overflow-hidden relative'>
          <div className='absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
          <div className='relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center'>
            <div className='md:col-span-8 space-y-4'>
              <h2 className='text-3xl font-black tracking-tight'>
                The Trio Format System
              </h2>
              <p className='text-lg text-white/70 font-medium leading-relaxed max-w-2xl'>
                Kannada script sharing roots with Sanskrit/Hindi makes it highly
                intuitive. By looking at the trio side-by-side, you leverage
                your existing language intuition to decode new symbols
                instantly.
              </p>
            </div>
            <div className='md:col-span-4 flex justify-end'>
              <div className='flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10'>
                <div className='w-12 h-12 rounded-2xl bg-terracotta flex items-center justify-center font-black text-2xl'>
                  ಅ
                </div>
                <div className='text-2xl font-black'>=</div>
                <div className='w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl'>
                  अ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
