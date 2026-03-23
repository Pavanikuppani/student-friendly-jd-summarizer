/**
 * App.js — Root component
 * Manages global state and tab navigation between all features
 */

import React, { useState } from "react";
import UploadJD from "./components/UploadJD";
import SummaryCard from "./components/SummaryCard";
import SkillGap from "./components/SkillGap";
import Roadmap from "./components/Roadmap";
import ChatAssistant from "./components/ChatAssistant";

// ── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: "analyze", label: "Analyze JD", icon: "🔍" },
  { id: "skills", label: "Skill Gap", icon: "📊" },
  { id: "roadmap", label: "Roadmap", icon: "🗺️" },
  { id: "chat", label: "AI Chat", icon: "💬" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("analyze");

  // ── Global shared state ───────────────────────────────────────────────────
  // jdResult: response from /analyze-jd
  const [jdResult, setJdResult] = useState(null);
  // jdText: raw JD text (shared between tabs)
  const [jdText, setJdText] = useState("");
  // skillResult: response from /match-skills
  const [skillResult, setSkillResult] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "var(--surface-card)",
          borderBottom: "1px solid var(--surface-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            >
              🎯
            </div>
            <div>
              <h1
                className="font-bold text-lg leading-none"
                style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}
              >
                CareerLens
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                AI Career Assistant for Students
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(52, 211, 153, 0.1)",
              color: "#34d399",
              border: "1px solid rgba(52, 211, 153, 0.2)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Powered by Groq AI
          </div>
        </div>
      </header>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <nav
        style={{
          background: "var(--surface-card)",
          borderBottom: "1px solid var(--surface-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-3.5 text-sm font-medium transition-all relative"
                style={{
                  color: activeTab === tab.id ? "var(--accent)" : "var(--text-secondary)",
                  borderBottom:
                    activeTab === tab.id
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab.id ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
                {/* Badge for skill gap if we have JD loaded */}
                {tab.id === "skills" && jdResult && (
                  <span
                    className="ml-2 px-1.5 py-0.5 text-xs rounded-full"
                    style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
                  >
                    Ready
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Analyze JD Tab */}
        {activeTab === "analyze" && (
          <div className="animate-in">
            <UploadJD
              onResult={(result, rawText) => {
                setJdResult(result);
                setJdText(rawText);
                // Auto-hint to move to next tab
              }}
            />
            {jdResult && (
              <SummaryCard
                result={jdResult}
                onGoToSkills={() => setActiveTab("skills")}
              />
            )}
          </div>
        )}

        {/* Skill Gap Tab */}
        {activeTab === "skills" && (
          <div className="animate-in">
            <SkillGap
              jdText={jdText}
              onResult={(result) => setSkillResult(result)}
              skillResult={skillResult}
              onGoToRoadmap={() => setActiveTab("roadmap")}
            />
          </div>
        )}

        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div className="animate-in">
            <Roadmap
              skillResult={skillResult}
              jdResult={jdResult}
            />
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="animate-in">
            <ChatAssistant />
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-8 text-center" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">
          Built with ❤️ for students · Powered by{" "}
          <span style={{ color: "var(--accent)" }}>Groq LLaMA3</span>
        </p>
      </footer>
    </div>
  );
}
