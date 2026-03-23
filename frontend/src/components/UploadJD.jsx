/**
 * components/UploadJD.jsx
 * Step 1: User inputs a job description via paste or PDF upload
 */

import React, { useState, useRef } from "react";
import { analyzeJD } from "../utils/api";

const EXAMPLE_JD = `Software Engineer Intern - React & Node.js

We are looking for a passionate Software Engineer Intern to join our team!

Responsibilities:
- Build and maintain React web applications
- Develop RESTful APIs using Node.js and Express
- Collaborate with cross-functional teams
- Write clean, well-documented code
- Participate in code reviews

Requirements:
- Pursuing a degree in Computer Science or related field
- Proficiency in JavaScript, React.js
- Basic knowledge of Node.js, Express
- Familiarity with Git and GitHub
- Understanding of REST APIs and HTTP
- Nice to have: TypeScript, MongoDB, Docker

We offer competitive stipend, mentorship, and real-world experience.`;

export default function UploadJD({ onResult }) {
  const [inputMode, setInputMode] = useState("text"); // "text" | "pdf"
  const [jdText, setJdText] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [analysisMode, setAnalysisMode] = useState("student"); // "student" | "professional"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── Handle PDF drop/select ─────────────────────────────────────────────
  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      return;
    }
    setPdfFile(file);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");

    if (inputMode === "text" && jdText.trim().length < 50) {
      setError("Please paste a job description (at least 50 characters).");
      return;
    }
    if (inputMode === "pdf" && !pdfFile) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    try {
      const rawText = inputMode === "text" ? jdText : null;
      const result = await analyzeJD(rawText, inputMode === "pdf" ? pdfFile : null, analysisMode);
      onResult(result, jdText);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to analyze. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Page title ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}
        >
          Analyze a Job Description
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Paste the JD text or upload a PDF — our AI will break it down for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Input area (2/3 width) ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Input mode toggle */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
          >
            {["text", "pdf"].map((mode) => (
              <button
                key={mode}
                onClick={() => { setInputMode(mode); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: inputMode === mode ? "var(--surface-elevated)" : "transparent",
                  color: inputMode === mode ? "var(--accent)" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {mode === "text" ? "📝 Paste Text" : "📄 Upload PDF"}
              </button>
            ))}
          </div>

          {/* Text input */}
          {inputMode === "text" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Job Description
                </label>
                <button
                  onClick={() => setJdText(EXAMPLE_JD)}
                  className="text-xs px-3 py-1 rounded-full transition-all"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-glow)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    cursor: "pointer",
                  }}
                >
                  Load Example
                </button>
              </div>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={14}
                className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--surface-border)",
                  color: "var(--text-primary)",
                  lineHeight: "1.7",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(56,189,248,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--surface-border)")
                }
              />
              <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                {jdText.length} characters
              </p>
            </div>
          )}

          {/* PDF upload */}
          {inputMode === "pdf" && (
            <div
              className="rounded-xl p-8 text-center cursor-pointer transition-all"
              style={{
                border: `2px dashed ${dragOver ? "var(--accent)" : "var(--surface-border)"}`,
                background: dragOver ? "var(--accent-glow)" : "var(--surface-card)",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              {pdfFile ? (
                <div>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="font-medium" style={{ color: "var(--accent)" }}>
                    {pdfFile.name}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                    {(pdfFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                    className="mt-3 text-xs px-3 py-1 rounded-full"
                    style={{ color: "var(--red)", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-4">☁️</div>
                  <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                    Drop your PDF here
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    or click to browse · Max 5MB
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)" }}
            >
              <span className="text-base flex-shrink-0">⚠️</span>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" style={{ animation: "spin 0.8s linear infinite" }} />
                Analyzing with AI...
              </>
            ) : (
              <>
                🔍 Analyze Job Description
              </>
            )}
          </button>
        </div>

        {/* ── Right: Options panel (1/3 width) ─────────────────────────── */}
        <div className="space-y-4">

          {/* Analysis Mode */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              📋 Analysis Mode
            </h3>
            <div className="space-y-2">
              {[
                { id: "student", label: "Student Mode", desc: "Simple, beginner-friendly explanation", icon: "🎓" },
                { id: "professional", label: "Professional Mode", desc: "Formal structured summary", icon: "💼" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAnalysisMode(m.id)}
                  className="w-full text-left p-3 rounded-xl transition-all"
                  style={{
                    background: analysisMode === m.id ? "var(--accent-glow)" : "var(--surface-elevated)",
                    border: `1px solid ${analysisMode === m.id ? "rgba(56,189,248,0.4)" : "transparent"}`,
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{m.icon}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: analysisMode === m.id ? "var(--accent)" : "var(--text-primary)" }}>
                        {m.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{m.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              💡 Tips
            </h3>
            <ul className="space-y-2">
              {[
                "Include the full JD for better results",
                "PDF works great for saved job postings",
                "Use Student Mode if you're new to job searching",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }}>→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* What you'll get */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              ✨ What you'll get
            </h3>
            <ul className="space-y-1.5">
              {["Role overview", "Required skills", "Tech stack", "Difficulty rating", "Resume keywords", "Salary insight"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--green)" }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
