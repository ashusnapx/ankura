"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const GLYPHS = [
  "ಅ",
  "ಆ",
  "ಇ",
  "ಈ",
  "ಉ",
  "ಊ",
  "ಋ",
  "ಎ",
  "ಏ",
  "ಐ",
  "ಒ",
  "ಓ",
  "ಔ",
  "ಕ",
  "ಖ",
  "ಗ",
  "ಘ",
  "ಙ",
  "ಚ",
  "ಛ",
  "ಜ",
  "ಝ",
  "ಞ",
  "ಟ",
  "ಠ",
  "ಡ",
  "ಢ",
  "ಣ",
  "ತ",
  "ಥ",
  "ದ",
  "ಧ",
  "ನ",
  "ಪ",
  "ಫ",
  "ಬ",
  "ಭ",
  "ಮ",
  "ಯ",
  "ರ",
  "ಲ",
  "ವ",
  "ಶ",
  "ಷ",
  "ಸ",
  "ಹ",
  "ಳ",
];

export const AnimatedCosmos = ({ density = 20 }: { density?: number }) => {
  const [mounted, setMounted] = useState(false);
  const [elements, setElements] = useState<
    {
      top: string;
      left: string;
      size: number;
      duration: number;
      delay: number;
      glyph: string;
    }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    const newElements = Array.from({ length: density }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 40 + 20,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    }));
    setElements(newElements);
  }, [density]);

  if (!mounted) return null;

  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {/* Background Gradients */}
      <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo/[0.03] blur-[140px] rounded-full' />
      <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/[0.04] blur-[140px] rounded-full' />

      {/* Floating Glyphs */}
      {elements.map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            y: [0, -40, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
          className='absolute font-kannada text-indigo/5 select-none'
          style={{
            top: el.top,
            left: el.left,
            fontSize: `${el.size}px`,
          }}
        >
          {el.glyph}
        </motion.div>
      ))}

      <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
