const {
	updateAllDetailStocks,
	updateAllListStocks,
	updateAllChartStocks,
	updateAllDescriptionStocks,
	pushNewPriceToStockChart6M,
	pushNewPriceToStockChartMax,
} = require('../services/stocks/index');
const cron = require('node-cron');
const { delay } = require('../utils/promise/delay');

module.exports = async function () {
	console.log('run stock');
	//*/10 9-14 * * 1-5
	cron.schedule('*/15 * * * 1-5', async () => {
		updateAllListStocks();
	});
	//0 2,10,12,14,16 * * 1-5
	cron.schedule('0 2,8,10,11,14,16,18 * * 1-5', async () => {
		updateAllDetailStocks();
	});
	//0 4 * * 1-5
	cron.schedule('0 4,11,16 * * 1-5', async () => {
		updateAllChartStocks();
	});
	cron.schedule('0 16 * * *', async () => {
		updateAllDescriptionStocks();
	});
	//0 9-15 * * 1-5
	cron.schedule('0 9-15 * * 1-5', async () => {
		pushNewPriceToStockChart6M();
	});
	//0 7 * * *
	cron.schedule('0 7 * * *', async () => {
		pushNewPriceToStockChartMax();
	});
};
