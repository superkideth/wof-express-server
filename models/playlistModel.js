const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},

		playlist_id: {
			type: String,
			default: null,
		},
		name: {
			type: String,
			default: null,
		},
		description: {
			type: String,
			default: null,
		},
		uri: {
			type: String,
			default: null,
		},
		image: {
			type: String,
			default: null,
		},
		owner: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Playlist", PlaylistSchema);
