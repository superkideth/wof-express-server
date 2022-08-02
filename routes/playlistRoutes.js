const express = require("express");
const router = express.Router();
const {
	getUserPlaylists,
	getPlaylistTracks,
} = require("../controllers/playlistController");
const { protectUserRoute } = require("../middleware/authMiddleware");

router.get("/user/:id", protectUserRoute, getUserPlaylists);
router.get("/:id", getPlaylistTracks);

module.exports = router;
