/**
 * controllers/jd.controller.js
 * Handles JD analysis: summarization, keyword extraction, difficulty meter
 */

const { summarizeJD, extractKeywords } = require("../services/groq.service");
const { extractTextFromPDF } = require("../utils/pdfParser");

/**
 * POST /api/analyze-jd
 * Accepts JD as text or PDF upload
 * Returns: summary, keywords, difficulty meter
 */
const analyzeJD = async (req, res) => {
  try {
    let jdText = "";

    // ── Extract text from PDF if uploaded ──────────────────────────────────
    if (req.file) {
      console.log("📄 Processing uploaded PDF:", req.file.originalname);
      jdText = await extractTextFromPDF(req.file.path);
    } else if (req.body.jdText) {
      jdText = req.body.jdText.trim();
    } else {
      return res.status(400).json({
        error: "Please provide a job description as text or upload a PDF file.",
      });
    }

    // Validate minimum content
    if (jdText.length < 50) {
      return res.status(400).json({
        error: "Job description is too short. Please provide more details.",
      });
    }

    const mode = req.body.mode || "student"; // "student" or "professional"

    console.log(`🤖 Analyzing JD in ${mode} mode (${jdText.length} chars)`);

    // ── Run AI analysis (parallel for speed) ──────────────────────────────
    const [summary, keywords] = await Promise.all([
      summarizeJD(jdText, mode),
      extractKeywords(jdText),
    ]);

    return res.json({
      success: true,
      mode,
      jdText: jdText.substring(0, 500) + (jdText.length > 500 ? "..." : ""), // Return preview
      summary,
      keywords,
    });
  } catch (error) {
    console.error("❌ analyzeJD Error:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to analyze job description. Please try again.",
    });
  }
};

module.exports = { analyzeJD };
