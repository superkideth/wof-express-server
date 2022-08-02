const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register Client
// @route   POST /auth/client/register
// @access  Public
const registerClient = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	// Check if all fields exists
	if (!firstName || !lastName || !email || !password) {
		res.status(400);
		throw new Error("Please add all fields");
	}

	// Check if client exists
	const clientExists = await Client.findOne({ email });

	if (clientExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create Client
	const client = await Client.create({
		firstName,
		lastName,
		email,
		password: hashedPassword,
	});

	if (client) {
		res.status(201).json({
			success: true,
			client: {
				_id: client.id,
				firstName: client.firstName,
				lastName: client.lastName,
				email: client.email,
				token: generateToken(client._id),
			},
		});
	} else {
		res.status(400);
		throw new Error("Invalid User Data");
	}
});

// @desc    Login Client
// @route   POST /auth/client/login
// @access  Public
const loginClient = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for client email
	const client = await Client.findOne({ email });

	// Check for client password
	if (client && (await bcrypt.compare(password, client.password))) {
		res.status(200).json({
			success: true,
			client: {
				_id: client.id,
				firstName: client.firstName,
				lastName: client.lastName,
				email: client.email,
				mirrors: client.mirrors,
				token: generateToken(client._id),
			},
		});
	} else {
		res.status(400);
		throw new Error("Invalid Credentials");
	}
});

// @desc    Get Client Data
// @route   GET /auth/client/me
// @access  Private
const getClientMe = asyncHandler(async (req, res) => {
	//The id, is inside the auth middleware.
	const profile = await Client.findById(req.client.id);

	res.status(200).json({
		success: true,
		profile: profile,
	});
});

// @desc    Update Client Data
// @route   PUT /auth/client/:id
// @access  Private
const updateClientProfile = asyncHandler(async (req, res) => {
	const client = await Client.findById(req.client.id);

	// Check for Client
	if (!client) {
		res.status(401);
		throw new Error("Client not found");
	}

	res.status(200).json({
		success: true,
		updated: client,
	});
});

// @desc    Logout Client
// @route   GET /auth/client/logout
// @access  Needs to be logged in?
const logoutClient = asyncHandler(async (req, res) => {
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

// Generate Token
const generateToken = (id) => {
	// refresh token or expiration with payment..
	return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: "1d",
	});
};

module.exports = {
	registerClient,
	loginClient,
	getClientMe,
	updateClientProfile,
	logoutClient,
};
