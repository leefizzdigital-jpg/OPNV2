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
import { WelcomeScreen } from './components/WelcomeScreen';
import { JonyIveDemo } from './components/JonyIveDemo';

import { TheLevel } from './components/TheLevel';
import { MyParcel } from './components/MyParcel';

export default function App() {
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('opn_user_name'));
  const [user, setUser] = useState<{ id: string, name: string, initials: string, color: string } | null>(null);
  
  const [records, setRecords] = useState<OpalRecord[]>(() => {
    return SEEDS.map(calculateDerived);
  });
  
  const [selectedOpalId, setSelectedOpalId] = useState<string | number | null>(null);
  const [mineTargetId, setMineTargetId] = useState<string | number | null>(null);
  const [currentView, setCurrentView] = useState<'level' | 'parcel' | 'divergence' | 'marketplace' | 'mint' | 'verify'>('level');

  const selectedOpal = records.find(r => r.id === selectedOpalId) || null;

  useEffect(() => {
    setUser(USERS['mattk']);
    
    const handleRedir = (e: any) => {
      setCurrentView('parcel');
      // We'll pass some state if needed but for now just global view change
    };
    window.addEventListener('change-view', handleRedir);
    return () => window.removeEventListener('change-view', handleRedir);
  }, []);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem('opn_user_name', name);
  };

  const handleLogout = () => {
    localStorage.removeItem('opn_user_name');
    setUserName(null);
    setCurrentView('level');
  };

  if (!userName) {
    return <JonyIveDemo onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen pb-20 selection:bg-[#00D1FF] selection:text-black relative overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(0,209,255,0.08),transparent_70%)]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#0072ff]/5 rounded-full blur-[180px] opacity-40"></div>
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00D1FF]/3 rounded-full blur-[150px] opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#02050a]/60 border-b border-white/5 px-8 md:px-12 py-6 mb-16 backdrop-blur-2xl relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8 group cursor-pointer" onClick={() => setCurrentView('level')}>
            <AosaLogo className="h-9 md:h-10 w-auto transition-transform group-hover:scale-105" />
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="hidden md:block">
              <div className="flex items-center gap-3 mb-0.5">
                <p className="text-[11px] font-bold text-[#00D1FF] tracking-[0.6em] uppercase font-mono">{userName.split(' ')[0]}_NODE</p>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]/20"></div>
                </div>
              </div>
              <h1 className="text-lg font-display font-light text-white tracking-[0.2em] uppercase">PROVENANCE_03</h1>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <div className="bg-white/[0.03] border border-white/10 rounded-full p-1 flex gap-1">
              {[
                { id: 'level', label: 'THE LEVEL' },
                { id: 'parcel', label: 'MY PARCEL' },
                { id: 'marketplace', label: 'MARKET' },
                { id: 'divergence', label: 'DIVERGENCE' },
              ].map(v => (
                <button 
                  key={v.id}
                  onClick={() => {
                    setMineTargetId(null);
                    setCurrentView(v.id as any);
                  }} 
                  className={`px-6 py-2.5 rounded-full text-[11px] uppercase font-bold tracking-[0.3em] transition-all duration-700 relative group ${currentView === v.id ? 'text-white' : 'text-white/20 hover:text-white/60'}`}
                >
                  <span className="relative z-10">{v.label}</span>
                  {currentView === v.id && (
                    <motion.div 
                      layoutId="nav-bg" 
                      className="absolute inset-0 bg-white/10 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <button 
                onClick={() => { setMineTargetId(null); setCurrentView('verify'); }}
                className="group relative px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] border border-[#00D1FF]/30 hover:border-[#00D1FF] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#00D1FF]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 flex items-center gap-2 text-[#00D1FF]">
                  <Activity size={14}/> VERIFYAI
                </span>
              </button>

              <button 
                onClick={() => { setMineTargetId(null); setCurrentView('mint'); }}
                className="px-8 py-3 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] border-none"
              >
                <span className="relative z-10 flex items-center gap-2"><Zap size={14}/> THE MINT</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 group transition-all"
                title="Disconnect"
              >
                <Fingerprint size={16} className="text-white/30 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 min-h-[60vh] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentView === 'level' && <TheLevel data={records} />}
            {currentView === 'parcel' && <MyParcel data={records} onFocusAsset={setSelectedOpalId} />}
            {currentView === 'divergence' && <DivergenceView data={records} />}
            {currentView === 'marketplace' && <MarketplaceView data={records} onSelect={setSelectedOpalId} />}
            {currentView === 'verify' && <VerifyAI onRegister={(newRecord) => {
                 setRecords([...records, newRecord]);
                 setCurrentView('parcel');
                 setSelectedOpalId(newRecord.id);
            }} />}
            {currentView === 'mint' && (
              <TheMine 
                records={records}
                initialId={mineTargetId}
                onComplete={(newRecord) => {
                   setRecords(records.map(r => r.id === newRecord.id ? newRecord : r));
                   setCurrentView('parcel');
                   setSelectedOpalId(newRecord.id);
                   setMineTargetId(null);
                }} 
              />
            )}
          </motion.div>
        </AnimatePresence>
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

      <footer className="max-w-7xl mx-auto px-8 mt-32 py-12 border-t border-white/5 flex justify-between items-center opacity-30">
        <p className="text-[8px] md:text-[9px] uppercase tracking-[0.6em] font-medium">Opal Provenance Protocol v3.11</p>
        <div className="flex items-center gap-6">
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.6em] font-medium hidden md:block">Neural Link Active</p>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
}

function OpalDetails({ record, onClose, onVerify, onMint }: { record: OpalRecord; onClose: () => void, onVerify?: () => void, onMint?: () => void }) {
  const isNft = record.nft;
  const theme = getGradeTheme(record.mk_grade || 0);
  
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
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#02050a]/95 backdrop-blur-3xl overflow-y-auto custom-scrollbar"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="w-full max-w-5xl bg-[#02050a] border border-white/5 rounded-[56px] shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Abstract Spectral Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-10 pointer-events-none" style={{ backgroundColor: theme.color }}></div>

        {/* Left Side: Visual */}
        <div className="md:w-1/2 p-10 md:p-16 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
          <header className="mb-16">
            <div className="flex items-center gap-4 mb-6">
               <div className={`w-3 h-3 rounded-full animate-pulse shadow-2xl ${isNft ? 'bg-[#00D1FF]' : 'bg-white/20'}`} style={{ backgroundColor: isNft ? '#00D1FF' : 'rgba(255,255,255,0.2)' }}></div>
               <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.5em] font-mono">
                 {isNft ? 'PROTOCOL_SECURED_TWIN' : 'UNVALIDATED_PHYSICAL_NODE'}
               </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-[0.2em] uppercase mb-4 leading-none">
              {record.name}
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-[11px] text-white/20 font-mono tracking-[0.3em] uppercase">
                NODE_ID: 0x{record.id.toString().toUpperCase().replace(/-/g, '')}
              </p>
              <div className={`px-4 py-1 rounded-full border ${theme.border} text-[10px] font-bold tracking-widest ${theme.text} bg-white/[0.03]`}>M{record.mk_grade}</div>
            </div>
          </header>

          <div className="flex-1 flex flex-col justify-center items-center py-8">
            <div className={`relative w-full aspect-square rounded-[32px] overflow-hidden group border ${isNft ? 'border-[#00D1FF]/20 shadow-[0_0_50px_rgba(0,209,255,0.1)]' : 'border-white/5 bg-white/[0.02]'}`}>
              <img 
                src={record.nft_img || record.img} 
                className={`w-full h-full object-contain p-8 md:p-12 transform group-hover:scale-105 transition-transform duration-1000 ease-[0.22, 1, 0.36, 1] ${!isNft ? 'grayscale opacity-60' : ''}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#02050a] via-transparent to-transparent opacity-40"></div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
             {isNft && (
                <button 
                  onClick={downloadImage}
                  className="flex-1 py-4 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={12} />
                  Export Twin
                </button>
             )}
             <button 
               onClick={onClose}
               className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
               title="Close Profile"
             >
                <Maximize2 size={12} className="rotate-45" />
             </button>
          </div>
        </div>

        {/* Right Side: Data */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-between relative bg-[radial-gradient(circle_at_bottom_right,rgba(0,209,255,0.03),transparent_60%)]">
          <div className="space-y-16">
            <section>
              <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.6em] mb-12 flex items-center gap-3 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]" /> TELEMETRY_PROTOCOL
              </h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                <div className="group">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase font-mono">MASS</p>
                    <InfoTooltip title="Nodal Mass" content="Physical weight parameter of the mineral asset." />
                  </div>
                  <p className="text-3xl font-display font-light text-white tracking-widest uppercase">{record.ct} CT</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase font-mono">LUSTRE</p>
                    <InfoTooltip title="Spectral Lustre" content="Light return efficiency and surface refraction index." />
                  </div>
                  <p className="text-3xl font-display font-light text-white tracking-widest uppercase">{record.brightness}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase font-mono">PATTERN</p>
                    <InfoTooltip title="Optic Pattern" content="Natural geometric arrangement of the opal's silicon matrix." />
                  </div>
                  <p className="text-3xl font-display font-light text-white tracking-widest uppercase">{record.pattern || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[11px] font-bold text-white/30 tracking-[0.3em] uppercase font-mono">STABILITY</p>
                    <InfoTooltip title="Structural Risk" content="Integrity assessment of the specimen based on moisture and internal stress." />
                  </div>
                  <p className="text-3xl font-display font-light text-white tracking-widest uppercase">{record.stabilityRisk || 'N/A'}</p>
                </div>
              </div>
            </section>

            <section className="p-10 bg-white/[0.03] border border-white/5 rounded-[40px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               <div className="flex items-center gap-2 mb-6">
                 <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.5em] font-mono">VALUATION_INDEX</h3>
                 <InfoTooltip title="Value appraisal" content="Current protocol value derived from neural grading and scarcity metrics." />
               </div>
               <div className="flex items-end gap-6">
                 <span className="text-5xl font-display font-light text-[#00D1FF] tracking-[0.1em]">
                   {formatCur(record.nft_value || record.mk_rough_total || record.mr_offer)}
                 </span>
                 <span className="text-[12px] font-bold text-[#00FF88] tracking-[0.3em] mb-2 font-mono">+12.4%</span>
               </div>
            </section>

            <section>
               <h3 className="text-[11px] font-bold text-white/20 uppercase tracking-[0.6em] mb-10 flex items-center gap-3 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> PROTOCOL_ACTIONS
               </h3>
               <div className="space-y-4">
                 {isNft ? (
                   <div className="p-8 border border-[#00D1FF]/20 bg-[#00D1FF]/10 rounded-[32px] flex items-center justify-between group transition-all hover:bg-[#00D1FF]/20">
                     <div className="flex items-center gap-6">
                        <ShieldCheck size={24} className="text-[#00D1FF]" />
                        <div>
                          <p className="text-[11px] font-bold text-white tracking-[0.3em] uppercase">IMMUTABILITY_VERIFIED</p>
                          <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-1">CRYPTO-ANCHOREDSPECIMEN</p>
                        </div>
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-4">
                      {record.mk_grade ? (
                        <button 
                          onClick={onMint}
                          className="w-full p-8 bg-[#00D1FF] text-black rounded-[32px] flex items-center justify-between hover:scale-[1.02] transition-all group overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <div className="text-left font-bold tracking-[0.3em] relative z-10">
                            <p className="text-[11px] uppercase">INITIALIZE_MINT</p>
                            <p className="text-[10px] opacity-60 uppercase font-mono mt-1">CREATE_LEDGER_ENTRY_M{record.mk_grade}</p>
                          </div>
                          <Zap size={24} className="fill-black relative z-10" />
                        </button>
                      ) : (
                        <button 
                          onClick={onVerify}
                          className="w-full p-8 bg-white/[0.03] border border-white/5 text-white rounded-[32px] flex items-center justify-between hover:bg-white/10 transition-all group"
                        >
                          <div className="text-left font-bold tracking-[0.3em]">
                            <p className="text-[11px] uppercase">VERIFYAI_LINK</p>
                            <p className="text-[10px] text-white/30 uppercase mt-1 font-mono">AWAITING_NEURAL_SCAN</p>
                          </div>
                          <Activity size={24} className="text-[#00D1FF]" />
                        </button>
                      )}
                   </div>
                 )}
               </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
