import { GoogleGenAI, Type } from "@google/genai";
import { SlideData, SlideLayout } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

const slideSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    content: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    layout: { 
      type: Type.STRING, 
      enum: [
        "title", 
        "bullet_points", 
        "two_column", 
        "three_column",
        "quote", 
        "section_header",
        "big_number",
        "gallery",
        "comparison",
        "code_block"
      ] 
    },
    imageKeyword: { type: Type.STRING },
    notes: { type: Type.STRING }
  },
  required: ["title", "content", "layout"]
};

export const generatePresentationContent = async (topic: string): Promise<SlideData[]> => {
  const ai = getClient();
  
  const prompt = `Create a professional presentation about: "${topic}". 
  Generate 6 to 8 slides. 
  Ensure variety in layouts (use comparison, big_number, or three_column where appropriate). 
  For 'imageKeyword', provide a short, descriptive search term for a stock photo.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are a world-class presentation designer. You create engaging, structured slide decks with varied visual templates. IMPORTANT: Output CLEAN PLAIN TEXT for titles and content. DO NOT use Markdown formatting (like **bold**, *italics*, # headers, or bullets) inside the JSON string values. Just plain text.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: slideSchema
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as SlideData[];
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Failed to generate valid presentation data.");
    }
  }
  
  throw new Error("No content generated.");
};

export const updatePresentation = async (currentSlides: SlideData[], userInstruction: string): Promise<SlideData[]> => {
  const ai = getClient();
  
  const prompt = `
  Current Slides JSON: ${JSON.stringify(currentSlides)}
  
  User Instruction: "${userInstruction}"
  
  Task: Modify the slides based ONLY on the user instruction. Return the full updated array of slides.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert presentation editor. Output clean plain text without Markdown characters like * or **.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: slideSchema
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as SlideData[];
    } catch (e) {
      console.error("Failed to parse Gemini update response", e);
      throw new Error("Failed to update presentation.");
    }
  }
  
  throw new Error("No update generated.");
};