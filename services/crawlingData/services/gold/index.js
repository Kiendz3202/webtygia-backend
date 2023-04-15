const {
	crawlSjc,
	crawlSjcChart,
	crawlPnj,
	crawlDoji,
	crawlBaoTinMinhChau,
	crawlPhuQuySjc,
	crawlMiHong,
} = require('./crawlGold');
const { URL_GOLD_SJC } = require('../../configs/constants/gold');
const SjcChart = require('../../../../models/gold/sjcChartModel');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');
const axios = require('axios');
const cheerio = require('cheerio');
const { delay } = require('../../utils/promise/delay');

const goldRunAll = async () => {
	const crawlAllDetailPnj = async () => {
		const arr = ['00', '07', '11', '13', '14', '21'];
		arr.forEach((gold, index) => {
			setTimeout(() => {
				crawlPnj(gold, index + 1);
			}, 3000 * index);
		});
	};
	crawlAllDetailPnj();
	await delay(18000);
	crawlSjc();
	await delay(5000);
	crawlDoji();
	await delay(5000);
	crawlPhuQuySjc();
	await delay(5000);
	crawlBaoTinMinhChau();
	await delay(5000);
	crawlMiHong();
	await delay(5000);
};

const upsertAllChartSjc = async () => {
	crawlSjcChart();
};

const updateSjcChart1y = async () => {
	const result = await axios(URL_GOLD_SJC)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' sjc');
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'SJC';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.sjc1l10lBuy = $('#myTable tbody :nth-child(1) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lSell = $('#myTable tbody :nth-child(1) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err.message);
	}

	SjcChart.findOneAndUpdate(
		{ type: '1y' },
		{
			name: 'SJC',
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -365,
				},
				buy: {
					$each: [dataJson?.sjc1l10lBuy],
					$slice: -365,
				},
				sell: {
					$each: [dataJson?.sjc1l10lSell],
					$slice: -365,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update sjcchart1d'
		)
	);
};

const updateSjcChartMax = async () => {
	const result = await axios(URL_GOLD_SJC)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' sjc');
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'SJC';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.sjc1l10lBuy = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lSell = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err.message);
	}

	SjcChart.findOneAndUpdate(
		{ type: 'max' },
		{
			name: 'SJC',
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -1000,
				},
				buy: {
					$each: [dataJson?.sjc1l10lBuy],
					$slice: -1000,
				},
				sell: {
					$each: [dataJson?.sjc1l10lSell],
					$slice: -1000,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update sjcchart1d'
		)
	);
};

module.exports = {
	goldRunAll,
	upsertAllChartSjc,
	updateSjcChart1y,
	updateSjcChartMax,
};
