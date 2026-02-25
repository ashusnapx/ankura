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
  Github,
  Twitter,
} from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/missions", label: "Stories", icon: BookOpen },
  {
    label: "Practice",
    icon: Mic,
    isDropdown: true,
    sublinks: [
      {
        href: "/practice/sentences",
        label: "Vaakya",
        icon: Sparkles,
        desc: "Sentence Patterns",
      },
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change (state-based sync)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }

  return (
    <nav
      className={`sticky top-0 z-[100] w-full transition-all duration-500 ${
        scrolled ?
          "bg-white/80 backdrop-blur-2xl border-b border-indigo/5 py-2"
        : "bg-transparent py-4"
      }`}
    >
      <div className='max-w-7xl mx-auto px-6 flex items-center justify-between'>
        <Link href='/' className='flex items-center gap-3 group'>
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className='w-10 h-10 bg-indigo rounded-[14px] flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo/20 border-2 border-white'
          >
            A
          </motion.div>
          <div className='flex flex-col'>
            <span className='text-xl font-black text-indigo tracking-tighter leading-none'>
              Ankura
            </span>
            <span className='text-[8px] font-black text-terracotta uppercase tracking-[0.3em] mt-1 opacity-60'>
              Story Learning
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center bg-indigo/[0.03] border border-indigo/5 rounded-full px-2 py-1.5 gap-2'>
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
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-full ${
                      isSubActive ?
                        "bg-white text-indigo shadow-sm"
                      : "text-indigo/40 hover:text-indigo"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${isPracticeOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isPracticeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className='absolute top-full -left-4 pt-4 w-72'
                      >
                        <div className='bg-white rounded-[32px] shadow-[0_30px_60px_-15px_rgba(45,34,103,0.15)] border border-indigo/5 p-4 flex flex-col gap-1'>
                          <div className='px-4 py-2 mb-2 border-b border-indigo/5'>
                            <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
                              Mastery Modules
                            </p>
                          </div>
                          {link.sublinks?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                                pathname === sub.href ?
                                  "bg-indigo/5 text-indigo"
                                : "hover:bg-indigo/[0.02] text-indigo/60 hover:text-indigo"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  pathname === sub.href ?
                                    "bg-indigo text-white shadow-lg shadow-indigo/20"
                                  : "bg-white border border-indigo/5"
                                }`}
                              >
                                <sub.icon size={18} />
                              </div>
                              <div>
                                <p className='text-sm font-black tracking-tight'>
                                  {sub.label}
                                </p>
                                <p className='text-[10px] font-bold opacity-30 mt-0.5'>
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

            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href || link.label}
                href={link.href || "#"}
                className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-full ${
                  isActive ?
                    "bg-white text-indigo shadow-sm"
                  : "text-indigo/40 hover:text-indigo"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-3'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-terracotta to-indigo text-white rounded-full shadow-lg shadow-terracotta/10 cursor-pointer'
          >
            <Sparkles size={14} />
            <span className='text-[10px] font-black uppercase tracking-widest'>
              Join Pro
            </span>
          </motion.div>

          <button className='w-10 h-10 rounded-full bg-white border border-indigo/5 flex items-center justify-center text-indigo/40 hover:text-indigo transition-all hover:scale-110 shadow-sm'>
            <User size={18} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden w-10 h-10 rounded-full bg-indigo text-white flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-indigo/20'
          >
            <AnimatePresence mode='wait'>
              {isMobileMenuOpen ?
                <motion.div
                  key='x'
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={20} />
                </motion.div>
              : <motion.div
                  key='menu'
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={20} />
                </motion.div>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed inset-0 bg-indigo/40 backdrop-blur-md z-[90]'
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className='fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[100] shadow-2xl p-8 flex flex-col'
            >
              <div className='flex items-center justify-between mb-12'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-indigo rounded-xl flex items-center justify-center text-white font-black text-xl'>
                    A
                  </div>
                  <span className='text-2xl font-black text-indigo tracking-tighter'>
                    Ankura
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='w-10 h-10 rounded-full bg-indigo/5 flex items-center justify-center text-indigo'
                >
                  <X size={20} />
                </button>
              </div>

              <div className='flex flex-col gap-3'>
                {links.map((link) => (
                  <div key={link.label}>
                    {!link.isDropdown ?
                      <Link
                        href={link.href || "#"}
                        className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${
                          pathname === link.href ?
                            "bg-indigo text-white shadow-xl shadow-indigo/20"
                          : "bg-indigo/5 text-indigo/60"
                        }`}
                      >
                        <link.icon size={20} />
                        <span className='text-lg font-black tracking-tight'>
                          {link.label}
                        </span>
                      </Link>
                    : <div className='space-y-3 mt-6'>
                        <p className='px-4 text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
                          {link.label}
                        </p>
                        <div className='flex flex-col gap-2'>
                          {link.sublinks?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${
                                pathname === sub.href ?
                                  "bg-terracotta text-white shadow-xl shadow-terracotta/20"
                                : "bg-indigo/5 text-indigo/60"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname === sub.href ? "bg-white/20" : "bg-white shadow-sm"}`}
                              >
                                <sub.icon size={20} />
                              </div>
                              <div>
                                <p className='text-base font-black tracking-tight'>
                                  {sub.label}
                                </p>
                                <p
                                  className={`text-[10px] font-bold ${pathname === sub.href ? "text-white/60" : "opacity-40"}`}
                                >
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
              </div>

              <div className='mt-auto space-y-6'>
                <div className='p-6 rounded-[32px] bg-gradient-to-br from-indigo to-indigo-dark text-white shadow-2xl shadow-indigo/20'>
                  <div className='flex items-center gap-3 mb-4'>
                    <Sparkles className='text-terracotta' />
                    <p className='text-sm font-black uppercase tracking-widest'>
                      Premium Odyssey
                    </p>
                  </div>
                  <p className='text-xs font-medium text-white/60 leading-relaxed mb-6'>
                    Unlock deep cultural insights and AI pronunciation coaching.
                  </p>
                  <button className='w-full bg-white text-indigo font-black py-4 rounded-2xl shadow-lg transition-transform active:scale-95'>
                    Upgrade Now
                  </button>
                </div>

                <div className='flex items-center justify-center gap-6 text-indigo/20'>
                  <Link href='https://github.com/ashusnapx' target='_blank'>
                    <Github size={20} />
                  </Link>
                  <Link href='https://twitter.com/ashusnapx' target='_blank'>
                    <Twitter size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
