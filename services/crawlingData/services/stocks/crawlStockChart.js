const Hnx = require('../../../../models/stock/stockList/hnxModel');
const Hnx30 = require('../../../../models/stock/stockList/hnx30Model');
const Hose = require('../../../../models/stock/stockList/hoseModel');
const Vn30 = require('../../../../models/stock/stockList/vn30Model');
const Upcom = require('../../../../models/stock/stockList/upcomModel');

const StockChart1W = require('../../../../models/stock/chartStock/stockChart1WModel');
const StockChart6M = require('../../../../models/stock/chartStock/stockChart6MModel');
const StockChartMax = require('../../../../models/stock/chartStock/stockChartMaxModel');
// const Hnx30Chart = require('../../../../models/stock/chartStock/hnx30ChartModel');
// const HoseChart = require('../../../../models/stock/chartStock/hoseChartModel');
// const Vn30Chart = require('../../../../models/stock/chartStock/vn30ChartModel');
// const UpcomChart = require('../../../../models/stock/chartStock/upcomChartModel');

const {
	updateStockChart,
} = require('../../helpers/updateDataToDb/stocks/updateStockToDb');
const {
	getStockChartAPI1W,
	getStockChartAPI6M,
	getStockChartAPIMax,
} = require('../../configs/constants/stock');
const { delay } = require('../../utils/promise/delay');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const axios = require('axios');

const crawlChartHnx = async () => {
	const hnxStocks = await Hnx.find({});
	const ONE_WEEK = 3600 * 24 * 7;
	const SIX_MONTH = 3600 * 24 * 180;
	const MAX = 1450000000;

	for (const stock of hnxStocks) {
		let currentTime = Math.floor(Date.now() / 1000);
		axios
			.get(
				getStockChartAPI1W(
					stock.symbol,
					currentTime - ONE_WEEK,
					currentTime
				)
			)
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChart1W);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChart1W ' +
						stock.symbol
				);
			});
		await delay(4000);
		axios
			.get(
				getStockChartAPI6M(
					stock.symbol,
					currentTime - SIX_MONTH,
					currentTime
				)
			)
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChart6M);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChart6M ' +
						stock.symbol
				);
			});
		await delay(4000);
		axios
			.get(getStockChartAPIMax(stock.symbol, MAX, currentTime))
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChartMax);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChartMax ' +
						stock.symbol
				);
			});
		await delay(4000);
	}
};

// const crawlChartHnx30 = async () => {
// 	const hnx30Stocks = await Hnx30.find({});
// 	let currentTime = Math.floor(Date.now() / 1000);
// 	const ONE_WEEK = 3600 * 24 * 7;
// 	const SIX_MONTH = 3600 * 24 * 180;
// 	const MAX = 1450000000;

// 	for (const stock of hnx30Stocks) {
// 		axios
// 			.get(
// 				getStockChartAPI1W(
// 					stock.symbol,
// 					currentTime - ONE_WEEK,
// 					currentTime
// 				)
// 			)
// 			.then((response) => {
// 				const data = response.data;
// 				if (data) {
// 					updateStockChart(stock, data, StockChart1W);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' stockChart1W ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(4000);
// 		axios
// 			.get(
// 				getStockChartAPI6M(
// 					stock.symbol,
// 					currentTime - SIX_MONTH,
// 					currentTime
// 				)
// 			)
// 			.then((response) => {
// 				const data = response.data;
// 				if (data) {
// 					updateStockChart(stock, data, StockChart6M);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' stockChart6M ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(4000);
// 		axios
// 			.get(getStockChartAPIMax(stock.symbol, MAX, currentTime))
// 			.then((response) => {
// 				const data = response.data;
// 				if (data) {
// 					updateStockChart(stock, data, StockChartMax);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' stockChartMax ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(4000);
// 	}
// };

// const crawlChartVn30 = async () => {
// 	const vn30Stocks = await Vn30.find({});
// 	let currentTime = Math.floor(Date.now() / 1000);
// 	const ONE_WEEK = 3600 * 24 * 7;
// 	const SIX_MONTH = 3600 * 24 * 180;
// 	const MAX = 1450000000;

// 	for (const stock of vn30Stocks) {
// 		axios
// 			.get(
// 				getStockChartAPI1W(
// 					stock.symbol,
// 					currentTime - ONE_WEEK,
// 					currentTime
// 				)
// 			)
// 			.then((response) => {
// 				const data = response.data;
// 				if (data) {
// 					updateStockChart(stock, data, StockChart1W);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' stockChart1W ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(4000);
// 		axios
// 			.get(
// 				getStockChartAPI6M(
// 					stock.symbol,
// 					currentTime - SIX_MONTH,
// 					currentTime
// 				)
// 			)
// 			.then((response) => {
// 				const data = response.data;
// 				if (data) {
// 					updateStockChart(stock, data, StockChart6M);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' stockChart6M ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(4000);
// 		axios
// 			.get(getStockChartAPIMax(stock.symbol, MAX, currentTime))
// 			.then((response) => {
// 				const data = response.data;
// 				if (data) {
// 					updateStockChart(stock, data, StockChartMax);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' stockChartMax ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(4000);
// 	}
// };

const crawlChartHose = async () => {
	const hoseStocks = await Hose.find({});
	const ONE_WEEK = 3600 * 24 * 7;
	const SIX_MONTH = 3600 * 24 * 180;
	const MAX = 1450000000;

	for (const stock of hoseStocks) {
		let currentTime = Math.floor(Date.now() / 1000);
		axios
			.get(
				getStockChartAPI1W(
					stock.symbol,
					currentTime - ONE_WEEK,
					currentTime
				)
			)
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChart1W);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChart1W ' +
						stock.symbol
				);
			});
		await delay(4000);
		axios
			.get(
				getStockChartAPI6M(
					stock.symbol,
					currentTime - SIX_MONTH,
					currentTime
				)
			)
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChart6M);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChart6M ' +
						stock.symbol
				);
			});
		await delay(4000);
		axios
			.get(getStockChartAPIMax(stock.symbol, MAX, currentTime))
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChartMax);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChartMax ' +
						stock.symbol
				);
			});
		await delay(4000);
	}
};

const crawlChartUpcom = async () => {
	const upcomStocks = await Upcom.find({});
	const ONE_WEEK = 3600 * 24 * 7;
	const SIX_MONTH = 3600 * 24 * 180;
	const MAX = 1450000000;

	for (const stock of upcomStocks) {
		let currentTime = Math.floor(Date.now() / 1000);
		axios
			.get(
				getStockChartAPI1W(
					stock.symbol,
					currentTime - ONE_WEEK,
					currentTime
				)
			)
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChart1W);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChart1W ' +
						stock.symbol
				);
			});
		await delay(4000);
		axios
			.get(
				getStockChartAPI6M(
					stock.symbol,
					currentTime - SIX_MONTH,
					currentTime
				)
			)
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChart6M);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChart6M ' +
						stock.symbol
				);
			});
		await delay(4000);
		axios
			.get(getStockChartAPIMax(stock.symbol, MAX, currentTime))
			.then((response) => {
				const data = response.data;
				if (data) {
					updateStockChart(stock, data, StockChartMax);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' stockChartMax ' +
						stock.symbol
				);
			});
		await delay(4000);
	}
};

module.exports = {
	crawlChartHnx,
	// crawlChartHnx30,
	crawlChartHose,
	crawlChartUpcom,
	// crawlChartVn30,
};
