/**
 * controllers/chat.controller.js
 * Career assistant chatbot handler
 */

const { chatAssistant } = require("../services/groq.service");

/**
 * POST /api/chat
 * Accepts: question, optional history array
 * Returns: AI response
 */
const chatHandler = async (req, res) => {
  try {
    const { question, history } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        error: "Please provide a question.",
      });
    }

    if (question.trim().length > 500) {
      return res.status(400).json({
        error: "Question is too long. Please keep it under 500 characters.",
      });
    }

    console.log(`💬 Chat question: "${question.substring(0, 50)}..."`);

    const answer = await chatAssistant(question, history || []);

    return res.json({
      success: true,
      question,
      answer,
    });
  } catch (error) {
    console.error("❌ chat Error:", error.message);
    return res.status(500).json({
      error: error.message || "Chat service unavailable. Please try again.",
    });
  }
};

module.exports = { chatHandler };
