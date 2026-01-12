
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, AIInsight } from "../types";

export const getAIWeatherInsights = async (weather: WeatherData): Promise<AIInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a local weather expert, provide a smart summary for the current weather in ${weather.location.name}, ${weather.location.country}.
    Current Temperature: ${weather.current.temp}°C (Feels like ${weather.current.feelsLike}°C).
    Humidity: ${weather.current.humidity}%.
    Wind: ${weather.current.windSpeed} km/h.
    Today's Forecast: High of ${weather.daily[0].maxTemp}°C, Low of ${weather.daily[0].minTemp}°C.
    
    Give specific advice for clothing, activities, and health based on these conditions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A friendly 2-sentence weather summary." },
            clothing: { type: Type.STRING, description: "Specific clothing recommendations." },
            activities: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 recommended activities." 
            },
            healthTip: { type: Type.STRING, description: "A health tip (e.g., UV protection, hydration, allergies)." }
          },
          required: ["summary", "clothing", "activities", "healthTip"],
        }
      },
    });

    return JSON.parse(response.text || "{}") as AIInsight;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "Enjoy your day in " + weather.location.name + "!",
      clothing: "Dress comfortably for the current temperature.",
      activities: ["Local exploration", "Outdoor walk", "Photography"],
      healthTip: "Stay hydrated and check local UV index."
    };
  }
};
