const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');

const AgribankExchange = require('../../../../models/exchangeRate/agribankExchangeModel');
const BidvExchange = require('../../../../models/exchangeRate/bidvExchangeModel');
const MbbankExchange = require('../../../../models/exchangeRate/mbbankExchangeModel');
const TechcombankExchange = require('../../../../models/exchangeRate/techcombankExchangeModel');
const VietcombankExchange = require('../../../../models/exchangeRate/vietcombankExchangeModel');
const VietinBankExchange = require('../../../../models/exchangeRate/vietinbankExchangeModel');

const ExchangeUsdToVnd = require('../../../../models/exchangeRate/exchangeUsdToVndModel');
const UsdVietombankChart = require('../../../../models/foreignCurrency/usdVietcombankChart');

const {
	URL_EXCHANGE_RATE_AGRIBANK,
	URL_EXCHANGE_RATE_VIETCOMBANK,
	URL_EXCHANGE_RATE_BIDV,
	URL_EXCHANGE_RATE_TECHCOMBANK,
	URL_EXCHANGE_RATE_VIETINBANK,
	URL_EXCHANGE_RATE_MBBANK,
} = require('../../configs/constants/exchangeRate');

const crawlAgribank = async () => {
	const result = await axios(URL_EXCHANGE_RATE_AGRIBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Agribank exchange'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name =
			'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam';
		dataJson.symbol = 'Agribank';

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

		dataJson.eurBuyCast = $('#myTable tbody :nth-child(3) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.eurBuyTransfer = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.eurSell = $('#myTable tbody :nth-child(3) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.gbpBuyCast = $('#myTable tbody :nth-child(5) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.gbpBuyTransfer = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.gbpSell = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.hkdBuyCast = $('#myTable tbody :nth-child(9) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.hkdBuyTransfer = $(
			'#myTable tbody :nth-child(9) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.hkdSell = $('#myTable tbody :nth-child(9) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.chfBuyCast = $('#myTable tbody :nth-child(4) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.chfBuyTransfer = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.chfSell = $('#myTable tbody :nth-child(4) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.jpyBuyCast = $('#myTable tbody :nth-child(2) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.jpyBuyTransfer = $(
			'#myTable tbody :nth-child(2) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.jpySell = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.audBuyCast = $('#myTable tbody :nth-child(6) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.audBuyTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.audSell = $('#myTable tbody :nth-child(6) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.sgdBuyCast = $('#myTable tbody :nth-child(7) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sgdBuyTransfer = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.sgdSell = $('#myTable tbody :nth-child(7) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.thbBuyCast = $('#myTable tbody :nth-child(10) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.thbBuyTransfer = $(
			'#myTable tbody :nth-child(10) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.thbSell = $('#myTable tbody :nth-child(10) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cadBuyCast = $('#myTable tbody :nth-child(8) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cadBuyTransfer = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cadSell = $('#myTable tbody :nth-child(8) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.nzdBuyCast = $('#myTable tbody :nth-child(11) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nzdBuyTransfer = $(
			'#myTable tbody :nth-child(11) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.nzdSell = $('#myTable tbody :nth-child(11) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.krwBuyCast = $('#myTable tbody :nth-child(12) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\,/g, '');
		dataJson.krwBuyTransfer = $(
			'#myTable tbody :nth-child(12) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\,/g, '');
		dataJson.krwSell = $('#myTable tbody :nth-child(12) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\,/g, '');
	} catch (err) {
		console.log(err.message);
	}

	AgribankExchange.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			// usdSellTransfer: dataJson.usdSellTransfer,
			usdSell: dataJson.usdSell,

			eurBuyCast: dataJson.eurBuyCast,
			eurBuyTransfer: dataJson.eurBuyTransfer,
			// eurSellTransfer: dataJson.eurSellTransfer,
			eurSell: dataJson.eurSell,

			gbpBuyCast: dataJson.gbpBuyCast,
			gbpBuyTransfer: dataJson.gbpBuyTransfer,
			// gbpSellTransfer: dataJson.gbpSellTransfer,
			gbpSell: dataJson.gbpSell,

			jpyBuyCast: dataJson.jpyBuyCast,
			jpyBuyTransfer: dataJson.jpyBuyTransfer,
			// jpySellTransfer: dataJson.jpySellTransfer,
			jpySell: dataJson.jpySell,

			audBuyCast: dataJson.audBuyCast,
			audBuyTransfer: dataJson.audBuyTransfer,
			// audSellTransfer: dataJson.audSellTransfer,
			audSell: dataJson.audSell,

			cadBuyCast: dataJson.cadBuyCast,
			cadBuyTransfer: dataJson.cadBuyTransfer,
			// cadSellTransfer: dataJson.cadSellTransfer,
			cadSell: dataJson.cadSell,

			nzdBuyCast: dataJson.nzdBuyCast,
			nzdBuyTransfer: dataJson.nzdBuyTransfer,
			// nzdSellTransfer: dataJson.nzdSellTransfer,
			nzdSell: dataJson.nzdSell,

			sgdBuyCast: dataJson.sgdBuyCast,
			sgdBuyTransfer: dataJson.sgdBuyTransfer,
			// sgdSellTransfer: dataJson.sgdSellTransfer,
			sgdSell: dataJson.sgdSell,

			chfBuyCast: dataJson.chfBuyCast,
			chfBuyTransfer: dataJson.chfBuyTransfer,
			// chfSellTransfer: dataJson.chfSellTransfer,
			chfSell: dataJson.chfSell,

			hkdBuyCast: dataJson.hkdBuyCast,
			hkdBuyTransfer: dataJson.hkdBuyTransfer,
			// hkdSellTransfer: dataJson.hkdSellTransfer,
			hkdSell: dataJson.hkdSell,

			krwBuyCast: dataJson.krwBuyCast,
			krwBuyTransfer: dataJson.krwBuyTransfer,
			// krwSellTransfer: dataJson.krwSellTransfer,
			krwSell: dataJson.krwSell,

			thbBuyCast: dataJson.thbBuyCast,
			thbBuyTransfer: dataJson.thbBuyTransfer,
			// thbSellTransfer: dataJson.thbSellTransfer,
			thbSell: dataJson.thbSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) =>
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Agribank exchange'
			)
		);
};
const crawlVietcombank = async () => {
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

		dataJson.audBuyCast = $('#myTable tbody :nth-child(6) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.audBuyTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.audSell = $('#myTable tbody :nth-child(6) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.cadBuyCast = $('#myTable tbody :nth-child(8) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.cadBuyTransfer = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.cadSell = $('#myTable tbody :nth-child(8) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.chfBuyCast = $('#myTable tbody :nth-child(4) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.chfBuyTransfer = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.chfSell = $('#myTable tbody :nth-child(4) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.cnyBuyCast = $('#myTable tbody :nth-child(15) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.cnyBuyTransfer = $(
			'#myTable tbody :nth-child(15) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.cnySell = $('#myTable tbody :nth-child(15) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.dkkBuyCast = $('#myTable tbody :nth-child(13) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.dkkBuyTransfer = $(
			'#myTable tbody :nth-child(13) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.dkkSell = $('#myTable tbody :nth-child(13) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.eurBuyCast = $('#myTable tbody :nth-child(3) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.eurBuyTransfer = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.eurSell = $('#myTable tbody :nth-child(3) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.gbpBuyCast = $('#myTable tbody :nth-child(5) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.gbpBuyTransfer = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.gbpSell = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.hkdBuyCast = $('#myTable tbody :nth-child(9) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.hkdBuyTransfer = $(
			'#myTable tbody :nth-child(9) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.hkdSell = $('#myTable tbody :nth-child(9) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.inrBuyCast = $('#myTable tbody :nth-child(20) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.inrBuyTransfer = $(
			'#myTable tbody :nth-child(20) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.inrSell = $('#myTable tbody :nth-child(20) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.jpyBuyCast = $('#myTable tbody :nth-child(2) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\,/g, '');
		dataJson.jpyBuyTransfer = $(
			'#myTable tbody :nth-child(2) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\,/g, '');
		dataJson.jpySell = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\,/g, '');

		dataJson.krwBuyCast = $('#myTable tbody :nth-child(11) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.\s]/g, '');
		dataJson.krwBuyTransfer = $(
			'#myTable tbody :nth-child(11) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.krwSell = $('#myTable tbody :nth-child(11) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.kwdBuyCast = $('#myTable tbody :nth-child(19) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.kwdBuyTransfer = $(
			'#myTable tbody :nth-child(19) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.kwdSell = $('#myTable tbody :nth-child(19) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.myrBuyCast = $('#myTable tbody :nth-child(17) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.myrBuyTransfer = $(
			'#myTable tbody :nth-child(17) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.myrSell = $('#myTable tbody :nth-child(17) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.nokBuyCast = $('#myTable tbody :nth-child(14) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.nokBuyTransfer = $(
			'#myTable tbody :nth-child(14) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.nokSell = $('#myTable tbody :nth-child(14) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.rubBuyCast = $('#myTable tbody :nth-child(16) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.rubBuyTransfer = $(
			'#myTable tbody :nth-child(16) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.rubSell = $('#myTable tbody :nth-child(16) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.sarBuyCast = $('#myTable tbody :nth-child(18) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.sarBuyTransfer = $(
			'#myTable tbody :nth-child(18) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.sarSell = $('#myTable tbody :nth-child(18) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.sekBuyCast = $('#myTable tbody :nth-child(12) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.sekBuyTransfer = $(
			'#myTable tbody :nth-child(12) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.sekSell = $('#myTable tbody :nth-child(12) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.sgdBuyCast = $('#myTable tbody :nth-child(7) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -3)
			.replace(/[.,\s]/g, '');
		dataJson.sgdBuyTransfer = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');
		dataJson.sgdSell = $('#myTable tbody :nth-child(7) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -3)
			.replace(/[.,\s]/g, '');

		dataJson.thbBuyCast = $('#myTable tbody :nth-child(10) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.\s]/g, '');
		dataJson.thbBuyTransfer = $(
			'#myTable tbody :nth-child(10) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.thbSell = $('#myTable tbody :nth-child(10) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

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
	VietcombankExchange.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			audBuyCast: dataJson.audBuyCast,
			audBuyTransfer: dataJson.audBuyTransfer,
			audSell: dataJson.audSell,

			cadBuyCast: dataJson.cadBuyCast,
			cadBuyTransfer: dataJson.cadBuyTransfer,
			cadSell: dataJson.cadSell,

			chfBuyCast: dataJson.chfBuyCast,
			chfBuyTransfer: dataJson.chfBuyTransfer,
			chfSell: dataJson.chfSell,

			cnyBuyCast: dataJson.cnyBuyCast,
			cnyBuyTransfer: dataJson.cnyBuyTransfer,
			cnySell: dataJson.cnySell,

			dkkBuyCast: dataJson.dkkBuyCast,
			dkkBuyTransfer: dataJson.dkkBuyTransfer,
			dkkSell: dataJson.dkkSell,

			eurBuyCast: dataJson.eurBuyCast,
			eurBuyTransfer: dataJson.eurBuyTransfer,
			eurSell: dataJson.eurSell,

			gbpBuyCast: dataJson.gbpBuyCast,
			gbpBuyTransfer: dataJson.gbpBuyTransfer,
			gbpSell: dataJson.gbpSell,

			hkdBuyCast: dataJson.hkdBuyCast,
			hkdBuyTransfer: dataJson.hkdBuyTransfer,
			hkdSell: dataJson.hkdSell,

			inrBuyCast: dataJson.inrBuyCast,
			inrBuyTransfer: dataJson.inrBuyTransfer,
			inrSell: dataJson.inrSell,

			jpyBuyCast: dataJson.jpyBuyCast,
			jpyBuyTransfer: dataJson.jpyBuyTransfer,
			jpySell: dataJson.jpySell,

			krwBuyCast: dataJson.krwBuyCast,
			krwBuyTransfer: dataJson.krwBuyTransfer,
			krwSell: dataJson.krwSell,

			kwdBuyCast: dataJson.kwdBuyCast,
			kwdBuyTransfer: dataJson.kwdBuyTransfer,
			kwdSell: dataJson.kwdSell,

			myrBuyCast: dataJson.myrBuyCast,
			myrBuyTransfer: dataJson.myrBuyTransfer,
			myrSell: dataJson.myrSell,

			nokBuyCast: dataJson.nokBuyCast,
			nokBuyTransfer: dataJson.nokBuyTransfer,
			nokSell: dataJson.nokSell,

			rubBuyCast: dataJson.rubBuyCast,
			rubBuyTransfer: dataJson.rubBuyTransfer,
			rubSell: dataJson.rubSell,

			sarBuyCast: dataJson.sarBuyCast,
			sarBuyTransfer: dataJson.sarBuyTransfer,
			sarSell: dataJson.sarSell,

			sekBuyCast: dataJson.sekBuyCast,
			sekBuyTransfer: dataJson.sekBuyTransfer,
			sekSell: dataJson.sekSell,

			sgdBuyCast: dataJson.sgdBuyCast,
			sgdBuyTransfer: dataJson.sgdBuyTransfer,
			sgdSell: dataJson.sgdSell,

			thbBuyCast: dataJson.thbBuyCast,
			thbBuyTransfer: dataJson.thbBuyTransfer,
			thbSell: dataJson.thbSell,

			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			usdSell: dataJson.usdSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) =>
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Vietcombank exchange'
			)
		);

	ExchangeUsdToVnd.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,
			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			usdSell: dataJson.usdSell,
		},
		{
			upsert: true,
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code + ' ' + err.response?.status + ' usd to vnd exchange'
		)
	);

	UsdVietombankChart.findOneAndUpdate(
		{ name: '1d' },
		{
			symbol: dataJson?.symbol,
			$push: {
				t: {
					$each: [dataJson?.timeUpdate],
					$slice: -48,
				},
				price: {
					$each: [dataJson?.usdSell],
					$slice: -48,
				},
			},
		}
	).catch((err) =>
		uploadErrorToDb(
			err.code +
				' ' +
				err.response?.status +
				' update usdvietcombankchart1d'
		)
	);
};
const crawlBidv = async () => {
	const result = await axios(URL_EXCHANGE_RATE_BIDV)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Bidv exchange'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name =
			'Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam';
		dataJson.symbol = 'Bidv';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.audBuyCast = $('#myTable tbody :nth-child(6) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.audBuyTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.audSell = $('#myTable tbody :nth-child(6) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.cadBuyCast = $('#myTable tbody :nth-child(8) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.cadBuyTransfer = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.cadSell = $('#myTable tbody :nth-child(8) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.chfBuyCast = $('#myTable tbody :nth-child(4) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.chfBuyTransfer = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.chfSell = $('#myTable tbody :nth-child(4) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.cnyBuyCast = $('#myTable tbody :nth-child(18) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.cnyBuyTransfer = $(
			'#myTable tbody :nth-child(18) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.cnySell = $('#myTable tbody :nth-child(18) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.dkkBuyCast = $('#myTable tbody :nth-child(16) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.dkkBuyTransfer = $(
			'#myTable tbody :nth-child(16) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.dkkSell = $('#myTable tbody :nth-child(16) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.eurBuyCast = $('#myTable tbody :nth-child(3) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.eurBuyTransfer = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.eurSell = $('#myTable tbody :nth-child(3) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.gbpBuyCast = $('#myTable tbody :nth-child(5) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.gbpBuyTransfer = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.gbpSell = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.hkdBuyCast = $('#myTable tbody :nth-child(9) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.hkdBuyTransfer = $(
			'#myTable tbody :nth-child(9) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.hkdSell = $('#myTable tbody :nth-child(9) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		// dataJson.inrBuyCast = $('#myTable tbody :nth-child(20) td:nth-child(2)')
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -1)
		// 	.replace(/[.\s]/g, '');
		// dataJson.inrBuyTransfer = $(
		// 	'#myTable tbody :nth-child(20) td:nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -1)
		// 	.replace(/[.\s]/g, '');
		// dataJson.inrSell = $('#myTable tbody :nth-child(20) td:nth-child(3)')
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -1)
		// 	.replace(/[.\s]/g, '');

		dataJson.jpyBuyCast = $('#myTable tbody :nth-child(2) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\,/g, '');
		dataJson.jpyBuyTransfer = $(
			'#myTable tbody :nth-child(2) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\,/g, '');
		dataJson.jpySell = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\,/g, '');

		dataJson.krwBuyCast = $('#myTable tbody :nth-child(13) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.\s]/g, '');
		dataJson.krwBuyTransfer = $(
			'#myTable tbody :nth-child(13) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.krwSell = $('#myTable tbody :nth-child(13) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		// dataJson.kwdBuyCast = $('#myTable tbody :nth-child(19) td:nth-child(2)')
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -3)
		// 	.replace(/[.,\s]/g, '');
		// dataJson.kwdBuyTransfer = $(
		// 	'#myTable tbody :nth-child(19) td:nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -3)
		// 	.replace(/[.,\s]/g, '');
		// dataJson.kwdSell = $('#myTable tbody :nth-child(19) td:nth-child(3)')
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -3)
		// 	.replace(/[.,\s]/g, '');

		dataJson.myrBuyCast = $('#myTable tbody :nth-child(20) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.myrBuyTransfer = $(
			'#myTable tbody :nth-child(20) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.myrSell = $('#myTable tbody :nth-child(20) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.nokBuyCast = $('#myTable tbody :nth-child(17) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.nokBuyTransfer = $(
			'#myTable tbody :nth-child(17) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.nokSell = $('#myTable tbody :nth-child(17) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.rubBuyCast = $('#myTable tbody :nth-child(19) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.rubBuyTransfer = $(
			'#myTable tbody :nth-child(19) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.rubSell = $('#myTable tbody :nth-child(19) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		// dataJson.sarBuyCast = $('#myTable tbody :nth-child(18) td:nth-child(2)')
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -3)
		// 	.replace(/[.,\s]/g, '');
		// dataJson.sarBuyTransfer = $(
		// 	'#myTable tbody :nth-child(18) td:nth-child(4)'
		// )
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -3)
		// 	.replace(/[.,\s]/g, '');
		// dataJson.sarSell = $('#myTable tbody :nth-child(18) td:nth-child(3)')
		// 	.contents()
		// 	.first()
		// 	.text()
		// 	.slice(0, -3)
		// 	.replace(/[.,\s]/g, '');

		dataJson.sekBuyCast = $('#myTable tbody :nth-child(14) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.sekBuyTransfer = $(
			'#myTable tbody :nth-child(14) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.sekSell = $('#myTable tbody :nth-child(14) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.lakBuyCast = $('#myTable tbody :nth-child(15) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.lakBuyTransfer = $(
			'#myTable tbody :nth-child(15) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.lakSell = $('#myTable tbody :nth-child(15) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.sgdBuyCast = $('#myTable tbody :nth-child(7) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.,\s]/g, '');
		dataJson.sgdBuyTransfer = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');
		dataJson.sgdSell = $('#myTable tbody :nth-child(7) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.,\s]/g, '');

		dataJson.thbBuyCast = $('#myTable tbody :nth-child(10) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.\s]/g, '');
		dataJson.thbBuyTransfer = $(
			'#myTable tbody :nth-child(10) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.thbSell = $('#myTable tbody :nth-child(10) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.twdBuyCast = $('#myTable tbody :nth-child(11) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.\s]/g, '');
		dataJson.twdBuyTransfer = $(
			'#myTable tbody :nth-child(11) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.twdSell = $('#myTable tbody :nth-child(11) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

		dataJson.nzdBuyCast = $('#myTable tbody :nth-child(12) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/[.\s]/g, '');
		dataJson.nzdBuyTransfer = $(
			'#myTable tbody :nth-child(12) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');
		dataJson.nzdSell = $('#myTable tbody :nth-child(12) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/[.\s]/g, '');

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

	BidvExchange.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			usdSell: dataJson.usdSell,

			gbpBuyCast: dataJson.gbpBuyCast,
			gbpBuyTransfer: dataJson.gbpBuyTransfer,
			gbpSell: dataJson.gbpSell,

			hkdBuyCast: dataJson.hkdBuyCast,
			hkdBuyTransfer: dataJson.hkdBuyTransfer,
			hkdSell: dataJson.hkdSell,

			chfBuyCast: dataJson.chfBuyCast,
			chfBuyTransfer: dataJson.chfBuyTransfer,
			chfSell: dataJson.chfSell,

			jpyBuyCast: dataJson.jpyBuyCast,
			jpyBuyTransfer: dataJson.jpyBuyTransfer,
			jpySell: dataJson.jpySell,

			thbBuyCast: dataJson.thbBuyCast,
			thbBuyTransfer: dataJson.thbBuyTransfer,
			thbSell: dataJson.thbSell,

			audBuyCast: dataJson.audBuyCast,
			audBuyTransfer: dataJson.audBuyTransfer,
			audSell: dataJson.audSell,

			cadBuyCast: dataJson.cadBuyCast,
			cadBuyTransfer: dataJson.cadBuyTransfer,
			cadSell: dataJson.cadSell,

			sgdBuyCast: dataJson.sgdBuyCast,
			sgdBuyTransfer: dataJson.sgdBuyTransfer,
			sgdSell: dataJson.sgdSell,

			sekBuyCast: dataJson.sekBuyCast,
			sekBuyTransfer: dataJson.sekBuyTransfer,
			sekSell: dataJson.sekSell,

			lakBuyCast: dataJson.lakBuyCast,
			lakBuyTransfer: dataJson.lakBuyTransfer,
			lakSell: dataJson.lakSell,

			dkkBuyCast: dataJson.dkkBuyCast,
			dkkBuyTransfer: dataJson.dkkBuyTransfer,
			dkkSell: dataJson.dkkSell,

			nokBuyCast: dataJson.nokBuyCast,
			nokBuyTransfer: dataJson.nokBuyTransfer,
			nokSell: dataJson.nokSell,

			cnyBuyCast: dataJson.cnyBuyCast,
			cnyBuyTransfer: dataJson.cnyBuyTransfer,
			cnySell: dataJson.cnySell,

			rubBuyCast: dataJson.rubBuyCast,
			rubBuyTransfer: dataJson.rubBuyTransfer,
			rubSell: dataJson.rubSell,

			nzdBuyCast: dataJson.nzdBuyCast,
			nzdBuyTransfer: dataJson.nzdBuyTransfer,
			nzdSell: dataJson.nzdSell,

			krwBuyCast: dataJson.krwBuyCast,
			krwBuyTransfer: dataJson.krwBuyTransfer,
			krwSell: dataJson.krwSell,

			eurBuyCast: dataJson.eurBuyCast,
			eurBuyTransfer: dataJson.eurBuyTransfer,
			eurSell: dataJson.eurSell,

			twdBuyCast: dataJson.twdBuyCast,
			twdBuyTransfer: dataJson.twdBuyTransfer,
			twdSell: dataJson.twdSell,

			myrBuyCast: dataJson.myrBuyCast,
			myrBuyTransfer: dataJson.myrBuyTransfer,
			myrSell: dataJson.myrSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) =>
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Bidv exchange'
			)
		);
};
const crawlTechcombank = async () => {
	let dataJson = {};
	try {
		const result = await axios(URL_EXCHANGE_RATE_TECHCOMBANK)
			.then((res) => res.data)
			.catch((err) => {
				uploadErrorToDb(
					err.code +
						' ' +
						err.response?.status +
						' Techcombank exchange'
				);
			});

		const $ = cheerio.load(result);

		dataJson.name = 'Ngân hàng Thương mại cổ phần Kỹ Thương Việt Nam';
		dataJson.symbol = 'Techcombank';

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

		dataJson.eurBuyCast = $('#myTable tbody :nth-child(3) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.eurBuyTransfer = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.eurSell = $('#myTable tbody :nth-child(3) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.audBuyCast = $('#myTable tbody :nth-child(6) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.audBuyTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.audSell = $('#myTable tbody :nth-child(6) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cadBuyCast = $('#myTable tbody :nth-child(8) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cadBuyTransfer = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cadSell = $('#myTable tbody :nth-child(8) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.chfBuyCast = $('#myTable tbody :nth-child(4) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.chfBuyTransfer = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.chfSell = $('#myTable tbody :nth-child(4) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cnyBuyCast = $('#myTable tbody :nth-child(12) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cnyBuyTransfer = $(
			'#myTable tbody :nth-child(12) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cnySell = $('#myTable tbody :nth-child(12) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.gbpBuyCast = $('#myTable tbody :nth-child(5) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.gbpBuyTransfer = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.gbpSell = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.hkdBuyCast = $('#myTable tbody :nth-child(9) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.hkdBuyTransfer = $(
			'#myTable tbody :nth-child(9) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.hkdSell = $('#myTable tbody :nth-child(9) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.jpyBuyCast = $('#myTable tbody :nth-child(2) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.jpyBuyTransfer = $(
			'#myTable tbody :nth-child(2) :nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.jpySell = $('#myTable tbody :nth-child(2) :nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.krwBuyCast = $('#myTable tbody :nth-child(11) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.krwBuyTransfer = $(
			'#myTable tbody :nth-child(11) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.krwSell = $('#myTable tbody :nth-child(11) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.sgdBuyCast = $('#myTable tbody :nth-child(7) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sgdBuyTransfer = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.sgdSell = $('#myTable tbody :nth-child(7) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.thbBuyCast = $('#myTable tbody :nth-child(10) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.thbBuyTransfer = $(
			'#myTable tbody :nth-child(10) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.thbSell = $('#myTable tbody :nth-child(10) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	TechcombankExchange.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			audBuyCast: dataJson.audBuyCast,
			audBuyTransfer: dataJson.audBuyTransfer,
			audSell: dataJson.audSell,

			cadBuyCast: dataJson.cadBuyCast,
			cadBuyTransfer: dataJson.cadBuyTransfer,
			cadSell: dataJson.cadSell,

			chfBuyCast: dataJson.chfBuyCast,
			chfBuyTransfer: dataJson.chfBuyTransfer,
			chfSell: dataJson.chfSell,

			cnyBuyCast: dataJson.cnyBuyCast,
			cnyBuyTransfer: dataJson.cnyBuyTransfer,
			cnySell: dataJson.cnySell,

			eurBuyCast: dataJson.eurBuyCast,
			eurBuyTransfer: dataJson.eurBuyTransfer,
			eurSell: dataJson.eurSell,

			gbpBuyCast: dataJson.gbpBuyCast,
			gbpBuyTransfer: dataJson.gbpBuyTransfer,
			gbpSell: dataJson.gbpSell,

			hkdBuyCast: dataJson.hkdBuyCast,
			hkdBuyTransfer: dataJson.hkdBuyTransfer,
			hkdSell: dataJson.hkdSell,

			jpyBuyCast: dataJson.jpyBuyCast,
			jpyBuyTransfer: dataJson.jpyBuyTransfer,
			jpySell: dataJson.jpySell,

			krwBuyCast: dataJson.krwBuyCast,
			krwBuyTransfer: dataJson.krwBuyTransfer,
			krwSell: dataJson.krwSell,

			myrBuyCast: dataJson.myrBuyCast,
			myrBuyTransfer: dataJson.myrBuyTransfer,
			myrSell: dataJson.myrSell,

			sgdBuyCast: dataJson.sgdBuyCast,
			sgdBuyTransfer: dataJson.sgdBuyTransfer,
			sgdSell: dataJson.sgdSell,

			thbBuyCast: dataJson.thbBuyCast,
			thbBuyTransfer: dataJson.thbBuyTransfer,
			thbSell: dataJson.thbSell,

			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			usdSell: dataJson.usdSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) =>
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Techcombank exchange'
			)
		);
};
const crawlVietinbank = async () => {
	const result = await axios(URL_EXCHANGE_RATE_VIETINBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' VietinBank exchange'
			);
		});
	let dataJson = {};
	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng Thương mại cổ phần Công Thương Việt Nam';
		dataJson.symbol = 'VietinBank';
		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.audBuyCast = $('#myTable tbody :nth-child(6) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.audBuyTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.audSell = $('#myTable tbody :nth-child(6) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cadBuyCast = $('#myTable tbody :nth-child(8) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cadBuyTransfer = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cadSell = $('#myTable tbody :nth-child(8) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.chfBuyCast = $('#myTable tbody :nth-child(4) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.chfBuyTransfer = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.chfSell = $('#myTable tbody :nth-child(4) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cnyBuyCast = $('#myTable tbody :nth-child(17) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cnyBuyTransfer = $(
			'#myTable tbody :nth-child(17) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cnySell = $('#myTable tbody :nth-child(17) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.dkkBuyCast = $('#myTable tbody :nth-child(15) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.dkkBuyTransfer = $(
			'#myTable tbody :nth-child(15) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.dkkSell = $('#myTable tbody :nth-child(15) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.eurBuyCast = $('#myTable tbody :nth-child(3) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.eurBuyTransfer = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.eurSell = $('#myTable tbody :nth-child(3) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.gbpBuyCast = $('#myTable tbody :nth-child(5) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.gbpBuyTransfer = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.gbpSell = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.hkdBuyCast = $('#myTable tbody :nth-child(9) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.hkdBuyTransfer = $(
			'#myTable tbody :nth-child(9) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.hkdSell = $('#myTable tbody :nth-child(9) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.jpyBuyCast = $('#myTable tbody :nth-child(2) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.jpyBuyTransfer = $(
			'#myTable tbody :nth-child(2) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.jpySell = $('#myTable tbody :nth-child(2) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.krwBuyCast = $('#myTable tbody :nth-child(12) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.krwBuyTransfer = $(
			'#myTable tbody :nth-child(12) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.krwSell = $('#myTable tbody :nth-child(12) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.lakBuyCast = $('#myTable tbody :nth-child(14) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.lakBuyTransfer = $(
			'#myTable tbody :nth-child(14) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.lakSell = $('#myTable tbody :nth-child(14) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.nokBuyCast = $('#myTable tbody :nth-child(16) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nokBuyTransfer = $(
			'#myTable tbody :nth-child(16) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.nokSell = $('#myTable tbody :nth-child(16) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.nzdBuyCast = $('#myTable tbody :nth-child(11) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nzdBuyTransfer = $(
			'#myTable tbody :nth-child(11) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.nzdSell = $('#myTable tbody :nth-child(11) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.sekBuyCast = $('#myTable tbody :nth-child(13) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sekBuyTransfer = $(
			'#myTable tbody :nth-child(13) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.sekSell = $('#myTable tbody :nth-child(13) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.sgdBuyCast = $('#myTable tbody :nth-child(7) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sgdBuyTransfer = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.sgdSell = $('#myTable tbody :nth-child(7) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.thbBuyCast = $('#myTable tbody :nth-child(10) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.thbBuyTransfer = $(
			'#myTable tbody :nth-child(10) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.thbSell = $('#myTable tbody :nth-child(10) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.usdBuyCast = $('#myTable tbody :nth-child(1) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.usdBuyTransfer = $(
			'#myTable tbody :nth-child(1) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.usdSell = $('#myTable tbody :nth-child(1) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	VietinBankExchange.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			audBuyCast: dataJson.audBuyCast,
			audBuyTransfer: dataJson.audBuyTransfer,
			audSell: dataJson.audSell,

			cadBuyCast: dataJson.cadBuyCast,
			cadBuyTransfer: dataJson.cadBuyTransfer,
			cadSell: dataJson.cadSell,

			chfBuyCast: dataJson.chfBuyCast,
			chfBuyTransfer: dataJson.chfBuyTransfer,
			chfSell: dataJson.chfSell,

			cnyBuyCast: dataJson.cnyBuyCast,
			cnyBuyTransfer: dataJson.cnyBuyTransfer,
			cnySell: dataJson.cnySell,

			dkkBuyCast: dataJson.dkkBuyCast,
			dkkBuyTransfer: dataJson.dkkBuyTransfer,
			dkkSell: dataJson.dkkSell,

			eurBuyCast: dataJson.eurBuyCast,
			eurBuyTransfer: dataJson.eurBuyTransfer,
			eurSell: dataJson.eurSell,

			gbpBuyCast: dataJson.gbpBuyCast,
			gbpBuyTransfer: dataJson.gbpBuyTransfer,
			gbpSell: dataJson.gbpSell,

			hkdBuyCast: dataJson.hkdBuyCast,
			hkdBuyTransfer: dataJson.hkdBuyTransfer,
			hkdSell: dataJson.hkdSell,

			jpyBuyCast: dataJson.jpyBuyCast,
			jpyBuyTransfer: dataJson.jpyBuyTransfer,
			jpySell: dataJson.jpySell,

			krwBuyCast: dataJson.krwBuyCast,
			krwBuyTransfer: dataJson.krwBuyTransfer,
			krwSell: dataJson.krwSell,

			lakBuyCast: dataJson.lakBuyCast,
			lakBuyTransfer: dataJson.lakBuyTransfer,
			lakSell: dataJson.lakSell,

			nokBuyCast: dataJson.nokBuyCast,
			nokBuyTransfer: dataJson.nokBuyTransfer,
			nokSell: dataJson.nokSell,

			nzdBuyCast: dataJson.nzdBuyCast,
			nzdBuyTransfer: dataJson.nzdBuyTransfer,
			nzdSell: dataJson.nzdSell,

			sekBuyCast: dataJson.sekBuyCast,
			sekBuyTransfer: dataJson.sekBuyTransfer,
			sekSell: dataJson.sekSell,

			sgdBuyCast: dataJson.sgdBuyCast,
			sgdBuyTransfer: dataJson.sgdBuyTransfer,
			sgdSell: dataJson.sgdSell,

			thbBuyCast: dataJson.thbBuyCast,
			thbBuyTransfer: dataJson.thbBuyTransfer,
			thbSell: dataJson.thbSell,

			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			usdSell: dataJson.usdSell,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) =>
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' VietinBank exchange'
			)
		);
};

const crawlMbbank = async () => {
	const result = await axios(URL_EXCHANGE_RATE_MBBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Mbbank exchange'
			);
		});

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng Thương mại Cổ phần Quân đội';
		dataJson.symbol = 'Mbbank';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.usdBuyCast = $('#myTable tbody :nth-child(1) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.usdBuyTransfer = $(
			'#myTable tbody :nth-child(1) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.usdSell = $('#myTable tbody :nth-child(1) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.eurBuyCast = $('#myTable tbody :nth-child(3) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.eurBuyTransfer = $(
			'#myTable tbody :nth-child(3) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.eurSell = $('#myTable tbody :nth-child(3) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.audBuyCast = $('#myTable tbody :nth-child(1) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.audBuyTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(2)'
		)
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.audSell = $('#myTable tbody :nth-child(6) td:nth-child(4)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.audSellTransfer = $(
			'#myTable tbody :nth-child(6) td:nth-child(3)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cadBuyCast = $('#myTable tbody :nth-child(8) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cadBuyTransfer = $(
			'#myTable tbody :nth-child(8) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cadSell = $('#myTable tbody :nth-child(8) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.chfBuyCast = $('#myTable tbody :nth-child(4) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.chfBuyTransfer = $(
			'#myTable tbody :nth-child(4) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.chfSell = $('#myTable tbody :nth-child(4) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.cnyBuyCast = $('#myTable tbody :nth-child(15) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.cnyBuyTransfer = $(
			'#myTable tbody :nth-child(15) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.cnySell = $('#myTable tbody :nth-child(15) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.gbpBuyCast = $('#myTable tbody :nth-child(5) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.gbpBuyTransfer = $(
			'#myTable tbody :nth-child(5) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.gbpSell = $('#myTable tbody :nth-child(5) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.hkdBuyCast = $('#myTable tbody :nth-child(9) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.hkdBuyTransfer = $(
			'#myTable tbody :nth-child(9) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.hkdSell = $('#myTable tbody :nth-child(9) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.jpyBuyCast = $('#myTable tbody :nth-child(2) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.jpyBuyTransfer = $(
			'#myTable tbody :nth-child(2) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.jpySell = $('#myTable tbody :nth-child(2) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.khrBuyCast = $('#myTable tbody :nth-child(16) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.khrBuyTransfer = $(
			'#myTable tbody :nth-child(16) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.khrSell = $('#myTable tbody :nth-child(16) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.krwBuyCast = $('#myTable tbody :nth-child(12) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.krwBuyTransfer = $(
			'#myTable tbody :nth-child(12) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.krwSell = $('#myTable tbody :nth-child(12) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.lakBuyCast = $('#myTable tbody :nth-child(14) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.lakBuyTransfer = $(
			'#myTable tbody :nth-child(14) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.lakSell = $('#myTable tbody :nth-child(14) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.nzdBuyCast = $('#myTable tbody :nth-child(11) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.nzdBuyTransfer = $(
			'#myTable tbody :nth-child(11) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.nzdSell = $('#myTable tbody :nth-child(11) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.sekBuyCast = $('#myTable tbody :nth-child(13) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sekBuyTransfer = $(
			'#myTable tbody :nth-child(13) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.sekSell = $('#myTable tbody :nth-child(13) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.sgdBuyCast = $('#myTable tbody :nth-child(7) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.sgdBuyTransfer = $(
			'#myTable tbody :nth-child(7) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.sgdSell = $('#myTable tbody :nth-child(7) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');

		dataJson.thbBuyCast = $('#myTable tbody :nth-child(10) td:nth-child(2)')
			.contents()
			.first()
			.text()
			.slice(1, -1)
			.replace(/\./g, '');
		dataJson.thbBuyTransfer = $(
			'#myTable tbody :nth-child(10) td:nth-child(4)'
		)
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
		dataJson.thbSell = $('#myTable tbody :nth-child(10) td:nth-child(3)')
			.contents()
			.first()
			.text()
			.slice(0, -1)
			.replace(/\./g, '');
	} catch (err) {
		console.log(err);
	}

	MbbankExchange.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			usdBuyCast: dataJson.usdBuyCast,
			usdBuyTransfer: dataJson.usdBuyTransfer,
			usdSell: dataJson.usdSell,
			// usdSellTransfer: dataJson.usdSellTransfer,

			eurBuyCast: dataJson.eurBuyCast,
			eurBuyTransfer: dataJson.eurBuyTransfer,
			eurSell: dataJson.eurSell,
			// eurSellTransfer: dataJson.eurSellTransfer,

			gbpBuyCast: dataJson.gbpBuyCast,
			gbpBuyTransfer: dataJson.gbpBuyTransfer,
			gbpSell: dataJson.gbpSell,
			// gbpSellTransfer: dataJson.gbpSellTransfer,

			jpyBuyCast: dataJson.jpyBuyCast,
			jpyBuyTransfer: dataJson.jpyBuyTransfer,
			jpySell: dataJson.jpySell,
			// jpySellTransfer: dataJson.jpySellTransfer,

			hkdBuyCast: dataJson.hkdBuyCast,
			hkdBuyTransfer: dataJson.hkdBuyTransfer,
			hkdSell: dataJson.hkdSell,
			// hkdSellTransfer: dataJson.hkdSellTransfer,

			cnyBuyCast: dataJson.cnyBuyCast,
			cnyBuyTransfer: dataJson.cnyBuyTransfer,
			cnySell: dataJson.cnySell,
			// cnySellTransfer: dataJson.cnySellTransfer,

			audBuyCast: dataJson.audBuyCast,
			audBuyTransfer: dataJson.audBuyTransfer,
			audSell: dataJson.audSell,
			// audSellTransfer: dataJson.audSellTransfer,

			nzdBuyCast: dataJson.nzdBuyCast,
			nzdBuyTransfer: dataJson.nzdBuyTransfer,
			nzdSell: dataJson.nzdSell,
			// nzdSellTransfer: dataJson.nzdSellTransfer,

			cadBuyCast: dataJson.cadBuyCast,
			cadBuyTransfer: dataJson.cadBuyTransfer,
			cadSell: dataJson.cadSell,
			// cadSellTransfer: dataJson.cadSellTransfer,

			sgdBuyCast: dataJson.sgdBuyCast,
			sgdBuyTransfer: dataJson.sgdBuyTransfer,
			sgdSell: dataJson.sgdSell,
			// sgdSellTransfer: dataJson.sgdSellTransfer,

			thbBuyCast: dataJson.thbBuyCast,
			thbBuyTransfer: dataJson.thbBuyTransfer,
			thbSell: dataJson.thbSell,
			// thbSellTransfer: dataJson.thbSellTransfer,

			chfBuyCast: dataJson.chfBuyCast,
			chfBuyTransfer: dataJson.chfBuyTransfer,
			chfSell: dataJson.chfSell,
			// chfSellTransfer: dataJson.chfSellTransfer,

			krwBuyCast: dataJson.krwBuyCast,
			krwBuyTransfer: dataJson.krwBuyTransfer,
			krwSell: dataJson.krwSell,
			// krwSellTransfer: dataJson.krwSellTransfer,

			lakBuyCast: dataJson.lakBuyCast,
			lakBuyTransfer: dataJson.lakBuyTransfer,
			lakSell: dataJson.lakSell,
			// lakSellTransfer: dataJson.lakSellTransfer,

			khrBuyCast: dataJson.khrBuyCast,
			khrBuyTransfer: dataJson.khrBuyTransfer,
			khrSell: dataJson.khrSell,
			// khrSellTransfer: dataJson.khrSellTransfer,

			sekBuyCast: dataJson.sekBuyCast,
			sekBuyTransfer: dataJson.sekBuyTransfer,
			sekSell: dataJson.sekSell,
			// sekSellTransfer: dataJson.sekSellTransfer,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) =>
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' Mbbank exchange'
			)
		);
};

module.exports = {
	crawlAgribank,
	crawlBidv,
	crawlMbbank,
	crawlTechcombank,
	crawlVietcombank,
	crawlVietinbank,
};
