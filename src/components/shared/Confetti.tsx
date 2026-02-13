"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  char: string;
  color: string;
  delay: number;
  rotation: number;
}

const KANNADA_CHARS = [
  "ಅ",
  "ಆ",
  "ಇ",
  "ಈ",
  "ಉ",
  "ಎ",
  "ಐ",
  "ಒ",
  "ಕ",
  "ಚ",
  "ತ",
  "ನ",
  "ಪ",
  "ಮ",
  "ಯ",
  "ರ",
  "🎉",
  "✨",
  "🌟",
  "🪔",
];
const COLORS = ["#E07A5F", "#F2CC8F", "#81B29A", "#3D405B", "#F0A58E"];

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

export function Confetti({ show, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      char: KANNADA_CHARS[Math.floor(Math.random() * KANNADA_CHARS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));
  }, []);

  useEffect(() => {
    if (show) {
      setParticles(generateParticles());
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [show, generateParticles, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className='pointer-events-none fixed inset-0 z-[100] overflow-hidden'>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: "100vh", opacity: 0, rotate: p.rotation }}
              transition={{ duration: 2.5, delay: p.delay, ease: "easeIn" }}
              className='absolute text-xl'
              style={{ color: p.color }}
            >
              {p.char}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
