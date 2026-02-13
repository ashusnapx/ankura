"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface StreakCalendarProps {
  activityMap: Record<string, boolean>;
}

export function StreakCalendar({ activityMap }: StreakCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const days = [];
  // Padding for first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`pad-${i}`} className='w-8 h-8' />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isCompleted = activityMap[dateStr];
    const isToday = new Date().toISOString().split("T")[0] === dateStr;

    days.push(
      <div
        key={d}
        className='relative flex items-center justify-center w-8 h-8 text-[10px] font-bold group'
      >
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute inset-0 bg-terracotta rounded-lg shadow-lg shadow-terracotta/20'
          />
        )}
        <span
          className={`relative z-10 ${
            isCompleted ? "text-white"
            : isToday ? "text-terracotta"
            : "text-indigo/60"
          }`}
        >
          {d}
        </span>
        {!isCompleted && !isToday && (
          <div className='absolute inset-0 bg-secondary/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity' />
        )}
      </div>,
    );
  }

  return (
    <div className='p-6 bg-white/90 backdrop-blur-2xl rounded-[32px] border border-gold/20 shadow-2xl w-[280px]'>
      <div className='flex items-center justify-between mb-6'>
        <h4 className='text-xs font-black text-indigo uppercase tracking-widest'>
          {monthName} {year}
        </h4>
        <div className='flex gap-1'>
          <button
            onClick={prevMonth}
            className='p-1.5 hover:bg-secondary rounded-lg text-indigo/40 hover:text-indigo transition-colors'
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextMonth}
            className='p-1.5 hover:bg-secondary rounded-lg text-indigo/40 hover:text-indigo transition-colors'
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-7 gap-1 mb-2'>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div
            key={`${day}-${i}`}
            className='w-8 h-8 flex items-center justify-center text-[9px] font-black text-indigo/20 uppercase'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-1'>{days}</div>

      <div className='mt-6 pt-4 border-t border-gold/10 flex items-center justify-between px-1'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-terracotta' />
          <span className='text-[9px] font-bold text-indigo/40 uppercase'>
            Attended
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-secondary' />
          <span className='text-[9px] font-bold text-indigo/40 uppercase'>
            Missed
          </span>
        </div>
      </div>
    </div>
  );
}
