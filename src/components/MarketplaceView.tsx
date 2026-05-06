import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OpalRecord } from '../types';
import { GRADE_COLORS, formatCur } from '../data';
import { StatBox } from '../views';

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
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="space-y-12">
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tighter uppercase italic">The Floor</h2>
           <p className="text-[11px] text-ash font-bold tracking-[0.3em] uppercase mt-2">Verified Asset Marketplace</p>
        </div>
        <div className="flex gap-2 bg-obsidian border border-white/5 p-1 rounded-xl">
           {['all', 'm7+', 'm9'].map(f => (
             <button key={f} onClick={() => setGradeFilter(f)} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${gradeFilter === f ? 'bg-opal-gold text-obsidian shadow-lg' : 'text-ash hover:text-white'}`}>{f}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Active Listings" value={eligibleStones.length.toString()} color="white" />
        <StatBox label="Trade Volume" value={formatCur(totalCap)} color="opal-gold" />
        <StatBox label="Avg Yield" value="28.4%" color="opal-green" />
        <StatBox label="Nodes Synced" value="1,024" color="opal-blue" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
        {filtered.map(s => (
          <div key={s.id} className="glass-panel overflow-hidden border border-white/10 hover:border-opal-gold/50 transition-all group flex flex-col relative rounded-[32px]">
            <div className="h-64 overflow-hidden relative cursor-pointer" onClick={() => onSelect(s.id)}>
              <img src={s.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80"></div>
              <div className="absolute top-6 right-6 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-[14px] shadow-2xl" style={{backgroundColor: GRADE_COLORS[s.mk_grade!], color: 'white'}}>M{s.mk_grade}</div>
              {s.nft && <div className="absolute top-6 left-6 bg-opal-blue text-obsidian px-3 py-1 rounded-lg font-bold text-[10px] tracking-widest uppercase">NFT CERT</div>}
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-white/[0.01]">
              <h3 className="text-2xl font-display font-medium text-ivory tracking-tight mb-2 uppercase">{s.name}</h3>
              <div className="text-[10px] text-ash font-bold tracking-widest mb-8 uppercase flex items-center gap-2">
                 <span>{s.ct}ct Pure Fire</span>
                 <span className="w-1 h-1 bg-opal-gold rounded-full"></span>
                 <span>Andamooka SA</span>
              </div>
              
              <div className="mt-auto flex justify-between items-end">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-ash uppercase mb-1">List Value</div>
                  <div className="text-3xl font-data font-medium text-opal-gold tracking-tighter">{formatCur(s.listPrice)}</div>
                </div>
                <button 
                  disabled={s.isPurchased}
                  onClick={() => setBuyModal(s as OpalRecord)}
                  className="btn-magic btn-magic-white px-8 py-4 bg-white text-obsidian font-bold uppercase text-[12px] tracking-widest rounded-xl transition-all disabled:opacity-20 relative overflow-hidden transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative z-10">{s.isPurchased ? 'OWNED' : 'BUY'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {buyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-xl">
           <div className="glass-panel p-12 rounded-[40px] w-full max-w-lg text-center relative border-opal-blue/30 shadow-[0_0_50px_rgba(0,209,255,0.1)]">
              <div className="w-32 h-32 rounded-3xl mx-auto mb-8 shadow-2xl overflow-hidden border-2 border-white/10">
                 <img src={buyModal.img} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-3xl font-display font-medium text-white uppercase tracking-tighter mb-4">Finalize Acquisition</h3>
              <p className="text-ash text-sm mb-8 font-medium">You are about to secure ownership of this asset on the Polygon network.</p>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-10 border border-white/5 space-y-4">
                 <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-ash"><span>Asset Price</span><span className="text-white">{formatCur((buyModal as any).listPrice)}</span></div>
                 <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-ash"><span>Network Fee</span><span className="text-opal-green">FREE (Promo)</span></div>
                 <div className="flex justify-between pt-4 border-t border-white/5 text-xl font-data font-medium tracking-tighter text-opal-gold"><span>Total Due</span><span>{formatCur((buyModal as any).listPrice)}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setBuyModal(null)} className="py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-2xl transition-all">Cancel</button>
                 <button onClick={() => { setPurchased([...purchased, buyModal.id.toString()]); setBuyModal(null); }} className="btn-magic btn-magic-white py-5 bg-white text-obsidian font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all relative overflow-hidden transform hover:scale-105 active:scale-95">
                    <span className="relative z-10">Confirm</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </motion.div>
  );
}
