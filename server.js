require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const mirrorKeyRoutes = require("./routes/mirrorKeyRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const session = require("express-session");
// const MongoDBSession = require("connect-mongodb-session")(session);
const PORT = process.env.PORT || 8000;

connectDB();
const app = express();

//passport config
require("./config/passport")(passport);

app.use(
	cors({ origin: "https://app.socialnostalgia.club", credentials: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//sessions
app.use(
	session({
		secret: process.env.JWT_TOKEN_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 10000 }, // this is the key
		// store: new MongoDBSession({
		// 	uri: process.env.MONGO_URI,
		// 	collection: "sessions",
		// }),
	})
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Wall of Nostalgia API",
	});
});

app.use("/posts", postRoutes);
app.use("/auth/user", userRoutes);
app.use("/auth/client", clientRoutes);
app.use("/playlists", playlistRoutes);
app.use("/mirror", mirrorKeyRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
