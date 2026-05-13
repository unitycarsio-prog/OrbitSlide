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
      enum: Object.values(SlideLayout)
    },
    imageKeyword: { type: Type.STRING },
    notes: { type: Type.STRING }
  },
  required: ["title", "content", "layout"]
};

export const generatePresentationContent = async (topic: string, format: string = "Standard Presentation", style: string = "Storyteller"): Promise<SlideData[]> => {
  const ai = getClient();
  
  const prompt = `Create a professional, high-impact presentation about: "${topic}".
  The presentation format should be: "${format}".
  The presentation style should be: "${style}".

  Instructions:
  1. Act as a master presentation designer and copywriter.
  2. Structure the content logically, ensuring a clear beginning, middle, and end.
  3. Create content that is concise, punchy, and highly informative. Avoid fluff.
  4. Ensure every slide deck feels uniquely crafted, using a wide variety of slide layouts (e.g., Title, Bullet Points, Two Columns, Three Columns, Quote, Section Header, Big Number, Gallery, Comparison, Code Block, Image Left Text Right, Image Centered).
  5. Dynamically choose layouts based on the complexity and type of content to maximize engagement and clarity.
  6. Generate between 6 to 10 slides.
  7. For 'imageKeyword', provide a high-quality, professional, and specific search term (e.g., "minimalist office desk", "tech innovation concept") for a stock photo that aligns perfectly with the slide's content.
  8. IMPORTANT: Each slide should have a title, a brief subtitle (optional), and 3-5 concise bullet points (content). Assign a layout type that best fits the content density. Avoid using the same layout for consecutive slides.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash", // Using a better model if available or stick to 2.5
    contents: prompt,
    config: {
      systemInstruction: "You are a top-tier presentation designer. You ALWAYS prioritize clarity, hierarchy, and design impact. IMPORTANT: Output CLEAN PLAIN TEXT for titles, subtitles, and content array items (bullets). DO NOT use Markdown formatting (e.g., *bold*, #), tags, or bullets in the strings. Content items should be simple string items in the array.",
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