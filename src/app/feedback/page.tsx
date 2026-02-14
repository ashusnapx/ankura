"use client";
import { motion } from "framer-motion";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";
import { MessageSquare, Send, ThumbsUp, Sparkles } from "lucide-react";
import { useState } from "react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className='min-h-screen bg-white relative overflow-hidden selection:bg-indigo/10'>
      <AnimatedCosmos density={10} />

      <div className='container-responsive pt-32 pb-24 relative z-10'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-4xl mx-auto'
        >
          <div className='text-center mb-16 space-y-4'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/5 border border-indigo/10 text-indigo/40 mb-4'>
              <MessageSquare size={14} />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Help Us Grow
              </span>
            </div>
            <h1 className='text-6xl md:text-8xl font-black text-indigo tracking-tighter'>
              Share Your <span className='text-terracotta'>Thoughts</span>
            </h1>
            <p className='text-xl font-medium text-indigo/60 max-w-2xl mx-auto'>
              Ankura is built by the community, for the community. Your feedback
              directly shapes the future of our stories.
            </p>
          </div>

          <div className='bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(45,34,103,0.1)] border border-indigo/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2'>
            <div className='p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-indigo/5'>
              {!submitted ?
                <form
                  className='space-y-8'
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className='space-y-4'>
                    <label className='text-[10px] font-black text-indigo/20 uppercase tracking-widest px-1'>
                      Your Odyssey Name
                    </label>
                    <input
                      type='text'
                      placeholder='Name'
                      className='w-full px-6 py-4 rounded-2xl bg-indigo/5 border border-transparent focus:border-indigo/20 focus:bg-white transition-all outline-none font-bold text-indigo placeholder:text-indigo/20'
                    />
                  </div>

                  <div className='space-y-4'>
                    <label className='text-[10px] font-black text-indigo/20 uppercase tracking-widest px-1'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      placeholder='hello@example.com'
                      className='w-full px-6 py-4 rounded-2xl bg-indigo/5 border border-transparent focus:border-indigo/20 focus:bg-white transition-all outline-none font-bold text-indigo placeholder:text-indigo/20'
                    />
                  </div>

                  <div className='space-y-4'>
                    <label className='text-[10px] font-black text-indigo/20 uppercase tracking-widest px-1'>
                      The Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder='How can we make your learning better?'
                      className='w-full px-6 py-4 rounded-2xl bg-indigo/5 border border-transparent focus:border-indigo/20 focus:bg-white transition-all outline-none font-bold text-indigo placeholder:text-indigo/20 resize-none'
                    />
                  </div>

                  <button className='w-full py-5 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3'>
                    Submit Feedback <Send size={18} />
                  </button>
                </form>
              : <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='h-full flex flex-col items-center justify-center text-center space-y-6'
                >
                  <div className='w-20 h-20 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta'>
                    <ThumbsUp size={40} />
                  </div>
                  <h3 className='text-3xl font-black text-indigo tracking-tight'>
                    Dhanyavadagalu!
                  </h3>
                  <p className='text-indigo/60 font-medium'>
                    We&apos;ve received your feedback and will review it
                    shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className='text-xs font-black text-indigo/20 uppercase tracking-widest hover:text-indigo transition-colors'
                  >
                    Send another note
                  </button>
                </motion.div>
              }
            </div>

            <div className='p-12 lg:p-16 bg-secondary/30 space-y-12'>
              <div className='space-y-4'>
                <h4 className='text-xs font-black text-indigo uppercase tracking-widest'>
                  Our Commitment
                </h4>
                <p className='text-sm font-medium text-indigo/60 leading-relaxed'>
                  We read every single piece of feedback. Whether it&apos;s a
                  bug report or a suggestion for a new story set in
                  Malleshwaram, we want to hear it.
                </p>
              </div>

              <div className='space-y-6'>
                <div className='flex gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-white border border-indigo/5 flex items-center justify-center text-indigo flex-shrink-0'>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className='text-sm font-black text-indigo'>
                      Feature Requests
                    </p>
                    <p className='text-xs font-medium text-indigo/40'>
                      Tell us what tools you need to master Kannada faster.
                    </p>
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-white border border-indigo/5 flex items-center justify-center text-indigo flex-shrink-0'>
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className='text-sm font-black text-indigo'>
                      Bug Reports
                    </p>
                    <p className='text-xs font-medium text-indigo/40'>
                      Helps us polish the experience across all devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
