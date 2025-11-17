
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Article generation will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const articleSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy, SEO-friendly title for the automotive article, around 60-70 characters.",
    },
    meta_description: {
      type: Type.STRING,
      description: "A compelling meta description for SEO, around 150-160 characters.",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 4-5 relevant keywords for the article.",
    },
    content: {
      type: Type.STRING,
      description: "The full article content as a single HTML string. It should be at least 300 words, well-structured with <h2> and <h3> tags for headings, <p> tags for paragraphs, and maybe a <ul> with <li> for lists. The tone should be engaging and informative for car enthusiasts.",
    },
  },
  required: ["title", "meta_description", "keywords", "content"],
};

export const autoGenerateArticle = async (): Promise<{ title: string; meta_description: string; keywords: string[]; content: string; }> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a new, original automotive news article about a fictional, newly announced electric hypercar. The article should be exciting and detailed. Make up a plausible name for the car and manufacturer. Follow the provided JSON schema.",
      config: {
        responseMimeType: "application/json",
        responseSchema: articleSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating article with Gemini:", error);
    throw new Error("Failed to generate article. Please check the API key and try again.");
  }
};
