import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function JonyIveDemo({ onComplete }: { onComplete: (name: string) => void }) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#02050a] text-white font-sans flex flex-col overflow-hidden selection:bg-[#00D1FF] selection:text-black">
      <WaveBackground />
      
      {/* Top Nav */}
      <header className="absolute top-0 left-0 right-0 p-8 md:px-12 flex items-center justify-between z-20 text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-medium">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-[1.5px] border-[#00D1FF]/50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,209,255,0.8)]"></div>
          </div>
          <span className="tracking-[0.3em] font-normal text-white/90">OPN NODE</span>
        </div>
        <div className="hidden md:flex items-center gap-12 font-normal">
          <span className="cursor-pointer border-b border-[#00D1FF] pb-1 text-white">ACCESS</span>
          <span className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity">PROTOCOL</span>
          <span className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity">LEDGER</span>
          <span className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity">VALIDITY</span>
          <button className="px-6 py-2 rounded-full border border-white/20 hover:border-[#00D1FF] hover:bg-[#00D1FF]/10 hover:text-white transition-colors tracking-[0.2em]">
            CONNECT WRT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-[6rem] font-light tracking-[0.15em] mb-8 text-[#E8F1F2]"
        >
          WELCOME
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs md:text-sm text-white/40 font-mono tracking-widest leading-relaxed max-w-[480px] mb-12 uppercase"
        >
          Secure connection established. Initialize operator credential validation to enter the Opal Provenance Network.
        </motion.p>
        
        <AnimatePresence mode="wait">
          {!showInput ? (
            <motion.button
              key="btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setShowInput(true)}
              className="px-8 py-3.5 bg-transparent border border-[#00D1FF]/40 text-[#00D1FF] rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-[#00D1FF]/10 hover:border-[#00D1FF] transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D1FF]/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
              Initialize Neural Link
            </motion.button>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-center gap-6"
            >
              <input 
                autoFocus
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="PROVENANCE ID"
                className="w-full max-w-sm bg-transparent border-b border-[#00D1FF]/20 px-4 py-4 text-center text-xl tracking-[0.2em] uppercase font-light text-white focus:border-[#00D1FF] focus:outline-none transition-colors placeholder:text-white/20"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-8 py-3.5 bg-white text-black rounded-full font-bold text-[10px] tracking-[0.2em] uppercase hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              >
                Access Network
                <ArrowRight size={14} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#02050a]">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00D1FF] rounded-full blur-[200px] opacity-10 mix-blend-screen"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0072ff] rounded-full blur-[200px] opacity-10 mix-blend-screen"></div>
      <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-[#002050] rounded-full blur-[200px] opacity-40 mix-blend-screen"></div>

      <svg className="w-full h-full absolute inset-0 mix-blend-screen opacity-70" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0072ff" stopOpacity="0" />
            <stop offset="20%" stopColor="#00D1FF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#0072ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#002050" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#002050" stopOpacity="0" />
            <stop offset="40%" stopColor="#00D1FF" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0072ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00D1FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          {Array.from({ length: 45 }).map((_, i) => {
            const t = i / 45; 
            const startX = -200;
            const startY = 600 + t * 400;
            const cp1X = 300 + Math.sin(t * Math.PI) * 400;
            const cp1Y = 900 - t * 400;
            const cp2X = 900 - Math.sin(t * Math.PI) * 400;
            const cp2Y = 100 + t * 500;
            const endX = 1600;
            const endY = 100 + t * 300;
            
            const pathInfo = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
            
            return (
              <motion.path
                key={`a-${i}`}
                d={pathInfo}
                fill="none"
                stroke="url(#wave1)"
                strokeWidth={1}
                opacity={0.1 + 0.3 * Math.sin(t * Math.PI)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.1 + 0.3 * Math.sin(t * Math.PI) }}
                transition={{ duration: 4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
          {Array.from({ length: 45 }).map((_, i) => {
            const t = i / 45; 
            const startX = -200;
            const startY = 800 - t * 400;
            const cp1X = 400 - Math.sin(t * Math.PI) * 300;
            const cp1Y = 700 + t * 300;
            const cp2X = 1000 + Math.sin(t * Math.PI) * 400;
            const cp2Y = 200 - t * 400;
            const endX = 1600;
            const endY = 700 - t * 300;
            
            const pathInfo = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
            
            return (
              <motion.path
                key={`b-${i}`}
                d={pathInfo}
                fill="none"
                stroke="url(#wave2)"
                strokeWidth={0.6}
                opacity={0.1 + 0.2 * Math.sin(t * Math.PI)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.1 + 0.2 * Math.sin(t * Math.PI) }}
                transition={{ duration: 4, delay: 1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
