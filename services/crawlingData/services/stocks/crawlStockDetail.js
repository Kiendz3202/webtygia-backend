const Hnx = require('../../../../models/stock/stockList/hnxModel');
const Hnx30 = require('../../../../models/stock/stockList/hnx30Model');
const Hose = require('../../../../models/stock/stockList/hoseModel');
const Vn30 = require('../../../../models/stock/stockList/vn30Model');
const Upcom = require('../../../../models/stock/stockList/upcomModel');

// const HnxDetail = require('../../../../models/stock/stockDetail/hnxDetailModel');
// const Hnx30Detail = require('../../../../models/stock/stockDetail/hnx30DetailModel');
// const HoseDetail = require('../../../../models/stock/stockDetail/hoseDetailModel');
// const Vn30Detail = require('../../../../models/stock/stockDetail/vn30DetailModel');
// const UpcomDetail = require('../../../../models/stock/stockDetail/upcomDetailModel');
const StockDetail = require('../../../../models/stock/stockDetail/stockDetailModel');

const {
	updateStockDetail,
} = require('../../helpers/updateDataToDb/stocks/updateStockToDb');
const { getStockDetailAPI } = require('../../configs/constants/stock');
const { delay } = require('../../utils/promise/delay');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const axios = require('axios');

const getDataJson = (stock, ratios) => {
	let dataJson = {};

	dataJson.name = stock.name;
	dataJson.symbol = stock.symbol;
	dataJson.timeUpdate = Math.floor(Date.now() / 1000);
	dataJson.reference = stock.reference;
	dataJson.ceil = stock.ceil;
	dataJson.floor = stock.floor;
	dataJson.currentPrice = stock.currentPrice || stock.reference; //sửa thành crawl từ trang detail chứ kp lấy như thế này, mà trang all stock cũng ko cần currentprice, muốn xem thì vào trang details
	dataJson.high = stock.high;
	dataJson.low = stock.low;
	dataJson.change = stock.change;
	dataJson.changePercent = stock.changePercent;
	dataJson.turnOver = stock.turnOver;
	dataJson.marketcap = ratios.marketCapital?.toString();
	dataJson.openPrice = ratios.firstPrice?.toString();

	dataJson.priceChange52Week = ratios.priceChange52Week;
	dataJson.averageVolume10Day = ratios.averageVolume10Day?.toString();
	dataJson.percentPriceChange1Week =
		ratios.percentPriceChange1Week?.toString();
	dataJson.percentPriceChange1Month =
		ratios.percentPriceChange1Month?.toString();
	dataJson.percentPriceChange3Month =
		ratios.percentPriceChange3Month?.toString();
	dataJson.percentPriceChange6Month =
		ratios.percentPriceChange6Month?.toString();
	dataJson.percentPriceChange1Year =
		ratios.percentPriceChange1Year?.toString();
	dataJson.priceChange1Week = ratios.priceChange1Week?.toString();
	dataJson.priceChange1Month = ratios.priceChange1Month?.toString();
	dataJson.priceChange3Month = ratios.priceChange3Month?.toString();
	dataJson.priceChange6Month = ratios.priceChange6Month?.toString();
	dataJson.priceChange1Year = ratios.priceChange1Year?.toString();
	dataJson.high52Week = ratios.highestPrice52Week?.toString();
	dataJson.low52Week = ratios.lowestPrice52Week?.toString();
	dataJson.outstandingShare = ratios.outstandingShare?.toString();
	dataJson.freeFloat = ratios.freeFloat?.toString();
	dataJson.pe = ratios.pe?.toString();
	dataJson.dilutionPE = ratios.dilutionPE?.toString();
	dataJson.pb = ratios.pb?.toString();
	dataJson.eps = ratios.eps?.toString();
	dataJson.dilutionEPS = ratios.dilutionEPS?.toString();
	dataJson.bookValue = ratios.bookValue?.toString();
	dataJson.lastInterest = ratios.lastInterest?.toString();
	dataJson.roe = ratios.roe?.toString();

	return dataJson;
};

const crawlDetailHnx = async () => {
	hnxAll = await Hnx.find({});

	for (const stock of hnxAll) {
		axios(getStockDetailAPI(stock.symbol))
			.then((res) => {
				const ratios = res.data;

				if (ratios) {
					const dataJson = getDataJson(stock, ratios);

					updateStockDetail(dataJson, StockDetail);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' hnxdetail ' +
						stock.symbol
				);
			});
		await delay(2000);
	}
};

// const crawlDetailHnx30 = async () => {
// 	hnx30All = await Hnx30.find({});

// 	for (const stock of hnx30All) {
// 		axios(getStockDetailAPI(stock.symbol))
// 			.then((res) => {
// 				const ratios = res.data;

// 				if (ratios) {
// 					const dataJson = getDataJson(stock, ratios);

// 					updateStockDetail(dataJson, Hnx30Detail);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' hnx30detail ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(2000);
// 	}
// };

const crawlDetailHose = async () => {
	hoseAll = await Hose.find({});

	for (const stock of hoseAll) {
		axios(getStockDetailAPI(stock.symbol))
			.then((res) => {
				const ratios = res.data;

				if (ratios) {
					const dataJson = getDataJson(stock, ratios);

					updateStockDetail(dataJson, StockDetail);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' hosedetail ' +
						stock.symbol
				);
			});
		await delay(2000);
	}
};

// const crawlDetailVn30 = async () => {
// 	vn30All = await Vn30.find({});

// 	for (const stock of vn30All) {
// 		axios(getStockDetailAPI(stock.symbol))
// 			.then((res) => {
// 				const ratios = res.data;

// 				if (ratios) {
// 					const dataJson = getDataJson(stock, ratios);

// 					updateStockDetail(dataJson, Vn30Detail);
// 				}
// 			})
// 			.catch((err) => {
// 				uploadErrorToDb(
// 					err.code +
// 						' ' +
// 						err.response?.status +
// 						' vn30detail ' +
// 						stock.symbol
// 				);
// 			});
// 		await delay(2000);
// 	}
// };

const crawlDetailUpcom = async () => {
	upcomAll = await Upcom.find({});

	for (const stock of upcomAll) {
		const ratios = await axios(getStockDetailAPI(stock.symbol))
			.then((res) => {
				const ratios = res.data;

				if (ratios) {
					const dataJson = getDataJson(stock, ratios);

					updateStockDetail(dataJson, StockDetail);
				}
			})
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' upcomDetail ' +
						stock.symbol
				);
			});
		await delay(2000);
	}
};

module.exports = {
	crawlDetailHnx,
	// crawlDetailHnx30,
	crawlDetailHose,
	// crawlDetailVn30,
	crawlDetailUpcom,
};
