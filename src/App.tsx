import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Diamond, Maximize2, Activity, Zap, ShieldCheck, Download, Fingerprint } from 'lucide-react';
import { AosaLogo } from './components/AosaLogo';
import { OpalRecord } from './types';
import { SEEDS, calculateDerived, USERS, formatCur } from './data';

import { DivergenceView, DirectoryView, StatBox } from './views';
import { ClaimPortal } from './components/ClaimPortal';
import { MarketplaceView } from './components/MarketplaceView';
import { TheMine } from './components/TheMine';
import { VerifyAI } from './components/VerifyAI';

export default function App() {
  const [user, setUser] = useState<{ id: string, name: string, initials: string, color: string } | null>(null);
  
  const [records, setRecords] = useState<OpalRecord[]>(() => {
    return SEEDS.map(calculateDerived);
  });
  
  const [selectedOpalId, setSelectedOpalId] = useState<string | number | null>(null);
  const [mineTargetId, setMineTargetId] = useState<string | number | null>(null);
  const [currentView, setCurrentView] = useState<'vault' | 'divergence' | 'marketplace' | 'mint' | 'verify'>('vault');

  const selectedOpal = records.find(r => r.id === selectedOpalId) || null;

  useEffect(() => {
    setUser(USERS['mattk']);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-panel border-b-white/5 px-8 py-5 mb-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <AosaLogo className="h-12 w-auto" />
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="hidden md:block">
              <p className="text-label text-opal-pink tracking-widest mb-0.5">Opal Provenance</p>
              <h1 className="text-xl font-display font-black text-ivory tracking-tight uppercase">OPN™</h1>
            </div>
          </div>

          <div className="flex items-center gap-6 lg:gap-8 text-[11px] uppercase tracking-[0.2em] font-bold">
            <div className="hidden lg:flex space-x-2 bg-white/5 p-1 rounded-2xl border border-white/5">
              {[
                { id: 'vault', label: 'Vault' },
                { id: 'marketplace', label: 'Market' },
                { id: 'divergence', label: 'Divergence' },
              ].map(v => (
                <button 
                  key={v.id}
                  onClick={() => {
                    setMineTargetId(null);
                    setCurrentView(v.id as any);
                  }} 
                  className={`px-6 py-2.5 rounded-xl transition-colors duration-200 ${currentView === v.id ? 'bg-obsidian text-ivory shadow-lg border border-white/10' : 'text-ash hover:text-white'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4">
              {typeof window !== 'undefined' && 'aistudio' in window && (
                <button 
                  onClick={() => (window as any).aistudio?.openSelectKey?.()}
                  className="btn-magic btn-magic-white bg-transparent border border-opal-blue text-opal-blue px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-opal-blue/10 transition-colors"
                >
                  <span className="relative z-10 flex items-center gap-2">API Key</span>
                </button>
              )}
              <button 
                onClick={() => { setMineTargetId(null); setCurrentView('verify'); }}
                className="btn-magic btn-magic-white bg-white text-obsidian px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2"><Activity size={14}/> VerifyAI</span>
              </button>

              <button 
                onClick={() => { setMineTargetId(null); setCurrentView('mint'); }}
                className="btn-magic btn-magic-white bg-white text-obsidian px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform border border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2"><Zap size={14}/> The Mint</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 min-h-[60vh]">
        {currentView === 'vault' && <ClaimPortal records={records} onSelect={(r) => setSelectedOpalId(r.id)} />}
        {currentView === 'divergence' && <DivergenceView data={records} />}
        {currentView === 'marketplace' && <MarketplaceView data={records} onSelect={setSelectedOpalId} />}
        {currentView === 'verify' && <VerifyAI onRegister={(newRecord) => {
             setRecords([...records, newRecord]);
             setCurrentView('vault');
             setSelectedOpalId(newRecord.id);
        }} />}
        {currentView === 'mint' && (
          <TheMine 
            data={records}
            initialId={mineTargetId}
            onComplete={(newRecord) => {
               setRecords(records.map(r => r.id === newRecord.id ? newRecord : r));
               setCurrentView('vault');
               setSelectedOpalId(newRecord.id);
               setMineTargetId(null);
            }} 
          />
        )}
      </main>

      <AnimatePresence>
        {selectedOpal && (
          <OpalDetails 
            record={selectedOpal} 
            onClose={() => setSelectedOpalId(null)} 
            onVerify={() => {
              setSelectedOpalId(null);
              setCurrentView('verify');
            }}
            onMint={() => {
              setMineTargetId(selectedOpal.id);
              setSelectedOpalId(null);
              setCurrentView('mint');
            }}
          />
        )}
      </AnimatePresence>

      <footer className="max-w-7xl mx-auto px-8 mt-32 py-12 border-t border-white/5 flex justify-between items-center opacity-40">
        <p className="text-[9px] uppercase tracking-[0.4em]">Opal Provenance Protocol © 2026</p>
        <p className="text-[9px] uppercase tracking-[0.4em]">Secured by sovereign blockchain integration</p>
      </footer>
    </div>
  );
}

function OpalDetails({ record, onClose, onVerify, onMint }: { record: OpalRecord; onClose: () => void, onVerify?: () => void, onMint?: () => void }) {
  const isNft = record.nft;
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = record.nft_img || record.img;
    link.download = `OPN-${record.id}-TWIN.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 z-50 flex items-center justify-end px-6 py-6 transition-colors duration-700 ${isNft ? 'bg-opal-blue/20 backdrop-blur-sm' : 'bg-obsidian/90 backdrop-blur-lg'}`}
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: '100%', scale: 0.95 }}
        animate={{ x: 0, scale: 1 }}
        exit={{ x: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`w-full max-w-4xl h-full shadow-2xl overflow-y-auto p-12 lg:p-20 relative custom-scrollbar rounded-[40px] border ${isNft ? 'bg-black/60 backdrop-blur-3xl border-opal-blue/30' : 'bg-[#0B0C10] border-white/10'}`}
        onClick={e => e.stopPropagation()}
      >
        <header className="mb-16">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full animate-pulse ${isNft ? 'bg-opal-blue shadow-[0_0_15px_rgba(0,209,255,0.8)]' : 'bg-opal-pink shadow-[0_0_15px_rgba(255,77,151,0.8)]'}`}></div>
               <span className={`text-label ${isNft ? 'text-opal-blue' : 'text-ivory'}`}>{isNft ? 'Immutable Twin Profile' : 'Physical Asset Profile'}</span>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors text-ash hover:text-white">
               <Maximize2 size={20} />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-label mb-3 opacity-50 font-data tracking-wider">Asset Hash: 0x{(record.id.toString().replace('-', '')).toUpperCase()}A9F2</p>
              <h2 className="text-5xl md:text-6xl font-display font-medium text-ivory tracking-tighter leading-none mb-3 uppercase drop-shadow-xl">
                {record.name}
              </h2>
              {record.pattern && (
                <p className={`text-lg font-data font-bold tracking-[0.2em] ${isNft ? 'text-white' : 'text-ash'}`}>{record.pattern} • {record.brightness}</p>
              )}
            </div>
            {record.mk_grade && !isNft && (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border border-opal-pink/50 p-1 bg-obsidian flex items-center justify-center shrink-0 shadow-[0_0_40px_rgba(255,77,151,0.15)] transform rotate-2">
                <div className="text-center w-full h-full rounded-[20px] bg-white/5 flex flex-col items-center justify-center border border-white/5">
                  <p className="text-[9px] font-bold uppercase text-opal-pink tracking-widest mb-1">AOSA</p>
                  <p className="text-4xl font-display font-medium text-ivory uppercase leading-none">M{record.mk_grade}</p>
                </div>
              </div>
            )}
            {isNft && (
               <button onClick={downloadImage} className="px-8 py-5 rounded-[20px] bg-opal-blue/10 border border-opal-blue/30 shadow-[0_0_20px_rgba(0,209,255,0.15)] hover:bg-opal-blue hover:shadow-[0_0_40px_rgba(0,209,255,0.4)] transition-all shrink-0 group">
                 <span className="font-bold tracking-[0.2em] uppercase text-opal-blue group-hover:text-obsidian flex items-center justify-center gap-3 text-xs transition-colors">
                   <Download size={16} />
                   Add to Passport
                 </span>
               </button>
            )}
          </div>
        </header>

        <div className="space-y-16">
          {/* Main Visual */}
          <section className={`relative rounded-[32px] overflow-hidden group border ${isNft ? 'border-opal-blue/20 bg-black shadow-[0_0_50px_rgba(0,209,255,0.1)]' : 'border-white/5 bg-black/20'}`}>
             <img src={record.nft_img || record.img} className={`w-full ${isNft ? 'aspect-square md:aspect-[4/3] object-contain transform scale-90 group-hover:scale-95' : 'aspect-video object-cover transform scale-100 group-hover:scale-[1.02]'} transition-transform duration-700 ease-out`} />
             {!isNft && <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>}
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <StatBox label="Weight" value={`${record.ct} CT`} highlight={true} color={isNft ? "opal-blue" : "opal-pink"} />
             <StatBox label="Pattern" value={record.pattern || 'N/A'} color={isNft ? "opal-blue" : "white"} />
             <StatBox label="Lustre" value={`${record.brightness}`} color={isNft ? "opal-blue" : "white"} />
             <StatBox label="Stability" value={record.stabilityRisk || 'N/A'} color={isNft ? "opal-blue" : "white"} />
          </div>

          {/* Action Boxes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-white/5 pt-16">
            <div className={`p-10 rounded-[32px] flex flex-col items-center justify-center text-center relative overflow-hidden border ${isNft ? 'bg-opal-blue/5 border-opal-blue/20' : 'bg-white/[0.02] border-white/5'}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${isNft ? 'bg-opal-blue/20' : 'bg-white/5'}`}></div>
              <p className="text-[10px] font-black text-ash mb-3 tracking-[0.3em] uppercase">Total Appraised Value</p>
              <h3 className={`text-5xl lg:text-6xl font-data font-medium tracking-tighter ${isNft ? 'text-opal-blue drop-shadow-[0_0_15px_rgba(0,209,255,0.4)]' : 'text-ivory'}`}>
                {formatCur(record.nft_value || record.mk_rough_total || record.mr_offer)}
              </h3>
            </div>

            <div className={`rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-10 text-center border ${isNft ? 'bg-opal-blue/5 border-opal-blue/20' : 'bg-white/[0.02] border-white/5'}`}>
              {record.nft ? (
                <>
                  <div className="w-20 h-20 rounded-full border border-opal-blue/30 flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-full border border-opal-blue/40 border-dashed animate-[spin_10s_linear_infinite]"></div>
                    <Fingerprint size={28} className="text-opal-blue relative z-10 drop-shadow-[0_0_10px_rgba(0,209,255,0.8)]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-opal-blue mb-2">Cryptographic Seal</p>
                  <p className="text-xs text-ivory/80 uppercase tracking-widest font-bold">Node Secured / Protocol Active</p>
                </>
              ) : record.mk_grade ? (
                 <>
                  <div className="w-20 h-20 rounded-full border border-opal-green/20 flex items-center justify-center mb-6 relative">
                     <div className="absolute inset-0 rounded-full border border-opal-green/40 border-dashed animate-[spin_20s_linear_infinite]"></div>
                     <ShieldCheck size={28} className="text-opal-green drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ash mb-6">AOSA Verified Asset</p>
                  <button onClick={onMint} className="btn-magic btn-magic-white w-full max-w-[200px] py-4 rounded-full bg-white text-obsidian shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 active:scale-95 group">
                    <span className="relative z-10 font-bold tracking-[0.3em] uppercase text-obsidian flex items-center justify-center gap-2 text-[10px]">
                      <Activity size={14} />
                      Mint Asset
                    </span>
                  </button>
                </>
              ) : (
                 <>
                  <div className="w-20 h-20 rounded-full border border-opal-gold/20 flex items-center justify-center mb-6 relative">
                     <div className="absolute inset-0 rounded-full border border-opal-gold/40 border-dashed animate-[spin_20s_linear_infinite]"></div>
                     <div className="w-3 h-3 rounded-full bg-opal-gold animate-pulse shadow-[0_0_15px_rgba(251,191,36,0.6)]"></div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-ash mb-6">Unlinked Physical Asset</p>
                  <button onClick={onVerify} className="btn-magic btn-magic-white w-full max-w-[200px] py-4 rounded-full bg-white text-obsidian shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 active:scale-95 group">
                    <span className="relative z-10 font-bold tracking-[0.3em] uppercase text-obsidian flex items-center justify-center gap-2 text-[10px]">
                      <Activity size={14} />
                      VerifyAI™
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
