"use client";
import { motion } from "framer-motion";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";
import { BookOpen, Sparkles, Feather, Music, ArrowRight } from "lucide-react";

export default function CulturalNotesPage() {
  const notes = [
    {
      title: "The Art of Filter Coffee",
      tag: "Tradition",
      icon: Music,
      desc: "Why it's never just 'coffee'. Understanding the ceremony from stainless steel tumblers to the perfect froth.",
    },
    {
      title: "Avarekai Melas",
      tag: "Seasonal",
      icon: Feather,
      desc: "Exploring our obsession with the flat bean. Recipes, markets, and the community heart of Bangalore food.",
    },
    {
      title: "Script & Soul",
      tag: "Language",
      icon: Sparkles,
      desc: "The visual poetry of the Kannada script. How each curve represents centuries of literary evolution.",
    },
  ];

  return (
    <div className='min-h-screen bg-white relative overflow-hidden selection:bg-indigo/10'>
      <AnimatedCosmos density={10} />

      <div className='container-responsive pt-32 pb-24 relative z-10'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='max-w-7xl mx-auto'
        >
          <div className='text-center mb-24 space-y-6'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/5 border border-terracotta/10 text-terracotta mb-4'>
              <BookOpen size={14} />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Culture Lab
              </span>
            </div>
            <h1 className='text-7xl md:text-9xl font-black text-indigo tracking-tighter leading-none'>
              Cultural <br /> <span className='text-terracotta'>Notes</span>
            </h1>
            <p className='text-xl font-medium text-indigo/60 max-w-2xl mx-auto'>
              Go beyond the words. Immerse yourself in the habits, history, and
              heartbeats that define the Kannada spirit.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            {notes.map((note, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className='group cursor-pointer'
              >
                <div className='aspect-[4/5] bg-secondary/50 rounded-[48px] border border-gold/10 p-12 flex flex-col gap-8 relative overflow-hidden transition-all group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo/10 group-hover:border-indigo/10'>
                  <div className='w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo shadow-sm border border-indigo/5 mb-4'>
                    <note.icon size={24} />
                  </div>
                  <div className='space-y-4 relative z-10'>
                    <span className='text-[10px] font-black text-terracotta uppercase tracking-[0.3em]'>
                      {note.tag}
                    </span>
                    <h3 className='text-4xl font-black text-indigo tracking-tight leading-none'>
                      {note.title}
                    </h3>
                    <p className='text-lg font-medium text-indigo/40 leading-relaxed'>
                      {note.desc}
                    </p>
                  </div>
                  <div className='mt-auto relative z-10'>
                    <button className='flex items-center gap-3 text-xs font-black text-indigo uppercase tracking-widest group-hover:text-terracotta transition-colors'>
                      Read Note <ArrowRight size={14} />
                    </button>
                  </div>
                  {/* Background Decorative Element */}
                  <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-indigo/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
