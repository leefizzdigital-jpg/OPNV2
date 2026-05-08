import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Activity, 
  Zap, 
  ArrowRight, 
  RefreshCcw, 
  ShieldCheck, 
  Cpu,
  Feather,
  Palette,
  Atom,
  Wind,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { OpalRecord } from '../types';
import { USERS, formatCur, getRarity } from '../data';
import { GoogleGenAI } from '@google/genai';

interface TheMineProps {
  records: OpalRecord[];
  initialId?: string | number | null;
  onComplete?: (updated: OpalRecord) => void;
}

interface RitualBrief {
  living: string;
  inanimate: string;
  action: string;
  emotion: string;
  vibe: string;
  style: string;
  descriptors: string[];
}

const NFT_STYLES = [
  { id: 'pfp', label: 'PFP Avatar', icon: <Feather />, img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=200' },
  { id: 'gen', label: 'Generative Art', icon: <Cpu />, img: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=200' },
  { id: 'paint', label: 'Fine Art Painting', icon: <Palette />, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200' },
  { id: 'brutalist', label: 'Brutalist Arch', icon: <Layers />, img: 'https://images.unsplash.com/photo-1518005020251-58296b974910?auto=format&fit=crop&q=80&w=200' },
  { id: 'flora', label: 'Organic Flora', icon: <Wind />, img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=200' },
  { id: 'cyber', label: 'Cyberpunk', icon: <Atom />, img: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=200' },
  { id: 'dreamy', label: 'Dreamy Surreal', icon: <Sparkles />, img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=200' },
  { id: 'random', label: 'Randomise', icon: <RotateCcw />, img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200' },
];

export function TheMine({ records, initialId, onComplete }: TheMineProps) {
  const [step, setStep] = useState<'select' | 'brief' | 'generating' | 'success'>('select');
  const [selectedRecord, setSelectedRecord] = useState<OpalRecord | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (initialId && step === 'select') {
      const r = records.find(rec => rec.id.toString() === initialId.toString());
      if (r) {
        setSelectedRecord(r);
        setStep('brief');
      }
    }
  }, [initialId, records]);
  const [briefIndex, setBriefIndex] = useState(0);
  const [brief, setBrief] = useState<RitualBrief>({
    living: '',
    inanimate: '',
    action: '',
    emotion: '',
    vibe: '',
    style: '',
    descriptors: []
  });

  const [aiResult, setAiResult] = useState<{ name: string, prompt: string, img: string } | null>(null);
  const [nameRegens, setNameRegens] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const availableRecords = records.filter(r => !r.nft);

  const nextBrief = () => {
    if (briefIndex < 6) setBriefIndex(briefIndex + 1);
    else finalizeBrief();
  };

  const finalizeBrief = async () => {
    setStep('generating');
    await generateArt();
  };

  const generateArt = async (regenName = false) => {
    setImgLoaded(false);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // We'll generate a name and a prompt
    const ritualText = `Living: ${brief.living}, Object: ${brief.inanimate}, Action: ${brief.action}, Emotion: ${brief.emotion}, Vibe: ${brief.vibe}, Style: ${brief.style}, Descriptors: ${brief.descriptors.join(', ')}`;
    
    try {
      const promptText = `
        Based on this Creative Brief for a digital opal twin:
        ${ritualText}
        
        Task 1: Generate a poetic, enigmatic name for this NFT. Length 3-5 words.
        Task 2: Generate a highly detailed image generation prompt for Midjourney/DALL-E that translates these inputs into a visual masterpiece. Include keywords: high-resolution, iridescent, precious opal, dark aesthetic.
        
        Return ONLY a JSON object: {"name": "NAME HERE", "prompt": "IMAGE PROMPT HERE"}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: promptText }] }]
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      
      const data = JSON.parse(jsonMatch[0]);
      
      setAiResult({
        name: data.name,
        prompt: data.prompt,
        img: `https://image.pollinations.ai/prompt/${encodeURIComponent(data.prompt)}?width=1024&height=1024&nologo=true&seed=${Math.random()}`
      });
      setStep('success'); 
    } catch (e) {
      console.error(e);
      setAiResult({
        name: "THE EVERLASTING RADIANCE",
        prompt: "A cosmic opal blooming in silence",
        img: selectedRecord?.img || ''
      });
      setStep('success');
    }
  };

  const currentPrompt = [
    { key: 'living', label: 'Something living', sub: 'Plant, animal, or entity' },
    { key: 'inanimate', label: 'An inanimate object', sub: 'Stone, metal, or tool' },
    { key: 'action', label: 'An action or process', sub: 'Melting, soaring, or crystallising' },
    { key: 'emotion', label: 'An emotion or feeling', sub: 'Serenity, rage, or awe' },
    { key: 'vibe', label: 'The stone\'s internal vibe', sub: 'Electric, ancient, or soft' },
    { key: 'style', label: 'Select a visual direction', type: 'style' },
    { key: 'descriptors', label: 'Two words to bind the spell', sub: 'Type and press enter' },
  ];

  if (step === 'select') {
    return (
      <div className="space-y-12">
        <header>
          <h2 className="text-6xl font-display font-medium text-white tracking-tighter uppercase italic mb-2">The Mint<span className="text-opal-blue">™</span></h2>
          <p className="text-ash/60 text-[10px] font-black uppercase tracking-[0.4em]">Cryptographic Twin Synthesis Engine</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {availableRecords.map(r => (
             <motion.div 
               key={r.id}
               whileHover={{ y: -8 }}
               onClick={() => { setSelectedRecord(r); setStep('brief'); }}
               className="glass-panel p-6 rounded-[32px] border-white/5 cursor-pointer group hover:border-opal-blue/40 transition-colors"
             >
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-obsidian">
                   <img src={r.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] font-black text-ash uppercase tracking-widest mb-1">M{r.mk_grade} ASSET FOUND</p>
                      <h3 className="text-2xl font-display font-medium text-white uppercase tracking-tighter">{r.name}</h3>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-opal-blue text-obsidian flex items-center justify-center">
                      <Zap size={18} fill="currentColor" />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    );
  }

  if (step === 'brief') {
    const p = currentPrompt[briefIndex];
    return (
      <div className="flex flex-col lg:flex-row gap-16 min-h-[600px]">
        <div className="w-full lg:w-1/3 flex flex-col">
           <div className="glass-panel p-1 border-white/5 rounded-[40px] overflow-hidden mb-8 relative group">
              <img src={selectedRecord?.img} className="w-full h-full object-cover opacity-80" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                 <p className="text-[10px] font-black text-opal-blue uppercase tracking-widest mb-2">Synthesis Subject</p>
                 <h3 className="text-4xl font-display font-medium text-white uppercase tracking-tighter">{selectedRecord?.name}</h3>
              </div>
           </div>
           
           <div className="flex-1 glass-panel rounded-[40px] p-10 border-white/5">
              <h4 className="text-[10px] font-black text-ash uppercase tracking-[0.3em] mb-8">Transcription Progress</h4>
              <div className="space-y-4">
                 {currentPrompt.map((pr, i) => (
                   <div key={pr.key} className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i < briefIndex ? 'bg-opal-blue' : i === briefIndex ? 'bg-white animate-pulse' : 'bg-white/10'}`}></div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${i <= briefIndex ? 'text-white' : 'text-ash/40'}`}>{pr.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-2xl">
           <AnimatePresence mode="wait">
             <motion.div 
               key={briefIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-12"
             >
                <div>
                   <p className="text-[12px] font-black text-opal-blue uppercase tracking-[0.4em] mb-4">Prompt {briefIndex + 1} of 7</p>
                   <h2 className="text-5xl md:text-6xl font-display font-medium text-white tracking-tighter uppercase italic">{p.label}</h2>
                   {p.sub && <p className="text-ash/60 text-sm mt-2">{p.sub}</p>}
                </div>

                {p.type === 'style' ? (
                  <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                    {NFT_STYLES.map(s => (
                       <button 
                         key={s.id}
                         onClick={() => { setBrief({...brief, style: s.label}); nextBrief(); }}
                         className="flex-shrink-0 w-48 h-64 glass-panel border-white/10 rounded-3xl overflow-hidden relative group snap-start active:scale-95 transition-all"
                       >
                          <img src={s.img} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                          <div className="absolute bottom-6 left-6 right-6">
                             <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-3 group-hover:bg-opal-blue group-hover:text-obsidian transition-colors">
                                {s.icon}
                             </div>
                             <p className="text-[11px] font-black text-white uppercase tracking-widest">{s.label}</p>
                          </div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 rounded-full bg-opal-blue flex items-center justify-center text-obsidian">
                                <ArrowRight size={14} />
                             </div>
                          </div>
                       </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <input 
                      autoFocus
                      type="text"
                      className={`w-full bg-transparent border-b-2 py-6 text-3xl md:text-4xl font-display font-medium text-white placeholder:text-white/10 outline-none transition-all focus:border-opal-blue uppercase`}
                      style={{ borderBottomColor: p.key === 'descriptors' && (brief.descriptors.length >= 2) ? '#00D1FF' : 'rgba(255,255,255,0.1)' }}
                      placeholder="Type your response..."
                      onChange={(e) => {
                        if (p.key === 'descriptors') {
                          const val = e.currentTarget.value;
                          const words = val.trim().split(/\s+/).filter(w => w.length > 0);
                          if (words.length > 2) {
                            // Don't allow more than two words
                            e.currentTarget.value = words.slice(0, 2).join(' ');
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.currentTarget.value).trim();
                          if (val) {
                            if (p.key === 'descriptors') {
                              const words = val.split(/\s+/).filter(w => w.length > 0).slice(0, 2);
                              if (words.length === 2) {
                                setBrief({...brief, descriptors: words});
                                e.currentTarget.value = '';
                                nextBrief();
                              }
                            } else {
                              setBrief({...brief, [p.key]: val});
                              e.currentTarget.value = '';
                              nextBrief();
                            }
                          }
                        }
                      }}
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-ash uppercase tracking-widest">
                          Press <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10">ENTER</span> to commit to memory
                        </div>
                        {p.key === 'descriptors' && (
                          <div className="flex items-center gap-2">
                             <div className="flex gap-1">
                                {[1, 2].map(i => (
                                  <div key={i} className={`w-3 h-1 rounded-full transition-colors ${brief.descriptors.length >= i ? 'bg-opal-blue' : 'bg-white/10'}`}></div>
                                ))}
                             </div>
                             <span className="text-[10px] font-black text-ash uppercase tracking-widest leading-none">Limit: 2 Words</span>
                          </div>
                        )}
                    </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center text-center">
         <div className="w-32 h-32 relative mb-16">
            <div className="absolute inset-0 bg-opal-blue/20 rounded-full animate-ping"></div>
            <div className="absolute inset-4 bg-obsidian border-4 border-opal-blue border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Zap size={32} className="text-opal-blue animate-pulse" />
            </div>
         </div>

         <div className="space-y-4 mb-20">
            <h2 className="text-[12px] font-black text-opal-blue uppercase tracking-[0.5em] animate-pulse">Neural Synthesis Engaged</h2>
            <h3 className="text-6xl font-display font-medium text-white tracking-tighter uppercase italic leading-none">Forging Immutable<br />Digital Twin...</h3>
            <p className="text-ash/60 text-sm max-w-md mx-auto">We are merging your inputs with the stone's neural markers.</p>
         </div>

         <div className="w-full glass-panel p-8 rounded-3xl border-white/5 bg-white/[0.02] flex items-center gap-6 overflow-hidden relative">
            <div className="animate-[shimmer_2s_infinite] absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"></div>
            <img src={selectedRecord?.img} className="w-24 h-24 rounded-2xl object-cover opacity-60" />
            <div className="flex-1 text-left space-y-2">
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-opal-blue to-opal-pink"
                  ></motion.div>
               </div>
               <p className="text-[9px] font-black text-ash uppercase tracking-widest animate-pulse">&gt; Compiling Logic: {brief.living} + {brief.style}...</p>
            </div>
         </div>
      </div>
    );
  }

  if (step === 'success' && aiResult) {
    const rarity = getRarity(selectedRecord?.mk_grade || 1);
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 pb-20"
      >
        <div className="w-full lg:w-1/2">
           <div className="relative aspect-square glass-panel p-1 rounded-[48px] border-opal-blue/30 overflow-hidden shadow-[0_0_100px_rgba(0,209,255,0.1)] group bg-obsidian">
              <div className="absolute inset-0 bg-gradient-to-br from-opal-blue/20 via-transparent to-opal-pink/20 opacity-40"></div>
              
              {!imgLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4">
                   <div className="w-12 h-12 border-4 border-opal-blue border-t-white rounded-full animate-spin"></div>
                   <p className="text-[10px] font-black text-opal-blue uppercase tracking-widest animate-pulse">Developing Pixels...</p>
                </div>
              )}

              <img 
                src={aiResult.img} 
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover rounded-[44px] shadow-2xl relative z-10 transition-opacity duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} 
                alt="Generated NFT" 
              />
              <div className="absolute top-10 right-10 z-20">
                 <div className="bg-obsidian/80 backdrop-blur px-6 py-3 rounded-2xl border border-white/20 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3">
                    <Sparkles size={14} className="text-opal-gold" /> PROXY-STAMP VERIFIED
                 </div>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-12">
           <div>
              <div className="flex items-center gap-4 mb-4">
                 <div className={`${rarity.color} text-obsidian px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg`}>
                    {selectedRecord?.mk_grade && `M${selectedRecord.mk_grade} | `}{rarity.label}
                 </div>
                 <div className="h-0.5 w-12 bg-white/10"></div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-opal-blue animate-pulse"></div>
                    <span className="text-[9px] font-black text-ash uppercase tracking-widest">On-Chain Active</span>
                 </div>
              </div>
              <h2 className="text-6xl md:text-7xl font-display font-medium text-white tracking-tighter uppercase italic leading-[0.9] mb-6">{aiResult.name}</h2>
              <div className="flex gap-4">
                 <button 
                  disabled={nameRegens >= 3 || isMinting}
                  onClick={() => { setNameRegens(n => n + 1); generateArt(true); }}
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-20"
                 >
                    <RefreshCcw size={14} /> Regenerate Name ({3 - nameRegens})
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                 <h4 className="text-[10px] font-black text-opal-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} /> Protocol Distribution
                 </h4>
                 <div className="grid grid-cols-2 gap-8 font-data">
                    <div>
                       <p className="text-[8px] font-black text-ash uppercase tracking-widest mb-1.5 opacity-50">Estimated Yield</p>
                       <p className="text-3xl text-white tracking-tighter">+12.4% <span className="text-xs text-opal-green">APY</span></p>
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-ash uppercase tracking-widest mb-1.5 opacity-50">Market Weight</p>
                       <p className="text-3xl text-white tracking-tighter">{formatCur(selectedRecord?.mk_rough_total ? selectedRecord.mk_rough_total * 1.5 : 0)}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button 
                  onClick={() => {
                    setStep('select');
                    setBrief({ living: '', inanimate: '', action: '', emotion: '', vibe: '', style: '', descriptors: [] });
                    setAiResult(null);
                    setBriefIndex(0);
                  }}
                  className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-colors text-xs flex items-center justify-center gap-2"
                 >
                    Forge Another
                 </button>
                 <button 
                  className="w-full py-5 bg-opal-blue text-obsidian font-black uppercase tracking-widest rounded-2xl transition-transform hover:scale-[1.02] active:scale-95 text-xs flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(0,209,255,0.2)]"
                  onClick={() => {
                    if (selectedRecord && aiResult && onComplete) {
                      onComplete({
                        ...selectedRecord,
                        nft: true,
                        nft_img: aiResult.img,
                        name: aiResult.name,
                        nftStyle: brief.style
                      });
                    }
                  }}
                 >
                    Secure Asset in Parcel
                 </button>
              </div>
           </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
