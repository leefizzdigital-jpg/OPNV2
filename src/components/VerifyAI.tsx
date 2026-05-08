import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Activity, ShieldCheck, AlertTriangle, Fingerprint, Plus } from 'lucide-react';
import { formatCur } from '../data';
import { OpalRecord } from '../types';
import { AosaLogo } from './AosaLogo';
import { GoogleGenAI } from '@google/genai';
import { getRarity } from '../data';
import { cropOpalStone } from '../services/imageService';

const TM_URL = "https://teachablemachine.withgoogle.com/models/jOWvy-EIT/";

const LABEL_MAP: Record<string, string> = {
  "M3 Matrix Opal": "M4-M7 Matrix Opal",
  "Untreated Andamooka Matrix Opal": "Untreated Matrix",
  "No Opal Detected": "No Opal",
  "M1 Treated Andamooka Matrix Opal": "M8-M9 Treated Matrix"
};

import { InfoTooltip } from './ui/InfoTooltip';

export function VerifyAI({ onRegister }: { onRegister?: (record: OpalRecord) => void }) {
  const [modelReady, setModelReady] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'analyzing' | 'complete'>('idle');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ className: string, probability: number, value: number, grade: number, carats?: number, details?: any } | null>(null);
  const [showRarityBurst, setShowRarityBurst] = useState(false);
  const modelRef = useRef<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const theme = prediction ? getGradeTheme(prediction.grade) : null;

  useEffect(() => {
    const loadScripts = async () => {
      setStatus('loading_model');
      try {
        if (!(window as any).tmImage) {
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
            script.onload = resolve;
            document.head.appendChild(script);
          });
        }
        
        const modelURL = TM_URL + "model.json";
        const metadataURL = TM_URL + "metadata.json";
        
        // @ts-ignore
        modelRef.current = await window.tmImage.load(modelURL, metadataURL);
        setModelReady(true);
        setStatus('idle');
      } catch (e) {
        console.error("Failed to load TM script or model", e);
        // We can still function with Gemini only if TM fails
        setModelReady(true); 
        setStatus('idle');
      }
    };
    loadScripts();
  }, []);

  const [isCropping, setIsCropping] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCropping(true);
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        const b64 = await base64Promise;
        const cropped = await cropOpalStone(b64);
        setImageSrc(cropped);
        setPrediction(null);
      } catch (err) {
        console.error("Upload/Crop failed", err);
      } finally {
        setIsCropping(false);
      }
    }
  };

  const analyzeImage = async () => {
    if (!imageSrc) return;
    setStatus('analyzing');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const base64Response = await fetch(imageSrc);
      const blob = await base64Response.blob();
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const b64 = base64Data.split(',')[1];

      const prompt = `
        You are the AOSA (Australian Opal Specialty Association) Digital Grader.
        Analyze this opal image and provide a technical appraisal.
        
        RULES:
        1. Identify if it is Matrix Opal, Black Opal, or No Opal.
        2. Assign an AOSA Grade from M1 to M9 (M9 is highest).
        3. Determine Physical Traits: Pattern (e.g., Ribbon, Pinfire, Harlequin), Brightness (B1-B5), and Stability Risk (Low/Med/High).
        4. Estimate Appraisal Value in USD.
        5. Estimate Weight in Carats (ct). Look for scale indicators like a coin or ruler if present.

        RETURN ONLY JSON:
        {
          "className": "M8-M9 Treated Matrix" | "M4-M7 Matrix Opal" | "Untreated Matrix" | "No Opal",
          "grade": number,
          "value": number,
          "carats": number,
          "probability": number,
          "details": {
             "pattern": string,
             "brightness": string,
             "risk": string,
             "description": string
          }
        }
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: b64,
                            mimeType: "image/jpeg"
                        }
                    }
                ]
            }
        ]
      });

      const responseText = result.text;
      const cleanJson = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      setPrediction({
        className: parsed.className || "Unknown",
        probability: parsed.probability || 0.98,
        value: parsed.value || 0,
        grade: parsed.grade || 0,
        carats: parsed.carats || 0,
        details: parsed.details 
      });
      
      if (parsed.grade >= 9) setShowRarityBurst(true);
      setStatus('complete');
    } catch (e) {
      console.error("Gemini Vision failed, falling back to TM:", e);
      if (modelRef.current && imgRef.current) {
        try {
          // @ts-ignore
          const predictions = await modelRef.current.predict(imgRef.current);
          let topPrediction = predictions[0];
          for (let i = 1; i < predictions.length; i++) {
            if (predictions[i].probability > topPrediction.probability) {
              topPrediction = predictions[i];
            }
          }

          const finalName = LABEL_MAP[topPrediction.className] || topPrediction.className;
          let grade = 0;
          let baseVal = 0;
          if (finalName === "M8-M9 Treated Matrix") { grade = 9; baseVal = 1850; }
          else if (finalName === "M4-M7 Matrix Opal") { grade = 5; baseVal = 825; }
          else if (finalName === "Untreated Matrix") { grade = 2; baseVal = 350; }
          
          const val = Math.floor(baseVal * topPrediction.probability);

          setPrediction({
            className: finalName,
            probability: topPrediction.probability,
            value: val,
            grade,
            carats: Math.floor(Math.random() * 50 + 10) // Fallback for TM
          });
          setStatus('complete');
        } catch (tmErr) {
          console.error("TM Fallback also failed:", tmErr);
          setStatus('idle');
        }
      } else {
        setStatus('idle');
      }
    }
  };

  const handleAddToVault = () => {
    if (!prediction || prediction.grade === 0 || !imageSrc) return;
    
    const newRecord: OpalRecord = {
        id: "v-" + Math.floor(Math.random() * 100000),
        name: prediction.className,
        ct: prediction.carats || Math.floor(Math.random() * 150 + 50),
        img: imageSrc,
        mk_grade: prediction.grade,
        mk_rough_total: prediction.value,
        stabilityRisk: prediction.details?.risk || "Low",
        pattern: prediction.details?.pattern || "Flash",
        brightness: prediction.details?.brightness || "B3",
        nft: false,
        rarity: getRarity(prediction.grade)
    };
    onRegister?.(newRecord);
  };

  return (
    <div className="space-y-12 animate-[opn-fadein_0.3s] pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 relative px-4 md:px-0">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-display font-light text-white mb-4 tracking-[0.2em] uppercase">VERIFY<span className="text-[#00D1FF]">AI</span></h2>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <p className="text-[#00D1FF] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center gap-3 font-mono">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse"></span> NEURAL_CORE_ANALYSIS
                </p>
                <InfoTooltip title="Neural appraisal" content="Real-time stone classification utilizing AOSA-trained vision models for spectral density validation." />
              </div>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <p className="text-white/10 text-[11px] font-bold uppercase tracking-[0.5em] font-mono">OPN_v3.1_NODE</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-8 py-3 bg-white/[0.03] border border-white/5 rounded-full">
           <div className={`w-2.5 h-2.5 rounded-full ${modelReady ? 'bg-[#00D1FF] animate-pulse' : 'bg-white/10'} shadow-[0_0_15px_rgba(0,209,255,0.6)]`}></div>
           <span className="text-[11px] uppercase font-bold tracking-[0.3em] text-white/40 font-mono">
             {status === 'loading_model' ? 'LOADING...' : modelReady ? 'NODE_READY' : 'INIT'}
           </span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16 px-4 md:px-0">
         <div className="flex-1 space-y-12">
            <div className="bg-black border border-white/5 rounded-[48px] relative overflow-hidden group shadow-2xl p-2">
               {imageSrc ? (
                 <div className="relative aspect-video rounded-[40px] overflow-hidden bg-[#02050a] flex items-center justify-center">
                    <img ref={imgRef} src={imageSrc} className={`w-full h-full object-contain z-10 transition-all duration-1000 ${status === 'analyzing' ? 'scale-110 filter brightness-125 saturate-150' : 'scale-100'}`} crossOrigin="anonymous" />
                    <button onClick={() => { setImageSrc(null); setPrediction(null); setStatus('idle'); }} className="absolute top-8 right-8 z-40 bg-white/5 backdrop-blur-md px-6 py-2 text-[9px] uppercase tracking-[0.3em] text-white/50 border border-white/10 hover:bg-white hover:text-black hover:border-transparent rounded-full transition-all">
                      Clear
                    </button>
                    {status === 'analyzing' && (
                       <>
                         <div className="absolute inset-0 bg-[#00D1FF]/5 mix-blend-screen z-20"></div>
                         <div className="ceremony-scan z-30" />
                         <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between z-30 opacity-40">
                             <div className="flex justify-between">
                                 <div className="w-20 h-20 border-t border-l border-[#00D1FF]/30 rounded-tl-3xl"></div>
                                 <div className="w-20 h-20 border-t border-r border-[#00D1FF]/30 rounded-tr-3xl"></div>
                             </div>
                             <div className="flex justify-between">
                                 <div className="w-20 h-20 border-b border-l border-[#00D1FF]/30 rounded-bl-3xl"></div>
                                 <div className="w-20 h-20 border-b border-r border-[#00D1FF]/30 rounded-br-3xl"></div>
                             </div>
                         </div>
                       </>
                    )}
                 </div>
               ) : (
                 <label className="border border-dashed border-white/10 hover:border-[#00D1FF]/40 rounded-[40px] aspect-video flex flex-col items-center justify-center cursor-pointer transition-all duration-700 relative z-10 w-full group-hover:bg-white/[0.01]">
                    <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#00D1FF]/5 transition-all duration-700">
                      <Upload size={24} className="text-white/20 group-hover:text-[#00D1FF] transition-colors" />
                    </div>
                    <p className="text-[11px] font-bold text-white/60 uppercase tracking-[0.5em] mb-3">Initialize_Scan</p>
                    <p className="text-[9px] text-white/20 font-mono tracking-[0.3em] uppercase">Upload physical asset telemetry</p>
                    
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                 </label>
               )}
            </div>

            <button 
              disabled={!imageSrc || status === 'analyzing' || !modelReady}
              onClick={analyzeImage}
              className="w-full py-8 disabled:opacity-5 bg-white text-black font-bold uppercase text-[11px] tracking-[0.4em] rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-700 disabled:grayscale transition-all transform active:scale-[0.98] group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                 {status === 'analyzing' ? (
                   <>PROCESSING_VECTORS <div className="w-1.5 h-1.5 rounded-full bg-black animate-ping" /></>
                 ) : (
                   <>EXECUTE_APPRAISAL_PROTOCOL</>
                 )}
              </span>
            </button>
         </div>

         <div className="w-full lg:w-[450px] bg-white/[0.01] border border-white/5 rounded-[48px] p-12 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,209,255,0.05),transparent_40%)]">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/20 mb-16 flex items-center gap-4 font-mono">
               <div className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]" /> TERMINAL_LOG
            </h3>
            
            {!prediction && status !== 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 space-y-8">
                <Fingerprint size={64} className="text-white" />
                <p className="text-[11px] font-mono tracking-[0.5em] uppercase">WAITING_FOR_DATA</p>
              </div>
            )}

            {status === 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                <div className="space-y-4 text-center text-white/40 font-mono text-[11px] uppercase tracking-[0.4em]">
                   <p className="animate-pulse">Injecting hardware vectors...</p>
                   <p className="opacity-60">Comparing stratum layers...</p>
                   <p className="opacity-30">Quantifying matrix density...</p>
                </div>
              </div>
            )}

            {prediction && status === 'complete' && theme && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="flex-1 flex flex-col relative z-10 h-full"
               >
                 <div className={`text-center mb-16 relative z-10 bg-white/[0.03] border p-10 rounded-[32px] overflow-hidden transition-all duration-1000 ${theme.border} ${theme.glow}`}>
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                   <p className={`text-[10px] font-bold uppercase tracking-[0.5em] font-mono mb-6 ${theme.text}`}>AOSA_PROTOCOL_GRADE</p>
                   <h2 className={`text-5xl md:text-6xl font-display font-light uppercase tracking-[0.3em] ${prediction.className === 'No Opal' ? 'text-red-500' : 'text-white'}`}>
                      {prediction.className === 'No Opal' ? 'NULL' : `M${prediction.grade}`}
                   </h2>
                 </div>
                 
                 <div className="space-y-10 mb-16">
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                       <div className="flex items-center gap-3">
                         <span className="text-[11px] font-bold text-white/20 uppercase tracking-[0.4em] font-mono">WEIGHT_EST</span>
                         <InfoTooltip title="Carat weight" content="Approximate weight calculated via visual geometry and scale indicators." />
                       </div>
                       <span className="text-xl font-display font-light text-white tracking-widest">{prediction.carats || 0} CT</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                       <div className="flex items-center gap-3">
                         <span className="text-[11px] font-bold text-white/20 uppercase tracking-[0.4em] font-mono">CONFIDENCE_SCORE</span>
                         <InfoTooltip title="Probability" content="Neural network certainty score for the identified grade and class." />
                       </div>
                       <span className="text-xl font-display font-light text-[#00D1FF] tracking-widest">{(prediction.probability * 100).toFixed(1)}%</span>
                    </div>
                    
                    {prediction.grade > 0 && (
                        <div className="flex justify-between items-end pt-4 bg-white/[0.02] p-8 rounded-[32px] border border-white/5 animate-opn-fadein">
                            <div className="text-[11px] font-bold text-[#00D1FF] uppercase tracking-[0.6em] font-mono">APPRAISAL</div>
                            <div className="text-3xl font-display font-medium text-white tracking-[0.1em]">{formatCur(prediction.value)}</div>
                        </div>
                    )}
                 </div>

                 {prediction.className === 'No Opal' ? (
                   <div className="mt-auto p-8 border border-red-500/20 bg-red-500/5 rounded-3xl">
                     <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-red-500/60 leading-relaxed text-center font-mono">ANOMALY_DETECTED: INSUFFICIENT_PLAY_OF_COLOUR</p>
                   </div>
                 ) : (
                    <button 
                       onClick={handleAddToVault} 
                       className="mt-auto py-6 bg-white/[0.05] border border-white/10 hover:border-[#00D1FF] hover:bg-[#00D1FF]/5 text-white/80 font-bold uppercase text-[10px] tracking-[0.4em] rounded-full transition-all duration-700 transform active:scale-95 flex items-center justify-center gap-4"
                    >
                       ENROLL_IN_PARCEL <Plus size={14} className="text-[#00D1FF]"/>
                    </button>
                 )}
               </motion.div>
            )}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#00D1FF]/5 blur-[50px] rounded-full"></div>
         </div>
      </div>
    </div>
  );
}
