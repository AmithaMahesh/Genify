
import { GoogleGenAI } from "@google/genai";
import { Message, IndicLanguage } from "../types";

export async function generateFundingInsights(
  query: string, 
  language: IndicLanguage,
  history: Message[]
) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelName = 'gemini-3-flash-preview';
    
    // Extract actual language name from the enum (e.g., "Hindi" from "Hindi (हिन्दी)")
    const targetLanguageName = language.split(' ')[0];

    const systemInstruction = `
      You are Genify, an elite AI Startup Funding Intelligence expert for the Indian ecosystem.
      
      CORE MISSION:
      Provide accurate, real-time data on VCs, funding rounds, angel networks, and government startup policies (Startup India, MSME, etc.).
      
      CRITICAL LANGUAGE RULE:
      - You MUST respond ENTIRELY in the following language: ${targetLanguageName}.
      - Even if technical terms are used, the explanation and surrounding text must be in ${targetLanguageName}.
      - If the user provides a prompt in English, you still MUST respond in ${targetLanguageName} as requested by their session setting.
      
      FORMATTING RULES:
      1. Use professional, clean Markdown.
      2. Use bullet points for lists of investors or steps.
      3. Use bolding for key figures (e.g., funding amounts, dates).
      4. Use headers (##) to separate sections of a long answer.
      5. Always ensure the answer is directly relevant to the startup ecosystem.
      
      GROUNDING:
      - Use the googleSearch tool for every query to get the latest 2024-2025 data.
      - Refer to credible sources like Inc42, YourStory, Entrackr, or official government portals.
    `;

    const contents = [
      ...history.map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        parts: [{ text: m.content }] 
      })),
      { role: 'user', parts: [{ text: `Selected Response Language: ${targetLanguageName}. Query: ${query}` }] }
    ];

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Lower temperature for more focused/accurate responses
      },
    });

    const text = response.text || "I was unable to generate a response. Please try again.";
    
    const sources: Array<{title: string, uri: string}> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Reference",
            uri: chunk.web.uri
          });
        }
      });
    }

    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return {
      text,
      sources: uniqueSources
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API key not valid")) {
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
}
