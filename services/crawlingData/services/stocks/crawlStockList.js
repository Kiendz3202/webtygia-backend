const Hnx = require('../../../../models/stock/stockList/hnxModel');
const Hnx30 = require('../../../../models/stock/stockList/hnx30Model');
const Hose = require('../../../../models/stock/stockList/hoseModel');
const Vn30 = require('../../../../models/stock/stockList/vn30Model');
const Upcom = require('../../../../models/stock/stockList/upcomModel');

const StockChart1W = require('../../../../models/stock/chartStock/stockChart1WModel');

const {
	URL_HNX30,
	URL_HNX,
	URL_VN30,
	URL_HOSE,
	URL_UPCOM,
} = require('../../configs/constants/stock');

const {
	pageEvaluateFunc,
} = require('../../helpers/puppeteer/pageEvaluateFunc');
const {
	crawlDataByPuppeteer,
	crawlDataByPuppeteerLazyLoading,
} = require('../../helpers/puppeteer/crawlDataByPuppeteer');
const {
	updateStockList,
	pushNewDataToStockChart,
} = require('../../helpers/updateDataToDb/stocks/updateStockToDb');
const { delay } = require('../../utils/promise/delay');
const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');

const crawlHnx = async () => {
	let data = false;
	let attemps = 0;
	//retry request until it gets data or tries 3 times
	while (data == false && attemps < 2) {
		data = await crawlDataByPuppeteerLazyLoading(URL_HNX, pageEvaluateFunc);
		// console.log(data.length);
		attemps++;

		if (data) {
			for (const stock of data) {
				await updateStockList(stock, Hnx);

				await pushNewDataToStockChart(stock, StockChart1W, 200);
			}
			// await browser.close();
		}

		if (data === false) {
			//wait a few second, also a good idea to swap proxy here
			console.log('Recrawl........' + attemps);
			await delay(3000);
		}
	}
};

const crawlHnx30 = async () => {
	const result = await axios(URL_HNX30)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' hnx30stocklist'
			);
		});

	const $ = cheerio.load(result);

	// let arr = [];

	let stockElements = $('#price-board-container tbody tr');
	//https://www.tabnine.com/code/javascript/functions/cheerio/CheerioElement/find
	for (const stock of stockElements) {
		let dataJson = {};

		dataJson.name = $(stock).find('td').attr('data-tooltip');
		let symbolCrawl = $($(stock).find('span')[0]).text().trim();
		if (symbolCrawl.includes('*')) {
			let len = symbolCrawl?.length;
			if (symbolCrawl.includes('**')) {
				dataJson.symbol = symbolCrawl.slice(0, len - 2);
			} else {
				dataJson.symbol = symbolCrawl.slice(0, len - 1);
			}
		} else {
			dataJson.symbol = symbolCrawl;
		}

		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.reference = $($(stock).find('.cell-body-highlight')[0])
			.text()
			.trim('');
		dataJson.ceil = $($(stock).find('.cell-body-highlight')[1])
			.text()
			.trim('');
		dataJson.floor = $($(stock).find('.cell-body-highlight')[2])
			.text()
			.trim('');

		dataJson.currentPrice = $($(stock).find('.cell-body-highlight')[3])
			.text()
			.trim('');

		dataJson.high = $($(stock).find('.cell-body-highlight')[7])
			.text()
			.trim('');
		dataJson.low = $($(stock).find('.cell-body-highlight')[8])
			.text()
			.trim('');

		dataJson.change = $($(stock).find('.cell-body-highlight')[5])
			.text()
			.trim('');
		dataJson.changePercent = $($(stock).find('.cell-body-highlight')[6])
			.text()
			.trim('');

		const turnOverElement = $($(stock).find('td')[20]);
		dataJson.turnOver = $($(turnOverElement).find('span')[0]).text();

		// arr.push(dataJson);
		await updateStockList(dataJson, Hnx30);

		// await pushNewDataToStockChart(dataJson, StockChart1W);
	}
};

const crawlVn30 = async () => {
	const result = await axios(URL_VN30)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vn30stocklist'
			);
		});

	const $ = cheerio.load(result);

	// let arr = [];

	let stockElements = $('#price-board-container tbody tr');
	//https://www.tabnine.com/code/javascript/functions/cheerio/CheerioElement/find
	for (const stock of stockElements) {
		let dataJson = {};

		dataJson.name = $(stock).find('td').attr('data-tooltip');
		let symbolCrawl = $($(stock).find('span')[0]).text().trim();
		if (symbolCrawl.includes('*')) {
			let len = symbolCrawl?.length;
			if (symbolCrawl.includes('**')) {
				dataJson.symbol = symbolCrawl.slice(0, len - 2);
			} else {
				dataJson.symbol = symbolCrawl.slice(0, len - 1);
			}
		} else {
			dataJson.symbol = symbolCrawl;
		}

		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.reference = $($(stock).find('.cell-body-highlight')[0])
			.text()
			.trim('');
		dataJson.ceil = $($(stock).find('.cell-body-highlight')[1])
			.text()
			.trim('');
		dataJson.floor = $($(stock).find('.cell-body-highlight')[2])
			.text()
			.trim('');

		dataJson.currentPrice = $($(stock).find('.cell-body-highlight')[3])
			.text()
			.trim('');

		dataJson.high = $($(stock).find('.cell-body-highlight')[7])
			.text()
			.trim('');
		dataJson.low = $($(stock).find('.cell-body-highlight')[8])
			.text()
			.trim('');

		dataJson.change = $($(stock).find('.cell-body-highlight')[5])
			.text()
			.trim('');
		dataJson.changePercent = $($(stock).find('.cell-body-highlight')[6])
			.text()
			.trim('');

		const turnOverElement = $($(stock).find('td')[20]);
		dataJson.turnOver = $($(turnOverElement).find('span')[0]).text();

		// arr.push(dataJson);
		await updateStockList(dataJson, Vn30);

		// await pushNewDataToStockChart(dataJson, StockChart1W);
	}
};

const crawlHose = async () => {
	let data = false;
	let attemps = 0;
	//retry request until it gets data or tries 3 times
	while (data == false && attemps < 2) {
		data = await crawlDataByPuppeteerLazyLoading(
			URL_HOSE,
			pageEvaluateFunc
		);
		// console.log(data.length);
		attemps++;

		if (data) {
			for (const stock of data) {
				await updateStockList(stock, Hose);

				await pushNewDataToStockChart(stock, StockChart1W, 200);
			}
			// await browser.close();
		}

		if (data === false) {
			//wait a few second, also a good idea to swap proxy here
			console.log('Recrawl........' + attemps);
			await delay(3000);
		}
	}
};

const crawlUpcom = async () => {
	let data = false;
	let attemps = 0;
	//retry request until it gets data or tries 3 times
	while (data == false && attemps < 2) {
		data = await crawlDataByPuppeteer(URL_UPCOM, pageEvaluateFunc);
		// console.log(data.length);
		attemps++;

		if (data) {
			for (const stock of data) {
				await updateStockList(stock, Upcom);

				await pushNewDataToStockChart(stock, StockChart1W, 200);
			}
			// await browser.close();
		}

		if (data === false) {
			//wait a few second, also a good idea to swap proxy here
			console.log('Recrawl........' + attemps);
			await delay(3000);
		}
	}
};

module.exports = { crawlHnx, crawlHnx30, crawlVn30, crawlHose, crawlUpcom };
