/**
 * server.js - Main entry point for the JD Summarizer backend
 * Sets up Express, middleware, and routes
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import route files
const jdRoutes = require("./routes/jd.routes");
const skillRoutes = require("./routes/skill.routes");
const roadmapRoutes = require("./routes/roadmap.routes");
const chatRoutes = require("./routes/chat.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files statically (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", jdRoutes);       // POST /api/analyze-jd
app.use("/api", skillRoutes);    // POST /api/match-skills
app.use("/api", roadmapRoutes);  // POST /api/generate-roadmap
app.use("/api", chatRoutes);     // POST /api/chat

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "JD Summarizer API is running 🚀" });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong. Please try again.",
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
});
