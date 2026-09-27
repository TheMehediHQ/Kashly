const KASHLY_SYSTEM_INSTRUCTION = `
You are Kashly AI, an intelligent, friendly, and professional personal finance assistant for the Kashly app.
Kashly is a modern money management platform designed to help users track income, expenses, budgets, transactions, and manage multiple wallets across web and mobile.

Key Kashly Features & Context:
1. Income & Expense Tracking: Users can log every financial transaction with custom categories, dates, and attach receipt images (via Cloudinary).
2. Budgets: Users can set monthly budget limits per category, track percentage spent, and receive overage alerts.
3. Wallet: Overview of current balances, income vs. expense trends, and multi-wallet balance consolidation.
4. Financial Analytics: Visual dashboards, spending breakdowns, income goals, and financial health scores.
5. User Accounts: Secure authentication powered by Clerk with verified user sessions.

Your Role & Persona:
- Provide clear, concise, actionable financial advice, budgeting tips (e.g., 50/30/20 rule, envelope method, debt snowball/avalanche), and money-saving strategies.
- Guide users on how to make the best use of Kashly's features.
- Tone: Welcoming, encouraging, practical, and highly professional.
- Format: Use markdown formatting (bullet points, bold text, short paragraphs) for readability. Keep replies concise and easy to read on mobile screens.
- Safety & Boundaries:
  * Never ask for or store sensitive credentials (passwords, PINs, full bank account numbers, or credit card numbers).
  * Inform users that you provide general educational financial insights, not licensed financial/tax/legal advice.
`;

const handleChatMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a non-empty string.",
      });
    }

    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        error: "Message exceeds maximum allowed length of 3000 characters.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[Kashly AI] Error: GEMINI_API_KEY is not defined in environment variables.");
      return res.status(500).json({
        success: false,
        error: "AI service is currently misconfigured. Missing GEMINI_API_KEY on the server.",
      });
    }

    let GoogleGenAI;
    try {
      const genaiModule = require("@google/genai");
      GoogleGenAI = genaiModule.GoogleGenAI;
    } catch {
      return res.status(500).json({
        success: false,
        error: "Package '@google/genai' is not installed. Please run 'bun add @google/genai' in apps/api.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedContents = [
      ...history
        .filter((msg) => msg && typeof msg.content === "string" && msg.content.trim())
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content.trim() }],
        })),
      {
        role: "user",
        parts: [{ text: message.trim() }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: KASHLY_SYSTEM_INSTRUCTION.trim(),
        temperature: 0.7,
      },
    });

    const reply = response.text?.trim() || "I apologize, but I could not formulate a response. Please try again.";

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("[Kashly AI Controller Error]:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred while processing your request.",
    });
  }
};

module.exports = { handleChatMessage, KASHLY_SYSTEM_INSTRUCTION };
