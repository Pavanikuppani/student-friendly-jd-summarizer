/**
 * controllers/skill.controller.js
 * Handles skill gap analysis between JD and resume
 */

const { matchSkills } = require("../services/groq.service");
const { extractTextFromPDF } = require("../utils/pdfParser");

/**
 * POST /api/match-skills
 * Accepts JD text + resume text (or PDF)
 * Returns: matched skills, missing skills, match percentage
 */
const matchSkillsHandler = async (req, res) => {
  try {
    const { jdText, resumeText } = req.body;

    // Validate inputs
    if (!jdText || jdText.trim().length < 50) {
      return res.status(400).json({
        error: "Please provide a valid job description.",
      });
    }

    let finalResumeText = resumeText;

    // If resume was uploaded as PDF
    if (req.file) {
      console.log("📄 Processing resume PDF:", req.file.originalname);
      finalResumeText = await extractTextFromPDF(req.file.path);
    }

    if (!finalResumeText || finalResumeText.trim().length < 30) {
      return res.status(400).json({
        error: "Please provide your resume text.",
      });
    }

    console.log("🔍 Matching skills...");

    const result = await matchSkills(jdText, finalResumeText);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("❌ matchSkills Error:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to analyze skills. Please try again.",
    });
  }
};

module.exports = { matchSkillsHandler };
