const cheerio = require('cheerio');
const axios = require('axios');
const { uploadErrorToDb } = require('../../utils/error/uploadErrorToDb');

const AgribankInterestRate = require('../../../../models/interestRate/agribankInterestRateModel');
const BidvInterestRate = require('../../../../models/interestRate/bidvInterestRateModel');
const MbbankInterestRate = require('../../../../models/interestRate/mbbankInterestRateModel');
const ScbInterestRate = require('../../../../models/interestRate/scbInterestRateModel');
const VibInterestRate = require('../../../../models/interestRate/vibInterestRateModel');
const VietcombankInterestRate = require('../../../../models/interestRate/vietcombankInterestRateModel');
const VietinbankInterestRate = require('../../../../models/interestRate/vietinbankInterestRateModel');
const ManyBanksInterestRate = require('../../../../models/interestRate/manyBanksInterestModel');

const {
	URL_INTEREST_RATE_VIETCOMBANK,
	URL_INTEREST_RATE_VIETINBANK,
	URL_INTEREST_RATE_AGRIBANK,
	URL_INTEREST_RATE_BIDV,
	URL_INTEREST_RATE_SCB,
	URL_INTEREST_RATE_MBBANK,
	URL_INTEREST_RATE_VIB,
	URL_INTEREST_RATE_MANYBANKS,
} = require('../../configs/constants/interestRate');

// const {
// 	pageEvaluateFunc,
// } = require('../../helpers/puppeteer/pageEvaluateFunc');
const {
	crawlDataByPuppeteer,
	crawlDataByPuppeteerLazyLoading,
} = require('../../helpers/puppeteer/crawlDataByPuppeteer');
const { delay } = require('../../utils/promise/delay');

const crawlVietcombankInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_VIETCOMBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vietcombankInterest'
			);
		});

	if (!result) {
		return;
	}

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam';
		dataJson.symbol = 'Vietcombank';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.month1 = $(
			'#danhsachlaisuat tbody :nth-child(17) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month2 = $(
			'#danhsachlaisuat tbody :nth-child(18) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month3 = $(
			'#danhsachlaisuat tbody :nth-child(19) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month6 = $(
			'#danhsachlaisuat tbody :nth-child(20) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month9 = $(
			'#danhsachlaisuat tbody :nth-child(21) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month12 = $(
			'#danhsachlaisuat tbody :nth-child(22) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month24 = $(
			'#danhsachlaisuat tbody :nth-child(23) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month36 = $(
			'#danhsachlaisuat tbody :nth-child(24) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month48 = $(
			'#danhsachlaisuat tbody :nth-child(25) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
		dataJson.month60 = $(
			'#danhsachlaisuat tbody :nth-child(26) :nth-child(2)'
		)
			.text()
			.slice(1, -1)
			.replace(/\s./g, '')
			.slice(0, -1);
	} catch (err) {
		console.log(
			err.code + ' ' + err.response?.status + ' vietcombankInterest'
		);
	}

	VietcombankInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,
			month1: dataJson.month1,
			month2: dataJson.month2,
			month3: dataJson.month3,
			month6: dataJson.month6,
			month9: dataJson.month9,
			month12: dataJson.month12,
			month24: dataJson.month24,
			month36: dataJson.month36,
			month48: dataJson.month48,
			month60: dataJson.month60,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vietcombankInterest'
			);
		});
};

const crawlVietinbankInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_VIETINBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vietinbankInterest'
			);
		});

	if (!result) {
		return;
	}

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng Thương mại cổ phần Công Thương Việt Nam';
		dataJson.symbol = 'Vietinbank';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.khongkyhan = $('#hor-ex-b tbody :nth-child(4) :nth-child(2) ')
			.text()
			.replace(/,/g, '.');

		dataJson.khongkyhanBusiness = $(
			'#hor-ex-b tbody :nth-child(4) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.under1month = $('#hor-ex-b tbody :nth-child(5) :nth-child(2) ')
			.text()
			.replace(/,/g, '.');

		dataJson.under1monthBusiness = $(
			'#hor-ex-b tbody :nth-child(5) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from1to2month = $(
			'#hor-ex-b tbody :nth-child(6) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from1to2monthBusiness = $(
			'#hor-ex-b tbody :nth-child(6) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from2to3month = $(
			'#hor-ex-b tbody :nth-child(7) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from2to3monthBusiness = $(
			'#hor-ex-b tbody :nth-child(7) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from3to4month = $(
			'#hor-ex-b tbody :nth-child(8) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from3to4monthBusiness = $(
			'#hor-ex-b tbody :nth-child(8) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from4to5month = $(
			'#hor-ex-b tbody :nth-child(9) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from4to5monthBusiness = $(
			'#hor-ex-b tbody :nth-child(9) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from5to6month = $(
			'#hor-ex-b tbody :nth-child(10) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from5to6monthBusiness = $(
			'#hor-ex-b tbody :nth-child(10) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from6to7month = $(
			'#hor-ex-b tbody :nth-child(11) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from6to7monthBusiness = $(
			'#hor-ex-b tbody :nth-child(11) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from7to8month = $(
			'#hor-ex-b tbody :nth-child(12) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from7to8monthBusiness = $(
			'#hor-ex-b tbody :nth-child(12) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from8to9month = $(
			'#hor-ex-b tbody :nth-child(13) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from8to9monthBusiness = $(
			'#hor-ex-b tbody :nth-child(13) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from9to10month = $(
			'#hor-ex-b tbody :nth-child(14) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from9to10monthBusiness = $(
			'#hor-ex-b tbody :nth-child(14) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from10to11month = $(
			'#hor-ex-b tbody :nth-child(15) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from10to11monthBusiness = $(
			'#hor-ex-b tbody :nth-child(15) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from11to12month = $(
			'#hor-ex-b tbody :nth-child(16) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from11to12monthBusiness = $(
			'#hor-ex-b tbody :nth-child(16) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.month12 = $('#hor-ex-b tbody :nth-child(17) :nth-child(2) ')
			.text()
			.replace(/,/g, '.');

		dataJson.month12Business = $(
			'#hor-ex-b tbody :nth-child(17) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from12to18month = $(
			'#hor-ex-b tbody :nth-child(18) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from12to18monthBusiness = $(
			'#hor-ex-b tbody :nth-child(18) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from18to24month = $(
			'#hor-ex-b tbody :nth-child(19) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from18to24monthBusiness = $(
			'#hor-ex-b tbody :nth-child(19) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from24to36month = $(
			'#hor-ex-b tbody :nth-child(20) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.from24to36monthBusiness = $(
			'#hor-ex-b tbody :nth-child(20) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.month36 = $('#hor-ex-b tbody :nth-child(21) :nth-child(2) ')
			.text()
			.replace(/,/g, '.');

		dataJson.month36Business = $(
			'#hor-ex-b tbody :nth-child(21) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.upper36month = $(
			'#hor-ex-b tbody :nth-child(22) :nth-child(2) '
		)
			.text()
			.replace(/,/g, '.');

		dataJson.upper36monthBusiness = $(
			'#hor-ex-b tbody :nth-child(22) :nth-child(5) '
		)
			.text()
			.replace(/,/g, '.');
	} catch (err) {
		console.log(
			err.code + ' ' + err.response?.status + ' vietinbankInterest'
		);
	}

	VietinbankInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,
			khongkyhan: dataJson.khongkyhan,
			under1month: dataJson.under1month,
			from1to2month: dataJson.from1to2month,
			from2to3month: dataJson.from2to3month,
			from3to4month: dataJson.from3to4month,
			from4to5month: dataJson.from4to5month,
			from5to6month: dataJson.from5to6month,
			from6to7month: dataJson.from6to7month,
			from7to8month: dataJson.from7to8month,
			from8to9month: dataJson.from8to9month,
			from9to10month: dataJson.from9to10month,
			from10to11month: dataJson.from10to11month,
			from11to12month: dataJson.from11to12month,
			month12: dataJson.month12,
			from12to18month: dataJson.from12to18month,
			from18to24month: dataJson.from18to24month,
			from24to36month: dataJson.from24to36month,
			month36: dataJson.month36,
			upper36month: dataJson.upper36month,

			khongkyhanBusiness: dataJson.khongkyhanBusiness,
			under1monthBusiness: dataJson.under1monthBusiness,
			from1to2monthBusiness: dataJson.from1to2monthBusiness,
			from2to3monthBusiness: dataJson.from2to3monthBusiness,
			from3to4monthBusiness: dataJson.from3to4monthBusiness,
			from4to5monthBusiness: dataJson.from4to5monthBusiness,
			from5to6monthBusiness: dataJson.from5to6monthBusiness,
			from6to7monthBusiness: dataJson.from6to7monthBusiness,
			from7to8monthBusiness: dataJson.from7to8monthBusiness,
			from8to9monthBusiness: dataJson.from8to9monthBusiness,
			from9to10monthBusiness: dataJson.from9to10monthBusiness,
			from10to11monthBusiness: dataJson.from10to11monthBusiness,
			from11to12monthBusiness: dataJson.from11to12monthBusiness,
			month12Business: dataJson.month12Business,
			from12to18monthBusiness: dataJson.from12to18monthBusiness,
			from18to24monthBusiness: dataJson.from18to24monthBusiness,
			from24to36monthBusiness: dataJson.from24to36monthBusiness,
			month36Business: dataJson.month36Business,
			upper36monthBusiness: dataJson.upper36monthBusiness,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vietinbankInterest'
			);
		});
};

const crawlAgribankInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_AGRIBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' agribankInterest'
			);
		});
	if (!result) {
		return;
	}

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name =
			'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam';
		dataJson.symbol = 'Agribank';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		$('table').each((index, el) => {
			if (index == 0) {
				dataJson.khongkyhanPersonal = $(el)
					.find('table tbody :nth-child(1) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month1Personal = $(el)
					.find('table tbody :nth-child(2) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month2Personal = $(el)
					.find('table tbody :nth-child(3) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month3Personal = $(el)
					.find('table tbody :nth-child(4) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month4Personal = $(el)
					.find('table tbody :nth-child(5) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month5Personal = $(el)
					.find('table tbody :nth-child(6) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month6Personal = $(el)
					.find('table tbody :nth-child(7) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month7Personal = $(el)
					.find('table tbody :nth-child(8) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month8Personal = $(el)
					.find('table tbody :nth-child(9) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month9Personal = $(el)
					.find('table tbody :nth-child(10) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month10Personal = $(el)
					.find('table tbody :nth-child(11) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month11Personal = $(el)
					.find('table tbody :nth-child(12) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month12Personal = $(el)
					.find('table tbody :nth-child(13) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month13Personal = $(el)
					.find('table tbody :nth-child(14) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month15Personal = $(el)
					.find('table tbody :nth-child(15) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month18Personal = $(el)
					.find('table tbody :nth-child(16) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month24Personal = $(el)
					.find('table tbody :nth-child(17) :nth-child(2)')
					.text()
					.slice(0, -1);
			}
			if (index == 1) {
				dataJson.khongkyhanBusiness = $(el)
					.find('table tbody :nth-child(1) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month1Business = $(el)
					.find('table tbody :nth-child(2) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month2Business = $(el)
					.find('table tbody :nth-child(3) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month3Business = $(el)
					.find('table tbody :nth-child(4) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month4Business = $(el)
					.find('table tbody :nth-child(5) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month5Business = $(el)
					.find('table tbody :nth-child(6) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month6Business = $(el)
					.find('table tbody :nth-child(7) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month7Business = $(el)
					.find('table tbody :nth-child(8) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month8Business = $(el)
					.find('table tbody :nth-child(9) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month9Business = $(el)
					.find('table tbody :nth-child(10) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month10Business = $(el)
					.find('table tbody :nth-child(11) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month11Business = $(el)
					.find('table tbody :nth-child(12) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month12Business = $(el)
					.find('table tbody :nth-child(13) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month13Business = $(el)
					.find('table tbody :nth-child(14) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month15Business = $(el)
					.find('table tbody :nth-child(15) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month18Business = $(el)
					.find('table tbody :nth-child(16) :nth-child(2)')
					.text()
					.slice(0, -1);
				dataJson.month24Business = $(el)
					.find('table tbody :nth-child(17) :nth-child(2)')
					.text()
					.slice(0, -1);
			}
		});
	} catch (err) {
		console.log(err);
	}

	AgribankInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,
			khongkyhanPersonal: dataJson.khongkyhanPersonal,
			month1Personal: dataJson.month1Personal,
			month2Personal: dataJson.month2Personal,
			month3Personal: dataJson.month3Personal,
			month4Personal: dataJson.month4Personal,
			month5Personal: dataJson.month5Personal,
			month6Personal: dataJson.month6Personal,
			month7Personal: dataJson.month7Personal,
			month8Personal: dataJson.month8Personal,
			month9Personal: dataJson.month9Personal,
			month10Personal: dataJson.month10Personal,
			month11Personal: dataJson.month11Personal,
			month12Personal: dataJson.month12Personal,
			month13Personal: dataJson.month13Personal,
			month15Personal: dataJson.month15Personal,
			month18Personal: dataJson.month18Personal,
			month24Personal: dataJson.month24Personal,

			khongkyhanBusiness: dataJson.khongkyhanBusiness,
			month1Business: dataJson.month1Business,
			month2Business: dataJson.month2Business,
			month3Business: dataJson.month3Business,
			month4Business: dataJson.month4Business,
			month5Business: dataJson.month5Business,
			month6Business: dataJson.month6Business,
			month7Business: dataJson.month7Business,
			month8Business: dataJson.month8Business,
			month9Business: dataJson.month9Business,
			month10Business: dataJson.month10Business,
			month11Business: dataJson.month11Business,
			month12Business: dataJson.month12Business,
			month13Business: dataJson.month13Business,
			month15Business: dataJson.month15Business,
			month18Business: dataJson.month18Business,
			month24Business: dataJson.month24Business,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' agribankInterest'
			);
		});
};

const crawlBidvInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_BIDV)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' bidvInterest'
			);
		});
	if (!result) {
		return;
	}
	const data = result?.hanoi.data;

	let dataJson = {};
	console.log(data);

	try {
		dataJson.name =
			'Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam';
		dataJson.symbol = 'Bidv';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.khongkyhan = data[0].VND;
		dataJson.month1 = data[1].VND;
		dataJson.month2 = data[2].VND;
		dataJson.month3 = data[3].VND;
		dataJson.month5 = data[4].VND;
		dataJson.month6 = data[5].VND;
		dataJson.month9 = data[6].VND;
		dataJson.month12 = data[7].VND;
		dataJson.month13 = data[8].VND;
		dataJson.month15 = data[9].VND;
		dataJson.month18 = data[10].VND;
		dataJson.month24 = data[11].VND;
		dataJson.month36 = data[12].VND;
	} catch (err) {
		console.log(err.code + ' ' + err.response?.status + ' bidvInterest');
	}

	BidvInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,
			khongkyhan: dataJson.khongkyhan,
			month1: dataJson.month1,
			month2: dataJson.month2,
			month3: dataJson.month3,
			month5: dataJson.month5,
			month6: dataJson.month6,
			month9: dataJson.month9,
			month12: dataJson.month12,
			month13: dataJson.month13,
			month15: dataJson.month15,
			month18: dataJson.month18,
			month24: dataJson.month24,
			month36: dataJson.month36,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' bidvInterest'
			);
		});
};

const crawlScbInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_SCB)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' scbInterest'
			);
		});
	if (!result) {
		return;
	}

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng Thương mại Cổ phần Sài Gòn';
		dataJson.symbol = 'SCB';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.month1 = $(
			'#myTable tbody :nth-child(1) td:nth-child(3)'
		).text();

		dataJson.month3 = $(
			'#myTable tbody :nth-child(2) td:nth-child(3)'
		).text();

		dataJson.month6 = $(
			'#myTable tbody :nth-child(3) td:nth-child(3)'
		).text();

		dataJson.month9 = $(
			'#myTable tbody :nth-child(4) td:nth-child(3)'
		).text();

		dataJson.month12 = $(
			'#myTable tbody :nth-child(5) td:nth-child(3)'
		).text();

		dataJson.month18 = $(
			'#myTable tbody :nth-child(6) td:nth-child(3)'
		).text();

		dataJson.month24 = $(
			'#myTable tbody :nth-child(7) td:nth-child(3)'
		).text();

		dataJson.month36 = $(
			'#myTable tbody :nth-child(8) td:nth-child(3)'
		).text();
	} catch (err) {
		console.log(err.code + ' ' + err.response?.status + ' scbInterest');
	}

	ScbInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			month1: dataJson.month1,
			month3: dataJson.month3,
			month6: dataJson.month6,
			month9: dataJson.month9,
			month12: dataJson.month12,
			month18: dataJson.month18,
			month24: dataJson.month24,
			month36: dataJson.month36,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' scbInterest'
			);
		});
};

const crawlMbbankInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_MBBANK)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' mbbankInterest'
			);
		});

	if (!result) {
		return;
	}

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng Thương mại Cổ phần Quân đội';
		dataJson.symbol = 'MB';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.month1 = $(
			'#myTable tbody :nth-child(1) td:nth-child(3)'
		).text();

		dataJson.month3 = $(
			'#myTable tbody :nth-child(2) td:nth-child(3)'
		).text();

		dataJson.month6 = $(
			'#myTable tbody :nth-child(3) td:nth-child(3)'
		).text();

		dataJson.month9 = $(
			'#myTable tbody :nth-child(4) td:nth-child(3)'
		).text();

		dataJson.month12 = $(
			'#myTable tbody :nth-child(5) td:nth-child(3)'
		).text();

		dataJson.month18 = $(
			'#myTable tbody :nth-child(6) td:nth-child(3)'
		).text();

		dataJson.month24 = $(
			'#myTable tbody :nth-child(7) td:nth-child(3)'
		).text();

		dataJson.month36 = $(
			'#myTable tbody :nth-child(8) td:nth-child(3)'
		).text();
	} catch (err) {
		console.log(err.code + ' ' + err.response?.status + ' mbbankInterest');
	}

	MbbankInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			month1: dataJson.month1,
			month3: dataJson.month3,
			month6: dataJson.month6,
			month9: dataJson.month9,
			month12: dataJson.month12,
			month18: dataJson.month18,
			month24: dataJson.month24,
			month36: dataJson.month36,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' mbbankInterest'
			);
		});
};

const crawlVibInterestRate = async () => {
	const result = await axios(URL_INTEREST_RATE_VIB)
		.then((res) => res.data)
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vibInterest'
			);
		});

	if (!result) {
		return;
	}

	let dataJson = {};

	try {
		const $ = cheerio.load(result);
		dataJson.name = 'Ngân hàng Thương mại Cổ phần Quốc tế Việt Nam';
		dataJson.symbol = 'VIB';

		let date = new Date();
		dataJson.timeUpdate = Math.floor(Date.now() / 1000);

		dataJson.month1 = $(
			'#myTable tbody :nth-child(1) td:nth-child(3)'
		).text();

		dataJson.month3 = $(
			'#myTable tbody :nth-child(2) td:nth-child(3)'
		).text();

		dataJson.month6 = $(
			'#myTable tbody :nth-child(3) td:nth-child(3)'
		).text();

		dataJson.month9 = $(
			'#myTable tbody :nth-child(4) td:nth-child(3)'
		).text();

		dataJson.month12 = $(
			'#myTable tbody :nth-child(5) td:nth-child(3)'
		).text();

		dataJson.month18 = $(
			'#myTable tbody :nth-child(6) td:nth-child(3)'
		).text();

		dataJson.month24 = $(
			'#myTable tbody :nth-child(7) td:nth-child(3)'
		).text();

		dataJson.month36 = $(
			'#myTable tbody :nth-child(8) td:nth-child(3)'
		).text();
	} catch (err) {
		console.log(err.code + ' ' + err.response?.status + ' vibInterest');
	}

	VibInterestRate.findOneAndUpdate(
		{ symbol: dataJson.symbol },
		{
			name: dataJson.name,
			symbol: dataJson.symbol,
			timeUpdate: dataJson.timeUpdate,

			month1: dataJson.month1,
			month3: dataJson.month3,
			month6: dataJson.month6,
			month9: dataJson.month9,
			month12: dataJson.month12,
			month18: dataJson.month18,
			month24: dataJson.month24,
			month36: dataJson.month36,
		},
		{ upsert: true }
	)
		// .then((doc) => console.log(doc))
		.catch((err) => {
			uploadErrorToDb(
				err.code + ' ' + err.response?.status + ' vibInterest'
			);
		});
};

const crawlManyBankInterestRate = async () => {
	const pageEvaluateFunc = async () => {
		let offline = [];
		let online = [];

		let offlineElements = document.querySelectorAll(
			'#lai_suat_tiet_kiem_tai_quay table tbody tr'
		);
		let onlineElements = document.querySelectorAll(
			'#lai_suat_tiet_kiem_online table tbody tr'
		);

		offlineElements.forEach((item) => {
			let dataJson = {};

			try {
				dataJson.name = item.querySelector(
					':nth-child(1) a :nth-child(2)'
				).innerText;

				dataJson.khongkyhan =
					item.querySelector('td:nth-child(2)').innerText;
				dataJson.month1Offline =
					item.querySelector('td:nth-child(3)').innerText;
				dataJson.month3Offline =
					item.querySelector('td:nth-child(4)').innerText;
				dataJson.month6Offline =
					item.querySelector('td:nth-child(5)').innerText;
				dataJson.month9Offline =
					item.querySelector('td:nth-child(6)').innerText;
				dataJson.month12Offline =
					item.querySelector('td:nth-child(7)').innerText;
				dataJson.month13Offline =
					item.querySelector('td:nth-child(8)').innerText;
				dataJson.month18Offline =
					item.querySelector('td:nth-child(9)').innerText;
				dataJson.month24Offline =
					item.querySelector('td:nth-child(10)').innerText;
				dataJson.month36Offline =
					item.querySelector('td:nth-child(11)').innerText;
			} catch (err) {
				console.log(err);
			}

			offline.push(dataJson);
		});
		onlineElements.forEach((item) => {
			let dataJson = {};

			try {
				dataJson.name = item.querySelector(
					':nth-child(1) a :nth-child(2)'
				).innerText;

				dataJson.khongkyhan =
					item.querySelector('td:nth-child(2)').innerText;
				dataJson.month1Offline =
					item.querySelector('td:nth-child(3)').innerText;
				dataJson.month3Offline =
					item.querySelector('td:nth-child(4)').innerText;
				dataJson.month6Offline =
					item.querySelector('td:nth-child(5)').innerText;
				dataJson.month9Offline =
					item.querySelector('td:nth-child(6)').innerText;
				dataJson.month12Offline =
					item.querySelector('td:nth-child(7)').innerText;
				dataJson.month13Offline =
					item.querySelector('td:nth-child(8)').innerText;
				dataJson.month18Offline =
					item.querySelector('td:nth-child(9)').innerText;
				dataJson.month24Offline =
					item.querySelector('td:nth-child(10)').innerText;
				dataJson.month36Offline =
					item.querySelector('td:nth-child(11)').innerText;
			} catch (err) {
				console.log(err);
			}

			online.push(dataJson);
		});

		return { offline, online };
	};

	let data = false;
	let attemps = 0;
	//retry request until it gets data or tries 3 times
	while (data == false && attemps < 2) {
		data = await crawlDataByPuppeteer(
			URL_INTEREST_RATE_MANYBANKS,
			pageEvaluateFunc
		);
		// console.log(data.length);
		attemps++;

		if (data) {
			const timeUpdate = Math.floor(Date.now() / 1000);

			ManyBanksInterestRate.findOneAndUpdate(
				{ name: 'manybanks' },
				{
					name: 'manybanks',
					timeUpdate: timeUpdate,
					offline: data.offline,
					online: data.online,
				},
				{ upsert: true }
			)
				// .then((doc) => console.log(doc))
				.catch((err) => {
					uploadErrorToDb(
						err.code +
							' ' +
							err.response?.status +
							' manybanksInterest'
					);
				});
			// console.log(data);
		}

		if (data === false) {
			//wait a few second, also a good idea to swap proxy here
			console.log('Recrawl........' + attemps);
			await delay(3000);
		}
	}
};
module.exports = {
	crawlAgribankInterestRate,
	crawlBidvInterestRate,
	crawlMbbankInterestRate,
	crawlScbInterestRate,
	crawlVibInterestRate,
	crawlVietcombankInterestRate,
	crawlVietinbankInterestRate,
	crawlManyBankInterestRate,
};
