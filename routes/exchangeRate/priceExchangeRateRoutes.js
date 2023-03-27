const {
	agribankController,
	bidvController,
	mbbankController,
	techcombankController,
	vietcombankController,
	vietinbankController,
	getExchangeUsdToVnd,
} = require('../../controllers/exchangeRate/exchangeRateController');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/exchangeRate/agribank`, agribankController);
	app.get(`${pathApi}/exchangeRate/bidv`, bidvController);
	app.get(`${pathApi}/exchangeRate/mbbank`, mbbankController);
	app.get(`${pathApi}/exchangeRate/techcombank`, techcombankController);
	app.get(`${pathApi}/exchangeRate/vietcombank`, vietcombankController);
	app.get(`${pathApi}/exchangeRate/vietinbank`, vietinbankController);
	app.get(`${pathApi}/exchangeRate/usd-to-vnd`, getExchangeUsdToVnd);
};
