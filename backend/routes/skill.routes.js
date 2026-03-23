/**
 * routes/skill.routes.js
 */

const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { matchSkillsHandler } = require("../controllers/skill.controller");

// POST /api/match-skills
// Accepts: jdText, resumeText OR resumeFile
router.post("/match-skills", upload.single("resumeFile"), matchSkillsHandler);

module.exports = router;
