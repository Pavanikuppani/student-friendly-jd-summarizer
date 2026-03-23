/**
 * routes/jd.routes.js
 * Routes for JD analysis endpoints
 */

const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { analyzeJD } = require("../controllers/jd.controller");

// POST /api/analyze-jd
// Accepts: multipart/form-data (jdText or file, mode)
router.post("/analyze-jd", upload.single("jdFile"), analyzeJD);

module.exports = router;
