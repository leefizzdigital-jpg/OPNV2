import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AosaLogo } from './AosaLogo';
import { Diamond, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-opal-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-opal-pink/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl w-full flex flex-col items-center text-center relative z-10"
      >
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.8 }}
        >
          <AosaLogo className="h-20 w-auto mb-12 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        </motion.div>
        
        <div className="space-y-6 mb-16 relative">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: '100%' }} 
            transition={{ delay: 0.5, duration: 1.5 }}
            className="absolute -top-3 left-0 h-[1px] bg-gradient-to-r from-transparent via-opal-blue to-transparent"
          ></motion.div>
          <h1 className="text-[11px] font-black uppercase tracking-[0.6em] text-opal-blue/80">Opal Provenance Network Protocol v3.1</h1>
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tighter leading-[0.9] uppercase italic">
            Secure Node<br />
            <span className="text-ivory/40">Access Authorisation</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-10">
          <div className="relative group p-1 rounded-2xl bg-white/5 border border-white/10 focus-within:border-opal-blue transition-all duration-500">
            <div className="absolute inset-0 bg-opal-blue/5 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-xl"></div>
            <input 
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="USERNAME"
              className="w-full bg-transparent px-8 py-8 text-xl font-display font-medium text-white placeholder:text-white/5 outline-none text-center uppercase tracking-[0.2em] relative z-20"
            />
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-opal-blue/40"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-opal-blue/40"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-opal-blue/40"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-opal-blue/40"></div>
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className="group relative flex items-center justify-center gap-4 w-full py-8 rounded-2xl bg-ivory text-obsidian font-black uppercase tracking-[0.4em] text-[11px] hover:bg-opal-blue hover:text-white transition-all transform active:scale-[0.98] disabled:opacity-5 disabled:grayscale overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
            <span className="relative z-10 flex items-center gap-3">
              Initiate Neural Link
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </button>
        </form>

        <div className="mt-20 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 p-4 rounded-full border border-white/5 bg-white/[0.02]">
              <div className="w-1.5 h-1.5 rounded-full bg-opal-green animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.4)]"></div>
              <span className="text-[11px] text-opal-green font-bold uppercase tracking-[0.4em] font-mono">IDENTITY_SCANNERS_ACTIVE</span>
           </div>
           <p className="text-[11px] text-ash/30 uppercase tracking-[0.5em] font-medium max-w-xs leading-loose text-center font-mono">
              Sovereign data encryption standards enforced at protocol level.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
