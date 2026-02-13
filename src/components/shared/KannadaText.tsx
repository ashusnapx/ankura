"use client";
import { useState } from "react";
import { Volume2 } from "lucide-react";
import { speakText, isSpeechSynthesisSupported } from "@/lib/utils/speech";

interface KannadaTextProps {
  kannada: string;
  transliteration: string;
  english?: string;
  hindi?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSpeaker?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { kannada: "text-lg", trans: "text-xs", hint: "text-[10px]" },
  md: { kannada: "text-2xl", trans: "text-sm", hint: "text-xs" },
  lg: { kannada: "text-3xl", trans: "text-base", hint: "text-sm" },
  xl: { kannada: "text-4xl", trans: "text-lg", hint: "text-base" },
};

export function KannadaText({
  kannada,
  transliteration,
  english,
  hindi,
  size = "md",
  showSpeaker = true,
  className = "",
}: KannadaTextProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const s = sizeMap[size];

  const handleSpeak = async () => {
    if (!isSpeechSynthesisSupported()) return;
    setIsSpeaking(true);
    try {
      await speakText(kannada);
    } catch {
      /* silent */
    }
    setIsSpeaking(false);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className='flex items-baseline gap-2'>
        <span
          className={`text-kannada font-bold text-indigo tracking-tight ${s.kannada}`}
        >
          {kannada}
        </span>
        {showSpeaker && isSpeechSynthesisSupported() && (
          <button
            onClick={handleSpeak}
            className={`rounded-full p-1.5 transition-all hover:bg-gold ${isSpeaking ? "text-terracotta scale-110" : "text-indigo/30"}`}
            aria-label='Listen to pronunciation'
          >
            <Volume2 size={16} />
          </button>
        )}
      </div>
      <span
        className={`${s.trans} text-indigo-light font-medium tracking-wide`}
      >
        {transliteration}
      </span>
      {(english || hindi) && (
        <div className='mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1'>
          {hindi && (
            <div
              className={`flex items-center gap-1.5 rounded-md bg-gold px-2 py-0.5 ${s.hint} font-medium text-indigo-light`}
            >
              <span className='opacity-70 text-[10px]'>HI</span>
              <span>{hindi}</span>
            </div>
          )}
          {english && (
            <div
              className={`flex items-center gap-1.5 rounded-md bg-gold px-2 py-0.5 ${s.hint} font-medium text-indigo-light`}
            >
              <span className='opacity-70 text-[10px]'>EN</span>
              <span>{english}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
