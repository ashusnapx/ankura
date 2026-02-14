"use client";
import { motion } from "framer-motion";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-white relative overflow-hidden selection:bg-indigo/10'>
      <AnimatedCosmos density={10} />

      <div className='container-responsive pt-32 pb-24 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-3xl'
        >
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/5 border border-terracotta/10 text-terracotta/60 mb-8 font-technical'>
            <FileText size={14} />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              The Rules of the Garden
            </span>
          </div>

          <h1 className='text-6xl md:text-8xl font-black text-indigo tracking-tighter mb-8 font-ui'>
            Terms of <span className='text-indigo/20'>Service</span>
          </h1>

          <div className='space-y-16 mt-20 font-narrative'>
            <section className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-indigo flex items-center justify-center text-white font-black font-technical'>
                  01
                </div>
                <h2 className='text-3xl font-black text-indigo tracking-tight font-ui'>
                  Grant of Usage
                </h2>
              </div>
              <p className='text-lg text-indigo/60 leading-relaxed'>
                Ankura is a tool for learning and cultural immersion. By using
                the app, you agree to use our linguistic and creative
                assets—stories, illustrations, and translations—exclusively for
                your personal enrichment. Commercial redistribution of our
                narrative content is prohibited.
              </p>
            </section>

            <section className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-indigo flex items-center justify-center text-white font-black font-technical'>
                  02
                </div>
                <h2 className='text-3xl font-black text-indigo tracking-tight font-ui'>
                  The &quot;Beta&quot; Clause
                </h2>
              </div>
              <p className='text-lg text-indigo/60 leading-relaxed'>
                Ankura is currently in V2 Alpha. While we strive for absolute
                accuracy in our Kannada transcriptions and Hindi/English bridge
                translations, language is fluid. We are not liable for
                accidental social gaffes made using our simulated dialogues.
              </p>
            </section>

            <section className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-xl bg-indigo flex items-center justify-center text-white font-black font-technical'>
                  03
                </div>
                <h2 className='text-3xl font-black text-indigo tracking-tight font-ui'>
                  Community Conduct
                </h2>
              </div>
              <p className='text-lg text-indigo/60 leading-relaxed'>
                In our community spaces (Namma Area, Cultural Notes), we uphold
                a standard of respect and curiosity. Hate speech or harassment
                of any kind will result in immediate loss of access to shared
                resources.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
