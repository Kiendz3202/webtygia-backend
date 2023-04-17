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
const successLoginUrl = `${process.env.URL_FE}/authentication/success`;
const errorLoginUrl = `${process.env.URL_FE}/authentication/error`;
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
			// `${process.env.URL_FE}/authentication/success?email=${user.email}&name=${user.name}&avatar=${user.avatar}&token=${token}&role=${user.role}`
			`http://localhost:3000/authentication/success?email=${user.email}&name=${user.name}&avatar=${user.avatar}&token=${token}&role=${user.role}`
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

// Crawling data
// require('./services/crawlingData/scripts/coin')();
// require('./services/crawlingData/scripts/GoldPetrolExchangerateInterestRate')();
// require('./services/crawlingData/scripts/stock')();

// Update point for userinterest
// require('./services/rankingUserInterest/script/index')();

// =======test==========
const {
	foreignCurrencyRunAll,
	UpsertAllChartUsdVietcombank,
} = require('./services/crawlingData/services/foreignCurrency/index');
// foreignCurrencyRunAll();
// UpsertAllChartUsdVietcombank();
const {
	upsertAllChartSjc,
	updateSjcChart1y,
} = require('./services/crawlingData/services/gold/index');
// upsertAllChartSjc();
// updateSjcChart1y();
const {
	upsertAllChartPetrolimex,
} = require('./services/crawlingData/services/petrol/index');
// upsertAllChartPetrolimex();
const {
	translateByGoogleApi,
} = require('./utils/translate/translateByGoogleAPI');
const content =
	'Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency. It was created by an anonymous individual/group under the name, Satoshi Nakamoto. The source code is available publicly as an open source project, anybody can look at it and be part of the developmental process.\r\n\r\nBitcoin is changing the way we see money as we speak. The idea was to produce a means of exchange, independent of any central authority, that could be transferred electronically in a secure, verifiable and immutable way. It is a decentralized peer-to-peer internet currency making mobile payment easy, very low transaction fees, protects your identity, and it works anywhere all the time with no central authority and banks.\r\n\r\nBitcoin is designed to have only 21 million BTC ever created, thus making it a deflationary currency. Bitcoin uses the <a href="https://www.coingecko.com/en?hashing_algorithm=SHA-256">SHA-256</a> hashing algorithm with an average transaction confirmation time of 10 minutes. Miners today are mining Bitcoin using ASIC chip dedicated to only mining Bitcoin, and the hash rate has shot up to peta hashes.\r\n\r\nBeing the first successful online cryptography currency, Bitcoin has inspired other alternative currencies such as <a href="https://www.coingecko.com/en/coins/litecoin">Litecoin</a>, <a href="https://www.coingecko.com/en/coins/peercoin">Peercoin</a>, <a href="https://www.coingecko.com/en/coins/primecoin">Primecoin</a>, and so on.\r\n\r\nThe cryptocurrency then took off with the innovation of the turing-complete smart contract by <a href="https://www.coingecko.com/en/coins/ethereum">Ethereum</a> which led to the development of other amazing projects such as <a href="https://www.coingecko.com/en/coins/eos">EOS</a>, <a href="https://www.coingecko.com/en/coins/tron">Tron</a>, and even crypto-collectibles such as <a href="https://www.coingecko.com/buzz/ethereum-still-king-dapps-cryptokitties-need-1-billion-on-eos">CryptoKitties</a>.';
const CoinDescription = require('./models/coin/coinDescriptionModel');
const testFunc = async () => {
	const allDes = await CoinDescription.find().limit(5);
	for (let i = 0; i < allDes.length; i++) {
		const res = await translateByGoogleApi('en', 'vi', content);
		allDes[i].description = res;
	}

	for (let i = 0; i < allDes.length; i++) {
		await CoinDescription.findOneAndUpdate(
			{ nameId: allDes[i].nameId },
			{ description: allDes[i].description }
		);
	}
	console.log('done');
};
// testFunc();
const {
	crawlCoinDescription,
} = require('./services/crawlingData/services/coin/crawlCoinDescription');
// crawlCoinDescription({ nameId: 'bitcoin' });
const {
	startCrawlCoinListAndChart,
} = require('./services/crawlingData/services/coin/index');
startCrawlCoinListAndChart();
const {
	updatePetrolimexChart1y,
} = require('./services/crawlingData/services/petrol/index');
// updatePetrolimexChart1y();
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
// crawlSjc();
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

//=====listen price change  and notificate user=======
require('./services/notification/scripts/listenAndSendNotification')();
//=====================

//====Send notification to react native app by expo===
// require('./services/notification/scripts/listenAndSendNotification')();
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
const { delay } = require('./services/crawlingData/utils/promise/delay');
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
