const {
	startCrawlCoinListAndChart,
	updateCoinListAndChartTimeframe5Minute,
	updateCoinListAndChartTimeframe1Hour,
	updateCoinListAndChartTimeframe1Day,
} = require('../services/coin/index');
const cron = require('node-cron');
const { delay } = require('../utils/promise/delay');

module.exports = async function () {
	console.log('run coin');
	cron.schedule('0 0 */7 * *', async () => {
		// cron.schedule('0 0 * * *', async () => {
		startCrawlCoinListAndChart();
	});
	cron.schedule('*/5 * * * *', async () => {
		updateCoinListAndChartTimeframe5Minute();
	});
	cron.schedule('0 * * * *', async () => {
		updateCoinListAndChartTimeframe1Hour();
	});
	cron.schedule('0 7 * * *', async () => {
		updateCoinListAndChartTimeframe1Day();
	});
};
