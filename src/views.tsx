import React, { useState } from 'react';
import { motion } from 'motion/react';
import { calculateDerived, CUSTODIAN_ASSETS, GRADE_COLORS, SEEDS, generatePriceHistory, formatCur } from './data';
import { OpalRecord } from './types';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, Zap, Activity } from 'lucide-react';

export function StatBox({ label, value, highlight = false, color = 'opal-blue' }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className={`glass-box p-6 rounded-3xl text-center flex flex-col justify-center items-center ${highlight ? `border-${color}/30 shadow-[0_0_20px_rgba(255,77,151,0.1)]` : ''}`}>
      <p className="text-[10px] uppercase tracking-[0.3em] text-ash mb-3 font-bold">{label}</p>
      <p className={`font-data font-medium tracking-wider ${highlight ? `text-${color} text-3xl drop-shadow-[0_0_10px_var(--${color})]` : `text-${color} text-2xl`}`}>{value}</p>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

export function DivergenceView({ data }: { data: OpalRecord[] }) {
  const [showMiner, setShowMiner] = useState(true);
  const [showCutter, setShowCutter] = useState(true);
  const [showMarket, setShowMarket] = useState(true);

  const chartData = data.filter(d => d.mk_rough_total).map(d => ({
    name: d.name.split(' ').slice(0,2).join(' '),
    Miner: d.mk_rough_total || 0,
    Cutter: d.mr_offer || ((d.mk_rough_total || 0) * 0.85),
    Market: d.nft_value || ((d.mk_rough_total || 0) * 1.2),
  }));

  return (
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
         <div>
           <h2 className="text-5xl font-display font-black text-white mb-4 tracking-tighter uppercase italic">Variance Matrix</h2>
           <p className="text-ash text-[12px] font-black uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
             Where extraction potential diverges from lapidary floor value and market realization.
           </p>
         </div>
         <div className="flex gap-4 p-2 glass-panel rounded-2xl">
           <button 
             onClick={() => setShowMiner(!showMiner)}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showMiner ? 'bg-opal-pink text-white shadow-[0_0_15px_rgba(255,77,151,0.3)]' : 'text-ash hover:text-white'}`}
           >
             Miner
           </button>
           <button 
             onClick={() => setShowCutter(!showCutter)}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showCutter ? 'bg-opal-blue text-obsidian shadow-[0_0_15px_rgba(0,209,255,0.3)]' : 'text-ash hover:text-white'}`}
           >
             Cutter
           </button>
           <button 
             onClick={() => setShowMarket(!showMarket)}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showMarket ? 'bg-opal-green text-obsidian shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'text-ash hover:text-white'}`}
           >
             Market
           </button>
         </div>
      </header>

      <div className="glass-panel p-8 rounded-[40px] border border-white/5 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" stroke="#8E9299" fontSize={10} tickMargin={10} />
            <YAxis stroke="#8E9299" fontSize={10} tickFormatter={(val) => `$${val/1000}k`} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontFamily: 'Space Grotesk' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            {showMiner && <Bar dataKey="Miner" fill="#FF4D97" radius={[4, 4, 0, 0]} />}
            {showCutter && <Bar dataKey="Cutter" fill="#00D1FF" radius={[4, 4, 0, 0]} />}
            {showMarket && <Bar dataKey="Market" fill="#4ADE80" radius={[4, 4, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-panel p-8 rounded-[40px] mt-12">
         <h3 className="text-xl font-display font-black uppercase tracking-widest text-white mb-8">AOSA Grade Delta</h3>
         <div className="flex">
            <div className="flex flex-col justify-around pr-8 border-r border-white/10 text-[11px] font-black uppercase tracking-widest text-ash">
              <div className="text-opal-pink">Miner</div>
              <div className="text-opal-blue">Cutter</div>
              <div className="text-white mt-4">Delta</div>
            </div>
            <div className="flex-1 overflow-x-auto pl-8 pb-4 custom-scrollbar">
               <div className="flex gap-2 mb-2">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => (
                   <div key={`h-${s.id}`} className="w-16 text-center text-[9px] text-ash/60 truncate font-bold uppercase">{s.name.split(' ').slice(0,2).join(' ')}</div>
                 ))}
               </div>
               <div className="flex gap-2 mb-2">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => (
                   <div key={`mk-${s.id}`} className="w-16 h-12 rounded-xl flex items-center justify-center font-data font-bold text-[14px]" style={{backgroundColor: `${GRADE_COLORS[s.mk_grade!]}33`, border: `1px solid ${GRADE_COLORS[s.mk_grade!]}`, color: '#fff'}}>
                     M{s.mk_grade}
                   </div>
                 ))}
               </div>
               <div className="flex gap-2 mb-6">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => (
                   <div key={`mr-${s.id}`} className="w-16 h-12 rounded-xl flex items-center justify-center font-data font-bold text-[14px]" style={{backgroundColor: `${GRADE_COLORS[s.mr_grade!]}33`, border: `1px solid ${GRADE_COLORS[s.mr_grade!]}`, color: '#fff'}}>
                     M{s.mr_grade}
                   </div>
                 ))}
               </div>
               <div className="flex gap-2 border-t border-white/10 pt-6">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => {
                   const gap = Math.abs(s.mk_grade! - s.mr_grade!);
                   const isCritical = gap >= 4;
                   let bg = 'bg-opal-green/20'; let fg = 'text-opal-green';
                   if (gap === 1) { bg = 'bg-opal-blue/20'; fg = 'text-opal-blue'; }
                   if (gap === 2) { bg = 'bg-[#facc15]/20'; fg = 'text-[#facc15]'; }
                   if (gap >= 3) { bg = 'bg-opal-red/20'; fg = 'text-opal-red'; }

                   return (
                     <div key={`gap-${s.id}`} className={`w-16 h-10 rounded-xl flex items-center justify-center font-data font-bold text-[12px] ${bg} ${fg} ${isCritical ? 'animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]' : ''}`}>
                       {gap === 0 ? '✓' : `±${gap}`}
                     </div>
                   );
                 })}
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

export function DirectoryView({ data, onSelect }: { data: OpalRecord[], onSelect: (id: string | number) => void }) {
  return (
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}>
      <header className="mb-12">
         <h2 className="text-5xl font-display font-black text-white mb-4 tracking-tighter uppercase italic">Asset Directory</h2>
      </header>
      <div className="glass-panel overflow-hidden rounded-[32px]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ash">Asset</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ash">Miner Grade</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ash">Raw Vol Valuation</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ash">Stability</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-ash text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map(s => (
                <tr key={s.id} onClick={() => onSelect(s.id)} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                        <img src={s.img} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-ivory group-hover:text-opal-pink transition-colors">{s.name}</p>
                        <p className="text-[10px] text-ash font-bold tracking-widest">{s.ct}CT • {s.pattern}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 rounded-md text-[11px] font-bold" style={{ backgroundColor: `${GRADE_COLORS[s.mk_grade!]}33`, color: GRADE_COLORS[s.mk_grade!] }}>
                      M{s.mk_grade}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-data text-opal-gold font-medium">{formatCur(s.mk_rough_total)}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase ${s.stabilityRisk === 'High' ? 'bg-opal-red/20 text-opal-red' : s.stabilityRisk === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-opal-green/20 text-opal-green'}`}>
                      {s.stabilityRisk}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    {s.nft ? (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-opal-blue text-obsidian">Twin Active</span>
                    ) : (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-ash border border-white/10 group-hover:border-white/30">Physical</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
