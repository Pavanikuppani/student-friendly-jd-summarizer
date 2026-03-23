/**
 * routes/chat.routes.js
 */

const express = require("express");
const router = express.Router();
const { chatHandler } = require("../controllers/chat.controller");

// POST /api/chat
router.post("/chat", chatHandler);

module.exports = router;
