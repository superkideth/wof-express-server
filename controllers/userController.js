const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// @desc    Logout User
// @route   GET /auth/user/logout
// @access  Private
const logoutSpotifyUser = asyncHandler(async (req, res) => {
	await req.logout((error) => {
		if (error) {
			throw new Error(error);
		}

		req.session.destroy(function (err) {
			if (error) {
				throw new Error(err);
			}
			res.status(200).json({
				success: true,
				message: "Logged out",
			});
		});
	});
});

// @desc    Get User SpotifyData
// @route   GET /auth/user/spotify/me
// @access  Private
const getSpotifyMe = asyncHandler(async (req, res) => {
	// Check for user
	if (req.isAuthenticated()) {
		res.status(200).json({
			success: true,
			user: req.user,
			token: generateToken(req.user._id),
		});
	} else {
		res.status(400);
		throw new Error("Error");
	}
});

const spotifyCallback = asyncHandler(async (req, res) => {
	res.redirect("https://app.socialnostalgia.club/login/success"); // change to front end /login/success
});

// Generate Token
const generateToken = (id) => {
	// refresh token or expiration with payment..
	return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: "30d",
	});
};

module.exports = {
	logoutSpotifyUser,
	getSpotifyMe,
	spotifyCallback,
};
