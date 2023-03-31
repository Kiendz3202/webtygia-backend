const express = require('express');
const createError = require('http-errors');
const axios = require('axios');
const cors = require('cors');
const env = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./configs/database/db');
const bodyParser = require('body-parser');

const app = express();
env.config();
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ origin: '*' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); //sau deploy thì bỏ crosssite đi, dùng samesite

//google auth
const cookieSession = require('cookie-session');
require('./services/AuthThirdParty/google/google');
const passport = require('passport');

const { signAccessToken } = require('./helpers/jwt/jwt_service');
const { isUserAuthenticated } = require('./middlewares/auth/auth');
const successLoginUrl = 'http://localhost:3000/authentication/success';
const errorLoginUrl = 'http://localhost:3000/authentication/error';
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		session: false,
	})
);
app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureMessage: 'Can not login to Google, please try again later!',
		failureRedirect: errorLoginUrl,
		// successRedirect: successLoginUrl
		session: false,
	}),
	async (req, res, next) => {
		// res.send('Sign in successfully');
		if (!req.user) {
			return res.status(401).json({
				message: 'User was not authenticated',
			});
		}
		const { email, googleId } = req.user;
		const user = await User.findOne({ email }); //googleId
		const token = await signAccessToken(user._id);

		// return res.status(200).json({ token, user });
		res.redirect(
			`http://localhost:3000/authentication/success?email=${user.email}&name=${user.name}&avatar=${user.avatar}&token=${token}`
		);
	}
);
app.get('auth/user', isUserAuthenticated, (req, res) => {
	res.json(req.user);
});
app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000,
		keys: ['cookiekey'],
		httpOnly: false,
		sameSite: 'none',
	})
);
app.use(passport.initialize());
app.use(passport.session());

//=========Run script=============
require('./services/crawlingData/scripts/coin')();
require('./services/crawlingData/scripts/GoldPetrolExchangerateInterestRate')();
require('./services/crawlingData/scripts/stock')();
// const {
// 	crawlCoinDescriptionTranslateToVN,
// } = require('./services/crawlingData/services/coin/crawlCoinDescription');
// crawlCoinDescriptionTranslateToVN({ nameId: 'compound-governance-token' });
// crawlCoinDescriptionTranslateToVN({ nameId: 'nervos-network' });
// crawlCoinDescriptionTranslateToVN({ nameId: 'ssv-network' });
// const {
// 	crawlSjcChart,
// 	crawlSjc,
// } = require('./services/crawlingData/services/gold/crawlGold');
// const {
// 	upsertAllChartSjc,
// 	updateSjcChart1y,
// 	updateSjcChartMax,
// } = require('./services/crawlingData/services/gold/index');
// crawlSjcChart();
// // crawlSjc();
// // updateSjcChartMax();
// const {
// 	crawlPetrolimex,
// 	crawlPetrolimexChart,
// } = require('./services/crawlingData/services/petrol/crawlPetrolimex');
// crawlPetrolimexChart();
// // crawlPetrolimex();
// const {
// 	updatePetrolimexChart1y,
// 	updatePetrolimexChartMax,
// } = require('./services/crawlingData/services/petrol/index');
// // updatePetrolimexChart1y();

//listen price change  and notificate user
// require('./services/notification/scripts/listenAndSendNotification')();
//=====================

//====Send notification to react native app by expo===
require('./services/notification/sendNotificationByExpo/sendNotificationByExpo');
//====================================================

//================Routes====================
// const pathApi = '/api/v1';
// require('./routes/authRoutes/authRoutes')(app, process.env.pathApi);
require('./routes/coinRoutes/coinRoutes')(app, process.env.pathApi);
require('./routes/exchangeRate/priceExchangeRateRoutes')(
	app,
	process.env.pathApi
);
require('./routes/goldRoutes/goldRoutes')(app, process.env.pathApi);
require('./routes/interestRate/interestRateRoutes')(app, process.env.pathApi);
require('./routes/petrol/petrolimexRoutes')(app, process.env.pathApi);
require('./routes/stockRoutes/stockRoutes')(app, process.env.pathApi);
require('./routes/foreignCurrencyRoutes/foreignCurrencyRoutes')(
	app,
	process.env.pathApi
);
require('./routes/news/newsRoutes')(app, process.env.pathApi);
require('./routes/user/userRoutes')(app, process.env.pathApi);
require('./routes/searchRoutes/searchRoutes')(app, process.env.pathApi);

const news_route = require('./routes/admin/adminRoutes');
app.use(`${process.env.pathApi}`, news_route);

const auth_route = require('./routes/authRoutes/authRoutes');
const User = require('./models/user/userModel');
app.use(`${process.env.pathApi}`, auth_route);
//===========================================

//============Handle Error=================
app.get('/', (_req, res) => {
	res.send('Success!');
});

app.use((req, res, next) => {
	next(createError.NotFound('this route doesnt exist'));
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({
		status: 'fail',
		code: status,
		message: err.message,
	});
});
//===========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('connect successfully');
});
