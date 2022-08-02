const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
	logoutSpotifyUser,
	getSpotifyMe,
	spotifyCallback,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.get(
	"/spotify",
	passport.authenticate("spotify", {
		scope: ["user-read-email", "user-read-private", "user-read-playback-state"],
		showDialog: true,
	})
);

router.get(
	"/spotify/callback",
	passport.authenticate("spotify", {
		failureRedirect: "https://app.socialnostalgia.club/login/failed",
	}),
	spotifyCallback
);

router.get("/me", isLoggedIn, getSpotifyMe);

router.post("/logout", logoutSpotifyUser);

module.exports = router;
