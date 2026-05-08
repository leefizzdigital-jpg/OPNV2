import React from 'react';
import { motion } from 'motion/react';
import { OpalRecord } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap } from 'lucide-react';
import { PORTAL_CHART_DATA } from '../data';

export function ClaimPortal({ records, onSelect }: { records: OpalRecord[], onSelect: (r: OpalRecord) => void }) {
  const totalValue = records.reduce((acc, r) => acc + (r.nft_value || r.mk_rough_total || 0), 0);

  return (
    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-16">
      <header className="mb-12">
        <h2 className="text-6xl md:text-7xl font-display font-medium text-white mb-4 tracking-tighter uppercase italic">The Parcel<span className="text-opal-blue">™</span></h2>
        <p className="text-ash text-[12px] font-bold uppercase tracking-[0.3em]">Network Status: <span className="text-opal-green animate-pulse">Synchronized</span></p>
      </header>

      {/* NFTs Owned / Digital Twins (Top Section) */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
           <Zap size={20} className="text-opal-blue animate-pulse" />
           <h3 className="text-xl font-display font-bold uppercase tracking-widest text-opal-blue">Digital Twins</h3>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {records.filter(r => r.nft).map((record) => (
            <div 
              key={`nft-${record.id}`} 
              className="bg-black/40 p-2 rounded-2xl flex flex-col items-center justify-center group hover:bg-opal-blue/10 cursor-pointer border border-opal-blue/20 relative overflow-hidden transition-colors duration-300 shadow-[0_0_15px_rgba(0,209,255,0.05)] hover:shadow-[0_0_25px_rgba(0,209,255,0.2)]" 
              onClick={() => onSelect(record)}
            >
               <div className="absolute inset-0 bg-opal-blue/5 group-hover:bg-transparent transition-colors"></div>
               {/* 'Node electricity' decoration */}
               <div className="absolute top-0 left-1/2 w-4 h-[1px] bg-opal-blue/40"></div>
               <div className="absolute bottom-0 left-1/2 w-4 h-[1px] bg-opal-blue/40"></div>
               <div className="absolute top-1/2 left-0 h-4 w-[1px] bg-opal-blue/40"></div>
               <div className="absolute top-1/2 right-0 h-4 w-[1px] bg-opal-blue/40"></div>

               {/* Cropped Image Thumbnail */}
               <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 relative z-10 box-border border border-white/5 group-hover:border-opal-blue/40 transition-colors duration-300 bg-obsidian flex items-center justify-center">
                  <img src={record.nft_img || record.img} className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out" />
               </div>
               <div className="text-center w-full z-10 px-1">
                 <h4 className="font-display font-bold text-ivory text-[9px] mb-[1px] uppercase truncate">{record.name}</h4>
                 <p className="text-[8px] text-opal-blue font-bold tracking-[0.2em] font-data">ID-{record.id}</p>
               </div>
            </div>
          ))}
          {records.filter(r => r.nft).length === 0 && (
            <div className="col-span-4 lg:col-span-8 py-10 text-center text-opal-blue/40 font-black uppercase tracking-widest text-xs border border-opal-blue/10 border-dashed rounded-[24px]">
              Void. No digital twins forged. Access The Mint to begin.
            </div>
          )}
        </div>
      </div>

      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-box rounded-[40px] p-10 flex flex-col justify-center relative overflow-hidden group border border-white/5">
          <p className="text-label text-ash mb-4">Total Portfolio Value (AUD)</p>
          <h3 className="text-6xl font-data font-medium text-white mb-4 transform transition-transform duration-500 group-hover:scale-102 origin-left">
            ${totalValue.toLocaleString('en-AU', { maximumFractionDigits: 0 })}
          </h3>
          <div className="flex items-center gap-2 text-opal-green">
            <div className="px-3 py-1 rounded-full bg-opal-green/10 border border-opal-green/20 text-xs font-bold font-data flex items-center gap-1">
              +14.2% (24h)
            </div>
            <p className="text-ash text-xs font-bold uppercase tracking-widest">Market Trend</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass-box rounded-[40px] p-8 h-[300px] relative overflow-hidden border border-white/5">
          <div className="absolute top-8 left-10 z-10">
            <p className="text-label text-ash">Value Trajectory</p>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PORTAL_CHART_DATA} margin={{ top: 40, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontFamily: 'Space Grotesk' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#00D1FF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Arsenal list */}
      <div className="space-y-6 pb-20">
        <h3 className="text-xl font-display font-bold uppercase tracking-widest text-white mb-6">The Physical Arsenal</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {records.filter(r => !r.nft).map((record) => (
            <div 
              key={`arsenal-${record.id}`} 
              onClick={() => onSelect(record)}
              className={`glass-panel p-4 rounded-[32px] cursor-pointer group transition-colors duration-300 relative overflow-hidden border ${record.mk_grade && record.mk_grade >= 8 ? 'border-white/20 hover:border-opal-gold shadow-lg' : 'border-white/5 hover:border-white/20'}`}
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative bg-black">
                 <img src={record.img} className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-500 ease-out" />
                 {record.mk_grade && (
                   <div className="absolute top-4 right-4 bg-obsidian/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-ivory font-bold text-[10px]">
                     M{record.mk_grade}
                   </div>
                 )}
              </div>
              <h4 className="font-display font-bold text-sm text-ivory uppercase truncate group-hover:text-opal-gold transition-colors">{record.name}</h4>
              <div className="flex justify-between items-center mt-1">
                 <p className="font-data text-[11px] text-ash tracking-wider">{record.ct} CT</p>
                 <p className="text-[9px] uppercase tracking-widest text-ash/60 font-bold">{record.stabilityRisk} Risk</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
