/**
 * controllers/roadmap.controller.js
 * Generates personalized learning roadmap based on missing skills
 */

const { generateRoadmap } = require("../services/groq.service");

/**
 * POST /api/generate-roadmap
 * Accepts: missingSkills array, optional jobTitle
 * Returns: structured week-by-week learning plan
 */
const generateRoadmapHandler = async (req, res) => {
  try {
    const { missingSkills, jobTitle } = req.body;

    if (!missingSkills || missingSkills.length === 0) {
      return res.status(400).json({
        error: "Please provide missing skills to generate a roadmap.",
      });
    }

    console.log(`🗺️  Generating roadmap for ${missingSkills.length} missing skills...`);

    const roadmap = await generateRoadmap(missingSkills, jobTitle);

    return res.json({
      success: true,
      jobTitle: jobTitle || "Target Role",
      roadmap,
    });
  } catch (error) {
    console.error("❌ generateRoadmap Error:", error.message);
    return res.status(500).json({
      error: error.message || "Failed to generate roadmap. Please try again.",
    });
  }
};

module.exports = { generateRoadmapHandler };
