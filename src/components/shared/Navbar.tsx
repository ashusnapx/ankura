"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Mic,
  BarChart3,
  User,
  ChevronDown,
  ArrowRight,
  PenTool,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/missions", label: "Stories", icon: BookOpen },
  // { href: "/garden", label: "Garden", icon: Flower2 },
  {
    label: "Practice",
    icon: Mic,
    isDropdown: true,
    sublinks: [
      {
        href: "/practice/bridge",
        label: "Bridge",
        icon: ArrowRight,
        desc: "Hindi Context",
      },
      {
        href: "/practice/writing",
        label: "Scribe",
        icon: PenTool,
        desc: "Writing Alphabet",
      },
      {
        href: "/practice/shadow-speaking",
        label: "Shadowing",
        icon: Mic,
        desc: "Pronunciation",
      },
    ],
  },
  { href: "/dashboard", label: "Stats", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className='sticky top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-gold-dark/20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-3 group'>
          <div className='w-9 h-9 bg-indigo rounded-[10px] flex items-center justify-center text-white font-black text-xl transition-all group-hover:scale-110 shadow-lg shadow-indigo/20'>
            A
          </div>
          <span className='text-2xl font-black text-indigo tracking-tighter'>
            Ankura
          </span>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-10'>
          {links.map((link) => {
            if (link.isDropdown) {
              const isSubActive = link.sublinks?.some(
                (sub) => pathname === sub.href,
              );
              return (
                <div
                  key='practice-dropdown'
                  className='relative'
                  onMouseEnter={() => setIsPracticeOpen(true)}
                  onMouseLeave={() => setIsPracticeOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-bold transition-all hover:text-indigo ${
                      isSubActive ? "text-indigo" : "text-indigo/40"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isPracticeOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isPracticeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className='absolute top-full -left-4 pt-4 w-64'
                      >
                        <div className='bg-white rounded-[24px] shadow-2xl border border-gold/10 p-3 flex flex-col gap-1 overflow-hidden'>
                          <div className='px-4 py-2 mb-1 border-b border-gold/5'>
                            <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
                              Training Modules
                            </p>
                          </div>
                          {link.sublinks?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                                pathname === sub.href ?
                                  "bg-secondary text-indigo"
                                : "hover:bg-secondary text-indigo/60 hover:text-indigo"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${pathname === sub.href ? "bg-indigo text-white" : "bg-secondary"}`}
                              >
                                <sub.icon size={16} />
                              </div>
                              <div>
                                <p className='text-sm font-bold leading-none'>
                                  {sub.label}
                                </p>
                                <p className='text-[10px] font-medium opacity-50 mt-1'>
                                  {sub.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive =
              !!pathname &&
              (pathname === link.href ||
                (link.href !== "/" &&
                  link.href !== undefined &&
                  pathname.startsWith(link.href)));

            return (
              <Link
                key={link.href || link.label}
                href={link.href || "#"}
                className={`relative text-sm font-bold transition-all hover:text-indigo ${
                  isActive ? "text-indigo" : "text-indigo/40"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId='nav-underline'
                    className='absolute -bottom-1 left-0 right-0 h-0.5 bg-terracotta rounded-full'
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-2'>
          <div className='hidden lg:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full border border-gold/10'>
            <Sparkles size={14} className='text-terracotta' />
            <span className='text-[10px] font-black text-indigo/40 uppercase tracking-widest'>
              Premium Beta
            </span>
          </div>
          <button className='p-2.5 rounded-full bg-secondary text-indigo/40 hover:text-indigo transition-all hover:scale-110 border border-gold/10'>
            <User size={18} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2.5 rounded-full bg-secondary text-indigo/40 hover:text-indigo transition-all hover:scale-110 border border-gold/10 ml-1'
          >
            {isMobileMenuOpen ?
              <X size={20} />
            : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className='md:hidden bg-white border-b border-gold/10 overflow-hidden shadow-2xl'
          >
            <div className='flex flex-col p-6 gap-4'>
              {links.map((link) => (
                <div key={link.label}>
                  {!link.isDropdown ?
                    <Link
                      href={link.href || "#"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        pathname === link.href ?
                          "bg-secondary text-indigo"
                        : "text-indigo/60"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname === link.href ? "bg-indigo text-white" : "bg-secondary"}`}
                      >
                        <link.icon size={20} />
                      </div>
                      <span className='text-base font-black tracking-tight'>
                        {link.label}
                      </span>
                    </Link>
                  : <div className='space-y-2 mt-4'>
                      <p className='px-4 text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
                        {link.label}
                      </p>
                      <div className='grid grid-cols-1 gap-2'>
                        {link.sublinks?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                              pathname === sub.href ?
                                "bg-secondary text-indigo"
                              : "text-indigo/60"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname === sub.href ? "bg-indigo text-white" : "bg-secondary"}`}
                            >
                              <sub.icon size={20} />
                            </div>
                            <div>
                              <p className='text-sm font-black tracking-tight'>
                                {sub.label}
                              </p>
                              <p className='text-[10px] font-bold opacity-40'>
                                {sub.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  }
                </div>
              ))}

              <div className='mt-4 p-6 rounded-[32px] bg-secondary/50 border border-gold/10 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center text-indigo'>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className='text-xs font-black text-indigo uppercase tracking-widest'>
                      Upgrade to Pro
                    </p>
                    <p className='text-[10px] font-bold text-indigo/40 mt-0.5'>
                      Unlock all premium features
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className='text-terracotta' />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
