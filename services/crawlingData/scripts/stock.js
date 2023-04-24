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
	// chạy cronjob để crawl data(có thể lên trang này test https://crontab.guru/)
	//ví dụ '0 0 */7 * *' là “At 00:00 on every 7th day-of-month.”

	cron.schedule('*/10 9-14 * * 1-5', async () => {
		//cứ mỗi 10p sẽ crawl all list stock để cập nhật giá hiện tại và cho biểu đồ giá
		updateAllListStocks();
	});
	//0 2,10,12,14,16 * * 1-5
	cron.schedule('0 2,8,10,11,14,16,18 * * 1-5', async () => {
		//crawl all detail data của cổ phiếu
		updateAllDetailStocks();
	});
	//0 4 * * 1-5
	cron.schedule('0 4,11,16 * * 1-5', async () => {
		//crawl data chart của all stock
		updateAllChartStocks();
	});
	cron.schedule('0 6 * * 7', async () => {
		//crawl all description, thông tin liên quan, mô tả cho cổ phiếu
		updateAllDescriptionStocks();
	});
	//0 9-15 * * 1-5
	cron.schedule('0 9-15 * * 1-5', async () => {
		//cứ mỗi 60p sẽ crawl all list coin để cập nhật giá hiện tại và cho biểu đồ giá 6month
		pushNewPriceToStockChart6M();
	});
	//0 7 * * *
	cron.schedule('0 7 * * *', async () => {
		//cứ mỗi 1 ngày sẽ crawl all list coin để cập nhật giá hiện tại và cho biểu đồ giá max
		pushNewPriceToStockChartMax();
	});
};
