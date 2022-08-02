const express = require("express");
const router = express.Router();
const {
	generateMirrorKey,
	validateKey,
} = require("../controllers/mirrorKeyController");
const { protectClientRoute } = require("../middleware/authMiddleware");

//:id == client ID!
router.put("/generate/:id", protectClientRoute, generateMirrorKey);

router.get("/validate", validateKey);

module.exports = router;
