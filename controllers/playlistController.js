const asyncHandler = require("express-async-handler");
const Playlist = require("../models/playlistModel");
// const axios = require("axios");

// @desc    Get User Playlists
// @route   GET /playlists/user/:id
// @access  Private
const getUserPlaylists = asyncHandler(async (req, res) => {
	const playlists = await Playlist.find({ user: req.params.id });

	res.status(200).json({
		success: true,
		playlists: playlists,
	});
});

// @desc    Get Playlist tracks
// @route   GET /playlists/:id
// @access  Private
const getPlaylistTracks = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		message:
			"Returns the tracks of a playlist id by calling spotify's API. Needs User's access token OR refresh token to generate new",
	});
});

module.exports = {
	getUserPlaylists,
	getPlaylistTracks,
};
