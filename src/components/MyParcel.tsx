import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Sparkles, 
  Activity, 
  Zap, 
  ArrowRight,
  Disc,
  LayoutGrid,
  ListFilter,
  ArrowUpDown
} from 'lucide-react';
import { OpalRecord } from '../types';
import { formatCur, getGradeTheme } from '../data';

interface MyParcelProps {
  data: OpalRecord[];
  onFocusAsset: (id: string | number) => void;
}

type SortKey = 'grade' | 'value' | 'pattern' | 'ct';

export function MyParcel({ data, onFocusAsset }: MyParcelProps) {
  const [sortBy, setSortBy] = useState<SortKey>('pattern');

  const nfts = useMemo(() => data.filter(r => r.nft), [data]);
  const physicalsRaw = useMemo(() => data.filter(r => !r.nft), [data]);

  const groupedNfts = useMemo(() => {
    const groups: Record<number, OpalRecord[]> = {};
    nfts.forEach(r => {
      const g = r.mk_grade || 1;
      if (!groups[g]) groups[g] = [];
      groups[g].push(r);
    });
    const sortedGroups: Record<string, OpalRecord[]> = {};
    Object.keys(groups).sort((a, b) => Number(b) - Number(a)).forEach(key => {
      sortedGroups[`M${key}`] = groups[Number(key)];
    });
    return sortedGroups;
  }, [nfts]);

  const sortedPhysicals = useMemo(() => {
    const list = [...physicalsRaw];
    return list.sort((a, b) => {
      if (sortBy === 'grade') return (b.mk_grade || 0) - (a.mk_grade || 0);
      if (sortBy === 'value') return (b.mk_rough_total || 0) - (a.mk_rough_total || 0);
      if (sortBy === 'ct') return (b.ct || 0) - (a.ct || 0);
      if (sortBy === 'pattern') return (a.pattern || '').localeCompare(b.pattern || '');
      return 0;
    });
  }, [physicalsRaw, sortBy]);

  // Group by grade for "M-Rating" feel
  const groupedPhysicals = useMemo(() => {
    const groups: Record<number, OpalRecord[]> = {};
    sortedPhysicals.forEach(r => {
      const g = r.mk_grade || 1;
      if (!groups[g]) groups[g] = [];
      groups[g].push(r);
    });
    // Sort keys descending (M9 first)
    const sortedGroups: Record<string, OpalRecord[]> = {};
    Object.keys(groups).sort((a, b) => Number(b) - Number(a)).forEach(key => {
      sortedGroups[`M${key}`] = groups[Number(key)];
    });
    return sortedGroups;
  }, [sortedPhysicals]);

  return (
    <div className="space-y-24 animate-[opn-fadein_0.5s] pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative">
        <div className="absolute -left-20 top-0 w-64 h-64 bg-[#00D1FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div>
           <div className="flex items-center gap-6 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl shadow-inner">
                 <Package size={18} className="text-white/40" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-[0.15em] uppercase">THE PARCEL</h2>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
                 <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.4em]">Personal Node Inventory</p>
              </div>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.4em]">Protocol Sync Active</p>
           </div>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-full">
           {[
             { id: 'grade', label: 'GRADE' },
             { id: 'value', label: 'VALUE' },
             { id: 'pattern', label: 'PATTERN' },
             { id: 'ct', label: 'CARAT' },
           ].map(s => (
             <button 
               key={s.id}
               onClick={() => setSortBy(s.id as SortKey)}
               className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${sortBy === s.id ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
             >
               {s.label}
             </button>
           ))}
        </div>
      </header>

   <section className="space-y-16">
        <div className="flex items-center gap-8">
           <span className="text-[9px] font-bold text-[#00D1FF] uppercase tracking-[0.6em] whitespace-nowrap flex items-center gap-4">
             <Zap size={14} className="animate-pulse" /> {nfts.length} ACTIVE DIGITAL TWINS
           </span>
           <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00D1FF]/20 to-transparent"></div>
        </div>

        <div className="space-y-16">
           {(Object.entries(groupedNfts) as [string, OpalRecord[]][]).map(([gradeLabel, items]) => (
             <div key={gradeLabel} className="flex flex-col md:flex-row gap-6 items-start">
                {/* Divider/Crate Label */}
                <div className="w-full md:w-16 h-full md:h-[420px] flex md:flex-col items-center justify-center bg-white/5 border border-opal-blue/20 rounded-2xl md:rounded-3xl p-4 shrink-0 shadow-inner group transition-colors hover:bg-opal-blue/5">
                   <p className="text-[14px] font-data font-medium text-opal-blue md:-rotate-90 md:whitespace-nowrap mb-0 md:mt-20 uppercase tracking-[0.3em]">{gradeLabel}</p>
                   <div className="flex-1 hidden md:block"></div>
                   <p className="ml-auto md:ml-0 md:mt-auto text-[10px] font-black text-opal-blue/40 uppercase tracking-widest">{items.length}</p>
                </div>

                {/* Items Strip */}
                <div className="flex-1 w-full overflow-x-auto pb-6 scroll-smooth custom-scrollbar">
                   <div className="flex gap-8 px-2 pr-20 min-w-max">
                      {items.map((record: OpalRecord) => (
                        <DigitalCard key={record.id} record={record} onInspect={() => onFocusAsset(record.id)} />
                      ))}
                   </div>
                </div>
             </div>
           ))}
           {nfts.length === 0 && (
             <div className="col-span-full py-20 text-center glass-panel rounded-[32px] border-dashed border-opal-blue/20">
                <p className="text-ash/40 font-black uppercase tracking-[0.4em] text-[10px]">No cryptographically secured twins active.</p>
             </div>
           )}
        </div>
      </section>

   <section className="space-y-16">
        <div className="flex items-center gap-8">
           <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.6em] whitespace-nowrap flex items-center gap-4">
             <Disc size={14} /> PHYSICAL HOLDINGS
           </span>
           <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        <div className="space-y-16">
          {(Object.entries(groupedPhysicals) as [string, OpalRecord[]][]).map(([gradeLabel, items]) => (
            <div key={gradeLabel} className="flex flex-col md:flex-row gap-6 items-start">
               {/* Divider/Crate Label */}
               <div className="w-full md:w-16 h-full md:h-[380px] flex md:flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 shrink-0 shadow-inner group transition-colors hover:bg-white/10">
                  <p className="text-[14px] font-data font-medium text-opal-pink md:-rotate-90 md:whitespace-nowrap mb-0 md:mt-20 uppercase tracking-[0.3em]">{gradeLabel}</p>
                  <div className="flex-1 hidden md:block"></div>
                  <p className="ml-auto md:ml-0 md:mt-auto text-[10px] font-black text-ash/40 uppercase tracking-widest">{items.length}</p>
               </div>

               {/* Items Strip */}
               <div className="flex-1 w-full overflow-x-auto pb-6 scroll-smooth custom-scrollbar">
                  <div className="flex gap-8 px-2 pr-20 min-w-max">
                     {items.map((record: OpalRecord) => (
                       <PhysicalCard key={record.id} record={record} onInspect={() => onFocusAsset(record.id)} />
                     ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PhysicalCard({ record, onInspect }: { record: OpalRecord, onInspect: () => void, key?: React.Key }) {
  const needsMint = !record.nft;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-[280px] h-[350px] bg-white/[0.02] border border-white/5 group relative cursor-pointer overflow-hidden rounded-[32px] transition-all hover:border-white/20"
      onClick={onInspect}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-white tracking-widest">
             M{record.mk_grade}
           </div>
           <span className="text-[8px] font-bold text-white/20 tracking-widest uppercase font-mono">OPN-{record.id.toString().slice(0,4)}</span>
        </div>

        <div className="flex-1 rounded-2xl overflow-hidden mb-6 relative">
           <img src={record.img} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent opacity-80"></div>
           
           {needsMint && (
             <div className="absolute top-3 left-3 bg-[#02050a]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[7px] font-bold text-white/50 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#00D1FF]" /> READY FOR TWIN
             </div>
           )}

           <div className="absolute bottom-2 left-0 right-0 p-0 text-center">
              <h3 className="text-lg font-display font-light text-white uppercase tracking-widest leading-tight transition-colors group-hover:text-[#00D1FF] px-2">{record.name}</h3>
           </div>
        </div>

        <div className="flex justify-between items-center">
           <div>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Valuation</p>
              <p className="text-lg font-display font-light text-white tracking-widest">{formatCur(record.mk_rough_total)}</p>
           </div>
           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00D1FF] transition-all group-hover:border-transparent">
              <ArrowRight size={14} className="text-white/30 group-hover:text-black transition-colors" />
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function DigitalCard({ record, onInspect }: { record: OpalRecord, onInspect: () => void, key?: React.Key }) {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-[350px] aspect-square bg-[#02050a] border border-[#00D1FF]/20 relative cursor-pointer overflow-hidden rounded-[40px] shadow-[0_0_80px_rgba(0,209,255,0.05)] group p-8"
      onClick={onInspect}
    >
      {/* Glow Treatment */}
      <div className="absolute -inset-20 bg-[#00D1FF]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#00D1FF]/10 transition-all duration-1000 animate-pulse"></div>

      <div className="h-full flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-8">
           <div className="bg-[#00D1FF] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_30px_rgba(0,209,255,0.4)]">
              IMMUTABLE TWIN
           </div>
           <div className="px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-bold text-white tracking-widest font-mono">
             M{record.mk_grade}
           </div>
        </div>

        <div className="flex-1 rounded-[32px] overflow-hidden mb-10 relative bg-black/40 border border-white/5 shadow-2xl">
           <img src={record.nft_img} className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-2000 ease-[0.22, 1, 0.36, 1]" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent opacity-40"></div>
           
           <div className="absolute bottom-6 left-0 right-0 text-center px-4">
              <h3 className="text-2xl font-display font-light text-white uppercase tracking-[0.2em] leading-none mb-1">{record.name}</h3>
              <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.4em] font-mono whitespace-nowrap overflow-hidden text-ellipsis">HASH: 0x{record.id.toString().replace(/-/g,'').slice(0,16)}</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 text-center">
              <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest mb-1.5">RARITY SCORE</p>
              <p className="text-lg font-display font-light text-[#00D1FF] tracking-widest">+{record.mk_grade ? record.mk_grade * 10 : 50}%</p>
           </div>
           <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 text-center">
              <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest mb-1.5">HISTORIC YIELD</p>
              <p className="text-lg font-display font-light text-white tracking-widest">{record.gain30d}%</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
