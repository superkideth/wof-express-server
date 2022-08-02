const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		spotifyId: {
			type: String,
			default: null,
		},
		username: {
			type: String,
			default: null,
		},
		email: {
			type: String,
			default: null,
		},
		displayName: {
			type: String,
			default: null,
		},
		profileUrl: {
			type: String,
			default: null,
		},
		image: {
			type: String,
		},
		followers: {
			type: String,
			default: null,
		},
		country: {
			type: String,
			default: null,
		},
		spotify_refreshToken: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
