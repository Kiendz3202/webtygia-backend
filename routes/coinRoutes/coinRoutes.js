const {
	paginationPageCoinController,
	detailCoinController,
	coinChartController,
	getCoinTopRank,
	getCoinDescription,
	getUserCoinReference,
	getCoinReference,
	getCoinFollowOffline,
	// userFollowCoins,
	// userUnfollowCoins,
	// updateViewAndScore,
} = require('../../controllers/coin/CoinControllers');
const { verifyToken } = require('../../middlewares/auth/verifyToken');

module.exports = function (app, pathApi) {
	// app.get('/coin/:page', verifyToken, paginationPageCoinController);
	app.get(`${pathApi}/coin/markets`, paginationPageCoinController);
	app.get(`${pathApi}/coin/detail/:nameId`, detailCoinController);
	app.get(`${pathApi}/coin/chart/:nameId`, coinChartController);
	app.get(`${pathApi}/coin/top-rank`, getCoinTopRank);
	app.get(`${pathApi}/coin/description/:nameId`, getCoinDescription);
	app.post(`${pathApi}/coin/user-coin-reference`, getUserCoinReference);
	app.get(`${pathApi}/coin/coin-reference`, getCoinReference);
	app.post(`${pathApi}/coin/coin-follow-offline`, getCoinFollowOffline);
	// app.post(`${pathApi}/follow-coins`, userFollowCoins);
	// app.post(`${pathApi}/unfollow-coins`, userUnfollowCoins);
	// app.post(`${pathApi}/update-score-coins`, updateViewAndScore);
};
