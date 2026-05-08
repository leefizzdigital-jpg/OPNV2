import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  title?: string;
  className?: string;
}

export function InfoTooltip({ content, title, className = "" }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`relative inline-flex items-center group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Info size={12} className="text-white/20 group-hover:text-[#00D1FF] transition-colors cursor-help" />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 z-[100] pointer-events-none"
          >
            <div className="bg-[#0c1016] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
              {title && (
                <div className="text-[10px] font-bold text-[#00D1FF] uppercase tracking-[0.3em] mb-2 font-mono">
                  {title}
                </div>
              )}
              <div className="text-[11px] leading-relaxed text-white/60 font-medium">
                {content}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c1016] border-b border-r border-white/10 rotate-45 -mt-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
