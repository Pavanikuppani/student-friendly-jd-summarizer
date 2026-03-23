/**
 * components/SummaryCard.jsx
 * Displays the AI analysis results: summary, skills, keywords, difficulty
 */

import React, { useState } from "react";

// ── Difficulty meter component ─────────────────────────────────────────────
const DifficultyMeter = ({ level, reason }) => {
  const config = {
    Easy: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", width: "33%", emoji: "🟢" },
    Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", width: "66%", emoji: "🟡" },
    Hard: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", width: "100%", emoji: "🔴" },
  };
  const c = config[level] || config["Medium"];

  return (
    <div className="card">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
        ⚡ Difficulty Meter
      </h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: c.color }}>
          {c.emoji} {level}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Entry level</span>
      </div>
      <div className="progress-bar mb-2">
        <div
          className="progress-fill"
          style={{ width: c.width, background: c.color }}
        />
      </div>
      {reason && (
        <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>{reason}</p>
      )}
    </div>
  );
};

// ── Pill chip ──────────────────────────────────────────────────────────────
const Chip = ({ label, variant = "blue" }) => (
  <span className={`pill pill-${variant}`}>{label}</span>
);

export default function SummaryCard({ result, onGoToSkills }) {
  const [activeSection, setActiveSection] = useState("overview");
  const { summary, keywords, mode } = result || {};

  if (!summary) return null;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: "Skills & Tech" },
    { id: "keywords", label: "Keywords" },
  ];

  return (
    <div className="mt-8 animate-in">

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}>
            Analysis Results
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {mode === "student" ? "🎓 Student Mode" : "💼 Professional Mode"}
          </p>
        </div>
        <button
          onClick={onGoToSkills}
          className="btn-primary text-sm px-4 py-2"
        >
          Check Skill Gap →
        </button>
      </div>

      {/* ── Top metrics row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Experience", value: summary.experienceLevel || "N/A", icon: "📈" },
          { label: "Role Type", value: summary.roleType || "Full-time", icon: "💼" },
          { label: "Difficulty", value: summary.difficultyMeter || "Medium", icon: "⚡" },
          { label: "Salary", value: summary.salaryRange || "Not specified", icon: "💰" },
        ].map((metric) => (
          <div key={metric.label} className="card text-center py-4">
            <div className="text-2xl mb-1">{metric.icon}</div>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{metric.label}</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* ── Main content + sidebar ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: tabbed content */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            {/* Tab bar */}
            <div
              className="flex"
              style={{ borderBottom: "1px solid var(--surface-border)" }}
            >
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="px-5 py-3.5 text-sm font-medium transition-all"
                  style={{
                    color: activeSection === s.id ? "var(--accent)" : "var(--text-secondary)",
                    borderBottom: activeSection === s.id ? "2px solid var(--accent)" : "2px solid transparent",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: activeSection === s.id ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Overview tab */}
              {activeSection === "overview" && (
                <div className="animate-in">
                  <h3 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    📌 Role Overview
                  </h3>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {summary.roleOverview}
                  </p>

                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    💬 {mode === "student" ? "Simple Explanation" : "Professional Summary"}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {summary.simpleSummary}
                  </p>
                </div>
              )}

              {/* Skills tab */}
              {activeSection === "skills" && (
                <div className="animate-in">
                  <div className="mb-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      🛠️ Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(summary.requiredSkills || []).map((skill, i) => (
                        <Chip key={i} label={skill} variant="blue" />
                      ))}
                      {(!summary.requiredSkills || summary.requiredSkills.length === 0) && (
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No skills listed</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      🔧 Tools & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(summary.toolsAndTech || []).map((tool, i) => (
                        <Chip key={i} label={tool} variant="purple" />
                      ))}
                      {(!summary.toolsAndTech || summary.toolsAndTech.length === 0) && (
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Not specified</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Keywords tab */}
              {activeSection === "keywords" && (
                <div className="animate-in">
                  {keywords && (
                    <>
                      <div className="mb-5">
                        <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                          🔑 Must-Have Keywords
                        </h3>
                        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                          Add these to your resume to pass ATS filters
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(keywords.mustHaveKeywords || []).map((kw, i) => (
                            <Chip key={i} label={kw} variant="green" />
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                          💻 Technical Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(keywords.technicalKeywords || []).map((kw, i) => (
                            <Chip key={i} label={kw} variant="blue" />
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                          🤝 Soft Skills Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(keywords.softSkillKeywords || []).map((kw, i) => (
                            <Chip key={i} label={kw} variant="yellow" />
                          ))}
                        </div>
                      </div>

                      {keywords.resumeTips && keywords.resumeTips.length > 0 && (
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: "var(--accent-glow)", border: "1px solid rgba(56,189,248,0.2)" }}
                        >
                          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--accent)" }}>
                            📝 Resume Tips
                          </h3>
                          <ul className="space-y-1.5">
                            {keywords.resumeTips.map((tip, i) => (
                              <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--text-secondary)" }}>
                                <span style={{ color: "var(--accent)" }}>→</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: difficulty + action keywords */}
        <div className="space-y-4">
          <DifficultyMeter
            level={summary.difficultyMeter}
            reason={summary.difficultyReason}
          />

          {/* Key highlights */}
          {summary.keywords && summary.keywords.length > 0 && (
            <div className="card">
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                🏷️ Top Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {summary.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--surface-elevated)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--surface-border)",
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Next step CTA */}
          <div
            className="card text-center"
            style={{ background: "var(--accent-glow)", borderColor: "rgba(56,189,248,0.3)" }}
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--accent)" }}>
              Check Your Skill Gap
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
              Compare this JD with your resume
            </p>
            <button onClick={onGoToSkills} className="btn-primary text-xs px-4 py-2 w-full">
              Go to Skill Gap →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
