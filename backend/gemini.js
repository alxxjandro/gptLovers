const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-pro";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Function to generate health recommendation based on assessment data
async function generateHealthRecommendation(healthAssessmentData) {
  try {
    const prompt = `
You are an air quality and public health assistant.  
Using the following inputs, generate a short, personalized recommendation about whether the user should limit outdoor activities, wear a mask, or take other precautions due to air quality.

${JSON.stringify(healthAssessmentData, null, 2)}

Instructions:
1. Explain the overall air quality level in simple terms (good, moderate, unhealthy, very unhealthy, hazardous).
2. Give **personalized health advice** based on the user's age, health conditions, and pregnancy status.  
   - Example: people with asthma → avoid outdoor exercise if PM2.5 > 35.  
   - Example: elderly → sensitive to ozone and PM10.  
   - Example: pregnant women → limit exposure when AQI > 100.  
3. Include one practical tip (e.g., use an air purifier, stay hydrated, close windows).  
4. Output only a short recommendation (max 3 sentences) in natural, friendly language.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error(error);
    throw new Error("Error generating recommendation");
  }
}

module.exports = {
  generateHealthRecommendation
};