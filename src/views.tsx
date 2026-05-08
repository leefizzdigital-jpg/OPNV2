import React, { useState } from 'react';
import { motion } from 'motion/react';
import { calculateDerived, CUSTODIAN_ASSETS, GRADE_COLORS, SEEDS, generatePriceHistory, formatCur } from './data';
import { OpalRecord } from './types';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, Zap, Activity } from 'lucide-react';

export function StatBox({ label, value, highlight = false, color = 'opal-blue' }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className={`glass-box p-6 rounded-[24px] text-center flex flex-col justify-center items-center ${highlight ? `border-[#00D1FF]/20 bg-[#00D1FF]/5` : 'bg-white/[0.02] border-white/5'}`}>
      <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 mb-3 font-bold">{label}</p>
      <p className={`font-display font-light tracking-[0.1em] ${highlight ? `text-[#00D1FF] text-3xl` : `text-white text-2xl`}`}>{value}</p>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { InfoTooltip } from './components/ui/InfoTooltip';

export function DivergenceView({ data }: { data: OpalRecord[] }) {
  const [showMiner, setShowMiner] = useState(true);
  const [showCutter, setShowCutter] = useState(true);
  const [showMarket, setShowMarket] = useState(true);

  const chartData = data.filter(d => d.mk_rough_total).map(d => ({
    name: `OPN-${d.id.toString().slice(0, 4)}`,
    fullName: d.name,
    Miner: d.mk_rough_total || 0,
    Cutter: d.mr_offer || ((d.mk_rough_total || 0) * 0.85),
    Market: d.nft_value || ((d.mk_rough_total || 0) * 1.2),
  }));

  return (
    <motion.div initial={{opacity: 0, y: 15}} animate={{opacity: 1, y: 0}} transition={{ duration: 0.8 }} className="space-y-20 pb-40">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 relative px-4 md:px-0">
         <div className="space-y-6">
           <h2 className="text-5xl md:text-7xl font-display font-light text-white tracking-[0.2em] uppercase leading-tight">VARIANCE<span className="text-white/20">_MATRIX</span></h2>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <p className="text-[#00D1FF] text-[11px] font-bold uppercase tracking-[0.6em] font-mono">EXTRACTION_REALIZATION_DELTA</p>
                <InfoTooltip title="Variance Analysis" content="The percentage divergence between original mining appraisal and final market realization." />
              </div>
              <div className="w-12 h-[1px] bg-white/10 hidden md:block"></div>
              <p className="text-white/20 text-[11px] font-bold uppercase tracking-[0.6em] font-mono hidden md:block">PHASE_B_VALIDATION</p>
           </div>
         </div>
         <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-full backdrop-blur-3xl">
           <button 
             onClick={() => setShowMiner(!showMiner)}
             className={`px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 ${showMiner ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white/60'}`}
           >
             Miner
           </button>
           <button 
             onClick={() => setShowCutter(!showCutter)}
             className={`px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 ${showCutter ? 'bg-[#00D1FF] text-black shadow-2xl' : 'text-white/40 hover:text-white/60'}`}
           >
             Cutter
           </button>
           <button 
             onClick={() => setShowMarket(!showMarket)}
             className={`px-8 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 ${showMarket ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
           >
             Market
           </button>
         </div>
      </header>

      <div className="bg-black border border-white/5 p-12 rounded-[64px] shadow-3xl h-[450px] relative overflow-hidden mx-4 md:mx-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,209,255,0.03),transparent_70%)] opacity-40"></div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.1)" 
              fontSize={10} 
              tickMargin={15} 
              axisLine={false}
              tickLine={false}
              fontWeight="bold"
              letterSpacing="0.4em"
            />
            <YAxis hide={true} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.02)'}}
              contentStyle={{ backgroundColor: '#02050a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}
              itemStyle={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.3em' }}
              labelStyle={{ color: '#00D1FF', marginBottom: '16px', fontSize: '12px', letterSpacing: '0.4em', fontWeight: 'bold' }}
              labelFormatter={(label, payload) => {
                const item = payload[0]?.payload;
                return item ? `${item.fullName}` : label;
              }}
            />
            {showMiner && <Bar dataKey="Miner" fill="rgba(255,255,255,0.05)" radius={[2, 2, 0, 0]} />}
            {showCutter && <Bar dataKey="Cutter" fill="#00D1FF" radius={[2, 2, 0, 0]}  />}
            {showMarket && <Bar dataKey="Market" fill="rgba(255,255,255,0.2)" radius={[2, 2, 0, 0]}  />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/[0.01] border border-white/5 p-16 rounded-[64px] mt-32 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-32 h-32 bg-[#00D1FF]/5 blur-[80px] rounded-full"></div>
         <h3 className="text-[11px] font-bold uppercase tracking-[0.6em] text-white/20 mb-20 flex items-center gap-6 font-mono">
           <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] shadow-[0_0_15px_rgba(0,209,255,0.8)]" /> CROSS_CHAIN_VARIANCE_INDEX
         </h3>
         
         <div className="flex">
            <div className="flex flex-col justify-around pr-16 border-r border-white/5 text-[11px] font-bold uppercase tracking-[0.5em] text-white/5 font-mono py-8">
              <div className="bg-white/[0.03] px-5 py-2 rounded-full border border-white/5">EXTRACTOR</div>
              <div className="bg-white/[0.05] px-5 py-2 rounded-full border border-white/5 text-white/30">REFRACTOR</div>
              <div className="bg-[#00D1FF]/10 px-5 py-2 rounded-full border border-[#00D1FF]/10 text-[#00D1FF]">V_DELTA</div>
            </div>
            
            <div className="flex-1 overflow-x-auto pl-16 pb-8 custom-scrollbar">
               <div className="flex gap-8 mb-6">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => (
                   <div key={`h-${s.id}`} className="min-w-[100px] text-center text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] font-mono opacity-40">NODE_{s.id.toString().slice(0,3)}</div>
                 ))}
               </div>
               
               <div className="flex gap-8 mb-6">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => (
                   <div key={`mk-${s.id}`} className="min-w-[100px] h-20 rounded-[28px] flex flex-col items-center justify-center bg-black border border-white/5 transition-all hover:border-white/20 group">
                      <span className="text-[8px] text-white/20 font-mono tracking-widest mb-1 group-hover:text-white/40">G_INIT</span>
                      <span className="text-2xl font-display font-light text-white">M{s.mk_grade}</span>
                   </div>
                 ))}
               </div>
               
               <div className="flex gap-8 mb-12">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => (
                   <div key={`mr-${s.id}`} className="min-w-[100px] h-20 rounded-[28px] flex flex-col items-center justify-center bg-black border border-white/5 opacity-50 transition-all hover:opacity-100 group">
                      <span className="text-[8px] text-white/20 font-mono tracking-widest mb-1">G_FINAL</span>
                      <span className="text-2xl font-display font-light text-white/60">M{s.mr_grade}</span>
                   </div>
                 ))}
               </div>
               
               <div className="flex gap-8 border-t border-white/5 pt-12">
                 {data.filter(s => s.mk_grade && s.mr_grade).map(s => {
                   const gap = Math.abs(s.mk_grade! - s.mr_grade!);
                   const isCritical = gap >= 2;
                   return (
                     <div key={`gap-${s.id}`} className={`min-w-[100px] h-12 rounded-[24px] flex items-center justify-center font-mono font-bold text-[12px] tracking-widest ${gap === 0 ? 'text-white/10 uppercase' : isCritical ? 'bg-[#00D1FF] text-black shadow-[0_0_30px_rgba(0,209,255,0.3)]' : 'border border-[#00D1FF]/20 text-[#00D1FF]'}`}>
                       {gap === 0 ? 'SYNCED' : `Δ_${gap}`}
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
    <motion.div initial={{opacity: 0, y: 15}} animate={{opacity: 1, y: 0}} transition={{ duration: 0.8 }}>
      <header className="mb-12">
         <h2 className="text-3xl font-display font-light text-white tracking-[0.2em] uppercase">ASSET DIRECTORY</h2>
      </header>
      <div className="glass-panel overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.01]">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-white/[0.03] border-b border-white/5">
              <tr>
                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 font-mono">PROTOCOL_ID</th>
                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 font-mono text-center">M_GRADE</th>
                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 font-mono">VALUATION</th>
                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 font-mono">RISK_LEVEL</th>
                <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-[0.5em] text-white/30 font-mono text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map(s => (
                <tr key={s.id} onClick={() => onSelect(s.id)} className="hover:bg-white/[0.03] transition-all cursor-pointer group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/5 bg-black p-1">
                        <img src={s.img} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                      </div>
                      <div>
                        <p className="font-display font-light text-base text-white tracking-[0.1em] uppercase mb-1">{s.name}</p>
                        <p className="text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">HASH: 0x{s.id.toString().slice(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <span className={`px-4 py-1 rounded-full border text-[11px] font-bold font-mono ${getGradeTheme(s.mk_grade || 0).border} ${getGradeTheme(s.mk_grade || 0).text} bg-white/[0.03]`}>
                       M{s.mk_grade}
                     </span>
                  </td>
                  <td className="px-8 py-6 font-display font-light text-white tracking-widest text-base">{formatCur(s.mk_rough_total)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${s.stabilityRisk === 'High' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : s.stabilityRisk === 'Medium' ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'bg-[#00D1FF] shadow-[0_0_12px_rgba(0,209,255,0.6)]'}`} />
                       <span className={`text-[11px] font-bold tracking-[0.3em] uppercase font-mono ${s.stabilityRisk === 'High' ? 'text-red-500' : s.stabilityRisk === 'Medium' ? 'text-orange-400' : 'text-[#00D1FF]'}`}>
                        {s.stabilityRisk}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {s.nft ? (
                      <span className="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] border border-[#00FF88]/40 text-[#00FF88] bg-[#00FF88]/5">SECURED</span>
                    ) : (
                      <span className="px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] bg-white/5 text-white/10 border border-white/5 group-hover:border-white/20 group-hover:text-white/30 transition-all font-mono">RAW_CORE</span>
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
