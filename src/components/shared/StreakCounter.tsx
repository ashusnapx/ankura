"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { StreakCalendar } from "./StreakCalendar";
import { useStreak } from "@/hooks/useStreak";

interface StreakCounterProps {
  count: number;
  showMessage?: boolean;
}

export function StreakCounter({
  count,
  showMessage = true,
}: StreakCounterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { activityMap } = useStreak();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-3 p-1 rounded-2xl hover:bg-secondary/50 transition-colors group'
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            filter:
              count > 0 ?
                ["brightness(1)", "brightness(1.2)", "brightness(1)"]
              : "none",
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className='relative'
        >
          <div
            className={`p-2 rounded-xl ${count > 0 ? "bg-terracotta/10" : "bg-indigo/5"}`}
          >
            <Flame
              size={24}
              className={
                count > 0 ?
                  "text-terracotta fill-terracotta/30"
                : "text-indigo/20"
              }
            />
          </div>
          {count > 0 && (
            <div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-black text-white shadow-lg'>
              {count > 99 ? "99+" : count}
            </div>
          )}
        </motion.div>

        {showMessage && (
          <div className='flex flex-col items-start'>
            <span className='text-sm font-black text-indigo tracking-tight'>
              {count > 0 ? `${count}-day streak` : "Start journey"}
            </span>
            <span className='text-[10px] font-bold text-indigo/30 uppercase tracking-widest'>
              {count > 0 ? "Don't break it!" : "0 days active"}
            </span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className='absolute top-full right-0 mt-4 z-50'
          >
            <StreakCalendar activityMap={activityMap} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
