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
	// chạy cronjob để crawl data(có thể lên trang này test https://crontab.guru/)
	//ví dụ '0 0 */7 * *' là “At 00:00 on every 7th day-of-month.”

	// cron.schedule('0 0 */7 * *', async () => {
	//cữ mỗi 1 tuần sẽ chạy 1 lần để cập nhật xem 800 coin mới nhất, nhưng coin cũ nào mà out top 800 sẽ bị xoá và cập nhật những
	//coin mới
	startCrawlCoinListAndChart();
	// });
	cron.schedule('*/5 * * * *', async () => {
		//cứ mỗi 5p sẽ crawl all list coin để cập nhật giá hiện tại và cho biểu đồ giá(CoinChart1D)
		updateCoinListAndChartTimeframe5Minute();
	});
	cron.schedule('0 * * * *', async () => {
		//cứ mỗi 5p sẽ crawl all list coin để cập nhật giá hiện tại và cho biểu đồ giá(CoinChart90D)
		updateCoinListAndChartTimeframe1Hour();
	});
	cron.schedule('0 7 * * *', async () => {
		//cứ mỗi 5p sẽ crawl all list coin để cập nhật giá hiện tại và cho biểu đồ giá(CoinChartMax)
		updateCoinListAndChartTimeframe1Day();
	});
};
