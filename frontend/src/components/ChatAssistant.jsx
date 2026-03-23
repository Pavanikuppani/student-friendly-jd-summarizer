/**
 * components/ChatAssistant.jsx
 * Career Q&A chatbot powered by Groq AI
 */

import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../utils/api";

// ── Suggested questions ────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What is REST API?",
  "How do I prepare for a technical interview?",
  "What skills do frontend developers need?",
  "How to write a good resume?",
  "What is the difference between SQL and NoSQL?",
  "How do I negotiate salary as a fresher?",
  "What is Agile methodology?",
  "Tips to improve GitHub profile",
];

// ── Message bubble ─────────────────────────────────────────────────────────
const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : ""} animate-in`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
        style={{
          background: isUser
            ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
            : "var(--surface-elevated)",
          border: isUser ? "none" : "1px solid var(--surface-border)",
        }}
      >
        {isUser ? "👤" : "🤖"}
      </div>

      {/* Bubble */}
      <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"}>
        {message.content.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ── Typing indicator ───────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
      style={{ background: "var(--surface-elevated)", border: "1px solid var(--surface-border)" }}>
      🤖
    </div>
    <div className="chat-bubble-ai flex items-center gap-1.5 py-3 px-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            background: "var(--text-muted)",
            animation: "pulse 1.4s infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI career assistant. Ask me anything about tech careers, interview prep, skills, or job searching. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || loading) return;

    setInput("");
    setError("");

    // Add user message
    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build history for context (exclude first greeting)
      const history = newMessages.slice(1, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { answer } = await sendChatMessage(question, history);

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again in a moment. 🔄",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ask me anything about your career. 🚀",
      },
    ]);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Mono', monospace" }}>
          AI Career Assistant
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Ask anything about careers, tech concepts, interviews, or resume tips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Chat window (3/4) ──────────────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col" style={{ height: "600px" }}>
          <div
            className="rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--surface-border)",
              height: "100%",
            }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--surface-border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
                >
                  🤖
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Career AI
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Powered by Groq LLaMA3</p>
                  </div>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--surface-elevated)",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
              >
                🗑️ Clear
              </button>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto p-5 space-y-4"
              style={{ overflowY: "auto" }}
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Error */}
            {error && (
              <div className="px-5 pb-2">
                <p className="text-xs" style={{ color: "var(--red)" }}>⚠️ {error}</p>
              </div>
            )}

            {/* Input area */}
            <div
              className="p-4"
              style={{ borderTop: "1px solid var(--surface-border)" }}
            >
              <div
                className="flex items-end gap-3 rounded-xl p-3"
                style={{ background: "var(--surface-elevated)", border: "1px solid var(--surface-border)" }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 resize-none bg-transparent outline-none text-sm"
                  style={{ color: "var(--text-primary)", lineHeight: "1.5" }}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background:
                      input.trim() && !loading
                        ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                        : "var(--surface-border)",
                    border: "none",
                    cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  }}
                >
                  <span style={{ color: "white", fontSize: "14px" }}>↑</span>
                </button>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: "var(--text-muted)" }}>
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>

        {/* ── Suggestions sidebar (1/4) ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              💡 Try asking...
            </h3>
            <div className="space-y-2">
              {SUGGESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="w-full text-left text-xs p-2.5 rounded-xl transition-all"
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--surface-border)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)";
                    e.currentTarget.style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              🎯 What I can help with
            </h3>
            <ul className="space-y-1.5">
              {[
                "Tech concept explanations",
                "Interview tips & tricks",
                "Career path guidance",
                "Resume & LinkedIn advice",
                "Skill recommendations",
                "Salary negotiation tips",
              ].map((item, i) => (
                <li key={i} className="text-xs flex items-center gap-2"
                  style={{ color: "var(--text-secondary)" }}>
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
