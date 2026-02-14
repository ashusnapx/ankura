"use client";
import { motion } from "framer-motion";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";
import { ShieldCheck, Lock, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-white relative overflow-hidden selection:bg-indigo/10'>
      <AnimatedCosmos density={10} />

      <div className='container-responsive pt-32 pb-24 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-3xl'
        >
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/5 border border-indigo/10 text-indigo/40 mb-8'>
            <ShieldCheck size={14} />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              Privacy First
            </span>
          </div>

          <h1 className='text-6xl md:text-8xl font-black text-indigo tracking-tighter mb-8'>
            Privacy <span className='text-terracotta'>Policy</span>
          </h1>

          <p className='text-xl font-medium text-indigo/60 leading-relaxed mb-16'>
            At Ankura, your learning journey is personal. We believe in absolute
            transparency about how we handle your data.
          </p>

          <div className='space-y-16'>
            <section className='space-y-6'>
              <h2 className='text-3xl font-black text-indigo tracking-tight'>
                1. Data Sovereignty
              </h2>
              <p className='text-lg text-indigo/60 leading-relaxed'>
                By default, your progress data (story completions, vocabulary
                growth, streaks) is stored <strong>locally</strong> in your
                browser using IndexedDB. We do not transmit this to a central
                server unless you explicitly opt-in for cross-device
                synchronization.
              </p>
            </section>

            <section className='space-y-6'>
              <h2 className='text-3xl font-black text-indigo tracking-tight'>
                2. Voice Data
              </h2>
              <p className='text-lg text-indigo/60 leading-relaxed'>
                The Shadow Speaking mode uses the Web Speech API. Audio
                processing happens on your device or via your browser&apos;s
                trusted relay. We do not record or save your voice snippets on
                our servers.
              </p>
            </section>

            <section className='space-y-6'>
              <h2 className='text-3xl font-black text-indigo tracking-tight'>
                3. Analytics
              </h2>
              <p className='text-lg text-indigo/60 leading-relaxed'>
                Ankura uses privacy-focused, anonymous analytics to understand
                how users interact with stories. We do not track individuals or
                share data with advertising third-parties.
              </p>
            </section>
          </div>

          <div className='mt-24 p-12 rounded-[48px] bg-indigo text-white shadow-2xl shadow-indigo/20 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='space-y-2'>
              <h3 className='text-2xl font-black'>Questions?</h3>
              <p className='text-white/60 font-medium'>
                We&apos;re here to help clarify.
              </p>
            </div>
            <Link href='/feedback'>
              <button className='px-8 py-4 bg-white text-indigo rounded-2xl font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2'>
                Contact Support <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
