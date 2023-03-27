const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const { delay } = require('../../utils/promise/delay');
const {
	getCoinChartAPI1D,
	getCoinChartAPI90D,
	getCoinChartAPIMax,
} = require('../../configs/constants/coin');

// const CoinChart = require('../../../../models/coin/chartCoin/chartCoinModel');
const CoinChart1D = require('../../../../models/coin/chartCoin/chart1DModel');
const CoinChart90D = require('../../../../models/coin/chartCoin/chart90DModel');
const CoinChartMax = require('../../../../models/coin/chartCoin/chartMaxModel');
const {
	updateCoinChart,
} = require('../../helpers/updateDataToDb/coin/updateCoinToDb');

const crawlCoinChart1D = async (coin) => {
	axios
		.get(getCoinChartAPI1D(coin.nameId))
		.then((response) => {
			// let arrPrice = [];
			// let arrTime = [];

			const data = response.data.prices;
			// dataChart.map((item) => {
			// 	arrTime.push(item[0]);
			// 	arrPrice.push(item[1]);
			// });

			updateCoinChart(coin, data, CoinChart1D);
		})
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					err.message +
					' crawl chart coin 1D'
			);
		});
};

const crawlCoinChart90D = async (coin) => {
	axios
		.get(getCoinChartAPI90D(coin.nameId))
		.then((response) => {
			// let arrPrice = [];
			// let arrTime = [];

			const data = response.data.prices;
			// dataChart.map((item) => {
			// 	arrTime.push(item[0]);
			// 	arrPrice.push(item[1]);
			// });

			updateCoinChart(coin, data, CoinChart90D);
		})
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					err.message +
					' crawl chart coin 90D'
			);
		});
};

const crawlCoinChartMax = async (coin) => {
	axios
		.get(getCoinChartAPIMax(coin.nameId))
		.then((response) => {
			// let arrPrice = [];
			// let arrTime = [];

			const data = response.data.prices;
			// dataChart.map((item) => {
			// 	arrTime.push(item[0]);
			// 	arrPrice.push(item[1]);
			// });

			updateCoinChart(coin, data, CoinChartMax);
		})
		.catch((err) => {
			uploadErrorToDb(
				err.code +
					' ' +
					err.response?.status +
					err.message +
					' crawl chart coin Max'
			);
		});
};
module.exports = { crawlCoinChart1D, crawlCoinChart90D, crawlCoinChartMax };
