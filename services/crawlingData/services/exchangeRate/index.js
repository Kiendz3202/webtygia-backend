const {
	crawlAgribank,
	crawlBidv,
	crawlMbbank,
	crawlTechcombank,
	crawlVietcombank,
	crawlVietinbank,
} = require('./crawlExchangeRate');
const { delay } = require('../../utils/promise/delay');

const exchangeRateRunAll = async () => {
	crawlAgribank();
	await delay(10000);
	crawlVietcombank();
	await delay(10000);
	crawlBidv();
	await delay(10000);
	crawlTechcombank();
	await delay(10000);
	crawlVietinbank();
	await delay(10000);
	crawlMbbank();
	await delay(10000);
};

module.exports = { exchangeRateRunAll };
