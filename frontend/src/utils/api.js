/**
 * utils/api.js
 * Axios instance + API call helpers for all backend endpoints
 */

import axios from "axios";

// Base API instance — proxy routes to localhost:5000 in dev
const api = axios.create({
  baseURL: "/api",
  timeout: 60000, // 60 seconds (AI calls can be slow)
});

// ── 1. Analyze Job Description ─────────────────────────────────────────────
/**
 * @param {string|null} jdText - Pasted JD text
 * @param {File|null} jdFile - Uploaded PDF file
 * @param {string} mode - "student" | "professional"
 */
export const analyzeJD = async (jdText, jdFile, mode = "student") => {
  const formData = new FormData();
  formData.append("mode", mode);

  if (jdFile) {
    formData.append("jdFile", jdFile);
  } else {
    formData.append("jdText", jdText);
  }

  const { data } = await api.post("/analyze-jd", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// ── 2. Match Skills ────────────────────────────────────────────────────────
/**
 * @param {string} jdText - Job description text
 * @param {string} resumeText - Resume text
 */
export const matchSkills = async (jdText, resumeText) => {
  const formData = new FormData();
  formData.append("jdText", jdText);
  formData.append("resumeText", resumeText);

  const { data } = await api.post("/match-skills", formData);
  return data;
};

// ── 3. Generate Roadmap ────────────────────────────────────────────────────
/**
 * @param {string[]} missingSkills
 * @param {string} jobTitle
 */
export const generateRoadmap = async (missingSkills, jobTitle) => {
  const { data } = await api.post("/generate-roadmap", {
    missingSkills,
    jobTitle,
  });
  return data;
};

// ── 4. Chat ────────────────────────────────────────────────────────────────
/**
 * @param {string} question
 * @param {Array} history - [{role, content}]
 */
export const sendChatMessage = async (question, history = []) => {
  const { data } = await api.post("/chat", { question, history });
  return data;
};

export default api;
