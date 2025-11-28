import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBusinessAnswer = async (question: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are an expert business consultant for the Tamil Vanigar Peravai (Tamil Merchant Association).
      Answer questions about commerce, business history, tax regulations, and entrepreneurship in Tamil.
      Keep answers concise, professional, and encouraging.
      Use Tamil script.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: question,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "மன்னிக்கவும், என்னால் பதில் அளிக்க முடியவில்லை.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "தொழில்நுட்ப கோளாறு காரணமாக பதில் பெற முடியவில்லை. சிறிது நேரம் கழித்து முயற்சிக்கவும்.";
  }
};
