/**
 * services/groq.service.js
 * Reusable Groq API integration service.
 * All AI calls go through this file.
 */

const axios = require("axios");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ✅ Updated model — llama3-70b-8192 was deprecated May 2025
const MODEL = "llama-3.3-70b-versatile";

/**
 * Base function to call Groq API
 * @param {string} prompt - The prompt to send
 * @param {number} maxTokens - Max tokens for response
 * @returns {string} - AI response text
 */
const callGroq = async (prompt, maxTokens = 1500) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("❌ Groq API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message ||
        "AI service unavailable. Please try again."
    );
  }
};

// ─── 1. JD Summarizer ─────────────────────────────────────────────────────────
/**
 * Summarize a job description in student or professional mode
 * @param {string} jdText - Job description text
 * @param {string} mode - "student" or "professional"
 */
const summarizeJD = async (jdText, mode = "student") => {
  const studentPrompt = `
You are a friendly career assistant helping students understand job postings.

Analyze this job description and respond ONLY with valid JSON (no markdown, no extra text):

${jdText}

Return this exact JSON structure:
{
  "roleOverview": "2-3 sentence simple explanation of what this job is about",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "toolsAndTech": ["tool1", "tool2", "tool3"],
  "experienceLevel": "Entry-level / Mid-level / Senior",
  "simpleSummary": "One paragraph explaining this job as if talking to a college student",
  "difficultyMeter": "Easy / Medium / Hard",
  "difficultyReason": "Short reason why",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "salaryRange": "Estimated salary range if you can infer it, else 'Not specified'",
  "roleType": "Full-time / Part-time / Internship / Contract"
}
`;

  const professionalPrompt = `
You are a professional career consultant creating structured job analysis reports.

Analyze this job description and respond ONLY with valid JSON (no markdown, no extra text):

${jdText}

Return this exact JSON structure:
{
  "roleOverview": "Formal 3-4 sentence professional summary of the position",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "toolsAndTech": ["tool1", "tool2", "tool3"],
  "experienceLevel": "Entry-level / Mid-level / Senior / Lead",
  "simpleSummary": "Professional structured summary with key responsibilities",
  "difficultyMeter": "Easy / Medium / Hard",
  "difficultyReason": "Professional assessment of role complexity",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "salaryRange": "Estimated market salary range based on role and skills",
  "roleType": "Full-time / Part-time / Contract / Remote"
}
`;

  const prompt = mode === "student" ? studentPrompt : professionalPrompt;
  const raw = await callGroq(prompt, 2000);
  return parseJSON(raw);
};

// ─── 2. Skill Matching ────────────────────────────────────────────────────────
/**
 * Compare job description with resume and find skill gaps
 * @param {string} jdText - Job description
 * @param {string} resumeText - Resume text
 */
const matchSkills = async (jdText, resumeText) => {
  const prompt = `
You are a career advisor comparing a job description with a student's resume.

Job Description:
${jdText}

Student Resume:
${resumeText}

Analyze carefully and respond ONLY with valid JSON (no markdown, no extra text):
{
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "matchPercentage": 75,
  "strengths": ["What the candidate does well"],
  "suggestions": ["Specific improvement suggestions"],
  "overallVerdict": "Brief overall assessment in 2 sentences"
}

Be accurate. matchPercentage should be a number 0-100.
`;

  const raw = await callGroq(prompt, 1500);
  return parseJSON(raw);
};

// ─── 3. Roadmap Generator ─────────────────────────────────────────────────────
/**
 * Generate a learning roadmap for missing skills
 * @param {string[]} missingSkills - Array of missing skills
 * @param {string} jobTitle - Target job title
 */
const generateRoadmap = async (missingSkills, jobTitle = "the target job") => {
  const skillsList = Array.isArray(missingSkills)
    ? missingSkills.join(", ")
    : missingSkills;

  const prompt = `
You are a learning coach helping a student become job-ready for ${jobTitle}.

The student is missing these skills: ${skillsList}

Create a realistic step-by-step learning roadmap. Respond ONLY with valid JSON (no markdown, no extra text):
{
  "totalWeeks": 12,
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "2 weeks",
      "skills": ["skill1", "skill2"],
      "tasks": [
        "Specific task or resource to complete",
        "Another specific task"
      ],
      "resources": [
        {"name": "Resource name", "type": "Course/Video/Book/Practice", "url": "https://example.com"}
      ],
      "milestone": "What you can do after this phase"
    }
  ],
  "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
  "estimatedJobReadiness": "When the student will be ready to apply"
}

Make it practical, specific, and encouraging. Include real resources like freeCodeCamp, MDN, YouTube channels, etc.
`;

  const raw = await callGroq(prompt, 2500);
  return parseJSON(raw);
};

// ─── 4. Keyword Extractor ─────────────────────────────────────────────────────
/**
 * Extract important resume keywords from JD
 * @param {string} jdText - Job description text
 */
const extractKeywords = async (jdText) => {
  const prompt = `
Extract the most important keywords from this job description that a candidate should include in their resume.

Job Description:
${jdText}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "mustHaveKeywords": ["keyword1", "keyword2"],
  "technicalKeywords": ["tech1", "tech2"],
  "softSkillKeywords": ["skill1", "skill2"],
  "industryKeywords": ["industry term 1", "industry term 2"],
  "actionVerbs": ["verb1", "verb2"],
  "resumeTips": ["Specific tip on how to use these keywords in resume"]
}
`;

  const raw = await callGroq(prompt, 1000);
  return parseJSON(raw);
};

// ─── 5. Chat Assistant ────────────────────────────────────────────────────────
/**
 * Answer career-related questions
 * @param {string} question - User's question
 * @param {string[]} history - Previous chat history
 */
const chatAssistant = async (question, history = []) => {
  // Build conversation context from history
  const contextMessages = history
    .slice(-6) // Keep last 6 messages for context window
    .map((m) => `${m.role === "user" ? "Student" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `
You are a friendly, knowledgeable career assistant helping students with job searching and career development.

${contextMessages ? `Previous conversation:\n${contextMessages}\n` : ""}

Student's question: ${question}

Answer helpfully and simply. If it's a technical question (like "What is REST API?"), explain it clearly with an example.
If it's a career question, give practical, actionable advice.
Keep your response conversational and encouraging. Max 3-4 paragraphs.
`;

  return await callGroq(prompt, 800);
};

// ─── Helper: Safe JSON Parser ─────────────────────────────────────────────────
/**
 * Safely parse JSON from AI response (handles markdown code blocks)
 * @param {string} text - Raw AI response
 */
const parseJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/gi, "")
      .trim();

    // Find the JSON object/array boundaries
    const jsonStart =
      cleaned.indexOf("{") !== -1 ? cleaned.indexOf("{") : cleaned.indexOf("[");
    const jsonEnd =
      cleaned.lastIndexOf("}") !== -1
        ? cleaned.lastIndexOf("}")
        : cleaned.lastIndexOf("]");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in response");
    }

    const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("⚠️  JSON Parse Error:", err.message);
    console.error("Raw text preview:", text?.substring(0, 200));
    // Return a safe fallback structure so the app doesn't crash
    return {
      error: true,
      message: "Could not parse AI response. Please try again.",
      raw: text,
    };
  }
};

module.exports = {
  summarizeJD,
  matchSkills,
  generateRoadmap,
  extractKeywords,
  chatAssistant,
  callGroq,
};