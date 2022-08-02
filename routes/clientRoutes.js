const express = require("express");
const router = express.Router();
const {
	registerClient,
	loginClient,
	getClientMe,
	updateClientProfile,
	logoutClient,
} = require("../controllers/clientController");
const { protectClientRoute } = require("../middleware/authMiddleware");

router.post("/register", registerClient);

router.post("/login", loginClient);

router.get("/me", protectClientRoute, getClientMe);

router.put("/:id", protectClientRoute, updateClientProfile);

router.post("/logout", logoutClient);

module.exports = router;
