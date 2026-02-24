import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../env.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * AI Scout — matches a query against verified users.
 * Returns a JSON object mapping matched user IDs to reasoning strings.
 *
 * @param {string} query - The recruiter/searcher's plain-text query
 * @param {Array} users  - Top 50 verified user objects (with _id, name, skills)
 * @returns {Promise<Object>} { "userId1": "reasoning...", "userId2": "reasoning..." }
 */
export const aiScout = async (query, users) => {
  const usersContext = users.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    role: u.role,
    trustScore: u.trustScore,
    skills: u.skills.map((s) => (s.verified ? `${s.name} (verified)` : s.name)),
  }));

  const prompt = `
You are an expert developer matchmaker for a hackathon partner-finding platform.

QUERY: "${query}"

AVAILABLE DEVELOPERS (JSON):
${JSON.stringify(usersContext, null, 2)}

TASK:
- Analyze the query and find the best matching developers from the list above.
- Consider their verified skills, role, and trust score.
- Return ONLY a valid JSON object (no markdown, no explanation outside the JSON).
- The JSON must map matched user IDs (as string keys) to a brief reasoning string.

Example output format:
{
  "64a1b2c3d4e5f6g7h8i9j0k1": "Strong React and Node.js skills, high trust score, ideal for full-stack hackathon projects.",
  "64a1b2c3d4e5f6g7h8i9j0k2": "Expert in Python/Django with database experience, good fit for backend-heavy projects."
}

If no developers match, return an empty object: {}

OUTPUT (JSON only):`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Scout failed:", error.message);
    return {};
  }
};

/**
 * Generate a 2-sentence icebreaker cold DM based on a target user's verified skills.
 *
 * @param {Object} targetUser - The target user's profile object
 * @returns {Promise<string>} The icebreaker message
 */
export const generateIcebreaker = async (targetUser) => {
  const verifiedSkills = targetUser.skills
    .filter((s) => s.verified)
    .map((s) => s.name);

  const prompt = `
You are a friendly networking assistant for a hackathon platform.

TARGET DEVELOPER:
- Name: ${targetUser.name}
- Role: ${targetUser.role}
- Verified Skills: ${verifiedSkills.join(", ") || "None listed"}
- Trust Score: ${targetUser.trustScore}

TASK:
Write a 2-sentence cold DM (direct message) that:
1. References one or two of their specific verified skills
2. Proposes a concrete collaboration idea or hackathon project
3. Sounds genuine, enthusiastic, and professional — not generic

Return ONLY the 2-sentence message. No quotes, no labels, no other text.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Icebreaker generation failed:", error.message);
    return "Hey! I noticed your impressive skill set — would love to team up for an upcoming hackathon. Let me know if you're interested!";
  }
};
