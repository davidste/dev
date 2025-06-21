
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VinLookupData, GeminiKeyPinResponse } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

let ai: GoogleGenAI | null = null;
let apiKeyIsAvailable: boolean | null = null;

export const isApiKeyAvailable = (): boolean => {
  if (apiKeyIsAvailable === null) {
    const apiKey = process.env.API_KEY;
    apiKeyIsAvailable = !!apiKey;
    if (apiKeyIsAvailable) {
      ai = new GoogleGenAI({ apiKey: apiKey as string });
    }
  }
  return apiKeyIsAvailable;
};

export const generateIllustrativeKeyPinInfo = async (
  data: VinLookupData
): Promise<GeminiKeyPinResponse> => {
  if (!isApiKeyAvailable() || !ai) {
    return {
      error: "Gemini API key not configured or available. Please ensure process.env.API_KEY is set.",
      importantNotice: "This feature requires a valid Gemini API key to function."
    };
  }

  const { vin, make, model, year } = data;
  let promptVehicleInfo = `VIN: ${vin}`;
  if (make && model && year) {
    promptVehicleInfo += ` (Context: ${year} ${make} ${model})`;
  } else if (make && model) {
    promptVehicleInfo += ` (Context: ${make} ${model})`;
  } else if (make) {
    promptVehicleInfo += ` (Context: ${make})`;
  }

  const prompt = `
    You are an AI assistant for an automotive locksmith application called "King Codes".
    Your role is to provide *ILLUSTRATIVE AND GENERALIZED INFORMATION ONLY* based on vehicle details.
    **Under no circumstances should you provide actual, specific, real, or usable key codes, PIN codes, security algorithms, or precise programming procedures.**
    All output must be generic and for educational/demonstration purposes about automotive systems in general.

    Vehicle Information: ${promptVehicleInfo}

    Please provide a response in JSON format with the following structure:
    {
      "vehicleDescription": "A brief, general description of a vehicle matching the provided information (e.g., type, common characteristics).",
      "illustrativeKeyTypes": ["An array of common key types that *might* be associated with such a vehicle category (e.g., 'Transponder Key', 'Smart Key Fob', 'Remote Head Key'). Keep this general."],
      "illustrativePinFormat": "A generic description of what a PIN code format *might* look like in automotive systems (e.g., 'Typically a 4-8 digit numeric code', 'Some systems might use alphanumeric sequences', 'Format varies widely by manufacturer and year').",
      "importantNotice": "A mandatory disclaimer stating: 'IMPORTANT: The information provided is illustrative and generalized. It is NOT real, specific, or usable for any actual vehicle security system. It is for educational and demonstration purposes only within the King Codes app.'"
    }

    Focus on general vehicle knowledge and common industry practices, not specific models unless broadly categorizing.
    If the VIN is invalid or provides insufficient information for a general description, state that in the vehicleDescription.
    Always include the 'importantNotice'.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as GeminiKeyPinResponse;
    // Ensure the important notice is always present, even if Gemini forgets
    if (!parsedData.importantNotice) {
        parsedData.importantNotice = "IMPORTANT: The information provided is illustrative and generalized. It is NOT real, specific, or usable for any actual vehicle security system. It is for educational and demonstration purposes only within the King Codes app.";
    }
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Failed to get illustrative information from AI assistant.";
    if (error instanceof Error) {
      errorMessage += ` Details: ${error.message}`;
    }
    return {
      error: errorMessage,
      importantNotice: "An error occurred while trying to generate illustrative information. This is not real data."
    };
  }
};
