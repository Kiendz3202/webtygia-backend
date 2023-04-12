const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');

const BaoTinMinhChau = require('../../../../models/gold/baoTinMinhchauModel');
const Doji = require('../../../../models/gold/dojiModel');
const MiHong = require('../../../../models/gold/miHongModel');
const PhuQuySjc = require('../../../../models/gold/phuquysjcModel');
const Pnj = require('../../../../models/gold/pnjModel');
const Sjc = require('../../../../models/gold/sjcModel');
const SjcChart = require('../../../../models/gold/sjcChartModel');

const {
	URL_GOLD_SJC,
	URL_GOLD_PNJ,
	URL_GOLD_DOJI,
	URL_GOLD_PHUQUYSJC,
	URL_GOLD_MIHONG,
	URL_GOLD_BAOTINMINHCHAU,
} = require('../../configs/constants/gold');

const crawlSjc = async () => {
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

		dataJson.nhansjc99_991chi2chi5chiBuy = $(
			'#myTable tbody :nth-child(8) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nhansjc99_991chi2chi5chiSell = $(
			'#myTable tbody :nth-child(8) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nhansjc99_99_0_5chiBuy = $(
			'#myTable tbody :nth-child(7) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nhansjc99_99_0_5chiSell = $(
			'#myTable tbody :nth-child(7) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nutrang99_99percentBuy = $(
			'#myTable tbody :nth-child(6) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nutrang99_99percentSell = $(
			'#myTable tbody :nth-child(6) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nutrang99percentBuy = $(
			'#myTable tbody :nth-child(5) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nutrang99percentSell = $(
			'#myTable tbody :nth-child(5) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nutrang75percentBuy = $(
			'#myTable tbody :nth-child(4) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nutrang75percentSell = $(
			'#myTable tbody :nth-child(4) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nutrang58_3percentBuy = $(
			'#myTable tbody :nth-child(3) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nutrang58_3percentSell = $(
			'#myTable tbody :nth-child(3) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nutrang41_7percentBuy = $(
			'#myTable tbody :nth-child(2) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nutrang41_7percentSell = $(
			'#myTable tbody :nth-child(2) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjc1l10lHaNoiBuy = $(
			'#myTable tbody :nth-child(11) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lHaNoiSell = $(
			'#myTable tbody :nth-child(11) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjc1l10lDaNangBuy = $(
			'#myTable tbody :nth-child(9) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lDaNangSell = $(
			'#myTable tbody :nth-child(9) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjc1l10lNhaTrangBuy = $(
			'#myTable tbody :nth-child(12) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lNhaTrangSell = $(
			'#myTable tbody :nth-child(12) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjc1l10lCaMauBuy = $(
			'#myTable tbody :nth-child(10) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lCaMauSell = $(
			'#myTable tbody :nth-child(10) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjc1l10lHueBuy = $(
			'#myTable tbody :nth-child(13) :nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjc1l10lHueSell = $(
			'#myTable tbody :nth-child(13) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		// dataJson.sjc1l10lBinhPhuocBuy = $(
		// 	'#myTable tbody :nth-child(22) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lBinhPhuocSell = $(
		// 	'#myTable tbody :nth-child(22) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lBienHoaBuy = $(
		// 	'#myTable tbody :nth-child(13) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lBienHoaSell = $(
		// 	'#myTable tbody :nth-child(13) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lMienTayBuy = $(
		// 	'#myTable tbody :nth-child(12) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lMienTaySell = $(
		// 	'#myTable tbody :nth-child(12) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lQuangNgaiBuy = $(
		// 	'#myTable tbody :nth-child(14) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lQuangNgaiSell = $(
		// 	'#myTable tbody :nth-child(14) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lLongXuyenBuy = $(
		// 	'#myTable tbody :nth-child(1) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lLongXuyenSell = $(
		// 	'#myTable tbody :nth-child(1) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lBacLieuBuy = $(
		// 	'#myTable tbody :nth-child(16) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lBacLieuSell = $(
		// 	'#myTable tbody :nth-child(16) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lQuyNhonBuy = $(
		// 	'#myTable tbody :nth-child(18) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lQuyNhonSell = $(
		// 	'#myTable tbody :nth-child(18) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lPhanRangBuy = $(
		// 	'#myTable tbody :nth-child(19) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lPhanRangSell = $(
		// 	'#myTable tbody :nth-child(19) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lHaLongBuy = $(
		// 	'#myTable tbody :nth-child(20) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lHaLongSell = $(
		// 	'#myTable tbody :nth-child(20) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');

		// dataJson.sjc1l10lQuangNamBuy = $(
		// 	'#myTable tbody :nth-child(21) :nth-child(3)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
		// dataJson.sjc1l10lQuangNamSell = $(
		// 	'#myTable tbody :nth-child(21) :nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(1, -1)
		// 	.replace(/\./g, '');
	} catch (err) {
		console.log(err.message);
	}
	// console.log(dataJson);
	Sjc.findOneAndUpdate(
		{ name: dataJson.name },
		{
			name: dataJson.name,
			timeUpdate: dataJson.timeUpdate,
			sjc1l10lBuy: dataJson.sjc1l10lBuy,
			nhansjc99_991chi2chi5chiBuy: dataJson.nhansjc99_991chi2chi5chiBuy,
			nhansjc99_99_0_5chiBuy: dataJson.nhansjc99_99_0_5chiBuy,
			nutrang99_99percentBuy: dataJson.nutrang99_99percentBuy,
			nutrang99percentBuy: dataJson.nutrang99percentBuy,
			nutrang75percentBuy: dataJson.nutrang75percentBuy,
			nutrang58_3percentBuy: dataJson.nutrang58_3percentBuy,
			nutrang41_7percentBuy: dataJson.nutrang41_7percentBuy,

			sjc1l10lSell: dataJson.sjc1l10lSell,
			nhansjc99_991chi2chi5chiSell: dataJson.nhansjc99_991chi2chi5chiSell,
			nhansjc99_99_0_5chiSell: dataJson.nhansjc99_99_0_5chiSell,
			nutrang99_99percentSell: dataJson.nutrang99_99percentSell,
			nutrang99percentSell: dataJson.nutrang99percentSell,
			nutrang75percentSell: dataJson.nutrang75percentSell,
			nutrang58_3percentSell: dataJson.nutrang58_3percentSell,
			nutrang41_7percentSell: dataJson.nutrang41_7percentSell,

			sjc1l10lHaNoiBuy: dataJson.sjc1l10lHaNoiBuy,
			sjc1l10lHaNoiSell: dataJson.sjc1l10lHaNoiSell,

			sjc1l10lDaNangBuy: dataJson.sjc1l10lDaNangBuy,
			sjc1l10lDaNangSell: dataJson.sjc1l10lDaNangSell,

			sjc1l10lNhaTrangBuy: dataJson.sjc1l10lNhaTrangBuy,
			sjc1l10lNhaTrangSell: dataJson.sjc1l10lNhaTrangSell,

			sjc1l10lCaMauBuy: dataJson.sjc1l10lCaMauBuy,
			sjc1l10lCaMauSell: dataJson.sjc1l10lCaMauSell,

			sjc1l10lHueBuy: dataJson.sjc1l10lHueBuy,
			sjc1l10lHueSell: dataJson.sjc1l10lHueSell,

			sjc1l10lBinhPhuocBuy: dataJson.sjc1l10lBinhPhuocBuy,
			sjc1l10lBinhPhuocSell: dataJson.sjc1l10lBinhPhuocSell,

			sjc1l10lBienHoaBuy: dataJson.sjc1l10lBienHoaBuy,
			sjc1l10lBienHoaSell: dataJson.sjc1l10lBienHoaSell,

			sjc1l10lMienTayBuy: dataJson.sjc1l10lMienTayBuy,
			sjc1l10lMienTaySell: dataJson.sjc1l10lMienTaySell,

			sjc1l10lQuangNgaiBuy: dataJson.sjc1l10lQuangNgaiBuy,
			sjc1l10lQuangNgaiSell: dataJson.sjc1l10lQuangNgaiSell,

			sjc1l10lLongXuyenBuy: dataJson.sjc1l10lLongXuyenBuy,
			sjc1l10lLongXuyenSell: dataJson.sjc1l10lLongXuyenSell,

			sjc1l10lBacLieuBuy: dataJson.sjc1l10lBacLieuBuy,
			sjc1l10lBacLieuSell: dataJson.sjc1l10lBacLieuSell,

			sjc1l10lQuyNhonBuy: dataJson.sjc1l10lQuyNhonBuy,
			sjc1l10lQuyNhonSell: dataJson.sjc1l10lQuyNhonSell,

			sjc1l10lPhanRangBuy: dataJson.sjc1l10lPhanRangBuy,
			sjc1l10lPhanRangSell: dataJson.sjc1l10lPhanRangSell,

			sjc1l10lHaLongBuy: dataJson.sjc1l10lHaLongBuy,
			sjc1l10lHaLongSell: dataJson.sjc1l10lHaLongSell,

			sjc1l10lQuangNamBuy: dataJson.sjc1l10lQuangNamBuy,
			sjc1l10lQuangNamSell: dataJson.sjc1l10lQuangNamSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' sjc');
		});

	SjcChart.findOneAndUpdate(
		{ type: '1d' },
		{
			name: 'SJC',
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -48,
				},
				buy: {
					$each: [dataJson?.sjc1l10lBuy],
					$slice: -48,
				},
				sell: {
					$each: [dataJson?.sjc1l10lSell],
					$slice: -48,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update sjcchart1d'
		)
	);
};

const crawlSjcChart = async () => {
	const arr1year = [];
	const arrMax = [
		{ buy: 8710000, sell: 8760000, t: '2005-05-29' },
		{ buy: 12230000, sell: 12320000, t: '2006-12-31' },
		{ buy: 16100000, sell: 16210000, t: '2007-12-31' },
		{ buy: 17520000, sell: 17820000, t: '2008-12-31' },
		{ buy: 26600000, sell: 26700000, t: '2009-12-31' },
		{ buy: 36050000, sell: 36200000, t: '2010-12-31' },
		{ buy: 42280000, sell: 42680000, t: '2011-12-31' },
		{ buy: 46230000, sell: 46370000, t: '2012-12-31' },
		{ buy: 34700000, sell: 34780000, t: '2013-12-31' },
		{ buy: 34850000, sell: 35150000, t: '2014-12-31' },
		{ buy: 32550000, sell: 32750000, t: '2015-12-31' },
		{ buy: 35450000, sell: 36370000, t: '2016-12-31' },
		{ buy: 36290000, sell: 36640000, t: '2017-12-31' },
		{ buy: 36320000, sell: 36570000, t: '2018-12-31' },
		{ buy: 42300000, sell: 42800000, t: '2019-12-31' },
		{ buy: 55500000, sell: 56050000, t: '2020-12-31' },
		{ buy: 60950000, sell: 61650000, t: '2021-12-31' },
		{ buy: 68600000, sell: 69500000, t: '2022-06-06' },
		{ buy: 65900000, sell: 66720000, t: '2022-12-31' },
	];
	let buy1year = [];
	let sell1year = [];
	let time1year = [];

	let buyMax = [];
	let sellMax = [];
	let timeMax = [];

	// for (let item of arr1year) {
	// 	const date = new Date(item.t);
	// 	const timestamp = Math.floor(date.getTime() / 1000);

	// 	price1year.push(item.c);
	// 	time1year.push(timestamp);
	// }

	for (let item of arrMax) {
		const date = new Date(item.t);
		const timestamp = Math.floor(date.getTime() / 1000);

		buyMax.push(item.buy);
		sellMax.push(item.sell);
		timeMax.push(timestamp);
	}

	SjcChart.findOneAndUpdate(
		{ type: '1d' },
		{
			name: 'SJC',
			t: [],
			buy: [],
			sell: [],
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update sjcchart1d'
		)
	);

	SjcChart.findOneAndUpdate(
		{ type: '1y' },
		{
			name: 'SJC',
			buy: buy1year,
			sell: sell1year,
			t: time1year,
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update sjcchart1year'
		)
	);

	SjcChart.findOneAndUpdate(
		{ type: 'max' },
		{
			name: 'SJC',
			buy: buyMax,
			sell: sellMax,
			t: timeMax,
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' update sjcchartmax'
		)
	);
};

const crawlPnj = async (localtionNumber, index) => {
	const result = await axios(`${URL_GOLD_PNJ}${localtionNumber}`)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' pnj');
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'PNJ';
		dataJson.location = $(`#select_gold_area :nth-child(${index})`).text();

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.vangmiengsjcBuy = (
			$('#content-price :nth-child(1) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vangmiengsjcSell = (
			$('#content-price :nth-child(1) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.nhantronpnjBuy = (
			$('#content-price :nth-child(2) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.nhantronpnjSell = (
			$('#content-price :nth-child(2) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vangkimbaoBuy = (
			$('#content-price :nth-child(3) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vangkimbaoSell = (
			$('#content-price :nth-child(3) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vangphucloctaiBuy = (
			$('#content-price :nth-child(4) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vangphucloctaiSell = (
			$('#content-price :nth-child(4) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang24kBuy = (
			$('#content-price :nth-child(5) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang24kSell = (
			$('#content-price :nth-child(5) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang750Buy = (
			$('#content-price :nth-child(6) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang750Sell = (
			$('#content-price :nth-child(6) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang585Buy = (
			$('#content-price :nth-child(7) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang585Sell = (
			$('#content-price :nth-child(7) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang416Buy = (
			$('#content-price :nth-child(8) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang416Sell = (
			$('#content-price :nth-child(8) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vangmiengpnjBuy = (
			$('#content-price :nth-child(9) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vangmiengpnjSell = (
			$('#content-price :nth-child(9) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang916Buy = (
			$('#content-price :nth-child(10) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang916Sell = (
			$('#content-price :nth-child(10) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang680Buy = (
			$('#content-price :nth-child(11) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang680Sell = (
			$('#content-price :nth-child(11) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();

		dataJson.vang650Buy = (
			$('#content-price :nth-child(12) :nth-child(2) span')
				.text()
				.replace(',', '') * 10000
		).toString();
		dataJson.vang650Sell = (
			$('#content-price :nth-child(12) :nth-child(3) span')
				.text()
				.replace(',', '') * 10000
		).toString();
	} catch (err) {
		console.log(err.code + ' ' + err.response?.status + ' pnj');
	}

	Pnj.findOneAndUpdate(
		{ location: dataJson.location },
		{
			name: dataJson.name,
			location: dataJson.location,
			timeUpdate: dataJson.timeUpdate,
			vangmiengsjcBuy: dataJson.vangmiengsjcBuy,
			nhantronpnjBuy: dataJson.vangmiengsjcSell,
			vangkimbaoBuy: dataJson.vangkimbaoBuy,
			vangphucloctaiBuy: dataJson.vangphucloctaiBuy,
			vang24kBuy: dataJson.vang24kBuy,
			vang750Buy: dataJson.vang750Buy,
			vang585Buy: dataJson.vang585Buy,
			vang416Buy: dataJson.vang416Buy,
			vangmiengpnjBuy: dataJson.vangmiengpnjBuy,
			vang916Buy: dataJson.vang916Buy,
			vang680Buy: dataJson.vang680Buy,
			vang650Buy: dataJson.vang650Buy,

			vangmiengsjcSell: dataJson.vangmiengpnjSell,
			nhantronpnjSell: dataJson.nhantronpnjSell,
			vangkimbaoSell: dataJson.vangkimbaoSell,
			vangphucloctaiSell: dataJson.vangphucloctaiSell,
			vang24kSell: dataJson.vang24kSell,
			vang750Sell: dataJson.vang750Sell,
			vang585Sell: dataJson.vang585Sell,
			vang416Sell: dataJson.vang416Sell,
			vangmiengpnjSell: dataJson.vangmiengpnjSell,
			vang916Sell: dataJson.vang916Sell,
			vang680Sell: dataJson.vang680Sell,
			vang650Sell: dataJson.vang650Sell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' pnj');
		});
};

const crawlDoji = async () => {
	const result = await axios(URL_GOLD_DOJI)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' doji');
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'DOJI';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);
		$('._table').each((index, el) => {
			if (index == 1) {
				//-----Ha Noi----------
				dataJson.sjcHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(2)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.AVPLHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(3)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nhanHTVHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(4)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.KTTKimGiapHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(5)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.phiSjcHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(6)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang9999HNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(7)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang999HNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(8)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang99HNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(9)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang18kHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(10)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang14kHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(11)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang10kHNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(12)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();

				dataJson.sjcHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(2)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.AVPLHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(3)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nhanHTVHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(4)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.KTTKimGiapHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(5)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.phiSjcHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(6)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang9999HNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(7)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang999HNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(8)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang99HNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(9)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang18kHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(10)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang14kHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(11)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang10kHNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(12)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
			}
			if (index == 2) {
				//--------Ho Chi Minh----------
				dataJson.sjcHCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(2)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.AVPLHCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(3)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.KNTKTTKimGiapHCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(4)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nhanHTVHCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(5)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang9999HCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(6)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang999HCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(7)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang99HCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(8)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang75HCMBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(9)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();

				dataJson.sjcHCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(2)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.AVPLHCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(3)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.KNTKTTKimGiapHCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(4)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nhanHTVHCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(5)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang9999HCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(6)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang999HCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(7)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang99HCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(8)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang75HCMSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(9)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
			}
			if (index == 3) {
				//--------Da Nang--------------
				dataJson.sjcDNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(2)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.AVPLDNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(3)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.KNTKTTKimGiapDNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(4)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nhanHTVDNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(5)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang9999DNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(6)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang75DNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(7)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang68DNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(8)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang58_3DNBuy = (
					$(el)
						.find('._content-tab ._buy :nth-child(9)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();

				dataJson.sjcDNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(2)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.AVPLDNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(3)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.KNTKTTKimGiapDNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(4)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nhanHTVDNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(5)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang9999DNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(6)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang75DNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(7)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang68DNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(8)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
				dataJson.nuTrang58_3DNSell = (
					$(el)
						.find('._content-tab ._Sell :nth-child(9)')
						.text()
						.replace(/\s/g, '')
						.replace(',', '') * 10000
				).toString();
			}
		});
	} catch (error) {
		console.log(error.message);
	}

	Doji.findOneAndUpdate(
		{ name: dataJson.name },
		{
			name: dataJson.name,
			timeUpdate: dataJson.timeUpdate,
			sjcHNBuy: dataJson.sjcHNBuy,
			sjcHNSell: dataJson.sjcHNSell,
			AVPLHNBuy: dataJson.AVPLHNBuy,
			AVPLHNSell: dataJson.AVPLHNSell,
			nhanHTVHNBuy: dataJson.nhanHTVHNBuy,
			nhanHTVHNSell: dataJson.nhanHTVHNSell,
			KTTKimGiapHNBuy: dataJson.KTTKimGiapHNBuy,
			KTTKimGiapHNSell: dataJson.KTTKimGiapHNSell,
			phiSjcHNBuy: dataJson.phiSjcHNBuy,
			phiSjcHNSell: dataJson.phiSjcHNSell,
			nuTrang9999HNBuy: dataJson.nuTrang9999HNBuy,
			nuTrang9999HNSell: dataJson.nuTrang9999HNSell,
			nuTrang999HNBuy: dataJson.nuTrang999HNBuy,
			nuTrang999HNSell: dataJson.nuTrang999HNSell,
			nuTrang99HNBuy: dataJson.nuTrang99HNBuy,
			nuTrang99HNSell: dataJson.nuTrang99HNSell,
			nuTrang18kHNBuy: dataJson.nuTrang18kHNBuy,
			nuTrang18kHNSell: dataJson.nuTrang18kHNSell,
			nuTrang14kHNBuy: dataJson.nuTrang14kHNBuy,
			nuTrang14kHNSell: dataJson.nuTrang14kHNSell,
			nuTrang10kHNBuy: dataJson.nuTrang10kHNBuy,
			nuTrang10kHNSell: dataJson.nuTrang10kHNSell,

			sjcHCMBuy: dataJson.sjcHCMBuy,
			sjcHCMSell: dataJson.sjcHCMSell,
			AVPLHCMBuy: dataJson.AVPLHCMBuy,
			AVPLHCMSell: dataJson.AVPLHCMSell,
			KNTKTTKimGiapHCMBuy: dataJson.KNTKTTKimGiapHCMBuy,
			KNTKTTKimGiapHCMSell: dataJson.KNTKTTKimGiapHCMSell,
			nhanHTVHCMBuy: dataJson.nhanHTVHCMBuy,
			nhanHTVHCMSell: dataJson.nhanHTVHCMSell,
			nuTrang9999HCMBuy: dataJson.nuTrang9999HCMBuy,
			nuTrang9999HCMSell: dataJson.nuTrang9999HCMSell,
			nuTrang999HCMBuy: dataJson.nuTrang999HCMBuy,
			nuTrang999HCMSell: dataJson.nuTrang999HCMSell,
			nuTrang99HCMBuy: dataJson.nuTrang99HCMBuy,
			nuTrang99HCMSell: dataJson.nuTrang99HCMSell,
			nuTrang75HCMBuy: dataJson.nuTrang75HCMBuy,
			nuTrang75HCMSell: dataJson.nuTrang75HCMSell,

			sjcDNBuy: dataJson.sjcDNBuy,
			sjcDNSell: dataJson.sjcDNSell,
			AVPLDNBuy: dataJson.AVPLDNBuy,
			AVPLDNSell: dataJson.AVPLDNSell,
			KNTKTTKimGiapDNBuy: dataJson.KNTKTTKimGiapDNBuy,
			KNTKTTKimGiapDNSell: dataJson.KNTKTTKimGiapDNSell,
			nhanHTVDNBuy: dataJson.nhanHTVDNBuy,
			nhanHTVDNSell: dataJson.nhanHTVDNSell,
			nuTrang9999DNBuy: dataJson.nuTrang9999DNBuy,
			nuTrang9999DNSell: dataJson.nuTrang9999DNSell,
			nuTrang75DNBuy: dataJson.nuTrang75DNBuy,
			nuTrang75DNSell: dataJson.nuTrang75DNSell,
			nuTrang68DNBuy: dataJson.nuTrang68DNBuy,
			nuTrang68DNSell: dataJson.nuTrang68DNSell,
			nuTrang58_3DNBuy: dataJson.nuTrang58_3DNBuy,
			nuTrang58_3DNSell: dataJson.nuTrang58_3DNSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' doji');
		});
};

const crawlPhuQuySjc = async () => {
	const result = await axios(URL_GOLD_PHUQUYSJC)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Phú Quý SJC'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Phú Quý SJC';
		dataJson.location = 'Hà Nội';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.sjcBuy = $('#myTable tbody :nth-child(1) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjcSell = $('#myTable tbody :nth-child(1) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjnBuy = $('#myTable tbody :nth-child(12) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sjnSell = $('#myTable tbody :nth-child(12) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.npqBuy = $('#myTable tbody :nth-child(11) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.npqSell = $('#myTable tbody :nth-child(11) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.cngBuy = $('#myTable tbody :nth-child(10) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cngSell = $('#myTable tbody :nth-child(10) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang24kBuy = $('#myTable tbody :nth-child(9) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang24kSell = $('#myTable tbody :nth-child(9) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang999Buy = $('#myTable tbody :nth-child(7) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang999Sell = $('#myTable tbody :nth-child(7) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang099Buy = $('#myTable tbody :nth-child(5) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang099Sell = $('#myTable tbody :nth-child(5) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.v99Buy = $('#myTable tbody :nth-child(4) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.v99Sell = $('#myTable tbody :nth-child(4) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.v999Buy = $('#myTable tbody :nth-child(6) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.v999Sell = $('#myTable tbody :nth-child(6) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.v9999Buy = $('#myTable tbody :nth-child(8) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.v9999Sell = $('#myTable tbody :nth-child(8) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	PhuQuySjc.findOneAndUpdate(
		{ name: dataJson.name },
		{
			name: dataJson.name,
			location: dataJson.location,
			timeUpdate: dataJson.timeUpdate,
			sjcBuy: dataJson.sjcBuy,
			sjnBuy: dataJson.sjnBuy,
			npqBuy: dataJson.npqBuy,
			cngBuy: dataJson.cngBuy,
			vang24kBuy: dataJson.vang24kBuy,
			vang999Buy: dataJson.vang999Buy,
			vang099Buy: dataJson.vang099Buy,
			v99Buy: dataJson.v99Buy,
			v999Buy: dataJson.v999Buy,
			v9999Buy: dataJson.v9999Buy,

			sjcSell: dataJson.sjcSell,
			sjnSell: dataJson.sjnSell,
			npqSell: dataJson.npqSell,
			cngSell: dataJson.cngSell,
			vang24kSell: dataJson.vang24kSell,
			vang999Sell: dataJson.vang999Sell,
			vang099Sell: dataJson.vang099Sell,
			v99Sell: dataJson.v99Sell,
			v999Sell: dataJson.v999Sell,
			v9999Sell: dataJson.v9999Sell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Phú Quý SJC'
			);
		});
};

const crawlBaoTinMinhChau = async () => {
	const result = await axios(URL_GOLD_BAOTINMINHCHAU)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' baotinminhchau'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Bảo Tín Minh Châu';
		dataJson.location = 'Hà Nội';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.vangMiengVRTLBuy = $(
			'#myTable tbody :nth-child(2) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vangMiengVRTLSell = $(
			'#myTable tbody :nth-child(2) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.nhanTronTronBuy = $(
			'#myTable tbody :nth-child(1) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nhanTronTronSell = $(
			'#myTable tbody :nth-child(1) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.quaMungBanViVangBuy = $(
			'#myTable tbody :nth-child(8) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.quaMungBanViVangSell = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vangMiengSjcBuy = $(
			'#myTable tbody :nth-child(6) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vangMiengSjcSell = $(
			'#myTable tbody :nth-child(6) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.trangSucBangVangRongThangLong9999Buy = $(
			'#myTable tbody :nth-child(3) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.trangSucBangVangRongThangLong9999Sell = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.trangSucBangVangRongThangLong999Buy = $(
			'#myTable tbody :nth-child(4) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.trangSucBangVangRongThangLong999Sell = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vangHTBTBuy = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vangHTBTSell = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vangNguyenLieuBuy = $(
			'#myTable tbody :nth-child(7) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vangNguyenLieuSell = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}
	// console.log(dataJson);

	BaoTinMinhChau.findOneAndUpdate(
		{ name: dataJson.name },
		{
			name: dataJson.name,
			location: dataJson.location,
			timeUpdate: dataJson.timeUpdate,
			'vangRongThangLong.vangMiengVRTLBuy': dataJson.vangMiengVRTLBuy,
			'vangRongThangLong.vangMiengVRTLSell': dataJson.vangMiengVRTLSell,
			'vangRongThangLong.nhanTronTronBuy': dataJson.nhanTronTronBuy,
			'vangRongThangLong.nhanTronTronSell': dataJson.nhanTronTronSell,

			'quaMungVang.quaMungBanViVangBuy': dataJson.quaMungBanViVangBuy,
			'quaMungVang.quaMungBanViVangSell': dataJson.quaMungBanViVangSell,

			'vangSjc.vangMiengSjcBuy': dataJson.vangMiengSjcBuy,
			'vangSjc.vangMiengSjcSell': dataJson.vangMiengSjcSell,

			'vangBTMC.trangSucBangVangRongThangLong9999Buy':
				dataJson.trangSucBangVangRongThangLong9999Buy,
			'vangBTMC.trangSucBangVangRongThangLong9999Sell':
				dataJson.trangSucBangVangRongThangLong9999Sell,
			'vangBTMC.trangSucBangVangRongThangLong999Buy':
				dataJson.trangSucBangVangRongThangLong999Buy,
			'vangBTMC.trangSucBangVangRongThangLong999Sell':
				dataJson.trangSucBangVangRongThangLong999Sell,

			'vangHTBT.vangHTBTBuy': dataJson.vangHTBTBuy,
			'vangHTBT.vangHTBTSell': dataJson.vangHTBTSell,
			'vangThiTruong.vangNguyenLieuBuy': dataJson.vangNguyenLieuBuy,
			'vangThiTruong.vangNguyenLieuSell': dataJson.vangNguyenLieuSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' baotinminhchau'
			);
		});
};

const crawlMiHong = async () => {
	const result = await axios(URL_GOLD_MIHONG)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' mihong');
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Mi Hồng';
		dataJson.location = 'Hồ Chí Minh';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.sjcBuy = $('#myTable tbody :nth-child(1) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.sjcSell = $('#myTable tbody :nth-child(1) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang999Buy = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang999Sell = $('#myTable tbody :nth-child(2) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang985Buy = $('#myTable tbody :nth-child(3) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang985Sell = $('#myTable tbody :nth-child(3) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang980Buy = $('#myTable tbody :nth-child(4) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang980Sell = $('#myTable tbody :nth-child(4) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang950Buy = $('#myTable tbody :nth-child(7) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang950Sell = $('#myTable tbody :nth-child(7) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang750Buy = $('#myTable tbody :nth-child(8) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang750Sell = $('#myTable tbody :nth-child(8) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang680Buy = $('#myTable tbody :nth-child(5) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang680Sell = $('#myTable tbody :nth-child(5) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');

		dataJson.vang610Buy = $('#myTable tbody :nth-child(6) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.vang610Sell = $('#myTable tbody :nth-child(6) :nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	MiHong.findOneAndUpdate(
		{ name: dataJson.name },
		{
			name: dataJson.name,
			location: dataJson.location,
			timeUpdate: dataJson.timeUpdate,

			sjcBuy: dataJson.sjcBuy,
			vang999Buy: dataJson.vang999Buy,
			vang985Buy: dataJson.vang985Buy,
			vang980Buy: dataJson.vang980Buy,
			vang950Buy: dataJson.vang950Buy,
			vang750Buy: dataJson.vang750Buy,
			vang680Buy: dataJson.vang680Buy,
			vang610Buy: dataJson.vang610Buy,

			sjcSell: dataJson.sjcSell,
			vang999Sell: dataJson.vang999Sell,
			vang985Sell: dataJson.vang985Sell,
			vang980Sell: dataJson.vang980Sell,
			vang950Sell: dataJson.vang950Sell,
			vang750Sell: dataJson.vang750Sell,
			vang680Sell: dataJson.vang680Sell,
			vang610Sell: dataJson.vang610Sell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(err.code + ' ' + err.response?.status + ' mihong');
		});
};
module.exports = {
	crawlSjc,
	crawlSjcChart,
	crawlPnj,
	crawlDoji,
	crawlBaoTinMinhChau,
	crawlPhuQuySjc,
	crawlMiHong,
};
