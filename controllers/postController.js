const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");

// @desc    Get Posts
// @route   GET /posts
// @access  Public // Private for clients
const getPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find();

	res.status(200).json({
		success: true,
		posts: posts,
	});
});

// @desc    Get Post by Id
// @route   GET /posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
	let post = await Post.findOne({ _id: req.params.id });

	if (!req.params.id) {
		res.status(400);
		throw new Error("Please add an id field");
	}

	if (!post) {
		res.status(400);
		throw new Error("Not Found");
	}

	res.status(200).json({
		success: true,
		post: post,
	});
});

// @desc    Get Post by Id
// @route   GET /posts/user/:id
// @access  Private
const getPostByUser = asyncHandler(async (req, res) => {
	const posts = await Post.find({ user: req.user.id });

	res.status(200).json({
		success: true,
		posts: posts,
	});
});

// @desc    Save a Post from User
// @route   PUT /posts/:id/save
// @access  Private
const savePostFromUser = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(401);
		throw new Error("Post not found");
	}

	if (!post.saved.includes(req.body.userId)) {
		await post.updateOne({ $push: { saved: req.body.userId } });
		res.status(200).json({
			success: true,
			saved: post.saved,
			message: "Post Saved by user",
		});
	} else {
		await post.updateOne({ $pull: { saved: req.body.userId } });
		res.status(200).json({
			success: true,
			saved: post.saved,
			message: "Post Unsaved by user",
		});
	}
});

// @desc    Set Post
// @route   POST /posts
// @access  Private
const setPost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.body.user);
	// Check for user
	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	if (!req.body.quote) {
		res.status(400);
		throw new Error("Please add a quote field");
	}

	if (!req.body.playlist) {
		res.status(400);
		throw new Error("Please add a playlist");
	}
	if (!req.body.user_img) {
		res.status(400);
		throw new Error("Please add a playlist");
	}

	const post = await Post.create({
		user: req.user.id,
		user_img: req.user.image,
		quote: req.body.quote,
		playlist: req.body.playlist,
	});

	res.status(200).json({
		success: true,
		post: post,
	});
});

// @desc    Update Post
// @route   PUT /posts/:id/update
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(400);
		throw new Error("Post not found");
	}

	const user = await User.findById(req.body.userId);
	// Check for user
	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	// Check the logged in user matches the post user
	if (post.user.toString() !== user.id) {
		res.status(401);
		throw new Error("User not authorized");
	}

	const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	res.status(200).json({
		success: true,
		post: updatedPost,
	});
});

// @desc    Delete Post
// @route   DELETE /posts/:id/delete
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) {
		res.status(400);
		throw new Error("Post not found");
	}

	const user = await User.findById(req.body.userId);
	// Check for user
	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	// Check the logged in user matches the post user
	if (post.user.toString() !== user.id) {
		res.status(401);
		throw new Error("User not authorized");
	}

	await post.remove();

	res.status(200).json({
		success: true,
		message: `Post ${req.params.id} deleted.`,
	});
});

module.exports = {
	getPosts,
	getPostByUser,
	setPost,
	updatePost,
	deletePost,
	getPostById,
	savePostFromUser,
};
