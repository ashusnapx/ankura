"use client";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUpRight,
  Mail,
  Heart,
  Globe,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "Learning",
      links: [
        { label: "Stories", href: "/missions" },
        { label: "Word Garden", href: "/garden" },
        { label: "Practice Shadowing", href: "/practice/shadow-speaking" },
        { label: "Script Explorer", href: "/practice/writing" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Namma Area", href: "/community/namma-area" },
        { label: "Cultural Notes", href: "/community/cultural-notes" },
        { label: "Bangalore Diaries", href: "/community/cultural-notes" },
      ],
    },
    {
      title: "Legal & Support",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Feedback", href: "/feedback" },
      ],
    },
  ];

  const socials = [
    { icon: Github, href: "https://github.com/ashusnapx", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/ashusnapx", label: "Twitter" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/ashusnapx",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/ashusnapx",
      label: "Instagram",
    },
  ];

  return (
    <footer className='w-full bg-white border-t border-indigo/5 pt-24 pb-12 px-6 overflow-hidden'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24'>
          {/* Brand Info */}
          <div className='lg:col-span-4 space-y-8'>
            <Link href='/' className='flex items-center gap-3 group w-fit'>
              <div className='w-10 h-10 bg-indigo rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo/20 group-hover:rotate-12 transition-transform'>
                A
              </div>
              <span className='text-2xl font-black text-indigo tracking-tighter'>
                Ankura
              </span>
            </Link>
            <p className='text-lg font-medium text-indigo/60 leading-relaxed max-w-sm'>
              A story-driven odyssey through the heart of Bangalore. Learn
              Kannada by living inside the narrative.
            </p>
            <div className='flex items-center gap-4'>
              {socials.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  whileHover={{ scale: 1.1, y: -2 }}
                  className='w-10 h-10 rounded-full bg-indigo/5 flex items-center justify-center text-indigo hover:bg-indigo hover:text-white transition-colors border border-indigo/5'
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav Sections */}
          <div className='lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12'>
            {sections.map((section, idx) => (
              <div key={idx} className='space-y-6'>
                <h4 className='text-[10px] font-black text-indigo/20 uppercase tracking-[0.3em]'>
                  {section.title}
                </h4>
                <ul className='space-y-4'>
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={link.href}
                        className='group flex items-center gap-2 text-sm font-black text-indigo/40 hover:text-indigo transition-colors'
                      >
                        {link.label}
                        <ArrowUpRight
                          size={12}
                          className='opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all'
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Support & Contact */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-indigo/5 mb-12'>
          <div className='flex items-center gap-6 p-6 rounded-[32px] bg-secondary/30 border border-gold/10'>
            <div className='w-12 h-12 rounded-2xl bg-white border border-indigo/5 flex items-center justify-center text-indigo shadow-sm'>
              <Mail size={20} />
            </div>
            <div>
              <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest mb-1'>
                Send us a note
              </p>
              <p className='text-sm font-black text-indigo'>hello@ankura.app</p>
            </div>
          </div>
          <div className='flex items-center gap-6 p-6 rounded-[32px] bg-secondary/30 border border-gold/10'>
            <div className='w-12 h-12 rounded-2xl bg-white border border-indigo/5 flex items-center justify-center text-indigo shadow-sm'>
              <MessageSquare size={20} />
            </div>
            <div>
              <p className='text-[10px] font-black text-indigo/20 uppercase tracking-widest mb-1'>
                Community Support
              </p>
              <p className='text-sm font-black text-indigo'>
                Discord Community
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
          <div className='flex flex-col items-center md:items-start gap-2'>
            <div className='flex items-center gap-2 text-[10px] font-black text-indigo uppercase tracking-[0.2em]'>
              <span>Made with</span>
              <Heart size={10} className='text-terracotta fill-terracotta' />
              <span>in Bangalore by</span>
              <a
                href='https://github.com/ashusnapx'
                target='_blank'
                className='text-terracotta hover:underline underline-offset-4 transition-all'
              >
                Ashutosh Kumar
              </a>
            </div>
            <p className='text-[10px] font-bold text-indigo/20 uppercase tracking-widest'>
              © {currentYear} Ankura — All rights reserved.
            </p>
          </div>

          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2 text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
              <Globe size={12} />
              <span>Available Worldwide</span>
            </div>
            <div className='w-px h-4 bg-indigo/5' />
            <div className='text-[10px] font-black text-indigo/20 uppercase tracking-widest'>
              V2.0 ALPHA
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
