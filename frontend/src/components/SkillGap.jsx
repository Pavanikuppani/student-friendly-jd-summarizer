/**
 * components/SkillGap.jsx
 * Compare the job description against user's resume,
 * display matched / missing / nice-to-have skills and match %
 */

import React, { useState } from "react";
import { matchSkills } from "../utils/api";

const SAMPLE_RESUME = `John Doe | john@example.com | github.com/johndoe

SKILLS
JavaScript, React.js, HTML, CSS, Git, GitHub
Basic Python, SQL basics

PROJECTS
- Todo App: Built with React, useState, useEffect hooks
- Portfolio Website: HTML, CSS, vanilla JavaScript

EDUCATION
B.Tech Computer Science — 2025 (ongoing)

EXPERIENCE
Frontend Intern (2 months) - Built UI components with React`;

// ── Circular match percentage gauge ────────────────────────────────────────
const MatchGauge = ({ percentage }) => {
  const pct = Math.min(100, Math.max(0, percentage || 0));
  const color = pct >= 70 ? "#34d399" : pct >= 40 ? "#fbbf24" : "#f87171";
  const label = pct >= 70 ? "Great Match!" : pct >= 40 ? "Decent Match" : "Needs Work";

  return (
    <div className="card text-center py-8">
      <div className="relative inline-flex items-center justify-center mb-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface-elevated)" strokeWidth="10" />
          {/* Progress circle */}
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${(pct / 100) * 314} 314`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dasharray 1s ease-out" }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold" style={{ color, fontFamily: "'Space Mono', monospace" }}>{pct}%</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>match</p>
        </div>
      </div>
      <p className="font-semibold text-sm" style={{ color }}>{label}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Skills compatibility</p>
    </div>
  );
};

// ── Skill chip ─────────────────────────────────────────────────────────────
const SkillChip = ({ label, type }) => {
  const styles = {
    matched: "pill-green",
    missing: "pill-red",
    nice: "pill-yellow",
  };
  const icons = { matched: "✓", missing: "✗", nice: "+" };
  return (
    <span className={`pill ${styles[type]}`}>
      <span className="mr-1 text-xs">{icons[type]}</span>
      {label}
    </span>
  );
};

export default function SkillGap({ jdText, onResult, skillResult, onGoToRoadmap }) {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");

    if (!jdText || jdText.trim().length < 30) {
      setError("No job description found. Please analyze a JD first in the Analyze tab.");
      return;
    }
    if (resumeText.trim().length < 30) {
      setError("Please paste your resume content.");
      return;
    }

    setLoading(true);
    try {
      const result = await matchSkills(jdText, resumeText);
      onResult(result);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}>
          Skill Gap Analyzer
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Paste your resume below and see how well you match the job description.
        </p>
      </div>

      {/* JD status */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-6 text-sm"
        style={{
          background: jdText ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
          border: `1px solid ${jdText ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
        }}
      >
        <span>{jdText ? "✅" : "⚠️"}</span>
        <span style={{ color: jdText ? "#34d399" : "#f87171" }}>
          {jdText
            ? `Job description loaded (${jdText.length} chars) — ready to compare`
            : "No JD loaded yet. Please analyze a job description in the Analyze JD tab first."}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume input */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Your Resume / Skills
              </label>
              <button
                onClick={() => setResumeText(SAMPLE_RESUME)}
                className="text-xs px-3 py-1 rounded-full"
                style={{ color: "var(--accent)", background: "var(--accent-glow)", border: "1px solid rgba(56,189,248,0.2)", cursor: "pointer" }}
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here — skills, experience, education, projects..."
              rows={14}
              className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--surface-border)",
                color: "var(--text-primary)",
                lineHeight: "1.7",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(56,189,248,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--surface-border)")}
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-3">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" style={{ animation: "spin 0.8s linear infinite" }} />
                Comparing Skills...
              </>
            ) : "📊 Analyze Skill Gap"}
          </button>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>ℹ️ How it works</h3>
            <ul className="space-y-2">
              {[
                "AI reads your resume",
                "Extracts all skills mentioned",
                "Compares with JD requirements",
                "Shows what you have & what's missing",
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold"
                    style={{ background: "var(--surface-elevated)", color: "var(--accent)" }}>
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>📝 Tips for best results</h3>
            <ul className="space-y-1.5">
              {[
                "Include your full skills section",
                "Mention tools you've used in projects",
                "List any coursework or certifications",
              ].map((tip, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent)" }}>→</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Results Section ──────────────────────────────────────────────── */}
      {skillResult && !skillResult.error && (
        <div className="mt-10 animate-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}>
              Your Results
            </h3>
            {skillResult.missingSkills && skillResult.missingSkills.length > 0 && (
              <button onClick={onGoToRoadmap} className="btn-primary text-sm px-4 py-2">
                Build Roadmap →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Gauge */}
            <div>
              <MatchGauge percentage={skillResult.matchPercentage} />
            </div>

            {/* Skill columns */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Matched */}
              <div className="card">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#34d399" }}>
                  ✅ You Have ({(skillResult.matchedSkills || []).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(skillResult.matchedSkills || []).map((s, i) => (
                    <SkillChip key={i} label={s} type="matched" />
                  ))}
                  {(!skillResult.matchedSkills || skillResult.matchedSkills.length === 0) && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>None matched</p>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="card">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#f87171" }}>
                  ❌ Missing ({(skillResult.missingSkills || []).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(skillResult.missingSkills || []).map((s, i) => (
                    <SkillChip key={i} label={s} type="missing" />
                  ))}
                  {(!skillResult.missingSkills || skillResult.missingSkills.length === 0) && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Nothing missing! 🎉</p>
                  )}
                </div>
              </div>

              {/* Nice-to-have */}
              <div className="card">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#fbbf24" }}>
                  ⭐ Nice to Have ({(skillResult.niceToHaveSkills || []).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(skillResult.niceToHaveSkills || []).map((s, i) => (
                    <SkillChip key={i} label={s} type="nice" />
                  ))}
                  {(!skillResult.niceToHaveSkills || skillResult.niceToHaveSkills.length === 0) && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>None listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verdict + Suggestions */}
          {(skillResult.overallVerdict || skillResult.suggestions) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {skillResult.overallVerdict && (
                <div className="card"
                  style={{ background: "var(--accent-glow)", borderColor: "rgba(56,189,248,0.3)" }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>
                    🤖 AI Verdict
                  </h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {skillResult.overallVerdict}
                  </p>
                </div>
              )}

              {skillResult.suggestions && skillResult.suggestions.length > 0 && (
                <div className="card">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    💡 Suggestions
                  </h4>
                  <ul className="space-y-1.5">
                    {skillResult.suggestions.map((s, i) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                        <span style={{ color: "#fbbf24" }}>→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
