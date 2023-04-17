const passport = require('passport');
const User = require('../../../models/user/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			// callbackURL: `${process.env.URL_BE}/auth/google/callback`,
			callbackURL: 'http://localhost:5000/auth/google/callback',
			// passReqToCallback: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if google profile exist.
				if (profile.id) {
					// googleId: profile.id;
					await User.findOne({ email: profile.emails[0].value })
						.then(async (existingUser) => {
							if (existingUser) {
								await User.findOneAndUpdate(
									{ email: profile.emails[0].value },
									{ googleId: profile.id }
								)
									.then((user) => {
										done(null, user);
									})
									.catch((err) => console.log(err));
							} else {
								new User({
									googleId: profile.id,
									email: profile.emails[0].value,
									avatar: profile.photos[0].value,
									name: profile.name.givenName,
								})
									.save()
									.then((user) => done(null, user))
									.catch((err) => console.log(err));
							}
						})
						.catch((err) => console.log(err));
					// console.log(profile);
				}
				// console.log(profile);
			} catch (error) {
				throw new Error(error);
			}
		}
		// (accessToken) => {
		// 	console.log(accessToken);
		// }
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

module.exports = passport;
