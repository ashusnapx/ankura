"use client";
import { motion } from "framer-motion";
import { AnimatedCosmos } from "@/components/shared/AnimatedCosmos";
import { MapPin, Users, Coffee, Camera, ArrowUpRight } from "lucide-react";

export default function NammaAreaPage() {
  const locations = [
    {
      name: "Malleshwaram",
      kannada: "ಮಲ್ಲೇಶ್ವರಂ",
      desc: "Old Bangalore charm, temples, and the best filter coffee in the city.",
      icon: Coffee,
      color: "bg-terracotta",
    },
    {
      name: "Indiranagar",
      kannada: "ಇಂದಿರಾನಗರ",
      desc: "The urban pulse of the city. Cafes, boutiques, and tree-lined avenues.",
      icon: Camera,
      color: "bg-indigo",
    },
    {
      name: "Jayanagar",
      kannada: "ಜಯನಗರ",
      desc: "Planned perfection. Parks, markets, and a quiet, residential soul.",
      icon: MapPin,
      color: "bg-green-600",
    },
  ];

  return (
    <div className='min-h-screen bg-white relative overflow-hidden selection:bg-indigo/10'>
      <AnimatedCosmos density={10} />

      <div className='container-responsive pt-32 pb-24 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='max-w-6xl mx-auto'
        >
          <div className='mb-20 space-y-4'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/5 border border-indigo/10 text-indigo/40 mb-4'>
              <Users size={14} />
              <span className='text-[10px] font-black uppercase tracking-widest'>
                Our City
              </span>
            </div>
            <h1 className='text-6xl md:text-8xl font-black text-indigo tracking-tighter'>
              Namma <span className='text-terracotta'>Area</span>
            </h1>
            <p className='text-xl font-medium text-indigo/60 max-w-2xl'>
              Explore the neighborhoods through the lens of language. Every
              corner of Bangalore has a different story to tell.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {locations.map((loc, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className='bg-white rounded-[40px] p-10 border border-indigo/5 shadow-[0_20px_50px_-15px_rgba(45,34,103,0.05)] flex flex-col items-start gap-8'
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${loc.color} flex items-center justify-center text-white shadow-xl`}
                >
                  <loc.icon size={28} />
                </div>
                <div className='space-y-2'>
                  <h3 className='text-3xl font-black text-indigo tracking-tight'>
                    {loc.name}
                  </h3>
                  <p className='text-terracotta font-black tracking-widest text-xs uppercase'>
                    {loc.kannada}
                  </p>
                </div>
                <p className='text-lg font-medium text-indigo/60 leading-relaxed mb-4'>
                  {loc.desc}
                </p>
                <button className='mt-auto flex items-center gap-2 text-xs font-black text-indigo border-b-2 border-indigo/10 pb-1 hover:border-indigo transition-all group'>
                  Explore Stories{" "}
                  <ArrowUpRight
                    size={14}
                    className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all'
                  />
                </button>
              </motion.div>
            ))}
          </div>

          <div className='mt-24 p-16 rounded-[60px] bg-secondary/50 border border-gold/10 relative overflow-hidden'>
            <div className='relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
              <div className='space-y-8'>
                <h2 className='text-5xl font-black text-indigo tracking-tighter'>
                  Where should we go next?
                </h2>
                <p className='text-lg font-medium text-indigo/60 leading-relaxed'>
                  We&apos;re constantly mapping the city. If you want your
                  neighborhood to be featured in our upcoming stories, let us
                  know!
                </p>
                <button className='px-8 py-4 bg-indigo text-white rounded-2xl font-black shadow-xl shadow-indigo/20 hover:scale-105 transition-all'>
                  Suggest an Area
                </button>
              </div>
              <div className='hidden lg:block aspect-square bg-indigo/5 rounded-[48px] border border-indigo/5 flex items-center justify-center'>
                <MapPin size={120} className='text-indigo/10' />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
