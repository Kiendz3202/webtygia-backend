const { delay } = require('../../utils/promise/delay');
const {
	crawlHnx,
	crawlHose,
	crawlUpcom,
	crawlHnx30,
	crawlVn30,
} = require('./crawlStockList');
const {
	crawlDetailHnx,
	// crawlDetailHnx30,
	crawlDetailHose,
	// crawlDetailVn30,
	crawlDetailUpcom,
} = require('./crawlStockDetail');
const {
	crawlChartHnx,
	// crawlChartHnx30,
	crawlChartHose,
	crawlChartUpcom,
	// crawlChartVn30,
} = require('./crawlStockChart');
const { crawlStockDescription } = require('./crawlStockDescription');
const Hnx = require('../../../../models/stock/stockList/hnxModel');
const Hnx30 = require('../../../../models/stock/stockList/hnx30Model');
const Hose = require('../../../../models/stock/stockList/hoseModel');
const Vn30 = require('../../../../models/stock/stockList/vn30Model');
const Upcom = require('../../../../models/stock/stockList/upcomModel');

const StockChart1W = require('../../../../models/stock/chartStock/stockChart1WModel');
const StockChart6M = require('../../../../models/stock/chartStock/stockChart6MModel');
const StockChartMax = require('../../../../models/stock/chartStock/stockChartMaxModel');

const {
	pushNewDataToStockChart,
} = require('../../helpers/updateDataToDb/stocks/updateStockToDb');

const updateAllListStocks = async () => {
	crawlHnx30();
	// await delay(10000);
	crawlVn30();
	// await delay(10000);
	crawlHnx();
	// await delay(300000);
	crawlHose();
	// const hnxLength = await Hnx.find().count();
	// const hnx30Length = await Hnx30.find().count();
	// const vn30Length = await Vn30.find().count();
	// const hoseLength = await Hose.find().count();
};

const updateAllDetailStocks = async () => {
	//----Length of collection to caculate time delay each crawlingFunction executes
	const hnxLength = await Hnx.find().count();
	// const hnx30Length = await Hnx30.find().count();
	// const vn30Length = await Vn30.find().count();
	const hoseLength = await Hose.find().count();
	// const upcomLength = await Upcom.find().count();

	//---crawl detail information in particularly stock and update price to array in database to draw chart
	console.log('start crawl detail stocks');

	// if (hnx30Length !== 0) {
	// 	crawlDetailHnx30();
	// 	await delay(hnx30Length * 3500);
	// }

	// if (vn30Length !== 0) {
	// 	crawlDetailVn30();
	// 	await delay(vn30Length * 3500);
	// }

	if (hnxLength !== 0) {
		crawlDetailHnx();
		await delay(hnxLength * 3500);
	}

	if (hoseLength !== 0) {
		crawlDetailHose();
		await delay(hoseLength * 3500);
	}

	// if (upcomLength !== 0) {
	// 	crawlDetailUpcom();
	// 	await delay(upcomLength * 3500);
	// }

	console.log('end crawl detail stocks');
};

const updateAllChartStocks = async () => {
	//----Length of collection to caculate time delay each crawlingFunction executes
	const hnxLength = await Hnx.find().count();
	// const hnx30Length = await Hnx30.find().count();
	// const vn30Length = await Vn30.find().count();
	const hoseLength = await Hose.find().count();
	// const upcomLength = await Upcom.find().count();

	// if (hnx30Length !== 0) {
	// 	crawlChartHnx30();
	// 	await delay(hnx30Length * 12000);
	// }

	// if (vn30Length !== 0) {
	// 	crawlChartVn30();
	// 	await delay(vn30Length * 12000);
	// }

	if (hnxLength !== 0) {
		crawlChartHnx();
		await delay(hnxLength * 12000);
	}

	if (hoseLength !== 0) {
		crawlChartHose();
		await delay(hoseLength * 12000);
	}

	// if (upcomLength !== 0) {
	// 	crawlChartUpcom();
	// 	await delay(upcomLength * 12000);
	// }
};

const updateAllDescriptionStocks = async () => {
	//----Length of collection to caculate time delay each crawlingFunction executes
	const hnx = await Hnx.find({}, { symbol: 1 });
	// const hnx30 = await Hnx30.find({}, { symbol: 1 });
	// const vn30 = await Vn30.find({}, { symbol: 1 });
	const hose = await Hose.find({}, { symbol: 1 });
	// const upcom = await Upcom.find({},{symbol:1});

	for (const stock of hnx) {
		crawlStockDescription(stock.symbol);
		await delay(2000);
	}
	// for (const stock of hnx30) {
	// 	crawlStockDescription(stock.symbol);
	// 	await delay(2000);
	// }
	for (const stock of hose) {
		crawlStockDescription(stock.symbol);
		await delay(2000);
	}
	// for (const stock of vn30) {
	// 	crawlStockDescription(stock.symbol);
	// 	await delay(2000);
	// }
	// for(const stock of upcom ){
	// 	crawlStockDescription(stock.symbol)
	// 	await delay(2000)
	// }
};

const pushNewPriceToStockChart6M = async () => {
	let currentTime = Math.floor(Date.now() / 1000);
	await delay(120000);
	const hnx = await Hnx.find(
		{},
		{ symbol: 1, currentPrice: 1, timeUpdate: 1, reference: 1 }
	);
	for (const stock of hnx) {
		stock.timeUpdate = currentTime;
		await pushNewDataToStockChart(stock, StockChart6M, 4000);
	}
	await delay(300000);
	const hose = await Hose.find(
		{},
		{ symbol: 1, currentPrice: 1, timeUpdate: 1, reference: 1 }
	);
	for (const stock of hose) {
		stock.timeUpdate = currentTime;
		await pushNewDataToStockChart(stock, StockChart6M, 4000);
	}

	// const upcom = await Upcom.find({},{symbol: 1, currentPrice: 1,timeUpdate:1,reference:1});

	// for (const stock of upcom) {
	// 	await pushNewDataToStockChart(stock, StockChart6M);
	// }
};

const pushNewPriceToStockChartMax = async () => {
	let currentTime = Math.floor(Date.now() / 1000);
	const hnx = await Hnx.find(
		{},
		{ symbol: 1, currentPrice: 1, timeUpdate: 1, reference: 1 }
	);
	for (const stock of hnx) {
		stock.timeUpdate = currentTime;
		await pushNewDataToStockChart(stock, StockChartMax, 4000);
	}
	// await delay(300000);
	const hose = await Hose.find(
		{},
		{ symbol: 1, currentPrice: 1, timeUpdate: 1, reference: 1 }
	);
	for (const stock of hose) {
		stock.timeUpdate = currentTime;
		await pushNewDataToStockChart(stock, StockChartMax, 4000);
	}

	// const upcom = await Upcom.find({},{symbol: 1, currentPrice: 1,timeUpdate:1,reference:1});

	// for (const stock of upcom) {
	// 	await pushNewDataToStockChart(stock, StockChart6M);
	// }
};
module.exports = {
	updateAllDetailStocks,
	updateAllListStocks,
	updateAllChartStocks,
	updateAllDescriptionStocks,
	pushNewPriceToStockChart6M,
	pushNewPriceToStockChartMax,
};
