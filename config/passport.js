const SpotifyStrategy = require("passport-spotify").Strategy;
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Playlist = require("../models/playlistModel");
const axios = require("axios");

module.exports = function (passport) {
	passport.use(
		new SpotifyStrategy(
			{
				clientID: process.env.SPOTIFY_CLIENT_ID,
				clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
				callbackURL: "/auth/user/spotify/callback",
			},
			async (accessToken, refreshToken, expires_in, profile, done) => {
				const newUser = {
					spotifyId: profile.id,
					username: profile.username,
					email: profile.emails[0].value,
					displayName: profile.displayName,
					profileUrl: profile.profileUrl,
					image: profile.photos[0].value,
					followers: profile.followers,
					country: profile.country,
					spotify_refreshToken: refreshToken,
				};

				try {
					let user = await User.findOne({ spotifyId: profile.id });
					// add an update method for new created playlists..
					// check by response length

					if (user) {
						let playlist = await Playlist.findOne({ user: user.id });

						if (playlist) {
							done(null, user);
						} else {
							let playlists = [];
							await axios
								.get("https://api.spotify.com/v1/me/playlists", {
									headers: {
										Authorization: "Bearer " + accessToken,
									},
								})
								.then((res) => {
									playlists.push({
										user: user.id,
										playlist_id: res.data.items[0].id,
										name: res.data.items[0].name,
										description: res.data.items[0].description,
										uri: res.data.items[0].external_urls.spotify,
										image: res.data.items[0].images[0].url,
										owner: res.data.items[0].owner.display_name,
									});
								});
							await Playlist.create(playlists);
							done(null, user);
						}
					} else {
						user = await User.create(newUser);
						let playlists = [];
						await axios
							.get("https://api.spotify.com/v1/me/playlists", {
								headers: {
									Authorization: "Bearer " + accessToken,
								},
							})
							.then((res) => {
								playlists.push({
									user: user.id,
									playlist_id: res.data.items[0].id,
									name: res.data.items[0].name,
									description: res.data.items[0].description,
									uri: res.data.items[0].external_urls.spotify,
									image: res.data.items[0].images[0].url,
									owner: res.data.items[0].owner.display_name,
								});
							});
						await Playlist.create(playlists);
						done(null, user);
					}
				} catch (err) {
					console.error(err);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user));
	});
};
