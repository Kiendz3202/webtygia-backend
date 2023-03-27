const {
	getUsdInManyBanks,
	getUsdVietcombankChart,
} = require('../../controllers/foreignCurrency/usdController');

module.exports = function (app, pathApi) {
	//===USD in many banks===
	app.get(`${pathApi}/foreign-currency/usd`, getUsdInManyBanks);
	//=======================
	//===USD vietcombank chart===
	app.get(`${pathApi}/foreign-currency/chart/usd`, getUsdVietcombankChart);
	//=======================
};
