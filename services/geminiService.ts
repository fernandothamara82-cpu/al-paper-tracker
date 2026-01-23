
import { GoogleGenAI } from "@google/genai";
import { DayEntry } from "../types";

export const getStudyAdvice = async (entries: DayEntry[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const recentEntries = entries.slice(-7);
  const prompt = `
    I am an A/L (Advanced Level) student doing the Maths stream.
    Here is my past paper progress for the last few days:
    ${JSON.stringify(recentEntries, null, 2)}
    
    Based on this data, provide a short, motivating, and strategic piece of advice for my studies. 
    Focus on balancing Physics (MCQ/Essay), Chemistry (MCQ/Essay), and Maths (Pure/Applied).
    Keep it under 100 words and make it sound like a supportive mentor.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    return response.text || "Keep up the great work! Consistency is the key to success in A/Ls.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your progress is inspiring. Stay focused on your goals!";
  }
};
