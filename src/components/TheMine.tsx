import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OpalRecord } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { formatCur } from '../data';
import { getRarity } from '../data';
import { AosaLogo } from './AosaLogo';
import { Activity, Zap, ShieldCheck } from 'lucide-react';

interface TheMineProps {
  data: OpalRecord[];
  onComplete: (updatedRecord: OpalRecord) => void;
  initialId?: string | number | null;
}

export function TheMine({ data, onComplete, initialId }: TheMineProps) {
  const [step, setStep] = useState<'select' | 'ritual' | 'mining' | 'success'>(initialId ? 'ritual' : 'select');
  const [selId, setSelId] = useState<string | number | null>(initialId || null);
  const [ritualData, setRitualData] = useState({ name: '', feature: '', theme: '', style: '' });
  const [artImg, setArtImg] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selStone = data.find(s => s.id === selId);

  const startMining = async () => {
    setStep('mining');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // 1. Generate Metadata first
      const prompt = `You are a Senior Digital Systems Architect for "Opal Provenance Protocol" (OPN).
      
      CORE MISSION: Forge a digital twin (NFT metadata) for a physical opal.
      Physical Grade: M${selStone?.mk_grade}
      Intended Name: "${ritualData.name}"
      Defining Feature: "${ritualData.feature}"
      Theme: "${ritualData.theme}"
      Style: "${ritualData.style}"

      SYSTEM RULES:
      1. SYNERGY LOGIC: Match the physical traits with digital abilities.
      2. SCORING (0-100): Evaluate the aesthetic and physical properties.
      3. DESCRIPTION: Provide a cinematic, mysterious 2-sentence description.
      
      OUTPUT FORMAT:
      You MUST return exactly a valid JSON object with the following structure, and nothing else:
      {
        "nameOptions": ["name 1", "name 2", "name 3"],
        "description": "2-sentence cinematic description",
        "stats": {
          "luminance": 85,
          "rarityIndex": 92,
          "digitalResonance": 78
        },
        "imagePrompt": "A highly descriptive, comma-separated midjourney-style prompt for the image."
      }
      `;

      const jsonResponse = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let generatedMeta;
      try {
          let textRes = jsonResponse.text || "{}";
          // Handle potential markdown wrapping
          textRes = textRes.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
          generatedMeta = JSON.parse(textRes);
      } catch (parseErr) {
          console.warn("JSON Parse Error:", parseErr);
          generatedMeta = {
              nameOptions: [ritualData.name || "Genesis Twin", "Opal Void", "Ethereal Core"],
              description: "A mysterious digital manifestation of a physical opal.",
              stats: { luminance: 80, rarityIndex: 80, digitalResonance: 80 },
              imagePrompt: "Glowing neon ethereal opal core"
          };
      }
      setMetaData(generatedMeta);
      let finalArtImg = selStone?.img || null;

      // 2. Generate Image
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: `Highly detailed cinematic macro rendering of an opal digital twin: ${generatedMeta.imagePrompt}. ${ritualData.theme}, ${ritualData.style}.`,
          config: { 
             imageConfig: {
                 aspectRatio: "1:1",
                 imageSize: "1K"
             }
          }
        });
        
        let b64 = "";
        for (const part of fallbackRes.candidates?.[0]?.content?.parts || []) {
           if (part.inlineData) {
               b64 = part.inlineData.data;
               break;
           }
        }

        if (b64) {
             finalArtImg = `data:image/jpeg;base64,${b64}`;
             setArtImg(finalArtImg);
        }
      } catch (imgErr) {
        console.warn("Image generation failed:", imgErr);
        // Fallback to original image if generation completely fails
        setArtImg(selStone?.img || null);
      }

      setTimeout(() => {
        setStep('success');
        if (selStone) {
          const finalValue = (selStone.nft_value || selStone.mk_rough_total || 1000) * 1.5; // 50% premium for minting
          onComplete({
            ...selStone,
            name: ritualData.name || generatedMeta.nameOptions[0],
            nft: true,
            nft_value: finalValue,
            nft_img: finalArtImg || selStone.img,
            rarity: getRarity(selStone.mk_grade || 1)
          });
        }
      }, 2000);

    } catch (e: any) {
      console.error(e);
      let errMsg = e.message || 'API request failed. Network anomaly detected.';
      if (errMsg.includes("Failed to call") || errMsg.includes("User location")) {
         errMsg += " (Please check your API key by clicking 'API Key' in the header)";
      }
      setErrorMsg(errMsg);
      setArtImg(selStone?.img || null);
      setStep('success');
    }
  };

  if (step === 'select') {
    return (
       <div className="space-y-12 animate-[opn-fadein_0.3s]">
         <header className="flex justify-between items-end">
           <div>
             <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4 tracking-tighter uppercase italic">The Mint™</h2>
             <p className="text-ash text-[12px] font-black uppercase tracking-[0.3em]">Where Digital Twins are Forged</p>
           </div>
           <div className="px-4 py-2 bg-opal-blue/10 border border-opal-blue/20 rounded-full flex items-center gap-2">
              <Zap size={14} className="text-opal-blue" />
              <span className="text-[9px] uppercase tracking-widest text-opal-blue font-bold">API Gateway Active</span>
           </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {data.filter(s => !s.nft && s.mk_grade && s.mk_grade >= 1).map(s => (
             <div 
               key={s.id} 
               onClick={() => { setSelId(s.id); setStep('ritual'); }}
               className="glass-card rounded-[32px] overflow-hidden cursor-pointer hover:border-opal-blue transition-all group border border-white/5 bg-black/40"
             >
               <div className="h-48 overflow-hidden relative border-b border-white/5">
                  <img src={s.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 right-4 bg-obsidian/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10 text-white font-black text-[12px]">M{s.mk_grade}</div>
               </div>
               <div className="p-6">
                  <div className="font-display font-bold text-white text-lg mb-1 uppercase tracking-tight">{s.name}</div>
                  <div className="text-[10px] text-opal-blue font-bold tracking-[0.2em] group-hover:text-white transition-colors">FORGE TWIN →</div>
               </div>
             </div>
           ))}
           {data.filter(s => !s.nft && s.mk_grade && s.mk_grade >= 1).length === 0 && (
             <div className="col-span-4 py-12 text-center text-ash/60 font-black uppercase tracking-widest text-sm border border-white/5 border-dashed rounded-[24px]">
               No physical assets qualified for bridging.
             </div>
           )}
         </div>
       </div>
    );
  }

  if (step === 'ritual' && selStone) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto w-full glass-panel rounded-[40px] p-12 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-opal-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
        <button onClick={() => setStep('select')} className="text-[11px] font-black text-ash hover:text-white uppercase tracking-widest mb-12 flex items-center gap-2 relative z-10">← Cancel Forging</button>
        
        <div className="flex items-center gap-8 mb-12 pb-12 border-b border-white/5 relative z-10">
          <img src={selStone.img} className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-xl" />
          <div>
            <div className="text-[10px] font-black text-opal-blue uppercase tracking-[0.4em] mb-2 flex items-center gap-2"><Activity size={12} className="animate-pulse"/> Forging Protocol Initiated</div>
            <h3 className="text-4xl font-display font-medium text-white uppercase tracking-tighter">Physical ID-{selStone.id}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ash mb-3 block">Twin Identity (Name)</label>
              <input value={ritualData.name} onChange={e => setRitualData({...ritualData, name: e.target.value})} placeholder="e.g. Spectral Ghost" className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-opal-blue focus:bg-opal-blue/5 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ash mb-3 block">Energy Core (Feature)</label>
              <input value={ritualData.feature} onChange={e => setRitualData({...ritualData, feature: e.target.value})} placeholder="e.g. Electric Veins" className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-opal-blue focus:bg-opal-blue/5 transition-colors" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ash mb-3 block">Environment (Theme)</label>
              <select value={ritualData.theme} onChange={e => setRitualData({...ritualData, theme: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-opal-blue transition-colors appearance-none cursor-pointer">
                <option value="" className="bg-obsidian text-ash">Select Convergence...</option>
                <option value="Celestial Void" className="bg-obsidian">Celestial Void</option>
                <option value="Solar Supernova" className="bg-obsidian">Solar Supernova</option>
                <option value="Deep Sea Bioluminescence" className="bg-obsidian">Deep Sea Bioluminescence</option>
                <option value="Cybernetic Fractal" className="bg-obsidian">Cybernetic Fractal</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-ash mb-3 block">The Vessel (Visual Style)</label>
              <select value={ritualData.style} onChange={e => setRitualData({...ritualData, style: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-opal-blue transition-colors appearance-none cursor-pointer">
                <option value="" className="bg-obsidian text-ash">Select Rendering...</option>
                <option value="Hyper-realistic Macro" className="bg-obsidian">Hyper-realistic Macro</option>
                <option value="Abstract Fluidity" className="bg-obsidian">Abstract Fluidity</option>
                <option value="Ethereal Vaporwave" className="bg-obsidian">Ethereal Vaporwave</option>
                <option value="Dark Synthwave" className="bg-obsidian">Dark Synthwave</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          disabled={!ritualData.name || !ritualData.theme || !ritualData.style}
          onClick={startMining}
          className="btn-magic btn-magic-white w-full py-6 mt-12 bg-white text-obsidian font-bold text-lg tracking-[0.2em] rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all disabled:opacity-20 uppercase relative z-10 transform active:scale-[0.98]"
        >
          <span className="relative z-10">Execute Smart Contract ◉</span>
        </button>
      </motion.div>
    );
  }

  if (step === 'mining') {
    return (
      <div className="fixed inset-0 z-50 bg-obsidian flex flex-col items-center justify-center p-10">
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full border border-dashed border-opal-blue/30 animate-[spin_10s_linear_infinite] mb-12 p-3 relative">
               <div className="absolute inset-0 bg-opal-blue/5 rounded-full blur-xl"></div>
               <div className="w-full h-full rounded-full border-t-2 border-r-2 border-opal-blue animate-spin shadow-[0_0_30px_rgba(0,209,255,0.3)]"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white text-center mb-6 tracking-tighter uppercase italic">Forging Digital Twin on Polygon...</h2>
            <div className="text-opal-blue font-data text-xs tracking-[0.5em] animate-pulse mb-12 uppercase">Generative Model Processing</div>
         </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-12 p-12 glass-panel rounded-[40px] border border-opal-blue/20 bg-opal-blue/5 shadow-[0_0_50px_rgba(0,209,255,0.05)]">
         <div className="w-full md:w-1/2 aspect-square rounded-[24px] overflow-hidden border border-white/10 shadow-2xl relative bg-black">
            {errorMsg && <div className="absolute top-0 w-full bg-opal-red/90 backdrop-blur-md text-white text-xs font-bold p-3 text-center z-10">{errorMsg}</div>}
            <img src={artImg || ''} className="w-full h-full object-contain p-4" />
         </div>
         
         <div className="flex-1 flex flex-col justify-center">
            <div className="text-[10px] font-black text-opal-blue uppercase tracking-[0.5em] mb-4 flex items-center gap-2"><ShieldCheck size={14}/> Mint Successful</div>
            <h3 className="text-4xl lg:text-5xl font-display font-medium text-white tracking-tighter mb-4 leading-none uppercase">{ritualData.name || metaData?.nameOptions[0]}</h3>
            {metaData?.description && (
              <p className="text-sm text-ash leading-relaxed mb-6 font-data">{metaData.description}</p>
            )}
            
            <div className="p-8 bg-black/60 rounded-3xl border border-white/5 mb-8">
               <div className="text-[9px] font-black text-ash uppercase tracking-widest mb-2 flex justify-between">
                 <span>Protocol Value</span>
                 <span className="text-opal-blue">+{metaData?.stats?.digitalResonance || 85} Resonance</span>
               </div>
               <div className="text-4xl font-data font-medium text-white tracking-tighter mb-1">
                  {formatCur((selStone?.nft_value || selStone?.mk_rough_total || 1000) * 1.5)}
               </div>
               <p className="text-[10px] text-opal-green tracking-widest uppercase font-bold text-right">+50% Mint Premium applied</p>
            </div>

            <button 
              onClick={() => {
                setStep('select');
                setRitualData({ name: '', feature: '', theme: '', style: '' });
                setArtImg(null);
                setMetaData(null);
                setErrorMsg('');
              }}
              className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-colors text-xs"
            >
               Return to Vault
            </button>
         </div>
      </motion.div>
    );
  }

  return null;
}
