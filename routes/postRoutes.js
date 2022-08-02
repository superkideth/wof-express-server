const express = require("express");
const router = express.Router();
const {
	getPosts,
	getPostByUser,
	setPost,
	updatePost,
	deletePost,
	getPostById,
	savePostFromUser,
} = require("../controllers/postController");
const { protectUserRoute } = require("../middleware/authMiddleware");

router.get("/", getPosts); // protect for clients.

router.get("/:id", protectUserRoute, getPostById);

router.put("/:id/save", protectUserRoute, savePostFromUser);

router.get("/user/:id", protectUserRoute, getPostByUser); // get user's data

router.post("/", protectUserRoute, setPost);

router.put("/:id/update", protectUserRoute, updatePost);

router.post("/:id/delete", protectUserRoute, deletePost);

module.exports = router;
