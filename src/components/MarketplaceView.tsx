import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OpalRecord } from '../types';
import { GRADE_COLORS, formatCur, getGradeTheme } from '../data';
import { InfoTooltip } from './ui/InfoTooltip';

const StatBox = ({ label, value, highlight = false, tooltip = "" }: { label: string, value: string, highlight?: boolean, tooltip?: string }) => (
  <div className={`p-8 rounded-[48px] border transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-40 group ${highlight ? 'bg-white text-black border-transparent shadow-2xl scale-[1.02]' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}>
     <div className="flex justify-between items-start">
        <div className={`text-[11px] font-bold uppercase tracking-[0.5em] flex items-center gap-3 font-mono ${highlight ? 'text-black/40' : 'text-white/20'}`}>
           <span className={`w-1.5 h-1.5 rounded-full ${highlight ? 'bg-black' : 'bg-[#00D1FF]'} animate-pulse`} /> {label}
        </div>
        {tooltip && <InfoTooltip content={tooltip} title={label} />}
     </div>
     <div className={`text-4xl font-display font-light tracking-[0.1em] ${highlight ? 'text-black' : 'text-white'}`}>{value}</div>
  </div>
);

export function MarketplaceView({ data, onSelect }: { data: OpalRecord[], onSelect: (id: string | number) => void }) {
  const [gradeFilter, setGradeFilter] = useState('all');
  const [purchased, setPurchased] = useState<string[]>([]);
  const [buyModal, setBuyModal] = useState<OpalRecord | null>(null);

  const getListingPrice = (s: OpalRecord) => {
    const base = s.mr_offer || s.mk_rough_total || 1000;
    if (s.mk_grade && s.mk_grade >= 9) return base * 1.5;
    if (s.mk_grade && s.mk_grade >= 8) return base * 1.8;
    if (s.mk_grade && s.mk_grade >= 7) return base * 2.0;
    if (s.mk_grade && s.mk_grade >= 6) return base * 2.2;
    return base * 2.5;
  };

  const eligibleStones = data.filter(s => s.mk_grade && s.mk_grade >= 5).map(s => ({
    ...s,
    listPrice: s.id === 13 ? 4500 : getListingPrice(s),
    isPurchased: purchased.includes(s.id.toString())
  }));

  const filtered = eligibleStones.filter(s => {
    if (gradeFilter === 'm7+') return s.mk_grade && s.mk_grade >= 7;
    if (gradeFilter === 'm9') return s.mk_grade && s.mk_grade >= 9;
    return true;
  });

  const totalCap = eligibleStones.reduce((sum, s) => sum + s.listPrice, 0);

  return (
    <motion.div initial={{opacity: 0, y: 15}} animate={{opacity: 1, y: 0}} transition={{ duration: 0.6 }} className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative mb-8">
        <div>
           <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-[0.2em] uppercase">THE FLOOR</h2>
           <p className="text-[9px] text-white/30 font-bold tracking-[0.4em] uppercase mt-4">DIGITAL ASSET PROTOCOL / MARKETPLACE</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-full">
           {['all', 'm7+', 'm9'].map(f => (
             <button 
               key={f} 
               onClick={() => setGradeFilter(f)} 
               className={`px-8 py-2.5 text-[11px] font-bold uppercase tracking-[0.3em] rounded-full transition-all duration-700 ${gradeFilter === f ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
             >
               {f.toUpperCase()}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatBox label="ACTIVE_NODES" value={eligibleStones.length.toString()} highlight={true} tooltip="Number of verified matrix nodes currently available for acquisition." />
        <StatBox label="TRADE_VOLUME" value={formatCur(totalCap)} tooltip="Aggregate floor value of all eligible nodes within the current matrix." />
        <StatBox label="ASSET_YIELD" value="28.4%" tooltip="Projected annual growth based on historical price divergence and rarity index." />
        <StatBox label="NODE_STATUS" value="LIVE" tooltip="Current network connectivity and protocol synchronization status." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-16">
        {filtered.map(s => {
          const theme = getGradeTheme(s.mk_grade || 0);
          return (
            <div key={s.id} className="bg-white/[0.01] border border-white/5 hover:border-white/20 transition-all duration-700 group flex flex-col relative rounded-[48px] overflow-hidden p-3 hover:translate-y-[-4px]">
              <div className="h-80 overflow-hidden relative cursor-pointer rounded-[40px]" onClick={() => onSelect(s.id)}>
                <img src={s.img} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[0.22, 1, 0.36, 1]" />
                <div className="absolute inset-0 ceremony-scan opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                
                <div className={`absolute top-8 right-8 px-6 py-2 rounded-full border backdrop-blur-md font-mono text-[11px] font-bold text-white tracking-[0.3em] shadow-2xl transition-all ${theme.border} ${theme.glow}`}>
                   M{s.mk_grade}_NODE
                </div>
                
                {s.nft && <div className="absolute bottom-8 left-8 bg-[#00D1FF] text-black px-5 py-2 rounded-full font-bold text-[9px] tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(0,209,255,0.4)] transition-all group-hover:scale-105">CORELINKED</div>}
              </div>
              
              <div className="p-10 pb-12 flex-1 flex flex-col px-4">
                <h3 className="text-3xl font-display font-light text-white tracking-[0.2em] mb-6 uppercase leading-tight">{s.name.split(' ')[0]} <span className="text-white/20">{s.name.split(' ').slice(1).join(' ')}</span></h3>
                <div className="text-[11px] text-white/10 font-mono tracking-[0.5em] mb-12 uppercase flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#00D1FF] transition-colors"></div>
                      <span>{s.ct}CT_MASS</span>
                      <InfoTooltip title="Carat Mass" content="Verified physical weight of the opal matrix." />
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="opacity-50">SYNC_</span>
                      <span>V3.01</span>
                   </div>
                </div>
                
                <div className="mt-auto flex justify-between items-end bg-white/[0.03] border border-white/5 rounded-full p-2 pl-8">
                  <div className="pb-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase">VALUATION</div>
                      <InfoTooltip title="Market Valuation" content="Estimated exchange value based on neural grade and scarcity protocols." />
                    </div>
                    <div className="text-[16px] font-display font-light text-[#00D1FF] tracking-[0.1em]">{formatCur(s.listPrice)}</div>
                  </div>
                  <button 
                    disabled={s.isPurchased}
                    onClick={() => setBuyModal(s as OpalRecord)}
                    className="px-8 py-3 bg-white text-black font-bold uppercase text-[10px] tracking-[0.4em] rounded-full transition-all duration-700 disabled:opacity-0 hover:scale-[1.05] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-[#00D1FF] hover:text-black group-hover:shadow-[0_0_50px_rgba(0,209,255,0.2)]"
                  >
                    <span className="relative z-10">{s.isPurchased ? 'ACQUIRED' : 'INITIALIZE'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {buyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#02050a]/95 backdrop-blur-3xl" onClick={() => setBuyModal(null)}>
           <div 
             className="bg-[#02050a] p-12 md:p-16 rounded-[48px] w-full max-w-xl text-center relative border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
             onClick={e => e.stopPropagation()}
           >
              <div className="w-40 h-40 rounded-[32px] mx-auto mb-10 shadow-2xl overflow-hidden border border-white/5 bg-black p-2">
                 <img src={buyModal.img} className="w-full h-full object-cover grayscale opacity-60" />
              </div>
              <h3 className="text-3xl font-display font-light text-white uppercase tracking-[0.2em] mb-4">FINALIZE PROTOCOL</h3>
              <p className="text-white/30 text-[10px] tracking-[0.2em] font-medium uppercase mb-12">SECURE ASSET OWNERSHIP ON SOVEREIGN LEDGER</p>
              
              <div className="bg-white/[0.02] rounded-[24px] p-8 mb-12 border border-white/5 space-y-6">
                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-white/30"><span>ASSET PRICE</span><span className="text-white font-mono">{formatCur((buyModal as any).listPrice)}</span></div>
                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-white/30"><span>GAS TOKEN</span><span className="text-[#00D1FF] font-mono">0.000 / SPONSORED</span></div>
                 <div className="flex justify-between pt-6 border-t border-white/5 text-2xl font-display font-light tracking-[0.1em] text-white"><span>TOTAL DUE</span><span>{formatCur((buyModal as any).listPrice)}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setBuyModal(null)} className="py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all">ABORT</button>
                 <button onClick={() => { setPurchased([...purchased, buyModal.id.toString()]); setBuyModal(null); }} className="py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95">
                    CONFIRM NODE
                 </button>
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
}
