const { exchangeRateRunAll } = require('../services/exchangeRate/index');
const {
	goldRunAll,
	upsertAllChartSjc,
	updateSjcChart1y,
	updateSjcChartMax,
} = require('../services/gold/index');
const { interestRateRunAll } = require('../services/interestRate/index');
const {
	petrolRunAll,
	upsertAllChartPetrolimex,
	updatePetrolimexChart1y,
	updatePetrolimexChartMax,
} = require('../services/petrol/index');
const {
	foreignCurrencyRunAll,
	UpsertAllChartUsdVietcombank,
	updateUsdVietcombankChart1y,
	updateUsdVietcombankChartMax,
} = require('../services/foreignCurrency/index');
const { delay } = require('../utils/promise/delay');

const cron = require('node-cron');

module.exports = async function () {
	console.log('run exchange');
	cron.schedule('*/30 * * * *', async () => {
		goldRunAll();
		await delay(60000);
		petrolRunAll();
		await delay(40000);
		exchangeRateRunAll();
		await delay(60000);
		foreignCurrencyRunAll();
		await delay(60000);
		interestRateRunAll();
		await delay(80000);
	});

	//chỉ chạy 1 lần duy nhất vì nếu chạy lại thì nó sẽ upsert toàn bộ dữ liệu cũ fix cứng vào
	// cron.schedule('', async () => {
	// UpsertAllChartUsdVietcombank();
	// })

	cron.schedule('0 7 * * *', async () => {
		updateUsdVietcombankChart1y();
	});

	cron.schedule('0 0 1 1,7 *', async () => {
		updateUsdVietcombankChartMax();
	});

	//chỉ chạy 1 lần duy nhất vì nếu chạy lại thì nó sẽ upsert toàn bộ dữ liệu cũ fix cứng vào
	// cron.schedule('', async () => {
	// upsertAllChartSjc();
	// })

	cron.schedule('0 7 * * *', async () => {
		updateSjcChart1y();
	});

	cron.schedule('0 0 1 1,7 *', async () => {
		updateSjcChartMax();
	});

	//chỉ chạy 1 lần duy nhất vì nếu chạy lại thì nó sẽ upsert toàn bộ dữ liệu cũ fix cứng vào
	// cron.schedule('', async () => {
	// upsertAllChartPetrolimex();
	// })

	cron.schedule('0 7 * * *', async () => {
		updatePetrolimexChart1y();
	});

	cron.schedule('0 0 1 1,3,5,7,9,11 *', async () => {
		updatePetrolimexChartMax();
	});
};
