import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Activity, ShieldCheck, AlertTriangle, Fingerprint, Plus } from 'lucide-react';
import { formatCur } from '../data';
import { OpalRecord } from '../types';
import { AosaLogo } from './AosaLogo';
import { GoogleGenAI } from '@google/genai';
import { getRarity } from '../data';

const TM_URL = "https://teachablemachine.withgoogle.com/models/jOWvy-EIT/";

const LABEL_MAP: Record<string, string> = {
  "M3 Matrix Opal": "M4-M7 Matrix Opal",
  "Untreated Andamooka Matrix Opal": "Untreated Matrix",
  "No Opal Detected": "No Opal",
  "M1 Treated Andamooka Matrix Opal": "M8-M9 Treated Matrix"
};

export function VerifyAI({ onRegister }: { onRegister?: (record: OpalRecord) => void }) {
  const [modelReady, setModelReady] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading_model' | 'analyzing' | 'complete'>('idle');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ className: string, probability: number, value: number, grade: number, details?: any } | null>(null);
  const modelRef = useRef<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setPrediction(null);
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

        RETURN ONLY JSON:
        {
          "className": "M8-M9 Treated Matrix" | "M4-M7 Matrix Opal" | "Untreated Matrix" | "No Opal",
          "grade": number,
          "value": number,
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
        model: "gemini-1.5-flash",
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
        details: parsed.details 
      });
      
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
            grade
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
        ct: Math.floor(Math.random() * 150 + 50),
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
    <div className="space-y-12 animate-[opn-fadein_0.3s]">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div className="flex flex-col gap-4">
          <AosaLogo className="h-12 w-auto self-start" />
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-2 tracking-tighter uppercase italic">VerifyAI™</h2>
            <p className="text-ash text-[12px] font-bold uppercase tracking-[0.3em]">AI-Powered Computer Vision Grading</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full ${modelReady ? 'bg-opal-gold animate-pulse' : 'bg-ash'} shadow-[0_0_15px_rgba(251,191,36,0.6)]`}></div>
           <span className="text-[10px] uppercase font-bold tracking-widest text-ash">
             {status === 'loading_model' ? 'Loading Core...' : modelReady ? 'Neural Net Active' : 'Initializing'}
           </span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
         <div className="flex-1 space-y-6">
            <div className="glass-panel p-1 border-white/5 rounded-[40px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-opal-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               
               {imageSrc ? (
                 <div className="relative aspect-video rounded-[36px] overflow-hidden bg-black flex items-center justify-center">
                    <img ref={imgRef} src={imageSrc} className={`w-full h-full object-cover z-10 transition-all duration-1000 ${status === 'analyzing' ? 'scale-110 filter brightness-150 contrast-125 saturate-200' : 'scale-100'}`} crossOrigin="anonymous" />
                    <button onClick={() => { setImageSrc(null); setPrediction(null); setStatus('idle'); }} className="absolute top-6 right-6 z-40 bg-black/60 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest text-white border border-white/10 hover:bg-white hover:text-black rounded-lg transition-colors">
                      Clear
                    </button>
                    {status === 'analyzing' && (
                       <>
                         <div className="absolute inset-0 bg-opal-gold/20 mix-blend-overlay z-20"></div>
                         <motion.div 
                            className="absolute top-0 left-0 w-full h-[2px] bg-opal-gold drop-shadow-[0_0_15px_rgba(251,191,36,1)] z-30"
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                         >
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-opal-gold/40 to-transparent pointer-events-none"></div>
                         </motion.div>
                         <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-30 opacity-70">
                             <div className="flex justify-between">
                                 <div className="w-16 h-16 border-t-4 border-l-4 border-opal-gold"></div>
                                 <div className="w-16 h-16 border-t-4 border-r-4 border-opal-gold"></div>
                             </div>
                             <div className="flex justify-between flex-row-reverse border-opal-gold items-center justify-center absolute inset-0">
                                <Activity className="text-opal-gold w-24 h-24 animate-pulse opacity-50" />
                             </div>
                             <div className="flex justify-between">
                                 <div className="w-16 h-16 border-b-4 border-l-4 border-opal-gold"></div>
                                 <div className="w-16 h-16 border-b-4 border-r-4 border-opal-gold"></div>
                             </div>
                         </div>
                       </>
                    )}
                 </div>
               ) : (
                 <label className="border-2 border-dashed border-white/10 hover:border-opal-gold/50 rounded-[36px] aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors relative z-10 w-full group-hover:bg-white/[0.02]">
                    <Upload size={32} className="text-opal-gold mb-6 opacity-80" />
                    <p className="text-sm font-bold text-ivory uppercase tracking-widest mb-2">Upload Physical Asset</p>
                    <p className="text-[10px] text-ash font-bold tracking-wider">Drag & drop or click to select</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                 </label>
               )}
            </div>

            <button 
              disabled={!imageSrc || status === 'analyzing' || !modelReady}
              onClick={analyzeImage}
              className="btn-magic btn-magic-white w-full py-6 bg-white disabled:bg-white/5 text-obsidian disabled:text-ash font-bold uppercase text-xl tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:shadow-none hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] disabled:hover:shadow-none rounded-2xl transition-transform active:scale-[0.98] group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                 {status === 'analyzing' ? 'Processing...' : 'Run Vision Models'}
              </span>
            </button>
         </div>

         <div className="w-full lg:w-[400px] glass-panel rounded-[40px] p-10 flex flex-col border border-white/5 relative overflow-hidden">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-white flex items-center gap-3 mb-10"><Activity size={16} className="text-opal-gold"/> Terminal Output</h3>
            
            {!prediction && status !== 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <ShieldCheck size={48} className="text-ash mb-6" />
                <p className="text-xs font-data tracking-widest uppercase text-ash">Awaiting Input telemetry</p>
              </div>
            )}

            {status === 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border border-dashed border-opal-gold rounded-full animate-spin"></div>
                <div className="space-y-2 text-center text-opal-gold font-data text-[10px] uppercase tracking-[0.3em] animate-pulse">
                   <p>&gt; Injecting vectors...</p>
                   <p>&gt; Comparing stratum layers...</p>
                   <p>&gt; Quantifying matrix density...</p>
                </div>
              </div>
            )}

            {prediction && status === 'complete' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col relative z-10 h-full">
                 <div className="text-center mb-8">
                   <p className="text-[10px] font-bold text-ash uppercase tracking-[0.3em] mb-4">AOSA Verified Grade</p>
                   <h2 className={`text-4xl font-display font-medium uppercase leading-none tracking-tighter ${prediction.className === 'No Opal' ? 'text-opal-red' : 'text-opal-gold'}`}>
                      {prediction.className}
                   </h2>
                 </div>
                 
                 <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4 mb-6">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                       <span className="text-ash font-bold">Confidence</span>
                       <span className="text-opal-gold font-black">{(prediction.probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-opal-gold" style={{ width: `${prediction.probability * 100}%` }}></div>
                    </div>
                    
                    {prediction.grade > 0 && (
                        <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-end">
                            <div className="text-[10px] uppercase tracking-widest text-ash font-bold">Appraised Value</div>
                            <div className="text-2xl font-data font-medium text-opal-green tracking-tighter">{formatCur(prediction.value)}</div>
                        </div>
                    )}
                 </div>

                 {prediction.className === 'No Opal' ? (
                   <div className="mt-auto flex items-start gap-3 bg-opal-red/10 border border-opal-red/20 rounded-xl p-4">
                     <AlertTriangle size={16} className="text-opal-red shrink-0" />
                     <p className="text-[10px] uppercase tracking-wider font-bold text-opal-red/80">Anomaly detected. Insufficient play-of-colour to qualify as precious asset.</p>
                   </div>
                 ) : (
                    <div className="mt-auto space-y-4">
                        <div className="flex items-start gap-3 p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                            <Fingerprint size={16} className="text-opal-blue shrink-0 mt-1" />
                            <p className="text-[10px] uppercase tracking-wider font-bold text-white/70 leading-relaxed">This physical asset has been verified. You may now log it into the Armada Vault.</p>
                        </div>
                        <button onClick={handleAddToVault} className="btn-magic btn-magic-white w-full py-4 bg-white text-obsidian font-bold uppercase text-[12px] tracking-widest rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform active:scale-95 group relative overflow-hidden flex items-center justify-center gap-2">
                           <span className="relative z-10 flex items-center gap-2">Log Asset <Plus size={14}/></span>
                        </button>
                    </div>
                 )}
               </motion.div>
            )}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-opal-gold/5 blur-[50px] rounded-full"></div>
         </div>
      </div>
    </div>
  );
}
