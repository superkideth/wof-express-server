const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Client = require("../models/clientModel");

const protectUserRoute = asyncHandler(async (req, res, next) => {
	let userToken;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get Token from Header
			userToken = req.headers.authorization.split(" ")[1];
			// Verify the token
			const decodedUserToken = jwt.verify(
				userToken,
				process.env.JWT_TOKEN_SECRET
			);
			// Get User ID from token
			req.user = await User.findById(decodedUserToken.id).select("-password");
			next();
		} catch (error) {
			console.log(error);
			res.status(401);
			throw new Error("Not authorized");
		}
	}

	if (!userToken) {
		res.status(401);
		throw new Error("Not authorized");
	}
});

const protectClientRoute = asyncHandler(async (req, res, next) => {
	let clientToken;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get Token from Header
			clientToken = req.headers.authorization.split(" ")[1];
			// Verify the token
			const decodedClientToken = jwt.verify(
				clientToken,
				process.env.JWT_TOKEN_SECRET
			);
			// Get Client ID from token
			req.client = await Client.findById(decodedClientToken.id).select(
				"-password"
			);
			next();
		} catch (error) {
			console.log(error);
			res.status(401);
			throw new Error("Not authorized");
		}
	}

	if (!clientToken) {
		res.status(401);
		throw new Error("Not authorized");
	}
});

const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized");
	}
};

module.exports = {
	protectUserRoute,
	protectClientRoute,
	isLoggedIn,
};
