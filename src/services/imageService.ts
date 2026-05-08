import { GoogleGenAI } from "@google/genai";

export async function cropOpalStone(imageB64: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
    Analyze this image containing an opal stone. 
    Task: Identify the exact bounding box of the opal stone itself, excluding any tools, fingers, backgrounds, or labels.
    Return only a JSON object with the bounding box coordinates [ymin, xmin, ymax, xmax] as percentages (0-100).
    Format: {"box": [ymin, xmin, ymax, xmax]}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: imageB64 } }
        ]
      }]
    });

    const text = response.text || "";
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const { box } = JSON.parse(cleanJson);
    
    // Now use canvas to crop
    const img = new Image();
    img.src = `data:image/jpeg;base64,${imageB64}`;
    await new Promise(resolve => img.onload = resolve);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return `data:image/jpeg;base64,${imageB64}`;

    const [ymin, xmin, ymax, xmax] = box;
    const w = img.width;
    const h = img.height;

    const sx = (xmin / 100) * w;
    const sy = (ymin / 100) * h;
    const sw = ((xmax - xmin) / 100) * w;
    const sh = ((ymax - ymin) / 100) * h;

    // Use a fixed size or a size proportional to the crop
    // User wants it centered on neutral dark background
    const finalSize = Math.max(sw, sh) * 1.5;
    canvas.width = finalSize;
    canvas.height = finalSize;

    // Fill dark background
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, finalSize, finalSize);

    // Draw centered
    const dx = (finalSize - sw) / 2;
    const dy = (finalSize - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, sw, sh);

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (e) {
    console.error("AI Cropping failed:", e);
    return `data:image/jpeg;base64,${imageB64}`; // Fallback to original
  }
}
