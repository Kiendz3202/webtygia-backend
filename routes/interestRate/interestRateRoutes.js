const {
	agribankInterestRateController,
	bidvInterestRateController,
	mbbankInterestRateController,
	scbInterestRateController,
	vibInterestRateController,
	vietcombankInterestRateController,
	vietinbankInterestRateController,
	manyBanksInterestRateController,
} = require('../../controllers/interestRate/interestRateController');

module.exports = function (app, pathApi) {
	app.get(`${pathApi}/interestRate/agribank`, agribankInterestRateController);
	app.get(`${pathApi}/interestRate/bidv`, bidvInterestRateController);
	app.get(`${pathApi}/interestRate/mbbank`, mbbankInterestRateController);
	app.get(`${pathApi}/interestRate/scb`, scbInterestRateController);
	app.get(`${pathApi}/interestRate/vib`, vibInterestRateController);
	app.get(
		`${pathApi}/interestRate/vietcombank`,
		vietcombankInterestRateController
	);
	app.get(
		`${pathApi}/interestRate/vietinbank`,
		vietinbankInterestRateController
	);
	app.get(
		`${pathApi}/interestRate/manybanks`,
		manyBanksInterestRateController
	);
};
