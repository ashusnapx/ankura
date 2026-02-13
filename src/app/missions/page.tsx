"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Check, Clock, Star } from "lucide-react";
import { ALL_MISSIONS } from "@/lib/data/missions";
import { useProgress } from "@/hooks/useProgress";
import { BottomNav } from "@/components/shared/BottomNav";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function MissionsListPage() {
  const { completedMissionIds } = useProgress();

  return (
    <div className='min-h-screen bg-white'>
      <div className='container-responsive pt-12 pb-24'>
        <div className='mb-12'>
          <h1 className='text-4xl font-black text-indigo tracking-tight mb-2'>
            Bengaḷūru Stories
          </h1>
          <p className='text-lg font-medium text-indigo-light'>
            Each mission is a chapter in your life in this vibrant city.
          </p>
        </div>

        <motion.div
          initial='hidden'
          animate='show'
          transition={{ staggerChildren: 0.08 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {ALL_MISSIONS.map((mission, index) => {
            const isCompleted = completedMissionIds.includes(mission.id);
            const isLocked =
              mission.unlockAfter ?
                !completedMissionIds.includes(mission.unlockAfter)
              : false;

            return (
              <motion.div key={mission.id} variants={fadeUp}>
                {isLocked ?
                  <div className='flex h-full items-center gap-4 rounded-[32px] bg-secondary p-8 opacity-40 border border-gold-dark/10'>
                    <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-white/50 text-indigo/20'>
                      <Lock size={24} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-md font-black text-indigo tracking-tight opacity-30'>
                        {mission.title}
                      </p>
                      <p className='text-[10px] font-bold text-indigo/20 uppercase tracking-widest mt-1'>
                        Locked Chapter
                      </p>
                    </div>
                  </div>
                : <Link
                    href={`/missions/${mission.id}`}
                    className='block h-full'
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex h-full flex-col p-8 rounded-[32px] border transition-all ${
                        isCompleted ?
                          "bg-white border-green/20 shadow-md"
                        : "bg-white border-gold shadow-sm hover:shadow-2xl hover:border-indigo/5"
                      }`}
                    >
                      <div className='flex items-start justify-between mb-8'>
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-[20px] text-3xl shadow-inner ${
                            isCompleted ? "bg-green/10" : "bg-terracotta/5"
                          }`}
                        >
                          {mission.illustration}
                        </div>
                        {isCompleted && (
                          <div className='bg-green/10 text-green rounded-full p-2'>
                            <Check size={18} strokeWidth={3} />
                          </div>
                        )}
                        {!isCompleted && (
                          <span className='text-[10px] font-black text-indigo/10 uppercase tracking-[0.2em]'>
                            CH: {index + 1}
                          </span>
                        )}
                      </div>

                      <div className='flex-1'>
                        <h2 className='text-xl font-black text-indigo tracking-tight'>
                          {mission.title}
                        </h2>
                        <p className='text-sm font-bold text-terracotta/40 text-kannada mt-1'>
                          {mission.titleKannada}
                        </p>
                        <p className='text-xs font-medium text-indigo-light mt-4 line-clamp-2'>
                          {mission.description}
                        </p>
                      </div>

                      <div className='flex items-center gap-4 mt-8 pt-6 border-t border-gold-dark/10'>
                        <span className='flex items-center gap-1.5 text-[10px] font-black text-indigo/30 uppercase tracking-widest'>
                          <Clock size={12} /> {mission.estimatedMinutes} M
                        </span>
                        <span className='flex items-center gap-1.5 text-[10px] font-black text-indigo/30 uppercase tracking-widest'>
                          <Star size={12} /> {mission.words.length} VOCAB
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                }
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      <div className='md:hidden'>
        <BottomNav />
      </div>
    </div>
  );
}
