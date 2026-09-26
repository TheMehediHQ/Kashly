/**
 * @typedef {Object} ChatMessage
 * @property {"user" | "model" | "assistant"} role
 * @property {string} content
 *
 * @typedef {Object} ChatRequestBody
 * @property {string} message
 * @property {ChatMessage[]} [history]
 */

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
- Format: Use clean headings without excessive hash symbols, bullet points, bold text, and short paragraphs for readability.
- Safety & Boundaries:
  * Never ask for or store sensitive credentials (passwords, PINs, full bank account numbers, or credit card numbers).
  * Inform users that you provide general educational financial insights, not licensed financial/tax/legal advice.
`;

/**
 * Formats API errors into clean, human-readable user messages.
 * @param {string} rawError
 * @returns {string}
 */
function formatHumanError(rawError) {
  try {
    const parsed = JSON.parse(rawError);
    if (parsed.error) {
      if (parsed.error.code === 429 || parsed.error.status === "RESOURCE_EXHAUSTED") {
        const retryMatch = parsed.error.message?.match(/retry in ([0-9.]+s)/i);
        const retryWait = retryMatch ? ` (please retry in ${retryMatch[1]})` : "";
        return `⏳ Google Gemini free tier quota limit reached${retryWait}. Please wait a moment and try again.`;
      }
      if (parsed.error.code === 503 || parsed.error.status === "UNAVAILABLE") {
        return "⚠️ AI servers are experiencing temporary high traffic. Please try again in a few seconds.";
      }
      return parsed.error.message || rawError;
    }
  } catch {
    // Not a JSON error
  }
  return rawError;
}

/**
 * Controller to handle chat requests with automatic model fallback for high availability.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
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

    // Candidate models in priority order:
    // If the primary model hits 429 quota exhaustion or 503 high demand,
    // it automatically tries the next candidate model seamlessly.
    const candidateModels = [
      process.env.GEMINI_MODEL || "gemini-3.5-flash",
      "gemini-3-flash-preview",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.8-flash",
    ];

    let reply = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction: KASHLY_SYSTEM_INSTRUCTION.trim(),
            temperature: 0.7,
          },
        });

        reply = response.text?.trim();
        if (reply) break;
      } catch (err) {
        console.warn(`[Kashly AI] Model ${model} failed, trying fallback:`, err.message?.slice(0, 100));
        lastError = err;
      }
    }

    if (reply) {
      return res.status(200).json({
        success: true,
        reply,
      });
    }

    // All models failed - return friendly formatted error
    const friendlyError = formatHumanError(lastError ? lastError.message : "No response generated");
    return res.status(500).json({
      success: false,
      error: friendlyError,
    });
  } catch (error) {
    console.error("[Kashly AI Controller Error]:", error);
    return res.status(500).json({
      success: false,
      error: formatHumanError(error.message || "An unexpected error occurred while processing your request."),
    });
  }
};

module.exports = { handleChatMessage, KASHLY_SYSTEM_INSTRUCTION };
