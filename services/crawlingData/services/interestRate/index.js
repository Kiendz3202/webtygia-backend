const {
	crawlAgribankInterestRate,
	crawlBidvInterestRate,
	crawlMbbankInterestRate,
	crawlScbInterestRate,
	crawlVibInterestRate,
	crawlVietcombankInterestRate,
	crawlVietinbankInterestRate,
	crawlManyBankInterestRate,
} = require('./crawlInterestRate');

const { delay } = require('../../utils/promise/delay');

const interestRateRunAll = async () => {
	crawlVietcombankInterestRate();
	await delay(10000);
	crawlVietinbankInterestRate();
	await delay(10000);
	crawlAgribankInterestRate();
	await delay(10000);
	// crawlBidvInterestRate();
	// await delay(10000);
	crawlScbInterestRate();
	await delay(10000);
	crawlMbbankInterestRate();
	await delay(10000);
	crawlVibInterestRate();
	await delay(10000);
	crawlManyBankInterestRate();
};

module.exports = { interestRateRunAll };
