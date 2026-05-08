import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface OpalNFTMetadata {
  name: string;
  lore: string;
  rarityScore: number; // 1-100
  attributes: {
    power: number;
    chaos: number;
    brilliance: number;
  };
  imagePrompt: string;
}

export interface OpalMintRequest {
  grade: string;       // e.g., "M9"
  theme: string;       // e.g., "Cyberpunk"
  livingThing: string; // e.g., "Wolf"
  colors: string;      // e.g., "Emerald and Gold"
  style: string;       // e.g., "Macro Photography"
  sentence: string;    // e.g., "A silent guardian of the deep earth"
}

/**
 * STEP 1: Generate the NFT Metadata (The "Brain")
 */
export async function generateOpalMetadata(request: OpalMintRequest): Promise<OpalNFTMetadata> {
  const prompt = `You are the chaotic architect of an Opal NFT Minting forge.
  A user has brought an opal graded ${request.grade} (M1 is common, M9 is mythical).
  
  Integrate these catalysts into a single, cohesive entity:
  - Theme: ${request.theme}
  - Living Entity: ${request.livingThing}
  - Colors: ${request.colors}
  - Aesthetic Style: ${request.style}
  - Core Vibe (Max 10 words): "${request.sentence}"

  INSTRUCTIONS:
  1. Generate a 2-3 word epic name for this NFT.
  2. Write a 2-sentence lore description.
  3. Generate stats (1-100). If the grade is M8 or M9, the stats MUST be between 95 and 100.
  4. Write a highly detailed 'imagePrompt' that we will use to generate the actual image. 
     The prompt MUST include: ${request.style}, ${request.colors}, the ${request.livingThing}, 
     and explicitly mention it is made of iridescent precious opal crystals with extreme pinfire pattern.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          lore: { type: Type.STRING },
          rarityScore: { type: Type.NUMBER },
          attributes: {
            type: Type.OBJECT,
            properties: {
              power: { type: Type.NUMBER },
              chaos: { type: Type.NUMBER },
              brilliance: { type: Type.NUMBER },
            },
            required: ["power", "chaos", "brilliance"]
          },
          imagePrompt: { type: Type.STRING }
        },
        required: ["name", "lore", "rarityScore", "attributes", "imagePrompt"]
      }
    }
  });

  return JSON.parse(response.text) as OpalNFTMetadata;
}

/**
 * STEP 2: Generate the Art (The "Canvas")
 */
export async function generateOpalImage(imagePrompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ 
      role: 'user', 
      parts: [{ 
        text: `Masterpiece digital trading card art, standalone character/object against a clean dark studio background. ${imagePrompt}. Unreal Engine 5 render, glowing iridescent opal textures, volumetric lighting, extremely high fidelity.` 
      }] 
    }],
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/jpeg;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Minting failed: No image data returned.");
}
