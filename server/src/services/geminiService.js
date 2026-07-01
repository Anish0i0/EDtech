const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary = async (extractedText) => {
  try {
    // Try this first (most available free model in 2026):
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Craft a good prompt (prompt engineering!)
    const prompt = `
      You are a study assistant helping students understand their notes.
      
      Create a concise study summary of the following notes:
      - Use bullet points for key concepts
      - Highlight the most important ideas
      - Group related concepts together
      - Keep it under 300 words
      - Use simple, clear language
      - End with a "Key Takeaways" section
      
      Notes:
      ${extractedText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.log("GEMINI ERROR:", error);
    throw new Error("Failed to generate summary");
  }
};

module.exports = generateSummary;
