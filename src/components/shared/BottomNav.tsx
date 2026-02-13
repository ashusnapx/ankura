"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, Flower2, Mic, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/missions", icon: BookOpen, label: "Stories" },
  // { href: "/garden", icon: Flower2, label: "Garden" },
  { href: "/practice/shadow-speaking", icon: Mic, label: "Practice" },
  { href: "/dashboard", icon: BarChart3, label: "Progress" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on onboarding
  if (pathname?.startsWith("/onboarding")) return null;

  return (
    <div className='fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none'>
      <nav
        className='pointer-events-auto flex items-center gap-1 bg-white/70 backdrop-blur-2xl border border-gold-dark/20 px-3 py-2 rounded-[28px] shadow-2xl shadow-indigo/10'
        role='navigation'
        aria-label='Main navigation'
      >
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname?.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className='relative flex flex-col items-center gap-0.5 px-4 py-2 transition-all active:scale-90 group'
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className='relative'>
                <Icon
                  size={20}
                  className={
                    isActive ? "text-terracotta" : (
                      "text-indigo/40 group-hover:text-indigo/60 transition-colors"
                    )
                  }
                  strokeWidth={isActive ? 3 : 2}
                />
              </div>
              <span
                className={`text-[8px] font-black uppercase tracking-[0.1em] ${
                  isActive ?
                    "text-terracotta opacity-100"
                  : "text-indigo/30 opacity-0 group-hover:opacity-100 transition-opacity"
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId='nav-indicator'
                  className='absolute -bottom-1 left-1.2 h-1 w-1 rounded-full bg-terracotta'
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
