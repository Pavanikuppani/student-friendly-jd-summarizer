/**
 * components/Roadmap.jsx
 * Generates and displays a step-by-step learning roadmap for missing skills
 */

import React, { useState } from "react";
import { generateRoadmap } from "../utils/api";

// ── Phase card ─────────────────────────────────────────────────────────────
const PhaseCard = ({ phase, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  const colors = [
    { bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.3)", color: "#38bdf8" },
    { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", color: "#a78bfa" },
    { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", color: "#34d399" },
    { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", color: "#fbbf24" },
    { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#f87171" },
  ];
  const c = colors[index % colors.length];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: "var(--surface-card)", border: `1px solid var(--surface-border)` }}
    >
      {/* Phase header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left transition-all"
        style={{
          background: expanded ? c.bg : "transparent",
          borderBottom: expanded ? `1px solid ${c.border}` : "none",
          cursor: "pointer",
          border: "none",
        }}
      >
        {/* Phase number */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
        >
          {phase.phase}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {phase.title}
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
              {phase.duration}
            </span>
          </div>

          {/* Skill chips preview */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(phase.skills || []).slice(0, 4).map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--surface-elevated)", color: "var(--text-secondary)" }}>
                {s}
              </span>
            ))}
            {(phase.skills || []).length > 4 && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>+{phase.skills.length - 4} more</span>
            )}
          </div>
        </div>

        <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="p-5 space-y-4 animate-in">
          {/* Tasks */}
          {phase.tasks && phase.tasks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}>📋 Tasks</h4>
              <ul className="space-y-2">
                {phase.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                      style={{ background: "var(--surface-elevated)", color: c.color }}>
                      {i + 1}
                    </span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources */}
          {phase.resources && phase.resources.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}>🔗 Resources</h4>
              <div className="space-y-2">
                {phase.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl transition-all group"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--surface-border)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.border)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--surface-border)")}
                  >
                    <span className="text-base">
                      {res.type === "Course" ? "🎓" : res.type === "Video" ? "▶️" : res.type === "Book" ? "📖" : "🔧"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{res.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{res.type}</p>
                    </div>
                    <span className="text-xs" style={{ color: c.color }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Milestone */}
          {phase.milestone && (
            <div className="p-3 rounded-xl"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}>
              <p className="text-xs font-semibold mb-1" style={{ color: c.color }}>🏆 Milestone</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{phase.milestone}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Roadmap({ skillResult, jdResult }) {
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState("");
  const [customSkills, setCustomSkills] = useState("");

  // Pre-fill missing skills from skill gap analysis
  const missingSkillsFromGap = skillResult?.missingSkills || [];
  const jobTitle = jdResult?.summary?.roleOverview?.split(" ").slice(0, 4).join(" ") || "Target Role";

  const handleGenerate = async () => {
    setError("");

    // Use missing skills from analysis, or custom skills input
    let skills = missingSkillsFromGap;
    if (skills.length === 0 && customSkills.trim()) {
      skills = customSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    if (skills.length === 0) {
      setError("Please run the Skill Gap analysis first, or enter skills manually below.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateRoadmap(skills, jobTitle);
      setRoadmapData(result.roadmap);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}>
          Learning Roadmap
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Get a personalized step-by-step plan to become job-ready.
        </p>
      </div>

      {/* Missing skills from gap analysis */}
      {missingSkillsFromGap.length > 0 ? (
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                🎯 Roadmap Target: Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingSkillsFromGap.map((s, i) => (
                  <span key={i} className="pill pill-red">{s}</span>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary text-sm px-5 py-2.5 flex-shrink-0 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block"
                    style={{ animation: "spin 0.8s linear infinite" }} />
                  Generating...
                </>
              ) : "🗺️ Generate Roadmap"}
            </button>
          </div>
        </div>
      ) : (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            ✏️ Enter skills you want to learn
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            (or run Skill Gap analysis first to auto-fill missing skills)
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={customSkills}
              onChange={(e) => setCustomSkills(e.target.value)}
              placeholder="e.g. React, Node.js, MongoDB, TypeScript"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--surface-border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(56,189,248,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--surface-border)")}
            />
            <button onClick={handleGenerate} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                  style={{ animation: "spin 0.8s linear infinite" }} />
              ) : "Generate"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl text-sm mb-6"
          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "var(--red)" }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Roadmap Results ──────────────────────────────────────────────── */}
      {roadmapData && !roadmapData.error && (
        <div className="animate-in">
          {/* Summary row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <p className="text-3xl font-bold mb-1"
                style={{ color: "var(--accent)", fontFamily: "'Space Mono', monospace" }}>
                {roadmapData.totalWeeks || "?"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Weeks</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold mb-1"
                style={{ color: "#a78bfa", fontFamily: "'Space Mono', monospace" }}>
                {(roadmapData.phases || []).length}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Phases</p>
            </div>
            <div className="card text-center col-span-2 md:col-span-1">
              <p className="text-sm font-semibold mb-1" style={{ color: "#34d399" }}>
                {roadmapData.estimatedJobReadiness || "Varies"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Job Ready By</p>
            </div>
          </div>

          {/* Phase list */}
          <div className="space-y-3 mb-6">
            {(roadmapData.phases || []).map((phase, i) => (
              <PhaseCard key={i} phase={phase} index={i} />
            ))}
          </div>

          {/* Tips */}
          {roadmapData.tips && roadmapData.tips.length > 0 && (
            <div className="card"
              style={{ background: "var(--accent-glow)", borderColor: "rgba(56,189,248,0.3)" }}>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                💡 Pro Tips for Success
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {roadmapData.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>✦</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
