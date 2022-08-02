const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Generate Client Mirror Key
// @route   POST /mirror/generate/:id
// @access  Private
const generateMirrorKey = asyncHandler(async (req, res) => {
	const client = await Client.findById(req.client.id);

	// Check for Client
	if (!client) {
		res.status(401);
		throw new Error("Client not found");
	}

	const keysLength = client.mirrors.length;
	const newKeyCount = keysLength + 1;

	const newKey = generateKey(client.firstName, newKeyCount);

	console.log(newKey);

	if (!client.mirrors.includes(newKey)) {
		await client.updateOne({ $push: { mirrors: newKey } });
		res.status(200).json({
			success: true,
			access_key_created: true,
			forNow: newKey,
		});
	} else {
		res.status(401);
		throw new Error("Error.");
	}
});

// @desc    Validate Client Mirror Key
// @route   GET /mirror/validate?userId=...&apiKey=...
// @access  Public
const validateKey = asyncHandler(async (req, res) => {
	const client = await Client.findById(req.query.userId);

	// Check for Client
	if (!client) {
		res.status(401);
		throw new Error("Client not found");
	}

	const apiKey = req.query.apiKey;

	if (client.mirrors.includes(apiKey)) {
		// Verify the key
		const decodedMirrorApiKey = jwt.verify(
			apiKey,
			process.env.MIRROR_KEY_SECRET
		);

		const isValidKey = checkKeyExpiration(decodedMirrorApiKey.exp);

		if (client.firstName === decodedMirrorApiKey.name) {
			if (isValidKey) {
				res.status(200).json({
					success: true,
					isValid: isValidKey,
					keyData: {
						owner: decodedMirrorApiKey.name,
						iat: decodedMirrorApiKey.iat,
						exp: decodedMirrorApiKey.exp,
					},
				});
			} else {
				res.status(401);
				throw new Error("Key expired");
			}
		} else {
			res.status(401);
			throw new Error("Key is not valid");
		}
	} else {
		res.status(401);
		throw new Error("Error");
	}
});

// Check Key Expiration
const checkKeyExpiration = (expiration) => {
	if (Date.now() >= expiration * 1000) {
		return false;
	} else {
		return true;
	}
};

// Generate Key
const generateKey = (name, keys) => {
	// refresh key or expiration with payment..
	return jwt.sign({ name, keys }, process.env.MIRROR_KEY_SECRET, {
		expiresIn: "30d",
	});
};

module.exports = {
	generateMirrorKey,
	validateKey,
};
