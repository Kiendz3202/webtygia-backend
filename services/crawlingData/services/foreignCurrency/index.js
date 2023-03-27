const {
	crawlForeignCurrency,
	crawlUsdVietcombankChart,
} = require('./crawlForeignCurrency');
const { delay } = require('../../utils/promise/delay');
const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const UsdVietombankChart = require('../../../../models/foreignCurrency/usdVietcombankChart');

const {
	URL_USD_FOREIGN_CURRENCY,
} = require('../../configs/constants/foreignCurrecy');
const {
	URL_EXCHANGE_RATE_VIETCOMBANK,
} = require('../../configs/constants/exchangeRate');

const foreignCurrencyRunAll = async () => {
	crawlForeignCurrency(URL_USD_FOREIGN_CURRENCY);
};

const UpsertAllChartUsdVietcombank = async () => {
	crawlUsdVietcombankChart();
};

const updateUsdVietcombankChart1y = async () => {
	// const crawlVietcombank = async () => {
	const result = await axios(URL_EXCHANGE_RATE_VIETCOMBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Vietcombank exchange'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam';
		dataJson.symbol = 'Vietcombank';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.usdBuyCast = $('#myTable tbody :nth-child(1) :nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.usdBuyTransfer = $(
			'#myTable tbody :nth-child(1) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.usdSell = $('#myTable tbody :nth-child(1) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	UsdVietombankChart.findOneAndUpdate(
		{ name: '1y' },
		{
			symbol: dataJson?.symbol,
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -365,
				},
				price: {
					$each: [dataJson?.usdSell],
					$slice: -365,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code +
				' ' +
				err.response?.status +
				' update usdvietcombankchart1year'
		)
	);
	// };
};

const updateUsdVietcombankChartMax = async () => {
	// const crawlVietcombank = async () => {
	const result = await axios(URL_EXCHANGE_RATE_VIETCOMBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Vietcombank exchange'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam';
		dataJson.symbol = 'Vietcombank';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.usdBuyCast = $('#myTable tbody :nth-child(1) :nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.usdBuyTransfer = $(
			'#myTable tbody :nth-child(1) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.usdSell = $('#myTable tbody :nth-child(1) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	UsdVietombankChart.findOneAndUpdate(
		{ name: 'max' },
		{
			symbol: dataJson?.symbol,
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
				},
				price: {
					$each: [dataJson?.usdSell],
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code +
				' ' +
				err.response?.status +
				' update usdvietcombankchart1year'
		)
	);
	// };
};

module.exports = {
	foreignCurrencyRunAll,
	UpsertAllChartUsdVietcombank,
	updateUsdVietcombankChart1y,
	updateUsdVietcombankChartMax,
};
