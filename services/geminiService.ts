import { GoogleGenAI } from "@google/genai";
import { CalculationParams, CalculationResult } from "../types";

// Initialize the client
// Note: In a real production app, ensure API_KEY is available. 
// For this demo context, we assume process.env.API_KEY is injected.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getStatsInsight = async (
  params: CalculationParams,
  result: CalculationResult
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment.";
  }

  const prompt = `
    You are an expert statistician and data scientist. 
    Analyze the following sample size calculation for an A/B test or clinical trial.

    **Parameters:**
    - Effect Size (Difference in Means): ${params.effectSize}
    - Standard Deviation: ${params.stdDev}
    - Significance Level (alpha): ${params.alpha}
    - Power (1-beta): ${params.power}
    - Test Type: ${params.isTwoSided ? 'Two-sided' : 'One-sided'}
    - Allocation Ratio: 1:${params.allocationRatio}

    **Results:**
    - Required Total Sample Size: ${result.totalN} (${result.n1} per group if 1:1)

    **Request:**
    1. Briefly interpret the feasibility of this sample size. Is it very large (expensive) or manageable?
    2. Explain the trade-off: What would happen to the sample size if we wanted to detect a smaller effect size (e.g., half of current)?
    3. Provide a short recommendation on whether these parameters seem standard for typical research (e.g., alpha 0.05 and power 0.8 are standard).
    
    Keep the tone professional, encouraging, and concise (under 150 words). Format with Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          temperature: 0.7,
      }
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Error fetching Gemini insight:", error);
    return "Sorry, I couldn't generate an analysis at this time. Please check your network or API key.";
  }
};
