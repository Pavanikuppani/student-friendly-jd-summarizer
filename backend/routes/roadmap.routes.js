/**
 * routes/roadmap.routes.js
 */

const express = require("express");
const router = express.Router();
const { generateRoadmapHandler } = require("../controllers/roadmap.controller");

// POST /api/generate-roadmap
router.post("/generate-roadmap", generateRoadmapHandler);

module.exports = router;
