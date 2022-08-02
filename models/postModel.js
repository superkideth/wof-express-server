const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		user_img: {
			type: String,
			required: [true, "Please add an image link"],
		},
		quote: {
			type: String,
			required: [true, "Please add a quote value"],
			max: 500,
		},
		playlist: {
			type: Array,
			default: [],
			required: [true, "Please add a playlist object"],
		},

		saved: {
			type: Array,
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", PostSchema);
