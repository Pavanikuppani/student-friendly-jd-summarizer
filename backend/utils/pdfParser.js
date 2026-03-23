/**
 * utils/pdfParser.js
 * Utility to extract text from uploaded PDF files using pdf-parse
 */

const pdfParse = require("pdf-parse");
const fs = require("fs");

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the uploaded PDF
 * @returns {string} - Extracted text content
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    // Clean extracted text: remove excessive whitespace/newlines
    const cleanedText = data.text
      .replace(/\n{3,}/g, "\n\n")  // Reduce multiple newlines
      .replace(/\s{3,}/g, " ")      // Reduce multiple spaces
      .trim();

    // Delete the uploaded file after parsing to save disk space
    fs.unlinkSync(filePath);

    return cleanedText;
  } catch (error) {
    // Try to cleanup file even on error
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (_) {}

    console.error("❌ PDF Parse Error:", error.message);
    throw new Error("Could not read PDF file. Please ensure it's a valid PDF.");
  }
};

module.exports = { extractTextFromPDF };
